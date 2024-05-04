export type Observation = {
  id: string
  text: string
  reminderId: string
}

export type Reminder = {
  id: string
  text: string
}

export type Event<T> = {
  type: string
  payload: T
}

export type ReminderWithObservation = {
  id: string
  text: string
  observations: Observation[]
}
