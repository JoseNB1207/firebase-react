import React from 'react';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import { auth } from '../firebase/firebaseConfig';

export default function Perfil() {

  const usuario = auth.currentUser;

  return (

    <View style={styles.container}>

      <Text style={styles.titulo}>
        Perfil
      </Text>

      <Text>
        UID:
      </Text>

      <Text>
        {usuario?.uid}
      </Text>

      <Text style={{ marginTop:20 }}>
        Correo:
      </Text>

      <Text>
        {usuario?.email}
      </Text>

    </View>

  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },

  titulo:{
    fontSize:24,
    marginBottom:20
  }

});