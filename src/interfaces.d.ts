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
}

interface IDataPoint {
  // date represented in milliseconds
  date: number;
  messageCount: number;
}

interface IRawData {
  ROWID: number;
  service: string;
  adjusted_date: number;
  is_from_me: 0 | 1;
  handle_id: number;
}

/* COMPONENT PROP TYPINGS */

interface IAppState {
  loading: boolean;
  contacts: IContactInfo[];
  selectedContact?: string;
}

interface IContactListProps {
  contacts: IContactInfo[];
  changeContact: (id: string) => void;
}

interface IContactViewState {
  loading: boolean;
  data: IContactMessageData;
}
