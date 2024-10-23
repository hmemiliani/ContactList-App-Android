export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export type RootStackParamList = {
  ContactList: {newContact?: Contact};
  AddEditContact: {contactId?: string; contact?: Contact};
};
