//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Button, TouchableOpacity, Image} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import { Buffer } from 'buffer';
import { COLOR } from '../themes';
import Lottie from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// create a component
export const Audio = () => {
    const [audiofile, setAudiofile] = useState("");
    const [recording, setRecording] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [paused, setPaused] = useState(true);

    useEffect(() => {
      
        const options = {
            sampleRate: 16000,  // default 44100
            channels: 1,        // 1 or 2, default 1
            bitsPerSample: 16,  // 8 or 16, default 16
            audioSource: 6,     // android only (see below)
            wavFile: 'test.wav' // default 'audio.wav'
          };
    
        AudioRecord.init(options);
     
        
    }, [])

    starts = () =>{
        console.log("start record");
        setAudiofile("");
        setRecording(true);
        setLoaded(true);
        AudioRecord.start();
    }

    stops = async () =>{
        if (!recording) return;
        let audio = await AudioRecord.stop();
        console.log("Audio File",audio);
        setAudiofile(audio);
        setRecording(true);
        setLoaded(false);
        console.log('stop record');
    }

    load = () =>{
        return new Promise((resolve, reject)=>{
            if(!audiofile){
                return reject("File path empty")
            }
        })
    }

    const getResponse = async() => {
        const file = {
            uri : 'file://'+ audiofile,
            type : 'audio/wav',
            name : 'test.wav'
          }
          var formData = new FormData()
          formData.append('audio', file) // filePath -> your param for the file

          await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            body:formData
          }).then(response => response.json())
          .then(async data => {
            AsyncStorage.setItem('audioPredict',JSON.stringify(data));


            let audioResult = await AsyncStorage.getItem('audioPredict');  
            let result = JSON.parse(audioResult);  
            data?alert("First step is completed"): alert("Some thing went wrong, Try Again")

              console.log(result);
          })
          .catch(err => alert(err));
    }
    return (
        <View style={{ flex: 1 }}>
        <View style={styles.topBar}>
          {/* <View style={{ flexDirection: 'row' }}>
            <Image style={[styles.iconImg, { marginRight: 50 }]} source={{uri: "https://img.icons8.com/color/48/000000/video-call.png"}}/>
            <Text style={styles.subText}>WHATSAPP CALL</Text>
          </View> */}
          <Text style={styles.title}>{"Tell Your Story"}</Text>
          <Text style={styles.subText}>we record your audio and video</Text>
        </View>
        {/* <TouchableOpacity style={[styles.btnStopCall, styles.shadow]} onPress={starts}>
          <Image style={styles.iconImg} source={{uri: "https://img.icons8.com/windows/32/000000/phone.png"}}/>
        </TouchableOpacity> */}
        <Lottie
                style={styles.checkAnimation}
                source={require('../assets/lottie/audio_animation.json')}
                autoPlay
                resizeMode="contain"
                loop={true}
                speed={loaded?1:0}
              />
        <View style={styles.bottomBar}>
          <TouchableOpacity style={[styles.btnAction, styles.shadow]} onPress={stops}>
            <Image style={styles.iconImg} source={{uri: "https://img.icons8.com/flat-round/200/000000/stop.png"}}/>
          </TouchableOpacity>
          {!loaded?<TouchableOpacity style={[styles.btnAction, styles.shadow]} onPress={starts}>            
          <Image style={styles.iconImg} source={{uri: "https://img.icons8.com/color-glass/200/null/play.png"}}/>
          </TouchableOpacity>: null}
          <TouchableOpacity style={[styles.btnAction, styles.shadow]} onPress={()=> getResponse()}>
            <Image style={styles.iconImg} source={{uri: "https://img.icons8.com/fluency/200/null/popular-topic.png"}}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


const styles = StyleSheet.create({
  topBar: {
    backgroundColor:COLOR.primary,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  checkAnimation: {
    width: '65%',
    height: '65%',
    marginLeft:15,
    marginTop: 10,
  },
  image: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e20e30',
    marginTop: 250 
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLOR.primary,
    flex: 1,
  },
  title: {
    color: '#f0efef',
    fontSize: 36,
  },
  subText: {
    color: '#c8c8c8',
    fontSize: 14,
  },
  iconImg:{
    height: 50,
    width: 50, 
    alignSelf:'center'
  },
  btnStopCall: {
    height:65,
    width:65,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:32,
    backgroundColor: "#FF0000",
    position:'absolute',
    bottom:160,
    left:'40%',
    zIndex:1,
  },
  btnAction: {
    height:55,
    width:55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:32,
    backgroundColor: "#fff",
  },
  shadow:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  }
});