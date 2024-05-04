import express from 'express'
import cors from 'cors'
import { v4 as uuid4 } from 'uuid'
import { apiReminder, apiEvents } from './api'
import { config } from 'dotenv'
import { Observation, Reminder } from './types'

const app = express()
app.use(cors())
app.use(express.json())
config()

const observations: Observation[] = []

app.get('/', (req, res) => {
  res.send('API is running! 🦍')
})

app.get('/reminders/:id/observations', async (req, res) => {
  const { id } = req.params

  if (!id)
    return res.status(400).json({
      message: 'Missing a reminder ID'
    })

  const reminders = await apiReminder
    .get<Reminder>(`/reminders/${id}`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error(error)
      return null
    })

  if (!reminders)
    return res.status(404).json({
      message: 'There is no reminders with this ID'
    })

  const observationsByReminder = observations.filter(
    (observation) => observation.reminderId === id
  )

  if (observationsByReminder.length === 0 || !observationsByReminder)
    return res.status(404).json({
      message: 'There is no observations for this reminder'
    })

  res.status(200).json(observationsByReminder)
})

app.post('/reminders/:id/observations', async (req, res) => {
  const { id } = req.params
  const { text } = req.body

  if (!id)
    return res.status(400).json({
      message: 'Missing a reminder ID'
    })

  if (!text)
    return res.status(400).json({
      message: 'Missing text field'
    })

  const reminders = await apiReminder
    .get<Reminder>(`/reminders/${id}`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error(error)
      return null
    })

  if (!reminders)
    return res.status(404).json({
      message: 'There is no reminders with this ID'
    })

  const newObservation: Observation = {
    id: uuid4(),
    text,
    reminderId: id
  }

  try {
    await apiEvents.post('/events', {
      type: 'observationCreated',
      payload: newObservation
    })
  } catch (error) {
    console.error(error)
  }

  res.status(200).json({
    observation: newObservation,
    message: 'The observation is being created'
  })
})

app.post('/events', (req, res) => {
  const event = req.body

  if (!event.type || !event.payload) {
    return res.status(400).json({
      message: 'Missing type or payload'
    })
  }

  console.log('Received event:', event)

  if (event.type === 'observationCreated') {
    const { id, text } = event.payload
    observations.push({ id: uuid4(), text, reminderId: id })

    return res.status(201).json({
      reminder: event.payload,
      message: 'The event was received and processed'
    })
  }

  res.status(200).json({
    message: 'The event was received'
  })
})

app.delete('/reminders/:id/observations/:observationId', async (req, res) => {
  const { id, observationId } = req.params

  if (!id)
    return res.status(400).json({
      message: 'Missing a reminder ID'
    })

  if (!observationId)
    return res.status(400).json({
      message: 'Missing a observation ID'
    })

  const reminders = await apiReminder
    .get<Reminder>(`/reminders/${id}`)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      console.error(error)
      return null
    })

  if (!reminders)
    return res.status(404).json({
      message: 'There is no reminders with this ID'
    })

  const observationIndex = observations.findIndex(
    (observation) => observation.id === observationId
  )

  if (observationIndex === -1)
    return res.status(404).json({
      message: 'There is no observation with this ID'
    })

  observations.splice(observationIndex, 1)

  res.status(200).json({
    message: 'The observation was deleted'
  })
})

const { PORT } = process.env || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
