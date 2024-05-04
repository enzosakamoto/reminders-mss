import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { apiConsult, apiObservation, apiReminder } from './api'

config()
const app = express()

const PORT = process.env.PORT || 10000

app.use(express.json())
app.use(cors())

type Event = {
  type: string
  payload: unknown
}

app.post('/events', async (req, res) => {
  const event: Event = req.body

  console.log('Received Event:', event)

  // apiObservation.post('/events', event)
  try {
    if (event.type === 'reminderCreated') {
      const reminderResponse = await apiReminder.post('/events', event)

      console.log('Reminder Service:', reminderResponse.data.message)
    }

    if (event.type === 'observationCreated') {
      const observationResponse = await apiObservation.post('/events', event)

      console.log('Observation Service:', observationResponse.data.message)
    }

    const consultResponse = await apiConsult.post('/events', event)
    console.log('Consult Service:', consultResponse.data.message)
  } catch (error) {
    console.error(error)
  }

  res.end()
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
