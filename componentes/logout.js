import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function Logout() {
  useEffect(() => {
    signOut(auth);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#7eb8f7" />
      <Text style={styles.texto}>Cerrando sesión...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0e1a',
    gap: 16,
  },
  texto: {
    color: '#7ea8c9',
    fontSize: 16,
  },
});