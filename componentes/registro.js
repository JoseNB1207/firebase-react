import React, { useState } from 'react';

import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert
} from 'react-native';

import { createUserWithEmailAndPassword } from 'firebase/auth';

import {
  doc,
  setDoc
} from 'firebase/firestore';

import {
  auth,
  db
} from '../firebase/firebaseConfig';

import { useNavigation } from '@react-navigation/native';

export default function Registro() {

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');

  const navigation = useNavigation();

  const handleRegistro = async () => {

    try {

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          correo,
          contrasena
        );

      const user = userCredential.user;

      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        nombre,
        correo
      });

      Alert.alert(
        'Éxito',
        'Usuario registrado'
      );

      navigation.navigate('Login');

    } catch (error) {

      Alert.alert(
        'Error',
        error.message
      );

    }

  };

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Registro
      </Text>

      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
      />

      <TextInput
        placeholder="Correo"
        value={correo}
        onChangeText={setCorreo}
        style={styles.input}
      />

      <TextInput
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
        style={styles.input}
      />

      <Button
        title="Registrarse"
        onPress={handleRegistro}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:'center',
    padding:20
  },

  titulo:{
    fontSize:24,
    textAlign:'center',
    marginBottom:20
  },

  input:{
    borderWidth:1,
    borderColor:'#ccc',
    padding:12,
    marginBottom:12,
    borderRadius:6
  }

});