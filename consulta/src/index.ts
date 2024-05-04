import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { ReminderWithObservation } from './types'
// import axios from 'axios'

const database: ReminderWithObservation[] = []

config()
const app = express()

const PORT = process.env.PORT || 2000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('API is running! 🦍 🚀')
})

app.get('/reminders', (req, res) => {
  if (!database.length) {
    return res.status(404).json({
      message: 'No reminders found!'
    })
  }
  res.status(200).json(database)
})

app.post('/events', (req, res) => {
  const event = req.body
  console.log('Received Event:', event.type)

  if (!event) {
    return res.status(400).json({
      message: 'Invalid event!'
    })
  }

  if (event.type === 'reminderCreated') {
    const { id, text } = event.payload
    database.push({ id, text, observations: [] })
  }

  if (event.type === 'observationCreated') {
    const { id, text, reminderId } = event.payload
    const reminder = database.find((reminder) => reminder.id === reminderId)

    if (reminder) {
      reminder.observations.push({ id, text, reminderId })
    } else {
      return res.status(404).json({
        message: 'Reminder not found!'
      })
    }
  }

  res.status(201).json({
    message: 'Event received successfully!'
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
