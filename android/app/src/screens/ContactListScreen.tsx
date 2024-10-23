import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

type ContactListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ContactList' | 'AddEditContact'
>;

const ContactListScreen = () => {
  const navigation = useNavigation<ContactListScreenNavigationProp>(); // Aquí agregamos el tipo

  // Datos ficticios de ejemplo
  const [contacts] = useState([
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

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() =>
        navigation.navigate('AddEditContact', {contactId: item.id})
      } // Aquí pasamos el parámetro correctamente
    >
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
          navigation.navigate('AddEditContact', {contactId: undefined})
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
