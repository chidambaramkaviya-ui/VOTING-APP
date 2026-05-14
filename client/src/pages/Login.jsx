import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import eciLogo from '../assets/eci_logo.png';

const Login = () => {
   const location = useLocation();
   const navigate = useNavigate();

   const [step, setStep] = useState(1);
   const [aadhar, setAadhar] = useState('');
   const [otp, setOtp] = useState('');
   const [phone, setPhone] = useState('');
   const [error, setError] = useState('');
   const [showStepPopup, setShowStepPopup] = useState(false); // Step Popup State
   const [showSuccess, setShowSuccess] = useState(false); // Success Animation State
   const [showViolationPopup, setShowViolationPopup] = useState(false); // Violation Popup State
   const [showAlreadyVotedPopup, setShowAlreadyVotedPopup] = useState(false); // Already Voted Popup State

   // Speech Synthesis Function
   const speakInstructions = () => {
      if ('speechSynthesis' in window) {
         window.speechSynthesis.cancel();
         const text = `
            Welcome to the E-Voting portal. To cast your vote, please follow these instructions. 
            Step 1: Enter your 12-digit Aadhar number and click Verify. 
            Step 2: Enter the 6-digit O.T.P sent to your mobile. 
            Step 3: Complete the facial recognition process. 
            Once verified, you can select your candidate and confirm your vote. 

            மின்னணு வாக்குப்பதிவு தளத்திற்கு உங்களை வரவேற்கிறோம். 
            படி 1: உங்கள் ஆதார் எண்ணை உள்ளிட்டு சரிபார்க்கவும். 
            படி 2: உங்கள் மொபைலுக்கு வரும் கடவுச்சொல்லை உள்ளிடவும். 
            படி 3: உங்கள் முகத்தை கேமரா மூலம் சரிபார்க்கவும். 
            இதனை முடித்தவுடன் நீங்கள் விரும்பும் வேட்பாளருக்கு வாக்களிக்கலாம்.
         `;
         const utterance = new SpeechSynthesisUtterance(text);
         utterance.rate = 0.9;
         const voices = window.speechSynthesis.getVoices();
         const tamilVoice = voices.find(v => v.lang.includes('ta'));
         if (tamilVoice) utterance.voice = tamilVoice;
         window.speechSynthesis.speak(utterance);
      }
   };

   // Trigger voice on initial load & when popup is shown
   React.useEffect(() => {
      const timer = setTimeout(() => {
         speakInstructions();
      }, 1000);
      return () => {
         window.speechSynthesis.cancel();
         clearTimeout(timer);
      };
   }, []);

   React.useEffect(() => {
      if (showStepPopup) {
         speakInstructions();
      } else {
         window.speechSynthesis.cancel();
      }
   }, [showStepPopup]);

   React.useEffect(() => {
      if (location.state?.violation) {
         setShowViolationPopup(true);
         // Clear state so it doesn't show again on refresh
         window.history.replaceState({}, document.title);
      }
   }, [location]);

   const handleAadharSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
         const res = await axios.post('http://localhost:5000/api/voters/verify-aadhar', { aadharNumber: aadhar });
         if (res.data.success) {
            setPhone(res.data.phone);
            await axios.post('http://localhost:5000/api/voters/send-otp', { mobile: res.data.phone });
            setStep(2);
         }
      } catch (err) {
         if (err.response && err.response.status === 403) {
            setShowAlreadyVotedPopup(true);
         } else {
            setError(err.response?.data?.message || 'Verification failed');
         }
      }
   };

   const handleOtpSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try {
         const res = await axios.post('http://localhost:5000/api/voters/verify-otp', { phone, otp });
         if (res.data.success) {
            setShowSuccess(true);
            setTimeout(() => {
               navigate('/face-verify', { state: { aadhar } });
            }, 2000);
         }
      } catch (err) {
         setError(err.response?.data?.message || 'Invalid OTP');
      }
   };

   const handleResendOtp = async () => {
      setError('');
      try {
         await axios.post('http://localhost:5000/api/voters/send-otp', { mobile: phone });
         alert('OTP Resent Successfully!');
      } catch (err) {
         setError('Failed to resend OTP. Please try again.');
      }
   };

   return (
      <div
         className="min-h-screen w-full relative bg-white"
      >

         {/* Content Wrapper with z-10 to stay above overlay */}
         <div className="relative z-10">

            {/* Already Voted Popup */}
            {showAlreadyVotedPopup && (
               <div className="fixed inset-0 bg-red-900/90 z-[150] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-[shake_0.5s_ease-in-out]">
                     <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                     </div>
                     <h2 className="text-2xl font-bold text-red-700 mb-2">வாக்கு பதிவு முடிந்தது (Vote Recorded)</h2>
                     <p className="text-gray-900 text-lg font-bold mb-2">
                        நீங்கள் ஏற்கனவே வாக்களித்துவிட்டீர்கள்.
                     </p>
                     <p className="text-sm text-gray-500 mb-6 font-bold">
                        (ONE AADHAR NUMBER ONE VOTE ONLY)
                     </p>
                     <p className="text-xs text-gray-400 mb-6">
                        You cannot vote again. This attempt has been logged.
                     </p>
                     <button
                        onClick={() => setShowAlreadyVotedPopup(false)}
                        className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-full transition-colors w-full"
                     >
                        Close
                     </button>
                  </div>
               </div>
            )}

            {/* Violation Popup */}
            {showViolationPopup && (
               <div className="fixed inset-0 bg-red-900/90 z-[150] flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-[shake_0.5s_ease-in-out]">
                     <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                     </div>
                     <h2 className="text-2xl font-bold text-red-700 mb-2">எச்சரிக்கை (Warning)</h2>
                     <p className="text-gray-900 text-lg font-bold mb-2">
                        நீங்கள் விதிமுறைகளை மீறியதால், மீண்டும் உள்நுழையவும்.
                     </p>
                     <p className="text-sm text-gray-500 mb-6">
                        (You violated the rules. Please login again.)
                     </p>
                     <button
                        onClick={() => setShowViolationPopup(false)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors w-full"
                     >
                        OK
                     </button>
                  </div>
               </div>
            )}

            {/* Success Popup */}
            {showSuccess && (
               <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all scale-100 flex flex-col items-center animate-[bounceIn_0.5s_ease-out]">
                     <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" className="animate-[drawCheck_0.5s_ease-out_forwards] path-length-0" />
                           <style>{`
                              .path-length-0 { stroke-dasharray: 100; stroke-dashoffset: 100; animation: drawCheck 0.6s ease-out forwards 0.2s; }
                              @keyframes drawCheck { to { stroke-dashoffset: 0; } }
                              @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }
                           `}</style>
                        </svg>
                     </div>
                     <h2 className="text-3xl font-bold text-green-700 mb-2">வெற்றி (Success)!</h2>
                     <p className="text-gray-800 text-lg font-medium">ஆதார் சரிபார்ப்பு வெற்றிகரமாக முடிந்தது</p>
                     <p className="text-gray-500 text-sm mt-1">(Aadhar Verification Successful)</p>
                     <div className="mt-6">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                     </div>
                  </div>
               </div>
            )}



            {/* Step Popup */}
            {showStepPopup && (
               <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 text-center transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
                     <div className="mb-4">

                        <h2 className="text-2xl font-bold text-blue-800 mb-2 font-serif">வாக்களிக்கும் முறை (Steps to Vote)</h2>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                        <div className="p-3 bg-gray-50 rounded border border-gray-200">
                           <p className="font-bold text-blue-600 mb-1">Step 1: Login</p>
                           <p className="text-sm text-gray-700">ஆதார் எண்ணை உள்ளிடவும்.</p>
                           <p className="text-xs text-gray-500">(Enter Aadhar Number)</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded border border-gray-200">
                           <p className="font-bold text-blue-600 mb-1">Step 2: Verify</p>
                           <p className="text-sm text-gray-700">OTP சரிபார்க்கவும்.</p>
                           <p className="text-xs text-gray-500">(Verify OTP & Face)</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded border border-gray-200">
                           <p className="font-bold text-blue-600 mb-1">Step 3: Vote</p>
                           <p className="text-sm text-gray-700">உங்கள் வேட்பாளரைத் தேர்ந்தெடுத்து வாக்களிக்கவும்.</p>
                           <p className="text-xs text-gray-500">(Select Candidate & Vote)</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded border border-gray-200">
                           <p className="font-bold text-blue-600 mb-1">Step 4: Confirm</p>
                           <p className="text-sm text-gray-700">வாக்களித்ததற்கான உறுதிப்படுத்தலைப் பெறவும்.</p>
                           <p className="text-xs text-gray-500">(Get Confirmation)</p>
                        </div>
                     </div>

                     <button
                        onClick={() => setShowStepPopup(false)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                     >
                        தொடரவும் (Proceed)
                     </button>
                  </div>
               </div>
            )}



            {/* Hero Section: Centered Login Card */}
            <div
               className="min-h-screen flex flex-col items-center justify-center p-4 relative"
            >
               {/* Dark Overlay */}
               {/* This overlay is now handled by the fixed overlay at the root */}



               <div className="bg-white p-8 rounded-lg shadow-md w-[480px] flex flex-col items-center z-10 relative">
                  <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">மின்னணு வாக்குப்பதிவு நுழைவு (E-Voting Login)</h2>

                  {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

                  {step === 1 ? (
                     <form onSubmit={handleAadharSubmit} className="space-y-4 w-full">
                        <div>
                           <label className="block text-gray-700 text-sm font-bold mb-2">ஆதார் எண் (Aadhar Number)</label>
                           <input
                              type="text"
                              value={aadhar}
                              onChange={(e) => setAadhar(e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="12 இலக்க ஆதார் எண்ணை உள்ளிடவும்"
                              maxLength="12"
                              required
                           />
                        </div>
                        <button
                           type="submit"
                           className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                           ஆதார் சரிபார்க்கவும் (Verify Aadhar)
                        </button>


                     </form>
                  ) : (
                     <form onSubmit={handleOtpSubmit} className="space-y-4 w-full">
                        <p className="text-sm text-gray-600 mb-2">OTP sent to linked mobile number.</p>
                        <div>
                           <label className="block text-gray-700 text-sm font-bold mb-2">Enter OTP</label>
                           <input
                              type="text"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter OTP"
                              maxLength="6"
                              required
                           />
                        </div>
                        <div className="flex justify-end mb-2">
                           <button
                              type="button"
                              onClick={handleResendOtp}
                              className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none"
                           >
                              OTP கிடைக்கவில்லையா? மீண்டும் அனுப்புக (Resend OTP)
                           </button>
                        </div>
                        <button
                           type="submit"
                           className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
                        >
                           Verify OTP
                        </button>
                     </form>
                  )}
                  <div className="mt-4 text-center">
                     <a href="/terms" className="text-xs text-blue-500 hover:text-blue-700 underline block mb-2">
                        விதிமுறைகள் & நிபந்தனைகள் (Terms & Conditions)
                     </a>
                     <button
                        onClick={() => setShowStepPopup(true)}
                        className="text-xs text-blue-500 hover:text-blue-700 underline focus:outline-none"
                     >
                        வாக்களிக்கும் முறை (How to Vote)
                     </button>
                  </div>
               </div>
            </div>





            {/* Info Section: Rules & Instructions */}
            <div className="w-full bg-gray-200 pt-48 pb-12 flex flex-col items-center">
               <div className="w-11/12 max-w-7xl text-center mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">இணைய வழி வாக்களிப்பு முறை (How to Vote)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
                     <div className="p-4 bg-white rounded shadow-sm">
                        <p className="font-bold text-blue-600 mb-1">Step 1: Login</p>
                        <p className="text-sm text-gray-700">ஆதார் எண்ணை உள்ளிடவும்.</p>
                        <p className="text-xs text-gray-500">(Enter Aadhar Number)</p>
                     </div>
                     <div className="p-4 bg-white rounded shadow-sm">
                        <p className="font-bold text-blue-600 mb-1">Step 2: Verify</p>
                        <p className="text-sm text-gray-700">OTP மற்றும் முக அங்கீகாரத்தை சரிபார்க்கவும்.</p>
                        <p className="text-xs text-gray-500">(Verify OTP & Face)</p>
                     </div>
                     <div className="p-4 bg-white rounded shadow-sm">
                        <p className="font-bold text-blue-600 mb-1">Step 3: Vote</p>
                        <p className="text-sm text-gray-700">உங்கள் வேட்பாளரைத் தேர்ந்தெடுத்து வாக்களிக்கவும்.</p>
                        <p className="text-xs text-gray-500">(Select Candidate & Vote)</p>
                     </div>
                     <div className="p-4 bg-white rounded shadow-sm">
                        <p className="font-bold text-blue-600 mb-1">Step 4: Confirm</p>
                        <p className="text-sm text-gray-700">வாக்களித்ததற்கான உறுதிப்படுத்தலைப் பெறவும்.</p>
                        <p className="text-xs text-gray-500">(Get Confirmation)</p>
                     </div>
                  </div>
               </div>

               <div className="w-11/12 max-w-7xl text-center bg-yellow-50 p-6 rounded-lg border border-yellow-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">தேர்தல் விதிமுறைகள் (Election Rules)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                     <ul className="text-gray-700 text-sm space-y-2 text-left list-disc pl-5 inline-block">
                        <li>18 வயது பூர்த்தியான இந்திய குடிமக்கள் மட்டுமே வாக்களிக்க தகுதியுடையவர்கள்.</li>
                        <li>வாக்களிப்பது உங்கள் ஜனநாயக கடமை.</li>
                        <li>உங்கள் வாக்கை யாருக்கும் தெரியப்படுத்தாதீர்கள்.</li>
                        <li>லஞ்சம் வாங்குவதும் கொடுப்பதும் சட்டப்படி குற்றம்.</li>
                     </ul>

                     {/* Test Aadhar List */}
                     <div className="bg-white p-4 rounded-lg border border-yellow-300 shadow-inner">
                        <h4 className="text-sm font-bold text-blue-700 mb-2 uppercase">ஆய்வுக்கான தரவுகள் (50 Test Aadhar Numbers)</h4>
                        <div className="h-32 overflow-y-auto pr-2 custom-scrollbar text-left">
                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {Array.from({ length: 50 }, (_, i) => 100000000051 + i).map((num) => (
                                 <div
                                    key={num}
                                    className="text-[10px] font-mono bg-gray-50 p-1.5 rounded border border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors text-center"
                                    onClick={() => setAadhar(num.toString())}
                                    title="Click to use this Aadhar"
                                 >
                                    {num}
                                 </div>
                              ))}
                           </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 italic">Note: OTP: Any 6 digits for testing.</p>
                     </div>
                  </div>
               </div>

               <style>{`
                  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                  .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
                  .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
               `}</style>
            </div>
         </div>
      </div>

   );
};

export default Login;
