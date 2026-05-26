import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { auth } from '../firebase/firebaseConfig';
import { supabase } from '../supabase/supabaseClient';

const COHETES = ['Falcon 1', 'Falcon 9', 'Falcon Heavy', 'Dragon'];
const PUNTOS_CORRECTO = 10;
const TIEMPO_LIMITE = 15;

function mezclar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generarOpciones(correcto) {
  const otros = COHETES.filter(c => c !== correcto);
  const seleccionados = mezclar(otros).slice(0, 3);
  return mezclar([correcto, ...seleccionados]);
}

export default function Original() {
  const [mision, setMision] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [seleccion, setSeleccion] = useState(null);
  const [puntaje, setPuntaje] = useState(0);
  const [racha, setRacha] = useState(0);
  const [ronda, setRonda] = useState(1);
  const [loading, setLoading] = useState(true);
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_LIMITE);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const timerRef = useRef(null);
  const escalaAnim = useRef(new Animated.Value(1)).current;
  const opacidadAnim = useRef(new Animated.Value(1)).current;

  const obtenerMision = async () => {
    setLoading(true);
    setSeleccion(null);
    setTiempoRestante(TIEMPO_LIMITE);
    clearInterval(timerRef.current);

    try {
      let misionValida = null;
      while (!misionValida) {
        const id = Math.floor(Math.random() * 90) + 1;
        const res = await fetch(`https://api.spacexdata.com/v3/launches/${id}`);
        const json = await res.json();
        if (json && json.mission_name && json.rocket?.rocket_name) {
          misionValida = json;
        }
      }
      setMision(misionValida);
      setOpciones(generarOpciones(misionValida.rocket.rocket_name));
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    obtenerMision();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (loading || seleccion || juegoTerminado) return;

    timerRef.current = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setSeleccion('__tiempo__');
          setRacha(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [loading, mision, seleccion, juegoTerminado]);

  const animarRespuesta = () => {
    Animated.sequence([
      Animated.timing(escalaAnim, { toValue: 1.05, duration: 120, useNativeDriver: true }),
      Animated.timing(escalaAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const elegirRespuesta = (opcion) => {
    if (seleccion) return;
    clearInterval(timerRef.current);
    setSeleccion(opcion);
    animarRespuesta();

    if (opcion === mision.rocket.rocket_name) {
      const bonus = racha >= 2 ? 5 : 0;
      setPuntaje(p => p + PUNTOS_CORRECTO + bonus);
      setRacha(r => r + 1);
    } else {
      setRacha(0);
    }
  };

  const siguienteRonda = () => {
    if (ronda >= 10) {
      terminarJuego();
      return;
    }
    setRonda(r => r + 1);
    obtenerMision();
  };

  const terminarJuego = async () => {
    setJuegoTerminado(true);
    setGuardando(true);
    const usuario = auth.currentUser;

    if (usuario) {
      const { error } = await supabase
        .from('puntuaciones')
        .insert({
          uid: usuario.uid,
          email: usuario.email,
          mision: 'SpaceX Quiz',
          puntaje: puntaje,
        });
      if (error) console.log('Error guardando puntaje:', error.message);
    }

    setGuardando(false);
  };

  const reiniciar = () => {
    setPuntaje(0);
    setRacha(0);
    setRonda(1);
    setJuegoTerminado(false);
    obtenerMision();
  };

  const colorOpcion = (opcion) => {
    if (!seleccion) return styles.opcionNormal;
    if (opcion === mision.rocket.rocket_name) return styles.opcionCorrecta;
    if (opcion === seleccion) return styles.opcionErronea;
    return styles.opcionDesactivada;
  };

  const colorTextoOpcion = (opcion) => {
    if (!seleccion) return styles.textoOpcionNormal;
    if (opcion === mision.rocket.rocket_name) return styles.textoOpcionCorrecta;
    if (opcion === seleccion) return styles.textoOpcionErronea;
    return styles.textoOpcionDesactivada;
  };

  if (juegoTerminado) {
    return (
      <View style={styles.container}>
        <Text style={styles.gameOverTitulo}>🏁 Juego terminado</Text>
        <Text style={styles.gameOverPuntaje}>{puntaje} pts</Text>
        <Text style={styles.gameOverSub}>en 10 rondas</Text>
        {guardando ? (
          <ActivityIndicator color="#7eb8f7" style={{ marginTop: 20 }} />
        ) : (
          <Text style={styles.guardadoText}>✅ Puntaje guardado en Supabase</Text>
        )}
        <TouchableOpacity style={styles.botonReiniciar} onPress={reiniciar}>
          <Text style={styles.botonReiniciarText}>Jugar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#005288" />
        <Text style={styles.loadingText}>Cargando misión...</Text>
      </View>
    );
  }

  if (!mision) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No se pudo cargar la misión</Text>
        <TouchableOpacity style={styles.botonSiguiente} onPress={obtenerMision}>
          <Text style={styles.botonSiguienteText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const correcto = seleccion === mision.rocket.rocket_name;
  const tiempoAgotado = seleccion === '__tiempo__';
  const tiempoColor = tiempoRestante <= 5 ? '#f87171' : tiempoRestante <= 10 ? '#fbbf24' : '#4ade80';

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Puntaje</Text>
          <Text style={styles.statValor}>{puntaje}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Ronda</Text>
          <Text style={styles.statValor}>{ronda}/10</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Racha</Text>
          <Text style={styles.statValor}>🔥 {racha}</Text>
        </View>
      </View>

      <View style={styles.timerBox}>
        <Text style={[styles.timerTexto, { color: tiempoColor }]}>
          ⏱ {tiempoRestante}s
        </Text>
      </View>

      <Animated.View style={[styles.misionCard, { transform: [{ scale: escalaAnim }] }]}>
        {mision.links?.mission_patch ? (
          <Image
            source={{ uri: mision.links.mission_patch }}
            style={styles.parche}
            contentFit="contain"
            transition={400}
          />
        ) : (
          <View style={styles.sinParche}>
            <Text style={{ fontSize: 48 }}>🛸</Text>
          </View>
        )}
        <Text style={styles.misionNombre}>{mision.mission_name}</Text>
        <Text style={styles.misionAno}>Año: {mision.launch_year}</Text>
        <Text style={styles.pregunta}>¿Qué cohete usó esta misión?</Text>
      </Animated.View>

      <View style={styles.opcionesGrid}>
        {opciones.map((opcion, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.opcionBase, colorOpcion(opcion)]}
            onPress={() => elegirRespuesta(opcion)}
            activeOpacity={0.8}
            disabled={!!seleccion}
          >
            <Text style={[styles.textoOpcionBase, colorTextoOpcion(opcion)]}>
              {opcion}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {seleccion && (
        <View style={styles.feedbackBox}>
          {tiempoAgotado ? (
            <Text style={styles.feedbackMal}>⏰ Tiempo agotado — era {mision.rocket.rocket_name}</Text>
          ) : correcto ? (
            <Text style={styles.feedbackBien}>
              ✅ ¡Correcto!{racha >= 2 ? ' +5 bonus por racha 🔥' : ''}
            </Text>
          ) : (
            <Text style={styles.feedbackMal}>
              ❌ Era {mision.rocket.rocket_name}
            </Text>
          )}
          <TouchableOpacity style={styles.botonSiguiente} onPress={siguienteRonda}>
            <Text style={styles.botonSiguienteText}>
              {ronda >= 10 ? 'Ver resultado' : 'Siguiente →'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#7ea8c9',
    marginTop: 12,
    fontSize: 15,
  },
  errorText: {
    color: '#f87171',
    fontSize: 16,
    marginBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    width: '100%',
    justifyContent: 'center',
  },
  statBox: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e2d42',
    minWidth: 80,
  },
  statLabel: {
    fontSize: 11,
    color: '#5a7fa0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e8f0fe',
    marginTop: 2,
  },
  timerBox: {
    marginBottom: 10,
  },
  timerTexto: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  misionCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#1e2d42',
    marginBottom: 18,
  },
  parche: {
    width: 110,
    height: 110,
    marginBottom: 14,
  },
  sinParche: {
    width: 110,
    height: 110,
    backgroundColor: '#1a2535',
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  misionNombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e8f0fe',
    textAlign: 'center',
    marginBottom: 4,
  },
  misionAno: {
    fontSize: 13,
    color: '#5a7fa0',
    marginBottom: 10,
  },
  pregunta: {
    fontSize: 15,
    color: '#7eb8f7',
    fontWeight: '600',
  },
  opcionesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 16,
  },
  opcionBase: {
    width: '47%',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  opcionNormal: {
    backgroundColor: '#111827',
    borderColor: '#2a3f5f',
  },
  opcionCorrecta: {
    backgroundColor: '#14532d',
    borderColor: '#4ade80',
  },
  opcionErronea: {
    backgroundColor: '#450a0a',
    borderColor: '#f87171',
  },
  opcionDesactivada: {
    backgroundColor: '#0d1117',
    borderColor: '#1e2d42',
    opacity: 0.4,
  },
  textoOpcionBase: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  textoOpcionNormal: { color: '#c8d8f0' },
  textoOpcionCorrecta: { color: '#4ade80' },
  textoOpcionErronea: { color: '#f87171' },
  textoOpcionDesactivada: { color: '#3a4a5c' },
  feedbackBox: {
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  feedbackBien: {
    fontSize: 16,
    color: '#4ade80',
    fontWeight: 'bold',
  },
  feedbackMal: {
    fontSize: 16,
    color: '#f87171',
    fontWeight: 'bold',
  },
  botonSiguiente: {
    backgroundColor: '#1d4ed8',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  botonSiguienteText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameOverTitulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e8f0fe',
    marginBottom: 12,
  },
  gameOverPuntaje: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#7eb8f7',
  },
  gameOverSub: {
    fontSize: 16,
    color: '#5a7fa0',
    marginBottom: 8,
  },
  guardadoText: {
    fontSize: 14,
    color: '#4ade80',
    marginTop: 12,
  },
  botonReiniciar: {
    backgroundColor: '#1d4ed8',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 24,
  },
  botonReiniciarText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});