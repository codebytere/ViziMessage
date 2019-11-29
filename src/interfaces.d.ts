declare module "node-mac-contacts";

interface IContactMessageData {
  total: number;
  fromMe: Message[];
  fromThem: Message[];
}

interface IMessage {
  date: Date;
  isAudioMessage: boolean;
  service: string;
  body: string;
}

interface IContactInfo {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumbers: string[];
  messages: Record<string, ContactMessageData>;
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

/***** COMPONENT PROP TYPINGS *****/

interface IAppProps {
  loading: boolean;
  contacts?: ContactInfo[];
  selectedContact?: string;
}

interface IContactListProps {
  contacts: ContactInfo[];
  changeContact: (id: string) => void;
}
