import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, HelpCircle, MessageCircle } from 'lucide-react';


const Help = () => {
   const navigate = useNavigate();

   return (
      <div
         className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-white"
      >
         {/* Overlay */}
         <div className="absolute inset-0 bg-white/90 pointer-events-none fixed"></div>

         <div className="relative z-10 max-w-5xl mx-auto">

            {/* Header - No Box */}
            <div className="text-center mb-12">
               <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-2 uppercase tracking-widest leading-relaxed">
                  உதவி & ஆதரவு
                  <span className="block text-2xl text-blue-700 mt-2 font-bold">(Help & Support)</span>
               </h1>
               <p className="text-gray-600 font-medium text-lg mt-4 max-w-3xl mx-auto">
                  மின்னணு வாக்களிப்பு தளம் தொடர்பான எந்தவொரு பிரச்சனைக்கும் நாங்கள் உதவ காத்திருக்கிறோம்.
                  <span className="block text-sm text-gray-500 mt-1">(We are here to assist you with any issues related to the E-Voting Platform.)</span>
               </p>
            </div>

            {/* Content - Glassmorphism Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

               {/* Contact Section */}
               <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 h-full">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 border-b-2 border-blue-100 pb-4 mb-6">
                     <Phone className="text-blue-600" />
                     தொடர்புக்கு (Contact Us)
                  </h2>
                  <div className="space-y-6">

                     <div className="flex items-start gap-4 p-4 bg-blue-50/60 rounded-xl border border-blue-100 hover:shadow-md transition-all">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                           <Phone size={24} />
                        </div>
                        <div>
                           <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">இலவச அழைப்பு எண்<br />(Toll Free)</p>
                           <p className="text-2xl font-black text-gray-800 tracking-tight mt-1">1950</p>
                           <p className="text-xs text-green-600 font-medium mt-1">24/7 Available</p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4 p-4 bg-green-50/60 rounded-xl border border-green-100 hover:shadow-md transition-all">
                        <div className="p-3 bg-green-100 rounded-lg text-green-600">
                           <img src="/img/whatsapp.png" alt="WhatsApp" className="w-6 h-6 object-contain" />
                        </div>
                        <div>
                           <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">WhatsApp Support</p>
                           <p className="text-xl font-bold text-gray-800 mt-1">+91 8754881937</p>
                        </div>
                     </div>

                     <div className="flex items-start gap-4 p-4 bg-red-50/60 rounded-xl border border-red-100 hover:shadow-md transition-all">
                        <div className="p-3 bg-red-100 rounded-lg text-red-600">
                           <Mail size={24} />
                        </div>
                        <div>
                           <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">மின்னஞ்சல் (Email)</p>
                           <p className="text-lg font-bold text-gray-800 mt-1">support@eci.gov.in</p>
                        </div>
                     </div>

                  </div>
               </div>

               {/* FAQs Section */}
               <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 h-full flex flex-col justify-between">
                  <div>
                     <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 border-b-2 border-purple-100 pb-4 mb-6">
                        <HelpCircle className="text-purple-600" />
                        விடைகள் (Quick FAQs)
                     </h2>
                     <div className="space-y-4">
                        <div className="bg-white/60 p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                           <p className="font-bold text-gray-800 text-base mb-1">கடவுச்சொல் / ஓடிபி வரவில்லையா?</p>
                           <p className="text-xs text-gray-500 italic mb-3">(Forgot Password/OTP?)</p>
                           <p className="text-sm text-blue-700 font-medium bg-blue-50 p-3 rounded-lg inline-block w-full">Use the "Resend OTP" button or contact support.</p>
                        </div>
                        <div className="bg-white/60 p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                           <p className="font-bold text-gray-800 text-base mb-1">முக அங்கீகாரம் வேலை செய்யவில்லையா?</p>
                           <p className="text-xs text-gray-500 italic mb-3">(Face ID not working?)</p>
                           <p className="text-sm text-blue-700 font-medium bg-blue-50 p-3 rounded-lg inline-block w-full">Ensure good lighting and remove glasses/masks.</p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                     <p className="text-xs text-gray-400 text-center font-medium leading-relaxed">
                        இந்தியத் தேர்தல் ஆணையம்<br />
                        நிர்வாச்சன் சதன், அசோகா சாலை, புது தில்லி 110001
                     </p>
                  </div>
               </div>

            </div>

            {/* Footer */}
            <div className="mt-12 flex justify-center">
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

export default Help;
