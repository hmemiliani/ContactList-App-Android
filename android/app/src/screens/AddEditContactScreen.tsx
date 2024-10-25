import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditContact'>;

const AddEditContactScreen = ({ route, navigation }: Props) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);

  // Si se está editando un contacto, cargamos la información existente
  useEffect(() => {
    if (route.params?.contactId && route.params?.contact) {
      const contact = route.params.contact;
      if (contact) {
        setName(contact.name || '');
        setPhone(contact.phone || '');
        setEmail(contact.email || '');
        setProfileImage(contact.profileImage || undefined);
      }
    }
  }, [route.params?.contactId, route.params?.contact]);

  // Función para tomar una foto con la cámara
  const takePhoto = async () => {
    const response = await launchCamera({ mediaType: 'photo', saveToPhotos: true });
    if (response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri;
      setProfileImage(uri);
    }
    
    
  };

  // Función para seleccionar una imagen de la galería
  const pickImageFromGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setProfileImage(uri);
      }
    });
  };

  const handleSave = () => {
    const contact = {
      id: route.params?.contactId || Date.now().toString(),
      name,
      phone,
      email,
      profileImage,
    };

    navigation.navigate('ContactList', { newContact: contact });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImageFromGallery}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholder}>
            <Text>{name ? name[0] : "?"}</Text>
          </View>
        )}
      </TouchableOpacity>
      <Button title="Take Photo /" onPress={takePhoto} />

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
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default AddEditContactScreen;
