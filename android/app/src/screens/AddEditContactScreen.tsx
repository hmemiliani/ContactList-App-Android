import React, {useState, useEffect} from 'react';
import {View, TextInput, Button} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditContact'>;

const AddEditContactScreen = ({route, navigation}: Props) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (route.params?.contactId && route.params?.contact) {
      const contact = route.params.contact;
      if (contact) {
        setName(contact.name || '');
        setPhone(contact.phone || '');
        setEmail(contact.email || '');
      }
    }
  }, [route.params?.contactId, route.params?.contact]);

  const handleSave = () => {
    const contact = {
      id: route.params?.contactId || Date.now().toString(),
      name,
      phone,
      email,
    };

    navigation.navigate('ContactList', {newContact: contact});
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Save Contact" onPress={handleSave} />
    </View>
  );
};

import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default AddEditContactScreen;
