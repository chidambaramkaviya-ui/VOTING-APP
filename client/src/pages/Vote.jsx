import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';


import eciLogo from '../assets/eci_logo.png';

const parties = [
   { id: 1, name: 'Candidate 1', fullName: 'Independent Candidate', color: 'bg-blue-600' },
   { id: 2, name: 'Candidate 2', fullName: 'Independent Candidate', color: 'bg-green-600' },
   { id: 3, name: 'Candidate 3', fullName: 'Independent Candidate', color: 'bg-orange-600' },
   { id: 4, name: 'Candidate 4', fullName: 'Independent Candidate', color: 'bg-purple-600' },
   { id: 5, name: 'Candidate 5', fullName: 'Independent Candidate', color: 'bg-red-600' },
   { id: 6, name: 'Candidate 6', fullName: 'Independent Candidate', color: 'bg-teal-600' },
   { id: 7, name: 'NOTA', fullName: 'None of the Above', color: 'bg-gray-500', symbol: '🚫' },
];

const Vote = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const [selectedParty, setSelectedParty] = useState(null);
   const [votedId, setVotedId] = useState(null);
   const [showSuccess, setShowSuccess] = useState(false);
   const [showInstructions, setShowInstructions] = useState(true);

   const aadhar = location.state?.aadhar?.aadharNumber || location.state?.aadhar;

   const handleVote = async (party) => {
      if (window.confirm(`Confirm vote for ${party.name}?`)) {
         setVotedId(party.id);

         // Call Backend to Mark as Voted
         if (aadhar) {
            try {
               await axios.post('http://localhost:5000/api/voters/cast-vote', { aadharNumber: aadhar });
            } catch (error) {
               console.error("Failed to record vote", error);
            }
         }

         // Simulate processing delay
         setTimeout(() => {
            setShowSuccess(true);
            setTimeout(() => {
               navigate('/');
            }, 3000);
         }, 500);
      }
   };

   // Security: Reduce to Login on Tab Switch
   useEffect(() => {
      const handleVisibilityChange = () => {
         if (document.hidden) {
            navigate('/', { state: { violation: true } });
         }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
         document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
   }, [navigate]);

   // Speech Synthesis Function
   const speakInstructions = () => {
      if ('speechSynthesis' in window) {
         // Stop any current speech
         window.speechSynthesis.cancel();

         const text = `
            Welcome to the digital voting system. Please follow these steps to cast your vote. 
            Step 1: Choose your candidate from the list. 
            Step 2: Press the blue button next to your chosen candidate. 
            Step 3: Wait for the red light to glow and hear the beep. 
            Remember, you can only vote once. 
            
            வாக்களிக்கும் முறை. 
            படி 1: உங்கள் வேட்பாளரைத் தேர்ந்தெடுக்கவும். 
            படி 2: நீல நிற பொத்தானை அழுத்தவும். 
            படி 3: சிவப்பு விளக்கு எரிவதை உறுதி செய்யவும். 
            ஒருவர் ஒரு முறை மட்டுமே வாக்களிக்க முடியும்.
         `;

         const utterance = new SpeechSynthesisUtterance(text);
         utterance.rate = 0.9;
         utterance.pitch = 1;

         // Try to find a Tamil voice if possible, otherwise default
         const voices = window.speechSynthesis.getVoices();
         const tamilVoice = voices.find(voice => voice.lang.includes('ta'));
         if (tamilVoice) {
            utterance.voice = tamilVoice;
         }

         window.speechSynthesis.speak(utterance);
      }
   };

   // Trigger speech when instructions are shown
   useEffect(() => {
      if (showInstructions) {
         // Small delay to ensure browser allow speech
         const speechTimer = setTimeout(() => {
            speakInstructions();
         }, 500);
         return () => clearTimeout(speechTimer);
      } else {
         window.speechSynthesis.cancel();
      }
   }, [showInstructions]);

   // Auto-close instructions after 15 seconds (increased to allow speech to finish)
   useEffect(() => {
      const timer = setTimeout(() => {
         setShowInstructions(false);
      }, 15000);
      return () => {
         clearTimeout(timer);
         window.speechSynthesis.cancel();
      };
   }, []);

   return (
      <div
         className="min-h-screen pt-20 pb-12 px-4 flex flex-col items-center justify-center relative bg-white"
      >
         {/* Overlay for contrast */}
         <div className="absolute inset-0 bg-gray-900/10 pointer-events-none"></div>

         {/* VOTING INSTRUCTIONS POPUP (Auto-close in 10s) */}
         {showInstructions && (
            <div className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center p-4 backdrop-blur-sm">
               <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-[popIn_0.4s_ease-out] relative">

                  {/* Timer Bar */}
                  <div className="absolute top-0 left-0 h-1 bg-blue-500 w-full animate-[progress_10s_linear_forwards] origin-left"></div>

                  {/* Header */}
                  <div className="bg-blue-600 p-4 text-center">
                     <h2 className="text-xl font-bold text-white uppercase tracking-wider">Voting Instructions</h2>
                     <p className="text-blue-100 text-sm">வாக்களிக்கும் முறை</p>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-6">

                     <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg border-2 border-blue-200">1</div>
                        <div>
                           <p className="text-gray-800 font-bold text-lg">Choose Candidate</p>
                           <p className="text-gray-500 text-sm">உங்கள் வேட்பாளரைத் தேர்ந்தெடுக்கவும்</p>
                        </div>
                     </div>

                     <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                           <div className="w-6 h-4 bg-blue-600 rounded-full"></div>
                        </div>
                        <div>
                           <p className="text-gray-800 font-bold text-lg">Press Blue Button</p>
                           <p className="text-gray-500 text-sm">சின்னத்திற்கு நேராக உள்ள நீல நிற பொத்தானை அழுத்தவும்</p>
                        </div>
                     </div>

                     <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200">
                           <div className="w-3 h-3 bg-red-600 rounded-full shadow-[0_0_10px_red]"></div>
                        </div>
                        <div>
                           <p className="text-gray-800 font-bold text-lg">Check Red Light</p>
                           <p className="text-gray-500 text-sm">சிவப்பு விளக்கு எரிவதை உறுதி செய்யவும்</p>
                        </div>
                     </div>

                     <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                        <p className="text-xs text-yellow-800 font-semibold">
                           ⚠️ You can vote only ONCE. The choice cannot be changed.
                        </p>
                     </div>

                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
                     <button
                        onClick={() => setShowInstructions(false)}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider shadow-lg transform active:scale-95 transition-all w-full sm:w-auto"
                     >
                        I Understood / புரிந்தது
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Success Popup (Existing Logic preserved) */}
         {showSuccess && (
            <div className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-lg w-full transform transition-all scale-100 flex flex-col items-center animate-[bounceIn_0.6s_cubic-bezier(0.175,0.885,0.32,1.275)] border-4 border-green-500 relative overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(#22c55e 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>

                  <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                     <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" className="animate-[drawCheck_0.6s_ease-out_forwards] path-length-0" />
                     </svg>
                  </div>
                  <h2 className="text-3xl font-black text-green-700 mb-2 uppercase tracking-wide">Vote Cast Successfully!</h2>
                  <p className="text-gray-600 text-lg font-bold mb-6">வாக்களிப்பு வெற்றிகரமாக முடிந்தது</p>
                  <div className="bg-gray-100 rounded-lg p-4 w-full border border-gray-200">
                     <p className="text-sm text-gray-500 font-mono">VOTE ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                     <p className="text-xs text-gray-400 mt-1">Thank you for exercising your democratic right.</p>
                  </div>
                  <style>{`
                     .path-length-0 { stroke-dasharray: 100; stroke-dashoffset: 100; animation: drawCheck 0.8s ease-out forwards 0.3s; }
                     @keyframes drawCheck { to { stroke-dashoffset: 0; } }
                     @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.9); } 100% { transform: scale(1); } }
                  `}</style>
               </div>
            </div>
         )}

         {/* NEXT-GEN EVM MODEL */}
         <div className="relative z-10 w-full max-w-4xl bg-gray-200 rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[6px] border-gray-400">
            {/* Glossy Metallic Bezel Effect */}
            <div className="absolute inset-0 rounded-[2rem] border-[3px] border-white/50 pointer-events-none"></div>

            {/* Inner Dark Frame */}
            <div className="bg-gray-800 rounded-[2rem] p-6 shadow-inner relative overflow-hidden">

               {/* Top Bar: Status & Branding */}
               <div className="flex justify-between items-center mb-6 border-b border-gray-600 pb-4">
                  <div className="flex items-center space-x-4">
                     <div className="w-16 h-16 bg-white rounded-full p-2 shadow-lg flex items-center justify-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full animate-pulse"></div>
                     </div>
                     <div>
                        <h1 className="text-2xl font-black text-white tracking-widest uppercase">Ballot Unit</h1>
                        <span className="text-xs text-gray-400 font-mono tracking-[0.2em] uppercase">Digital-EVM-V3</span>
                     </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex flex-col items-center">
                     <div className="relative">
                        <div className="w-6 h-6 rounded-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,1)] animate-pulse"></div>
                        <div className="absolute inset-0 rounded-full bg-white opacity-30 animate-ping"></div>
                     </div>
                     <span className="text-[10px] text-green-400 font-bold mt-2 tracking-widest">SYSTEM READY</span>
                  </div>
               </div>

               {/* Candidate List Container */}
               <div className="space-y-4">
                  {parties.map((party, index) => (
                     <div
                        key={party.id}
                        className={`group relative flex items-center bg-gray-100 rounded-xl overflow-hidden transition-all duration-300 ${votedId === party.id ? 'ring-4 ring-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)] transform scale-[1.02]' : 'hover:transform hover:scale-[1.01] hover:shadow-xl'}`}
                     >
                        {/* Serial Number */}
                        <div className="w-16 h-28 flex items-center justify-center bg-gray-200 border-r border-gray-300">
                           <span className="text-3xl font-black text-gray-700">{index + 1}</span>
                        </div>

                        {/* Candidate Details */}
                        <div className="flex-1 px-6 flex flex-col justify-center h-28 bg-gradient-to-r from-white to-gray-50">
                           <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors uppercase">{party.name}</h3>
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{party.fullName}</p>
                        </div>

                        {/* Party Symbol / Candidate Placeholder */}
                        <div className="w-32 h-28 bg-white border-l border-r border-gray-200 p-2 flex items-center justify-center relative">
                           {party.candidateName ? (
                              <div className="font-extrabold text-blue-900 text-center uppercase tracking-wider text-sm whitespace-nowrap bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 shadow-sm w-full h-full flex items-center justify-center">
                                 {party.candidateName}
                              </div>
                           ) : (
                              <span className="text-5xl opacity-80">{party.symbol}</span>
                           )}
                           {/* Shine effect on symbol */}
                           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>

                        {/* Action Area (Button & LED) */}
                        <div className="w-40 h-28 bg-gray-200 flex items-center justify-between px-6 shadow-inner">

                           {/* LED Light */}
                           <div className={`w-5 h-5 rounded-full border-2 border-gray-400 transition-all duration-300 ${votedId === party.id ? 'bg-red-600 shadow-[0_0_15px_rgba(220,38,38,1)] border-red-800' : 'bg-gray-400/50'}`}></div>

                           {/* The Blue Button */}
                           <button
                              onClick={() => handleVote(party)}
                              className="w-20 h-10 bg-gradient-to-b from-blue-600 to-blue-800 rounded-3xl shadow-[0_4px_0_rgb(30,58,138),0_8px_10px_rgba(0,0,0,0.3)] border-t border-blue-400 active:shadow-none active:translate-y-1 active:border-none transition-all duration-150 group-hover:bg-blue-600 relative overflow-hidden"
                           >
                              {/* Inner gloss */}
                              <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 rounded-t-3xl"></div>
                           </button>

                        </div>
                     </div>
                  ))}
               </div>

               {/* Footer Branding */}
               <div className="mt-8 text-center border-t border-gray-700 pt-4 flex justify-between items-center text-gray-500 text-xs font-mono uppercase tracking-widest">
                  <span>Serial: BU-7782-TN</span>
                  <span>Made in India</span>
               </div>

            </div>
         </div>

         {/* Project Credits Removed */}
      </div>
   );
};

export default Vote;
