import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// Importar la imagen predeterminada localmente
const defaultImage = require('../assets/images/default-profile.png');

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditContact'>;

const AddEditContactScreen = ({ route, navigation }: Props) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<any>(defaultImage);  // Imagen predeterminada inicialmente

  useEffect(() => {
    if (route.params?.contactId && route.params?.contact) {
      const contact = route.params.contact;
      if (contact) {
        setName(contact.name || '');
        setPhone(contact.phone || '');
        setEmail(contact.email || '');
        setProfileImage(contact.profileImage ? { uri: contact.profileImage } : defaultImage);  // Usa la imagen si existe o la predeterminada
      }
    }
  }, [route.params?.contactId, route.params?.contact]);

  // Función para tomar una foto con la cámara
  const takePhoto = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) setProfileImage({ uri });  // Asegúrate de que el valor `uri` es una cadena válida
      }
    });
  };

  // Función para seleccionar una imagen de la galería
  const pickImageFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) setProfileImage({ uri });  // Asegúrate de que el valor `uri` es una cadena válida
      }
    });
  };

  const handleSave = () => {
    const contact = {
      id: route.params?.contactId || Date.now().toString(),
      name,
      phone,
      email,
      profileImage: profileImage.uri || null,  // Guardar solo la `uri` de la imagen o dejar `null`
    };

    navigation.navigate('ContactList', { newContact: contact });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImageFromGallery}>
        <Image source={profileImage} style={styles.profileImage} />
      </TouchableOpacity>

      <Button title="Take Photo" onPress={takePhoto} />  {/* Botón para tomar foto */}

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
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
});

export default AddEditContactScreen;
