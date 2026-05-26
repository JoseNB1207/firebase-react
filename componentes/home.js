import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';

export default function Home() {
  const [lanzamientos, setLanzamientos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await fetch('https://api.spacexdata.com/v3/launches');
        const json = await res.json();
        setLanzamientos(json.slice(0, 30));
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    obtenerDatos();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#005288" />
        <Text style={styles.loadingText}>Cargando misiones...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚀 Lanzamientos SpaceX</Text>
        <Text style={styles.headerSub}>{lanzamientos.length} misiones cargadas</Text>
      </View>

      <View style={styles.lista}>
        {lanzamientos.map((item, index) => (
          <TouchableOpacity key={index} style={styles.card} activeOpacity={0.85}>
            <View style={styles.cardRow}>
              {item.links.mission_patch_small ? (
                <Image
                  source={{ uri: item.links.mission_patch_small }}
                  style={styles.imagen}
                  contentFit="contain"
                  transition={300}
                />
              ) : (
                <View style={styles.sinImagenBox}>
                  <Text style={styles.sinImagenIcon}>🛸</Text>
                </View>
              )}
              <View style={styles.cardInfo}>
                <Text style={styles.titulo} numberOfLines={2}>
                  {item.mission_name}
                </Text>
                <View style={styles.badgeRow}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>#{item.flight_number}</Text>
                  </View>
                  <View style={[styles.badge, styles.badgeYear]}>
                    <Text style={styles.badgeText}>{item.launch_year}</Text>
                  </View>
                </View>
                <Text style={styles.cohete}>🔩 {item.rocket.rocket_name}</Text>
                <Text style={item.launch_success ? styles.exitoso : styles.fallido}>
                  {item.launch_success ? '✅ Exitoso' : '❌ Fallido'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#0a0e1a',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0e1a',
  },
  loadingText: {
    color: '#7ea8c9',
    marginTop: 12,
    fontSize: 15,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2d42',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 13,
    color: '#5a7fa0',
    marginTop: 4,
  },
  lista: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e2d42',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  imagen: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#1a2535',
  },
  sinImagenBox: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: '#1a2535',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sinImagenIcon: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
    gap: 6,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e8f0fe',
    lineHeight: 22,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: '#1e3a5f',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeYear: {
    backgroundColor: '#1e3d2f',
  },
  badgeText: {
    fontSize: 12,
    color: '#7eb8f7',
    fontWeight: '600',
  },
  cohete: {
    fontSize: 13,
    color: '#7ea8c9',
  },
  exitoso: {
    fontSize: 13,
    color: '#4ade80',
    fontWeight: '600',
  },
  fallido: {
    fontSize: 13,
    color: '#f87171',
    fontWeight: '600',
  },
});