import moment from 'moment'
import { DAY } from '../constants'

/**
 * Transforms a set of message objects into a set of plot
 * points for visualizing how many messages were sent on a
 * given date over the course of message history with a given
 * Contact.
 *
 * @param messages - an array of message objects.
 * @returns an array of graph point objects, with each object
 * containing a date and number of messages sent on that date.
 */
export function sumTextsForDates(messages: IMessage[]) {
  const formatted: IDataPoint[] = []

  // Used to set the iteration range so we can more accurately
  // step through message history of Contacts with wildly
  // disparate messaging time-spans.
  const [first, last] = [
    new Date(messages[0].date).getTime(),
    new Date(messages[messages.length - 1].date).getTime(),
  ]

  for (let time = first; time < last; time += DAY) {
    const day = new Date(time)

    const filtered: IMessage[] = []
    for (const message of messages) {
      if (isSameDay(day, new Date(message.date))) {
        filtered.push(message)
      }
    }

    formatted.push({
      date: day.getTime(),
      messageCount: filtered.length,
    })
  }

  return formatted
}

/**
 * Formats a date more human-readably.
 *
 * @param time - a date represented either as a Date or in milliseconds.
 * @returns a string with time formatted as YYYY-MM-DD.
 */
export function timeFormat(time: number | string | Date) {
  return moment(time).format('MM/DD/YYYY')
}

/**
 * Returns a boolean value indicating whether two dates represent the same day.
 *
 * @param first - the first date to compare.
 * @param second - the second date to compare.
 */
const isSameDay = (first: Date, second: Date) => {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  )
}

/**
 * Formats the date label more human-readably.
 *
 * @param value - a string representing the value for a given graph axis property
 * @param name - the name of the graph axis value
 * @returns a string with time formatted as YYYY-MM-DD.
 */
export const labelFormat = (value: any, name: string) => {
  if (name === 'Date') {
    return timeFormat(value)
  }
  return value
}

/**
 * Fetches the start and end dates for the x-axis, based on the
 * first and last texts sent between myself and a given Contact.
 *
 * @param fromMe - the array of message objects sent from me to
 * the Contact.
 * @param fromThem - the array of message objects sent from the
 * Contact to me.
 * @returns an array containing the start/end times for the graph
 * x-axis in milliseconds.
 */
export function getDomain(fromMe: IMessage[], fromThem: IMessage[]) {
  const meStart = new Date(fromMe[0].date).getTime()
  const themStart = new Date(fromThem[0].date).getTime()
  const start = meStart > themStart ? themStart : meStart

  const meEnd = new Date(fromMe[fromMe.length - 1].date).getTime()
  const themEnd = new Date(fromThem[fromThem.length - 1].date).getTime()
  const end = meEnd > themEnd ? meEnd : themEnd

  return [start, end]
}
