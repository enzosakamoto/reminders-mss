import express from 'express'
import cors from 'cors'
import { v4 as uuid4 } from 'uuid'
import { api } from './api'

const app = express()
app.use(cors())
app.use(express.json())

type Observation = {
  id: string
  text: string
  reminderId: string
}

type Reminder = {
  id: string
  text: string
}

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

  const reminders = await api
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

  const reminders = await api
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

  const observation: Observation = {
    id: uuid4(),
    text,
    reminderId: id
  }

  observations.push(observation)

  res.status(200).json({
    observation: observation,
    message: 'The observation was created'
  })
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
