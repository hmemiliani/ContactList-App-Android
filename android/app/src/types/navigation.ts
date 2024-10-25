export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  profileImage?: string;
}

export type RootStackParamList = {
  ContactList: { newContact?: Contact, contactIdToDelete?: string };
  AddEditContact: { contactId?: string; contact?: Contact };
  ContactDetail: { contact: Contact};
};

