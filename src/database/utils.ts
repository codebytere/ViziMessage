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
export function  normalizeNumber (number: string) {
  const stripped = number.replace(/\D/g, "");
  return stripped.length === 10 ? `+1${stripped}` : `+${stripped}`;
};

/**
 * Takes a timestamp and normalizes it into a Date object.
 * 
 * @param ts - a timestamp as stored per-message in the iMessage database
 * @returns a Date object created from the timestamp.
 */
export function formattedDate (ts: number) {
  const DATE_OFFSET = 978307200;
  if (ts.toString().length >= 18) ts = ts / 1000000000;

  const unpacked = Math.floor(ts / Math.pow(10, 9));
  if (unpacked !== 0) ts = unpacked;

  return new Date((ts + DATE_OFFSET) * 1000);
};

/**
 * Cleans up raw iMessage data dump to make it more readable and organized.
 * 
 * @param data - the raw phone number in a variety of potential formats
 * @returns an object containing messages from them, myself, and the total.
 */
export function cleanData (data: RawData[]) {
  let cleaned: ContactMessageData = {
    total: 0,
    fromMe: [],
    fromThem: []
  };

  for (let idx = 0; idx < data.length; idx++) {
    const raw = data[idx];
    const message = {
      date: formattedDate(raw.adjusted_date),
      isAudioMessage: raw.is_audio_message ? true : false,
      service: raw.service,
      body: raw.text
    };

    if (raw.is_from_me === 1) {
      cleaned.fromMe.push(message);
    } else {
      cleaned.fromThem.push(message);
    }
  }

  cleaned.total = cleaned.fromMe.length + cleaned.fromThem.length;

  return cleaned;
};
