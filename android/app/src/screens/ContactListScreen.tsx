import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

type ContactListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ContactList'
>;
type ContactListScreenRouteProp = RouteProp<RootStackParamList, 'ContactList'>;

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

const ContactListScreen = () => {
  const navigation = useNavigation<ContactListScreenNavigationProp>();
  const route = useRoute<ContactListScreenRouteProp>();

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Harold Medrano',
      phone: '302-456-7890',
      email: 'harold@example.com',
    },
    {
      id: '2',
      name: 'Amira Gutierrez',
      phone: '305-654-3210',
      email: 'amira@example.com',
    },
  ]);

  useEffect(() => {
    if (route.params?.newContact) {
      const newContact = route.params.newContact;

      setContacts(prevContacts => {
        const contactExists = prevContacts.some(
          contact => contact.id === newContact.id,
        );
        if (contactExists) {
          return prevContacts.map(contact =>
            contact.id === newContact.id ? newContact : contact,
          );
        } else {
          return [...prevContacts, newContact];
        }
      });
    }
  }, [route.params?.newContact]);

  const renderItem = ({item}: {item: Contact}) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() =>
        navigation.navigate('AddEditContact', {
          contactId: item.id,
          contact: item,
        })
      }>
      <Text style={styles.contactName}>{item.name}</Text>
      <Text>{item.phone}</Text>
      <Text>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      <Button
        title="Add Contact"
        onPress={() =>
          navigation.navigate({
            name: 'AddEditContact',
            params: {contactId: undefined},
          })
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactName: {
    fontSize: 18,
  },
});

export default ContactListScreen;
