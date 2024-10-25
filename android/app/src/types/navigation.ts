export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  profileImage?: string;
}

export type RootStackParamList = {
  ContactList: { newContact?: Contact };  // El parámetro newContact es del tipo Contact
  AddEditContact: { contactId?: string; contact?: Contact };
};

