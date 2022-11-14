import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SIZES} from '../constants';
import { COLOR } from '../themes';

let exercises = [
  {
    title: 'Podcast Clips',
    image: require('../assets/images/Exercise3.png'),
    subTitle: 'Recommended podecasts to uplift your mood..',
    duration: '15-30 MIN ',
    url: 'https://www.youtube.com/watch?v=oNIHL-6l7b0',
    session_data:{
      happy:['https://www.youtube.com/watch?v=oNIHL-6l7b0', 'https://www.youtube.com/watch?v=X3q5e1pV4pc' ,'https://www.youtube.com/watch?v=oNIHL-6l7b0', 'https://www.youtube.com/watch?v=oNIHL-6l7b0' ], 
      sad:[], 
      calm:[],
       fearful:[],
       angry:["https://www.youtube.com/watch?v=jq7LO_GTzVg"]
    }

  },
  {
    title: 'Exercises',
    image: require('../assets/images/Exercise2.png'),
    subTitle: 'Live happier and healthier by following recommended exercises',
    duration: '10-20 MIN ',
    url: 'https://www.youtube.com/watch?v=Cw-Wt4xKD2s',
    session_data:{
      happy:['https://www.youtube.com/watch?v=oNIHL-6l7b0', 'https://www.youtube.com/watch?v=X3q5e1pV4pc' ,'https://www.youtube.com/watch?v=oNIHL-6l7b0', 'https://www.youtube.com/watch?v=oNIHL-6l7b0' ], 
      sad:[], 
      calm:['https://www.youtube.com/watch?v=sTANio_2E0Q', 'https://www.youtube.com/watch?v=f9UbVRqd9YY', 'https://www.youtube.com/watch?v=lPJAtHWq08k', 'https://www.youtube.com/watch?v=tEmt1Znux58'],
      fearful:[],
      angry:['https://www.youtube.com/watch?v=-Q20udWcaLg', 'https://www.youtube.com/watch?v=NjyE6boUO1s', 'https://www.youtube.com/watch?v=wkse4PPxkk4', 'https://www.youtube.com/watch?v=jq7LO_GTzVg']
    }
  },
  {
    title: 'Songs',
    image: require('../assets/images/Exercise3.png'),
    subTitle:
      'Live happier and healthier by learning the recommended breathing techniques for your mood',
    duration: '3-10 MIN ',
    url: 'https://www.youtube.com/watch?v=tgMJIgnFKh0',
  },
  {
    title: 'Yoga',
    image: require('../assets/images/Exercise4.png'),
    subTitle:
      'Live happier and healthier by learning the fundamentals of Yoga recommended for your mood',
    duration: '5-10 MIN ',
    url: 'https://www.youtube.com/watch?v=myAcZzLKQvM',
  },
];

const ExerciseHomeScreen = ({navigation}) => {
  const [emotion, setEmotion] = useState("")
  async function getPredictEmotion(){
    let p = await AsyncStorage.getItem('activityPredict');  
        let t = JSON.parse(p);
   setEmotion(t.emotion);
  }

  getPredictEmotion();

  const ExerciseItem = ({exercise}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ExerciseDetails', {exercise: exercise})
        }
        activeOpacity={0.8}
        style={{
          backgroundColor: COLORS.white,
          width: 0.5 * SIZES.width - 35,
          margin: 10,
          height: 180,
          borderRadius: 10,
          padding: 15,
          shadowColor: '#9e9898',
          elevation: 5,
        }}>
        <Image
          source={exercise.image}
          style={{
            width: '100%',
            resizeMode: 'cover',
            flex: 1,
          }}
        />
        <Text style={{marginTop: 20,color:COLOR.greyFont, textAlign: 'center', fontSize: 16}}>
          {exercise.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, position: 'relative'}}>
      <StatusBar
        backgroundColor={COLORS.accent + '30'}
        barStyle="dark-content"
        animated={true}
      />
      <View
        style={{
          width: '100%',
          height: 0.45 * SIZES.height,
          padding: 30,
          backgroundColor: COLORS.accent + '20',
          position: 'relative',
        }}>
        <Image
          source={require('../assets/images/BgOrange.png')}
          style={{
            position: 'absolute',
            top: 60,
            left: -50,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              width: 60,
              height: 60,
              backgroundColor: COLORS.accent + '45',
              marginRight: 0,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: 3,
                backgroundColor: COLORS.white,
                width: '40%',
                marginBottom: 8,
                marginLeft: -5,
              }}></View>
            <View
              style={{
                height: 3,
                backgroundColor: COLORS.white,
                width: '40%',
                marginLeft: 5,
              }}></View>
          </View>
        </View>

        <Text style={{fontSize: 30, lineHeight: 45, color:"#f02b59"}}>BETTER YOU 🤞 </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            height: 50,
            borderRadius: 25,
            backgroundColor: COLORS.white,
            marginVertical: 40,
          }}>
          <MaterialCommunityIcons
            name="face-recognition"
            size={22}
            color={COLOR.primary}
            style={{marginHorizontal: 20}}
          />
          <Text style={{color:COLOR.greyFont,fontSize:20, fontWeight:'bold'}}>{emotion&& emotion}</Text>
        </View>
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.accent + '55',
            position: 'absolute',
            right: -30,
            bottom: 50,
          }}></View>
      </View>

      <FlatList
        data={exercises}
        style={{
          paddingHorizontal: 20,
          marginTop: -60,
        }}
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        keyExtractor={item => item.title}
        renderItem={({item}) => <ExerciseItem exercise={item} />}
      />
    </SafeAreaView>
  );
};

export default ExerciseHomeScreen;
