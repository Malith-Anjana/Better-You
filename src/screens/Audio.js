//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Button} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import { Buffer } from 'buffer';

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



    checkPermisson = async()=>{
        const graned = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,{
                title:"Better you app recording permission",
                message:"Better You app need record audio",
                buttonNegative:"Cancel",
                buttonNeutral:"Ask me later",
                buttonPositive:"Ok"
            }
        );
        const p = await Permissions.check('microphone');
        console.log("permission check", p);
        if(p== 'authorized') return;
        return requestPermission();
    }

    requestPermission = async () =>{
        const p = await Permissions.request('microphone');
        console.log('Permission Request', p);
    }

    start = () =>{
        console.log("start record");
        setAudiofile("");
        setRecording(true);
        setLoaded(false);
        AudioRecord.start();
    }

    stops = async () =>{
        if (!recording) return;
       

        let audio = await AudioRecord.stop();
        console.log("Audio File",audio);
        setAudiofile(audio);
        setRecording(true);
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
          .then(data => {
              console.log(data);
          })
          .catch(err => console.error(err));
    }
    return (
        <View style={styles.container}>
            <Button onPress={start} title="Record" disable={recording}/>
            <Button onPress={stops} title="Stop" disable={recording}/>
            <Button onPress={getResponse} title="send"/>


        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

