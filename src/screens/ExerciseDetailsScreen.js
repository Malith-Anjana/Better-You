import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  WebView,
  Linking,
  Button,
  TouchableOpacity
} from 'react-native';
import FontAwesome5Icons from 'react-native-vector-icons/FontAwesome5';
import {COLORS, SIZES} from '../constants';
import Video from 'react-native-video';
import YouTube from 'react-native-youtube';
import { COLOR } from '../themes';

import AsyncStorage from '@react-native-async-storage/async-storage';


const ExerciseDetailsScreen = ({route}) => {
  const [exercise, setExercise] = useState(route.params.exercise);
  const [activity, setActivity] = useState([])
  
  const getEmotion= async ()=>{
      let p = await AsyncStorage.getItem('activityPredict');  
      let t = JSON.parse(p);
      console.log(t.emotion);
      if(t.emotion == "Happy") setActivity(exercise.session_data.happy);
      else if(t.emotion == "Sad") setActivity(exercise.session_data.sad);
      else if(t.emotion == "Angry") setActivity(exercise.session_data.angry);
      else if(t.emotion == "Calm") setActivity(exercise.session_data.calm);
      else if(t.emotion == "Fearful") setActivity(exercise.session_data.fearful);
    }


  getEmotion();


  

  const SessionItem = ({session, index}) => {
    return (
      <View
        style={{
          backgroundColor: COLORS.white,
          width: 0.5 * SIZES.width - 40,
          borderRadius: 10,
          marginBottom: 10,
          marginHorizontal: 5,
          height: 70,
          padding: 15,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          shadowColor: '#9e9898',
          elevation: 5,
        }}>
        <View
          style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: COLORS.purple,
            backgroundColor:COLORS.white,
            marginRight: 7,
            borderRadius: 20,
          }}>
          <TouchableOpacity onPress={()=>{
          Linking.openURL(session)
        }}>
          <FontAwesome5Icons
            name="play"
            style={{color:COLORS.purple}}
          />

          </TouchableOpacity>
        </View>
        <Text style={{color:COLOR.greyFont, paddingRight:10}}>Activity {index+1}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, position: 'relative'}}>
      <StatusBar
        backgroundColor={'#C7B8F5'}
        barStyle={'dark-content'}
        animated={true}
      />
      <View
        style={{
          width: '100%',
          height: 0.4 * SIZES.height,
          padding: 30,
          backgroundColor: '#C7B8F5',
          position: 'relative',
        }}>
        <Image
          source={require('../assets/images/BgPurple.png')}
          style={{
            position: 'absolute',
            top: 60,
            left: -50,
          }}
        />
        <Text style={{fontSize: 30,fontWeight:'bold', color:"#9f00bf", lineHeight: 45}}>{exercise.title}</Text>
        <Text style={{fontSize: 16, opacity: 0.6, marginVertical: 10}}>
          {exercise.duration}
        </Text>
        <Text style={{fontSize: 16, width: '85%'}}>{exercise.subTitle}</Text>

        <Image
          source={exercise.image}
          style={{
            position: 'absolute',
            bottom: 40,
            right: -130,
            width: 350,
            height: 350,
            resizeMode: 'contain',
          }}
        />
      </View>

      <View style={{marginTop: -30, marginHorizontal: 30}}>
        <FlatList
          data={activity}
          contentContainerStyle={{
            alignItems: 'center',
          }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={item => item}
          renderItem={({item, index}) => (
            <SessionItem session={item} index={index} />
          )}
        />
        <Text style={{marginVertical: 15, fontSize: 20}}></Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default ExerciseDetailsScreen;
