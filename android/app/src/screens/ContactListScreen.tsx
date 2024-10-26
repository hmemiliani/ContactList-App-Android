import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Contact, RootStackParamList } from '../types/navigation';
import { useContacts } from '../hooks/useContacts';

type ContactListScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactList'>;

const ContactListScreen = () => {
  const navigation = useNavigation<ContactListScreenNavigationProp>();
  const { contacts, loadContacts } = useContacts();

  useFocusEffect(
    React.useCallback(() => {
      loadContacts();  // Cargar los contactos cada vez que la pantalla recibe foco
    }, [])
  );
  
  const renderItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate('ContactDetail', { contact: item })}
    >
      <View style={styles.infoContactContainer}>
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{item.name ? item.name[0] : "?"}</Text>
          </View>
        )}
        <View style={styles.contactContainer}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text>{item.phone}</Text>
          <Text>{item.email}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={contacts} keyExtractor={(item) => item.id} renderItem={renderItem} />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditContact', { contactId: undefined })}
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactContainer: {
    flexDirection: 'column',
    marginLeft: 20,
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
  placeholderText: {
    fontSize: 30,
    fontWeight: 'bold',
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
