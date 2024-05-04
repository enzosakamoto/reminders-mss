import axios from 'axios'
import { config } from 'dotenv'

config()

const { OBSERVATION_API_URL, REMINDER_API_URL, CONSULT_API_URL } = process.env

export const apiReminder = axios.create({
  baseURL: REMINDER_API_URL
})

export const apiConsult = axios.create({
  baseURL: CONSULT_API_URL
})

export const apiObservation = axios.create({
  baseURL: OBSERVATION_API_URL
})
