import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact } from '../types/navigation';  // Importamos el tipo Contact

const STORAGE_KEY = '@contacts';

export const useContacts = (route?: any) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
// Cargar los contactos desde AsyncStorage
  
  const loadContacts = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedContacts !== null) {
        setContacts(JSON.parse(storedContacts));
      }
    } catch (e) {
      console.error('Failed to load contacts.', e);
    }
  };

  // Guardar los contactos en AsyncStorage
  const saveContacts = async (newContacts: Contact[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
    } catch (e) {
      console.error('Failed to save contacts.', e);
    }
  };

  // Agregar o actualizar un contacto
  const addOrUpdateContact = (contact: Contact) => {
    setContacts((prevContacts) => {
      const contactExists = prevContacts.some((c) => c.id === contact.id);
      const updatedContacts = contactExists
        ? prevContacts.map((c) => (c.id === contact.id ? contact : c))
        : [...prevContacts, contact];
      saveContacts(updatedContacts);
      loadContacts();
      return updatedContacts;
    });
  };

  const deleteContact = (contactId: string) => {
    setContacts((prevContacts) => {
      const updatedContacts = prevContacts.filter((contact) => contact.id !== contactId);
      saveContacts(updatedContacts);
      return updatedContacts;
    });
  };

  useEffect(() => {
    if (route?.params?.contactIdToDelete) {
      deleteContact(route.params.contactIdToDelete);
    }
  }, [route?.params?.contactIdToDelete]);

  useEffect(() => {
    loadContacts();
  }, []);

  return {
    contacts,
    loadContacts,
    addOrUpdateContact,
    deleteContact,
  };
};
