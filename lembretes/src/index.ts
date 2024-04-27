import express from 'express'
import cors from 'cors'
import { v4 as uuid4 } from 'uuid'

const app = express()
app.use(cors())
app.use(express.json())

type Reminder = {
  id: string
  text: string
}

const reminders: Reminder[] = []

app.get('/', (req, res) => {
  res.send('API is running! 🦍')
})

app.get('/reminders', (req, res) => {
  if (reminders.length === 0)
    return res.status(404).json({
      message: 'There is no reminders'
    })
  res.status(200).json(reminders)
})

app.get('/reminders/:id', (req, res) => {
  const { id } = req.params

  if (!id)
    return res.status(400).json({
      message: 'Missing a valid reminder ID'
    })

  if (reminders.length === 0)
    return res.status(404).json({
      message: 'There is no reminders'
    })

  const reminder = reminders.find((reminder) => reminder.id === id)

  res.status(200).json(reminder)
})

app.post('/reminders', (req, res) => {
  const { text } = req.body

  if (!text)
    return res.status(400).json({
      message: 'Missing text field'
    })

  const newReminder: Reminder = {
    id: uuid4(),
    text
  }

  reminders.push(newReminder)

  res.status(201).json({
    reminder: newReminder,
    message: 'The reminder was created'
  })
})

app.patch('/reminders/:id', (req, res) => {
  const { id } = req.params
  const { text } = req.body

  if (!id)
    return res.status(400).json({
      message: 'Missing a valid reminder ID'
    })

  if (!text)
    return res.status(400).json({
      message: 'Missing text field'
    })

  reminders.forEach((reminder) => {
    if (reminder.id === id) {
      reminder.text = text
      return res.status(200).json({
        reminder,
        message: 'The reminder was updated'
      })
    }
  })
})

app.delete('/reminders/:id', (req, res) => {
  const { id } = req.params

  if (!id || Number(id) < 0 || Number(id) > reminders.length)
    return res.status(400).json({
      message: 'Missing a valid reminder ID'
    })

  const removedReminder = reminders.find((reminder) => reminder.id === id)
  const index = reminders.findIndex((reminder) => reminder.id === id)

  reminders.splice(index, 1)

  res.status(200).json({
    reminder: removedReminder,
    message: 'The reminder was deleted'
  })
})

const PORT = 4000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
