import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);

  const navigation = useNavigation();

  const handleRegistro = async () => {
    if (!nombre || !correo || !contrasena) {
      Alert.alert('Campos incompletos', 'Completa todos los campos.');
      return;
    }
    setCargando(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const user = userCredential.user;
      await setDoc(doc(db, 'usuarios', user.uid), {
        uid: user.uid,
        nombre,
        correo,
      });
      Alert.alert('¡Listo!', 'Cuenta creada correctamente.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    setCargando(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0a0e1a' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.emoji}>🚀</Text>
        <Text style={styles.titulo}>Crear cuenta</Text>
        <Text style={styles.subtitulo}>Únete al reto SpaceX</Text>

        <TextInput
          placeholder="Nombre"
          placeholderTextColor="#3a5070"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#3a5070"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#3a5070"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.boton, cargando && styles.botonDesactivado]}
          onPress={handleRegistro}
          disabled={cargando}
          activeOpacity={0.85}
        >
          <Text style={styles.botonText}>
            {cargando ? 'Creando cuenta...' : 'Registrarse'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 28,
    backgroundColor: '#0a0e1a',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 52,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e8f0fe',
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 15,
    color: '#5a7fa0',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1e2d42',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    color: '#e8f0fe',
    fontSize: 15,
  },
  boton: {
    backgroundColor: '#1d4ed8',
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  botonDesactivado: {
    opacity: 0.6,
  },
  botonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#7eb8f7',
    fontSize: 14,
  },
});