import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Text,
  ToastAndroid,
  ImageBackground,
  Button,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLOR, FONT} from '../themes';
import Voice from '@react-native-community/voice';
import {sendToRasa} from '../api/';
import {IMAGE} from '../assets/images/chatbotImage';
import Tts from 'react-native-tts';
import Lottie from 'lottie-react-native';
import {LogBox} from 'react-native';
import { predict } from '../api';

//for audio record
import AudioRecord from 'react-native-audio-record';

export function VoiceConversation() {
  LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
  LogBox.ignoreAllLogs(); //Ignore all log notifications
  Tts.setDefaultRate(0.4);

  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState(true);
  const [started, setStarted] = useState(false);
  const [reply, setReply] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);

  const BOT_USER = {
    _id: 2,
    name: 'FAQ Bot',
    avatar: IMAGE.chatbot,
  };
  const USER = {
    _id: 1,
    name: 'USER',
  };

  const onSpeechStart = e => {
    setStarted(true);
  };
  const onSpeechEnd = () => {
    setStarted(false);
    setEnd(true);
    setStarted(false);
  };
  const onSpeechError = e => {
    setError(JSON.stringify(e.error));
  };
  const onSpeechResults = async e => {
    console.log(e.value[0]);
    setResults(e.value[0]);

       //send for prediction
      const prediction = await predict({"start": true, "text":e.value[0], "end":false});
      console.log(prediction.data); 
    getReply(e.value[0]);
  };
  const onSpeechPartialResults = e => {
    setPartialResults(e.value);
  };
  const onSpeechVolumeChanged = e => {
    setPitch(e.value);
  };

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
  }, []);

  const getReply = async text => {
    console.log('hit');
    try {
      const res = await sendToRasa({message: text, sender: USER._id});
      console.log(res)
      if(res.data.length>0){
        setReply(res.data[0].text);    
      Tts.getInitStatus().then(() => {
        Tts.speak(res.data[0].text, {
          androidParams: {
            KEY_PARAM_PAN: -1,
            KEY_PARAM_VOLUME: 0.5,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
        });
      });
    }else{
      Tts.getInitStatus().then(() => {
        Tts.speak("Cannot understand you", {
          androidParams: {
            KEY_PARAM_PAN: -1,
            KEY_PARAM_VOLUME: 0.5,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
        });
      });
    }
      Tts.addEventListener('tts-finish', (event) => startSpeechRecognizing());
    } catch (err) {
      ToastAndroid.show(err, ToastAndroid.LONG);
    }
  };
  const startSpeechRecognizing = async () => {
    setPitch('');
    setError('');
    setStarted(true);
    // setReply('');
    setResults([]);
    setPartialResults([]);
    setEnd(false);
    try {
      await Voice.start('en-US');
    } catch (e) {
      console.error(e);
    }
  };
  const stopSpeechRecognizing = async () => {
    try {
      
      await Voice.stop();
      stops();
      setStarted(false);
      setResults([]);
      setPartialResults([]);
      setReply("")
    } catch (e) {
      console.error(e);
    }
  };







  //For the audio prediction part
  const [audiofile, setAudiofile] = useState("");
    const [recording, setRecording] = useState(false);

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


   const starts = () =>{
        console.log("start record");
        setAudiofile("");
        setRecording(true);
        AudioRecord.start();
    }

   const stops = async () =>{
        if (!recording) return;
       

        let audio = await AudioRecord.stop();
        setAudiofile(audio);
        console.log("Audio File",audio);
        setRecording(true);
        console.log('stop record');

        await getResponse(audio);
    }

    const getResponse = async(audio) => {
        const file = {
            uri : 'file://'+ audio,
            type : 'audio/wav',
            name : 'test.wav'
          }
          let formData = new FormData()
          formData.append('audio', file) // filePath -> your param for the file
          console.log("Form Data", formData);
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
    <ImageBackground style={styles.image} 
      resizeMode='cover' 
      source={require('../assets/images/voice_background.jpg')}
      imageStyle={{opacity:0.25}}
      >
      <View style={styles.hBox1}>
      <Text style={{textAlign:'center',fontFamily:FONT.SemiBold,color:COLOR.greyFont, fontSize:30,padding:5,borderRadius:50}}>Start the Conversation</Text>
      </View>
      <View style={styles.hBox2}>
        {/* {partialResults.map((result, index) => {
          return (
            <Text key={`partial-result-${index}`} style={styles.message}>
              {results}
            </Text>
          );
        })} */}
        <Text style={[styles.message, {color: COLOR.primary, padding:5, backgroundColor:'white', borderRadius:50}]}>{reply}</Text>
      </View>
      <View style={styles.hBox3}>
      <Text style={styles.message}>{results}</Text>
        <TouchableOpacity onPress={startSpeechRecognizing}>
          <View style={{position: 'relative', alignItems:'center', paddingBottom:10}}>
          
            {started ? (
              <Lottie
                style={styles.checkAnimation}
                source={require('../assets/lottie/mic_animation.json')}
                autoPlay
                resizeMode="cover"
                loop={true}
                speed={1}
              />
            ) : (
              <View style={{borderRadius:140, width:'100%', backgroundColor: COLOR.primary}}>
              <MaterialCommunityIcons
                name="microphone"
                color={COLOR.white}
                size={90}
              />
              </View>
                
            )}
          </View>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection:'row', justifyContent:'space-between'}}>
      <Button style={{width:100}} color={'red'} onPress={stopSpeechRecognizing} title="Stop"/>
      <Button style={styles.button} color={'green'} onPress={starts} title="Review"/>

      </View>
      </ImageBackground>
    </View>
  );
}







const styles = StyleSheet.create({
  checkAnimation: {
    width: '95%',
    height: '95%',
    marginLeft: 7,
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor:'white',
    flexDirection: 'column',
  },
  hBox1: {
    flex: 2,
    alignItems:'center',
    // backgroundColor: 'red',
  },
  hBox2: {
    flex: 3,
    // backgroundColor: 'darkorange',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  hBox3: {
    flex: 2,
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontFamily: FONT.SemiBold,
    fontSize: 30,
    color: 'black',
  },
  image:{
    flex:1,
    justifyContent:'center',
    padding: 20,
  },
  button: {
    flex:1,
    width: 80,
    height: 20,
    borderRadius:"50%"
  }
});
