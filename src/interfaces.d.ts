declare module 'node-mac-contacts';

interface ContactMessageData {
  total: number;
  fromMe: any[];
  fromThem: any[],
}

interface Contact {
  id: number;
  firstName: string;
  lastName: string,
  phoneNumbers: string[],
  messages: Record<string, ContactMessage>
}

interface RawData {
  ROWID: number;
  text: string;
  service: string;
  adjusted_date: number;
  date_read: number;
  cache_has_attachments: 0 | 1;
  is_from_me: 0 | 1;
  is_audio_message: 0 | 1;
  handle_id: number;
}
