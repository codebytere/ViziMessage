export function  normalizeNumber (number: string) {
  const stripped = number.replace(/\D/g, "");
  return stripped.length === 10 ? `+1${stripped}` : `+${stripped}`;
};

export function formattedDate (ts: number) {
  const DATE_OFFSET = 978307200;
  if (ts === 0) return null;
  if (ts.toString().length >= 18) ts = ts / 1000000000;

  const unpacked = Math.floor(ts / Math.pow(10, 9));
  if (unpacked !== 0) ts = unpacked;

  return new Date((ts + DATE_OFFSET) * 1000);
};

export function cleanData (data: Array<any>) {
  let cleaned: ContactMessage = {
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
