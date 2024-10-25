import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate('AddEditContact', { contactId: item.id, contact: item })}
        >
      <View style={styles.infoContactContainer}>
        {item.profileImage ? (
            <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholder}>
              <Text>{item.name ? item.name[0] : "?"}</Text>
            </View>
          )
        }
      
      <View style={styles.contactContainer}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text>{item.phone}</Text>
        <Text>{item.email}</Text>
      </View>
      </View>
      </TouchableOpacity>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={() => deleteContact(item.id)}>
          <Icon name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
        
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
  infoContactContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 18,
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
