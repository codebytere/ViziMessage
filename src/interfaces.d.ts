declare module 'node-mac-contacts';

interface IContactMessageData {
  total: number;
  fromMe: IMessage[];
  fromThem: IMessage[];
}

interface IMessage {
  date: Date;
  service: string;
}

interface IContactInfo {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumbers: string[];
  emailAddresses: string[];
  messages: Record<string, IContactMessageData>;
}

interface IDataPoint {
  // date represented in milliseconds
  date: number;
  messageCount: number;
}

interface IRawData {
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

/* COMPONENT PROP TYPINGS */

interface IAppProps {
  loading: boolean;
  contacts: IContactInfo[];
  selectedContact?: string;
}

interface IContactListProps {
  contacts: IContactInfo[];
  changeContact: (id: string) => void;
}
