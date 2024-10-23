import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importar los iconos

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

  // Función para eliminar contacto
  const deleteContact = (id: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setContacts(prevContacts =>
              prevContacts.filter(contact => contact.id !== id),
            );
          },
        },
      ],
    );
  };

  const renderItem = ({item}: {item: Contact}) => (
    <View style={styles.contactItem}>
      <TouchableOpacity
        style={styles.contactTouchable}
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
      {/* Botón con ícono de eliminación */}
      <TouchableOpacity onPress={() => deleteContact(item.id)}>
        <Icon name="trash" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate({
            name: 'AddEditContact',
            params: {contactId: undefined}, // Para crear un nuevo contacto
          })
        }>
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between', // Separar el contenido del icono
    alignItems: 'center', // Centrar verticalmente el ícono
  },
  contactName: {
    fontSize: 18,
  },
  contactTouchable: {
    flex: 1,
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
