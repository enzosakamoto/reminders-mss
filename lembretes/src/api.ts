import axios from 'axios'
import { config } from 'dotenv'

config()

const { EVENTS_API_URL } = process.env

export const apiEvents = axios.create({
  baseURL: EVENTS_API_URL
})
