// src/screens/AddEditContactScreen.tsx
import React, {useState, useEffect} from 'react';
import {View, TextInput, Button} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditContact'>;

const AddEditContactScreen = ({route, navigation}: Props) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Si estamos editando un contacto, obtenemos los datos del mismo
  useEffect(() => {
    if (route.params?.contactId) {
      // Aquí podrías cargar los datos reales del contacto por su ID
      // Para este ejemplo, lo dejamos vacío
      // Por ejemplo: cargarContacto(route.params.contactId);
      const contactId = route.params.contactId;
      // Simular carga de contacto para editar:
      // Aquí podrías obtener el contacto desde un backend o AsyncStorage.
      const contact = {
        id: contactId,
        name: 'Harold Medrano',
        phone: '302-456-7890',
        email: 'harold@example.com',
      };
      setName(contact.name);
      setPhone(contact.phone);
      setEmail(contact.email);
    }
  }, [route.params?.contactId]);

  const handleSave = () => {
    // Aquí agregarías la lógica para guardar el contacto (por ejemplo, en AsyncStorage o un backend)
    // Por ahora, solo volvemos a la pantalla de listado
    if (name && phone && email) {
      console.log('Contact saved:', {name, phone, email});
    }
    navigation.goBack();
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
