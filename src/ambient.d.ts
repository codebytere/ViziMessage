declare module 'node-mac-contacts';

interface ContactMessage {
  total: number;
  fromMe: any[];
  fromThem: any[],
}

interface Contact {
  id: number;
  firstName: string;
  lastName: string,
  numbers: string[],
  messages: Record<string, ContactMessage>
}
