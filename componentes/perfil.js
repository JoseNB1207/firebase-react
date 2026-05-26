import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth } from '../firebase/firebaseConfig';

export default function Perfil() {
  const usuario = auth.currentUser;

  return (
    <View style={styles.container}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarLetra}>
          {usuario?.email?.[0]?.toUpperCase() ?? '?'}
        </Text>
      </View>

      <Text style={styles.titulo}>Mi perfil</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoFila}>
          <Text style={styles.infoLabel}>Correo</Text>
          <Text style={styles.infoValor}>{usuario?.email ?? '—'}</Text>
        </View>
        <View style={styles.separador} />
        <View style={styles.infoFila}>
          <Text style={styles.infoLabel}>UID</Text>
          <Text style={styles.infoValorMono} numberOfLines={1} ellipsizeMode="middle">
            {usuario?.uid ?? '—'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1e3a5f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2a5a8f',
  },
  avatarLetra: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#7eb8f7',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e8f0fe',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#1e2d42',
  },
  infoFila: {
    gap: 4,
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#5a7fa0',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  infoValor: {
    fontSize: 16,
    color: '#c8d8f0',
    fontWeight: '500',
  },
  infoValorMono: {
    fontSize: 13,
    color: '#7ea8c9',
    fontFamily: 'monospace',
  },
  separador: {
    height: 1,
    backgroundColor: '#1e2d42',
  },
});