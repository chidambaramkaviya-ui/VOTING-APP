import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate, useLocation } from 'react-router-dom';


import fingerprintIcon from '../assets/fingerprint_icon.png';
import aadharCard from '../assets/aadhar_card.png';

const FaceVerification = () => {
   const videoRef = useRef();
   const [modelsLoaded, setModelsLoaded] = useState(false);
   const [verificationStatus, setVerificationStatus] = useState('Loading Models...');
   const navigate = useNavigate();
   const location = useLocation();

   const [showInstructions, setShowInstructions] = useState(true);
   const [showScanningIcon, setShowScanningIcon] = useState(true);

   // Effect to hide scanning icon after 2 seconds
   useEffect(() => {
      const timer = setTimeout(() => {
         setShowScanningIcon(false);
      }, 2000);
      return () => clearTimeout(timer);
   }, []);

   useEffect(() => {
      const loadModels = async () => {
         const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
         try {
            await Promise.all([
               faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
               faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
               faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
               faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
            ]);
            setModelsLoaded(true);
            setVerificationStatus('Please look at the camera');
         } catch (err) {
            console.error("Error loading models:", err);
            setVerificationStatus('Error loading face models. Please refresh.');
         }
      };
      loadModels();
   }, []);

   const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: {} })
         .then(stream => {
            videoRef.current.srcObject = stream;
         })
         .catch(err => console.error(err));
   };

   // Effect to start video once instructions are closed AND models are loaded
   useEffect(() => {
      if (!showInstructions && modelsLoaded) {
         startVideo();
      }
   }, [showInstructions, modelsLoaded]);


   const handleVideoOnPlay = () => {
      const interval = setInterval(async () => {
         // Only run detection if instructions are closed
         if (videoRef.current && modelsLoaded && !showInstructions) {
            const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();

            if (detections.length > 0) {
               setVerificationStatus('Face Detected. Verifying...');
               clearInterval(interval); // Stop detecting once found to simulate success flow
               setTimeout(() => {
                  setVerificationStatus('Verified! Redirecting...');
                  setTimeout(() => {
                     navigate('/vote', { state: location.state });
                  }, 1000);
               }, 1000);
            } else {
               setVerificationStatus('No face detected. Please position yourself clearly.');
            }
         }
      }, 1000);
   };

   return (
      <div
         className="flex flex-col items-center justify-center min-h-screen relative bg-white"
      >

         {/* Instruction Popup */}
         {showInstructions && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4">
               <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center animate-[popIn_0.3s_ease-out] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>

                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-2">முக அங்கீகாரம் (Face Verification)</h2>
                  <p className="text-gray-500 text-sm mb-6">Instructions for successful verification</p>

                  <ul className="text-left text-gray-700 space-y-3 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
                     <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✔</span>
                        <span>கேமராவை நேராகப் பார்க்கவும் (Look straight at the camera).</span>
                     </li>
                     <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✔</span>
                        <span>உங்கள் முகம் வெளிச்சத்தில் இருப்பதை உறுதி செய்யவும் (Ensure good lighting).</span>
                     </li>
                     <li className="flex items-start">
                        <span className="text-blue-500 mr-2">✔</span>
                        <span>கண்ணாடி அல்லது முகக்கவசத்தை அகற்றவும் (Remove glasses or mask).</span>
                     </li>
                  </ul>

                  <button
                     onClick={() => setShowInstructions(false)}
                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-[1.02] active:scale-95 shadow-lg"
                  >
                     தொடரவும் (Proceed to Scan)
                  </button>
               </div>
            </div>
         )}


         {/* Title Section */}
         <div className="z-10 mb-8 text-center bg-white bg-opacity-80 p-4 rounded-xl shadow-lg border border-blue-200 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800">
               Biometric Verification
            </h2>
            <p className="text-gray-600 text-sm mt-1">Secure Identity Check</p>
         </div>

         {/* Camera Box - Professional Static Model (Transparent) */}
         <div className="relative p-2 rounded-lg shadow-2xl border border-gray-600/50 bg-black/20 backdrop-blur-sm">

            {/* Professional Viewfinder Frame (Static) */}
            <div className="relative overflow-hidden rounded-md bg-black">

               {/* Center Aadhar Icon (Realistic) - Moving/Scanning (Transient) */}
               {showScanningIcon && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 z-10 opacity-80 animate-[scan_3s_ease-in-out_infinite]">
                     <img src={aadharCard} alt="Aadhar Card" className="w-32 h-auto drop-shadow-xl rounded-md border-2 border-blue-400/50" />
                  </div>
               )}

               {/* Video Element */}
               <video
                  ref={videoRef}
                  autoPlay
                  muted
                  onPlay={handleVideoOnPlay}
                  width="500"
                  height="375"
                  className="relative z-0 object-cover"
               />
            </div>

            {/* Status Badge */}
            <div className="absolute -bottom-12 left-0 right-0 text-center z-30">
               <span className={`px-8 py-2 rounded-md text-sm font-semibold tracking-wide uppercase shadow-lg border transition-all duration-300 ${verificationStatus.includes('Verified')
                  ? 'bg-green-600 border-green-500 text-white'
                  : verificationStatus.includes('Detected')
                     ? 'bg-blue-600 border-blue-500 text-white'
                     : 'bg-white border-gray-300 text-gray-700'
                  }`}>
                  {verificationStatus}
               </span>
            </div>
         </div>



         {/* Add custom keyframes for scan animation */}
         <style>{`
            @keyframes scan {
               0% { top: 0%; opacity: 0; }
               10% { opacity: 1; }
               90% { opacity: 1; }
               100% { top: 100%; opacity: 0; }
            }
            @keyframes progress {
               0% { width: 0%; }
               50% { width: 100%; }
               100% { width: 0%; }
            }
         `}</style>
      </div >
   );
};

export default FaceVerification;
