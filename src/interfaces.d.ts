declare module 'node-mac-contacts';

interface ContactMessageData {
  total: number;
  fromMe: Message[];
  fromThem: Message[],
}

interface Message {
  date: Date;
  isAudioMessage: boolean;
  service: string;
  body: string;
}

interface ContactInfo {
  id: string;
  firstName: string;
  lastName: string,
  phoneNumbers: string[],
  messages: Record<string, ContactMessageData>
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

/***** COMPONENT PROP TYPINGS *****/

interface AppProps {
  loading: boolean;
  contacts?: ContactInfo[];
  selectedContact?: string;
}

interface ContactListProps {
  contacts: ContactInfo[];
  changeContact: Function;
}