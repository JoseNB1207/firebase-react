import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

export default function Original() {

  const [mision, setMision] = useState(null);
  const [loading, setLoading] = useState(true);

  const obtenerMision = async () => {

    setLoading(true);

    const id = Math.floor(Math.random() * 100) + 1;

    try {

      const res = await fetch(
        `https://api.spacexdata.com/v3/launches/${id}`
      );

      const json = await res.json();

      setMision(json);

    } catch (error) {

      console.log(error);

    }

    setLoading(false);

  };

  useEffect(() => {
    obtenerMision();
  }, []);

  if (loading) {

    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  }

  if (!mision) {

    return (
      <View style={styles.center}>
        <Text>No se pudo cargar la misión</Text>
      </View>
    );

  }

  return (

    <View style={styles.container}>

      <Text style={styles.titulo}>
        {mision.mission_name}
      </Text>

      <Text>
        Año: {mision.launch_year}
      </Text>

      <Text>
        Rocket: {mision.rocket?.rocket_name}
      </Text>

      {
        mision.links?.mission_patch ? (

          <Image
            source={{
              uri: mision.links.mission_patch
            }}
            style={styles.imagen}
          />

        ) : (

          <Text>
            Sin imagen disponible
          </Text>

        )
      }

      <Button
        title="Otra misión"
        onPress={obtenerMision}
      />

    </View>

  );

}

const styles = StyleSheet.create({

  center:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },

  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    padding:20
  },

  titulo:{
    fontSize:24,
    fontWeight:'bold',
    marginBottom:20,
    textAlign:'center'
  },

  imagen:{
    width:200,
    height:200,
    resizeMode:'contain',
    marginVertical:20
  }

});