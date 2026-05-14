import React from 'react';
import { TrendingUp, Clock, AlertCircle, Activity } from 'lucide-react';

const Dashboard = () => {
   // Mock Data for Dashboard
   const stats = [
      { label: 'Total Registered Voters', value: '6.2 Cr', image: '/img/dashboard_voters.png', change: '+2.5%', color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
      { label: 'Votes Polled', value: '4.8 Cr', image: '/img/dashboard_votes.png', change: '72%', color: 'bg-gradient-to-r from-green-500 to-green-600' },
      { label: 'Polling Booths', value: '68,321', image: '/img/dashboard_booth.png', change: 'Active', color: 'bg-gradient-to-r from-purple-500 to-purple-600' },
      { label: 'Leading (Trend)', value: 'Candidate 1', image: '/img/dashboard_votes.png', change: 'Leading', color: 'bg-gradient-to-r from-orange-500 to-orange-600' },
   ];

   const partyStandings = [
      { name: 'Candidate 1', votes: '1.92 Cr', percentage: 41, color: 'bg-gradient-to-r from-blue-500 to-blue-400' },
      { name: 'Candidate 2', votes: '1.45 Cr', percentage: 32, color: 'bg-gradient-to-r from-green-600 to-green-500' },
      { name: 'Candidate 3', votes: '82.1 L', percentage: 14, color: 'bg-gradient-to-r from-orange-600 to-orange-500' },
      { name: 'Candidate 4', votes: '32.1 L', percentage: 6, color: 'bg-gradient-to-r from-purple-500 to-purple-400' },
      { name: 'Candidate 5', votes: '24.5 L', percentage: 4, color: 'bg-gradient-to-r from-red-800 to-red-700' },
      { name: 'Others', votes: '10.3 L', percentage: 3, color: 'bg-gradient-to-r from-gray-500 to-gray-400', symbol: '⚪' },
   ];



   return (
      <div
         className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative bg-white"
      >
         {/* Overlay */}
         <div className="absolute inset-0 bg-gray-50/80 pointer-events-none fixed"></div>

         <div className="relative z-10 max-w-7xl mx-auto space-y-8">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-300 pb-6">
               <div>
                  <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 to-blue-800 uppercase tracking-tight">
                     Live Election Dashboard
                  </h1>
                  <p className="mt-2 text-gray-600 font-medium flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                     Tamil Nadu Assembly Elections 2026
                  </p>
               </div>

            </div>

            {/* Stats Cards - Unique Style */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
               {stats.map((stat, index) => (
                  <div
                     key={index}
                     className="group bg-white/60 backdrop-blur-md rounded-2xl p-1 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                     <div className="bg-white/50 rounded-xl p-5 h-full flex flex-col justify-between relative overflow-hidden">



                        <div className="flex justify-between items-start mb-4">
                           <div className="w-16 h-16 bg-white/80 rounded-2xl shadow-sm border border-white p-2 flex items-center justify-center relative z-10">
                              <Activity className={`w-8 h-8 ${index === 0 ? 'text-blue-600' : index === 1 ? 'text-green-600' : index === 2 ? 'text-purple-600' : 'text-orange-600'}`} />
                           </div>
                           <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/80 truncate border border-gray-100 relative z-10 ${index === 0 ? 'text-blue-600' : index === 1 ? 'text-green-600' : index === 2 ? 'text-purple-600' : 'text-orange-600'}`}>
                              {stat.change}
                           </span>
                        </div>
                        <div className="relative z-10">
                           <div className="text-3xl font-black text-gray-800 tracking-tight">{stat.value}</div>
                           <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">{stat.label}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

               {/* Stylized Poll Results */}
               <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                     <div>
                        <h3 className="text-2xl font-bold text-gray-900">Live Vote Share</h3>
                        <p className="text-sm text-gray-500">Based on real-time ballot unit data</p>
                     </div>
                     <div className="flex gap-2 text-xs font-bold">
                        <span className="px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm text-gray-600">STATEWIDE</span>
                        <span className="px-3 py-1 bg-gray-200 rounded-full text-gray-500">CONSTITUENCY</span>
                     </div>
                  </div>

                  <div className="space-y-6">
                     {partyStandings.map((party) => (
                        <div key={party.name} className="relative group">
                           <div className="flex justify-between items-center mb-2 z-10 relative">
                              <div className="flex items-center gap-3">
                                 {/* Party Image/Avatar */}
                                 <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center shrink-0">
                                    {party.image ? (
                                       <img src={party.image} alt={party.name} className="w-full h-full object-cover" />
                                    ) : (
                                       <span className="text-xl">{party.symbol || '🏳️'}</span>
                                    )}
                                 </div>
                                 <span className="text-lg font-bold text-gray-800 w-24">{party.name}</span>
                                 <span className="text-xs font-medium text-gray-500 bg-white/50 px-2 py-0.5 rounded border border-gray-100">{party.votes}</span>
                              </div>
                              <span className="text-lg font-black text-gray-900">{party.percentage}%</span>
                           </div>

                           {/* Progress Bar Container */}
                           <div className="h-4 w-full bg-gray-200/50 rounded-full overflow-hidden shadow-inner backdrop-blur-sm relative">
                              {/* Animated Bar */}
                              <div
                                 className={`h-full rounded-full shadow-sm relative ${party.color}`}
                                 style={{ width: `${party.percentage}%`, transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                              >
                                 {/* Shimmer Effect */}
                                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* AI Insight Box */}
                  <div className="mt-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-5 border border-indigo-100 flex items-start gap-4 shadow-sm relative overflow-hidden">
                     <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                        <AlertCircle size={24} />
                     </div>
                     <div className="relative z-10">
                        <h4 className="font-bold text-indigo-900 text-sm uppercase tracking-wide mb-1">AI Analyst Insight</h4>
                        <p className="text-sm text-indigo-800/80 leading-relaxed font-medium">
                           Major upset in progress! <strong>Candidate 1</strong> has surged ahead in both urban and rural constituencies, establishing a commanding lead. <strong>Candidate 2</strong> trails in second place.
                        </p>
                     </div>
                     <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none"></div>
                  </div>

               </div>
            </div>
         </div>


         <style>{`
            @keyframes shimmer {
               0% { transform: translateX(-100%); }
               100% { transform: translateX(100%); }
            }
            @keyframes fadeIn {
               0% { opacity: 0; transform: translateY(-10px); }
               100% { opacity: 1; transform: translateY(0); }
            }
         `}</style>
      </div>
   );
};

export default Dashboard;
