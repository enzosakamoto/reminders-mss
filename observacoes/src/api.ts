import axios from 'axios'
import { config } from 'dotenv'

config()

const { EVENTS_API_URL, REMINDER_API_URL } = process.env

export const apiReminder = axios.create({
  baseURL: REMINDER_API_URL
})

export const apiEvents = axios.create({
  baseURL: EVENTS_API_URL
})
