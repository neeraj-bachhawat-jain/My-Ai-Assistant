import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../Context/UserContext'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const {userData, serverUrl, setUserData, getGeminiResponse} = useContext(userDataContext);
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis
  const handleLogout = async ()=>{
    try{
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {withCredentials:true})
      setUserData(null)
      navigate("/login")
    } catch (err) {
      setUserData(null)
      console.log(err)
    }
  }
 
  const startRecognition = () =>{
    try{
      recognitionRef.current?.start();
      setListening(true)
    }catch (error){
      if(!error.message.includes("start")){
        console.error("Recognition error:", error);
      }
    }
  }

  const speak = (text) =>{
    if(!synth){
      alert("Speech not supported in this browser");
      return;
    }
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices()
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if(hindiVoice){
      speech.voice = hindiVoice;
    }
    isSpeakingRef.current=true
    speech.onend = () =>{
      isSpeakingRef.current = false
      startRecognition()
    }
    // speech.lang = 'en-IN' || "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;
    synth.speak(speech);
  }
  
  const handleCommand = (data) =>{
    if(!data){
      speak("Sorry, I didn't receive a response from the assistant.");
      return;
    }
    const {type, userInput, response} = data || {};
    if(response){
      speak(response);
    } else {
      speak("Sorry, the assistant returned no response.");
    }
    if(type === 'generals'){
      console.log(response);
    }
    if(type === 'calculator_open'){
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
    if(type === 'instagram_open'){
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if(type === 'facebook_open'){
      window.open(`https://www.facebook.com/`, '_blank');
    }
    if(type === 'weather_show'){
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }
    if(type === 'youtube_search' || type === 'youtube_play'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
  }

  useEffect(()=>{
    const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    const recognition = new speechRecognition()
    recognition.continuous = true
    recognition.lang = "en-US"

    recognitionRef.current = recognition
    const isRecognizingRef = {current:false}

    const safeRecognition = ()=>{
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        try {
          recognition.start();
          console.log('Recognition request to start')
        } catch (error) {
          if(error.name !== "InvalidStateError"){
            console.error("Start error:", error);
          }
        }
  
      }
    }
    recognition.onstart = () =>{
      console.log("Recongnition started");
      isRecognizingRef.current = true;
      setListening(true)
    }

    recognition.onend = () =>{
      console.log("Recongnition ended");
      isRecognizingRef.current = false;
      setListening(false)
    }

    if(!isSpeakingRef.current){
      setTimeout(()=>{
        safeRecognition()
      }, 1000);
    }

    recognition.onerror = (event) =>{
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if(event.error !== "aborted" && !isSpeakingRef.current){
        setTimeout(()=>{
          safeRecognition();
        }, 1000);
      }
    }

    recognition.onresult= async (e)=>{
    const transcript = e.results[e.results.length-1][0].transcript.trim()
    console.log(transcript)
    
    if(transcript.toLowerCase().includes(userData.assistantName.toLowerCase())){
      recognition.stop()
      isRecognizingRef.current = false
      setListening(false)
      let data = await getGeminiResponse(transcript)
      console.log(data)
      handleCommand(data)
    }
    }

    const fallback = setInterval(()=>{
      if(!isSpeakingRef.current && !isRecognizingRef.current){
        safeRecognition()
      }
    }, 10000)
safeRecognition()
    return ()=>{
      recognition.stop()
      setListening(false)
      isRecognizingRef.current=false
      clearInterval(fallback)
    }

  },[])

  return (
    <div className='w-full h-screen bg-linear-to-t from-black to-[#6262ba] flex justify-center items-center flex-col backdrop-blur-2xl'>
      <div className='w-75 h-100 flex justify-center items-center overflow-hidden rounded-4xl shadow-2xl'>
        <img src={userData?.assistantImage} alt='' className='h-full object-cover rounded-4xl' />
      </div>
      <h1 className='text-white p-4 text-2xl sm:text-3xl md:text-4xl font-semibold text-center mt-6'>
        I'm <span className='text-pink-400'>{userData?.assistantName}</span>
      </h1>
      <div className='flex flex-col sm:flex-row gap-4 absolute bottom-6 right-4 sm:right-6 flex-wrap justify-end'>
        <button 
          className="px-4 py-2 text-white font-semibold rounded-full text-sm sm:text-base hover:border-2 hover:border-white transition-all duration-300 cursor-pointer bg-opacity-20 bg-blue-500 hover:bg-opacity-30" 
          onClick={()=>navigate('/customize')}
        >
          Customize
        </button>
        <button 
          className="px-4 py-2 text-white font-semibold rounded-full text-sm sm:text-base hover:border-2 hover:border-red-400 transition-all duration-300 cursor-pointer bg-opacity-20 bg-red-500 hover:bg-opacity-30" 
          onClick={()=>{handleLogout()}}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
