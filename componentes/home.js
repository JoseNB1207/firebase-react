import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet
} from 'react-native';

export default function Home() {

  const [lanzamientos, setLanzamientos] = useState([]);

  useEffect(() => {

    const obtenerDatos = async () => {

      try {

        const res = await fetch(
          'https://api.spacexdata.com/v3/launches'
        );

        const json = await res.json();

        setLanzamientos(json);

      } catch (error) {
        console.log(error);
      }

    };

    obtenerDatos();

  }, []);

  return (

    <ScrollView>

      <View style={styles.lista}>

        {lanzamientos.map((item, index) => (

          <View key={index} style={styles.card}>

            <Text style={styles.titulo}>
              {item.mission_name}
            </Text>

            <Text>
              Vuelo: {item.flight_number}
            </Text>

            <Text>
              Año: {item.launch_year}
            </Text>

            <Text>
              Cohete: {item.rocket.rocket_name}
            </Text>

            {item.links.mission_patch_small ? (

              <Image
                source={{
                  uri: item.links.mission_patch_small
                }}
                style={styles.imagen}
              />

            ) : (

              <Text style={styles.sinImagen}>
                Sin imagen disponible
              </Text>

            )}

          </View>

        ))}

      </View>

    </ScrollView>

  );
}

const styles = StyleSheet.create({

  lista:{
    padding:10
  },

  card:{
    backgroundColor:'#fff',
    padding:15,
    borderRadius:10,
    marginBottom:15
  },

  titulo:{
    fontSize:18,
    fontWeight:'bold',
    marginBottom:10
  },

  imagen:{
    width:120,
    height:120,
    resizeMode:'contain',
    alignSelf:'center',
    marginTop:10
  },

  sinImagen:{
    textAlign:'center',
    marginTop:10,
    color:'gray'
  }

});