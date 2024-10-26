import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useProfileImage } from '../hooks/useProfileImage';
import { useContacts } from '../hooks/useContacts';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEditContact'>;

const AddEditContactScreen = ({ route, navigation }: Props) => {
  const { addOrUpdateContact } = useContacts();
  const { profileImage, takePhoto, pickImageFromGallery, setProfileImage } = useProfileImage();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (route.params?.contact) {
      const { contact } = route.params;
      setName(contact.name || '');
      setPhone(contact.phone || '');
      setEmail(contact.email || '');
      setProfileImage(contact.profileImage || undefined);
    }
  }, [route.params]);

  const handleSave = async () => {
    const contact = {
      id: route.params?.contactId || Date.now().toString(),
      name,
      phone,
      email,
      profileImage,
    };
    await addOrUpdateContact(contact);
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
              <Text style={styles.currentAvatar}>{name ? name[0] : " "}</Text>
            </View>
          )}
        </TouchableOpacity>
        <Button title="Take Photo" onPress={takePhoto} />
      </View>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <Button title="Save Contact" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, display: 'flex' },
  imgContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  currentAvatar: { fontSize: 50 },
  placeholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, margin: 10, padding: 10 },
});

export default AddEditContactScreen;
