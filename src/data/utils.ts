import moment from "moment";
import { DAY } from "../constants";

/**
 * Returns a normalized phone number in E.164 format.
 * Assumes that if a number has no country code, that
 * the country code is 1 (USA or Canada).
 * Examples:
 * (415) 555-2671 => +14155552671
 * 44 020 7183 8750 = +4402071838750
 *
 * @param number - the raw phone number in a variety of potential formats
 * @returns the normalized number in E.164 format.
 */
export function normalizeNumber(rawNumber: string) {
  const stripped = rawNumber.replace(/\D/g, "");
  return stripped.length === 10 ? `+1${stripped}` : `+${stripped}`;
}

/**
 * Takes a timestamp and normalizes it into a Date object.
 *
 * @param ts - a timestamp as stored per-message in the iMessage database
 * @returns a Date object created from the timestamp.
 */
export function formattedDate(ts: number) {
  const DATE_OFFSET = 978307200;
  if (ts.toString().length >= 18) { ts = ts / 1000000000; }

  const unpacked = Math.floor(ts / Math.pow(10, 9));
  if (unpacked !== 0) { ts = unpacked; }

  return new Date((ts + DATE_OFFSET) * 1000);
}

/**
 * Cleans up raw iMessage data dump to make it more readable and organized.
 *
 * @param data - the raw phone number in a variety of potential formats
 * @returns an object containing messages from them, myself, and the total.
 */
export function cleanData(data: IRawData[]) {
  const cleaned: IContactMessageData = {
    fromMe: [],
    fromThem: [],
    total: 0,
  };

  for (const raw of data) {
    const message = {
      body: raw.text,
      date: formattedDate(raw.adjusted_date),
      isAudioMessage: raw.is_audio_message ? true : false,
      service: raw.service,
    };

    if (raw.is_from_me === 1) {
      cleaned.fromMe.push(message);
    } else {
      cleaned.fromThem.push(message);
    }
  }

  cleaned.total = cleaned.fromMe.length + cleaned.fromThem.length;

  return cleaned;
}

/**
 * Returns the total
 *
 * @param messages - an array of message objects
 * @returns an array of graph point objects, with each object containing a date and
 * number of messages sent on that date
 */
export function sumTextsForDates(messages: IMessage[]) {
  const formatted: IDataPoint[] = [];
  const [first, last] = [
    new Date(messages[0].date).getTime(),
    new Date(messages[messages.length - 1].date).getTime(),
  ];

  for (let time = first; time < last; time += DAY) {
    const day = new Date(time);
    const filtered = messages.filter((m) => {
      const d = new Date(m.date);
      return (
        day.getFullYear() === d.getFullYear() &&
        day.getMonth() === d.getMonth() &&
        day.getDate() === d.getDate()
      );
    });

    formatted.push(({
      date: day.getTime(),
      messageCount: filtered.length,
    }));
  }
  return formatted;
}

/**
 * Formats a date more human-readably.
 *
 * @param time - a date represented either as a Date or in milliseconds
 * @returns a string with time formatted as "YYYY-MM-DD"
 */
export function timeFormat(time: number | string | Date) {
 return moment(time).format("MM/DD/YYYY");
}

/**
 * Fetches the start and end dates for the x-axis, based on the first and last
 * texts sent between myself and a given Contact.
 *
 * @param fromMe - the array of message objects sent from me to the Contact
 * @param fromThem - the array of message objects sent from the Contact to me
 * @returns an array containing the start/end times for the graph x-axis in milliseconds
 */
export function getDomain(fromMe: IMessage[], fromThem: IMessage[]) {
  const meStart = new Date(fromMe[0].date).getTime();
  const themStart = new Date(fromThem[0].date).getTime();
  const start = (meStart > themStart) ? themStart : meStart;

  const meEnd = new Date(fromMe[fromMe.length - 1].date).getTime();
  const themEnd = new Date(fromThem[fromThem.length - 1].date).getTime();
  const end = (meEnd > themEnd) ? meEnd : themEnd;

  return ([start, end]);
}
