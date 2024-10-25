import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importar la imagen por defecto
const defaultImage = require('../assets/images/default-profile.png');

type ContactListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactList'>;
type ContactListScreenRouteProp = RouteProp<RootStackParamList, 'ContactList'>;

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  profileImage?: string;
}

const STORAGE_KEY = '@contacts';

const ContactListScreen = () => {
  const navigation = useNavigation<ContactListScreenNavigationProp>();
  const route = useRoute<ContactListScreenRouteProp>();

  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
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

    loadContacts();
  }, []);

  const saveContacts = async (newContacts: Contact[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newContacts));
    } catch (e) {
      console.error('Failed to save contacts.', e);
    }
  };

  useEffect(() => {
    if (route.params?.newContact) {
      const newContact = route.params.newContact;

      setContacts((prevContacts) => {
        const contactExists = prevContacts.some((contact) => contact.id === newContact.id);
        const updatedContacts = contactExists
          ? prevContacts.map((contact) => contact.id === newContact.id ? newContact : contact)
          : [...prevContacts, newContact];

        saveContacts(updatedContacts);
        return updatedContacts;
      });
    }
  }, [route.params?.newContact]);

  const deleteContact = (id: string) => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setContacts((prevContacts) => {
              const updatedContacts = prevContacts.filter((contact) => contact.id !== id);
              saveContacts(updatedContacts);
              return updatedContacts;
            });
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Contact }) => (
    <View style={styles.contactItem}>
      {/* Usar la imagen de perfil si existe, o la imagen predeterminada si no */}
      <Image
        source={item.profileImage ? { uri: item.profileImage } : defaultImage}
        style={styles.profileImage}
      />

      <View style={styles.contactDetails}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text>{item.phone}</Text>
        <Text>{item.email}</Text>
      </View>

      {/* Botón para eliminar */}
      <TouchableOpacity onPress={() => deleteContact(item.id)}>
        <Icon name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate({
          name: 'AddEditContact',
          params: { contactId: undefined }
        })}
      >
        <Text style={styles.addButtonText}>+ Add Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    margin: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ContactListScreen;
