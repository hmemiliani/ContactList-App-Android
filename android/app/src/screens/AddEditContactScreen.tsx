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

  const takePhoto = async () => {
    const response = await launchCamera({ mediaType: 'photo', saveToPhotos: true });
    if (response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri;
      setProfileImage(uri);
    }
  };

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
      <View style={styles.imgContainer}>
        <TouchableOpacity onPress={pickImageFromGallery}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholder}>
              <Text>{name ? name[0] : " "}</Text>
            </View>
          )}
        </TouchableOpacity>
        <Button title="Take Photo" onPress={takePhoto} />
      </View>
      <View style={styles.contentContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: 'flex',
  },
  imgContainer: {
    alignItems: 'center',
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  contentContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
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
