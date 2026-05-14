import React from 'react';
import { useNavigate } from 'react-router-dom';


const Terms = () => {
   const navigate = useNavigate();

   return (
      <div
         className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-white"
      >
         {/* Overlay */}
         <div className="absolute inset-0 bg-white/90 pointer-events-none fixed"></div>

         <div className="relative z-10 max-w-5xl mx-auto">

            {/* Header - No Box, just Text */}
            <div className="text-center mb-12">
               <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2 uppercase tracking-widest leading-relaxed">
                  விதிமுறைகள் & நிபந்தனைகள்
                  <span className="block text-2xl text-blue-700 mt-2">(Terms & Conditions)</span>
               </h1>
            </div>

            {/* Content - Glassmorphism Style */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 space-y-8 text-gray-800">



               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section>
                     <h2 className="text-xl font-bold text-blue-800 mb-2 border-b-2 border-blue-100 inline-block pb-1">பயனர் தகுதி (User Eligibility)</h2>
                     <p className="text-gray-800 font-medium">செல்லுபடியாகும் பதிவு செய்யப்பட்ட பயனர்கள் மட்டுமே வாக்களிக்க அனுமதி பெறுவர்.</p>
                     <p className="text-sm text-gray-600 mt-1">Only valid registered users will be allowed to vote.</p>
                  </section>

                  <section>
                     <h2 className="text-xl font-bold text-blue-800 mb-2 border-b-2 border-blue-100 inline-block pb-1">ஒரே முறை வாக்களிப்பு (One Vote Per Person)</h2>
                     <p className="text-gray-800 font-medium">ஒவ்வொரு பயனரும் ஒரு முறை மட்டுமே வாக்களிக்க முடியும். Duplicate அல்லது multiple voting கண்டறியப்பட்டால் அந்த vote நிராகரிக்கப்படும்.</p>
                     <p className="text-sm text-gray-600 mt-1">Each user can vote only once. If duplicate or multiple voting is detected, that vote will be rejected.</p>
                  </section>

                  <section>
                     <h2 className="text-xl font-bold text-blue-800 mb-2 border-b-2 border-blue-100 inline-block pb-1">அடையாள சரிபார்ப்பு (Identity Verification)</h2>
                     <p className="text-gray-800 font-medium">OTP, Face Recognition போன்ற முறைகள் மூலம் பயனர் சரிபார்க்கப்படுவர்.</p>
                     <p className="text-sm text-gray-600 mt-1">Users will be verified through methods like OTP and Face Recognition.</p>
                  </section>

                  <section>
                     <h2 className="text-xl font-bold text-blue-800 mb-2 border-b-2 border-blue-100 inline-block pb-1">Data Security</h2>
                     <p className="text-gray-800 font-medium">பயனர் தகவல்கள் பாதுகாப்பாக சேமிக்கப்படும். Unauthorized access அல்லது data misuse அனுமதிக்கப்படாது.</p>
                     <p className="text-sm text-gray-600 mt-1">User information will be stored securely. Unauthorized access or data misuse will not be tolerated.</p>
                  </section>
               </div>

               <div className="bg-blue-50/80 p-6 rounded-2xl border border-blue-100 text-center mt-8">
                  <h2 className="text-lg font-bold text-gray-800 mb-2">User Agreement</h2>
                  <p className="text-blue-900 font-bold">இந்த Online Voting System-ஐ பயன்படுத்துவதன் மூலம், மேலுள்ள அனைத்து விதிமுறைகளையும் பயனர் ஒப்புக்கொள்கிறார்.</p>
                  <p className="text-sm text-blue-700 mt-1">By using this Online Voting System, the user agrees to all the above terms and conditions.</p>
               </div>

            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-center">
               <button
                  onClick={() => navigate('/')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 rounded-full transition-colors duration-200 shadow-xl transform hover:scale-105 active:scale-95"
               >
                  முகப்புக்கு திரும்ப (Go Home)
               </button>
            </div>

         </div>

         {/* Project Credits */}
         <div className="mt-8 text-center relative z-10 w-full pb-8">
            <h3 className="text-black font-black text-2xl tracking-widest drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)] uppercase">
               ONLINE VOTING MANAGEMENT
            </h3>
            <p className="text-black text-sm font-bold mt-2 tracking-[0.2em] bg-white/40 px-4 py-1 rounded-full inline-block backdrop-blur-sm border border-white/40 shadow-sm">
               BY KAVIYA, NALLASELVI, AARTHY
            </p>
         </div>
      </div>
   );
};

export default Terms;
