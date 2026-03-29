import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  MapPin, 
  Clock, 
  Package, 
  CheckCircle2, 
  ArrowLeft, 
  Activity, 
  Zap,
  Target,
  ShieldCheck,
  User as UserIcon,
  ChevronRight,
  TrendingUp,
  History
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const UserDashboard = ({ user, onBack, onUpdateProfile }) => {
  const [activity, setActivity] = useState({ donations: [], claims: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('donations'); // 'donations' or 'claims'

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user/activity', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setActivity(data);
      } catch (err) {
        console.error("Activity fetch err", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const stats = [
    { label: 'Total Rescues', value: activity.claims.length, icon: Target, color: 'text-primary' },
    { label: 'Impact Rank', value: user.rating?.toFixed(1) || '0.0', icon: Trophy, color: 'text-amber-400' },
    { label: 'Global Rank', value: '#128', icon: TrendingUp, color: 'text-emerald-400' },
    { label: 'Contribution', value: activity.donations.length, icon: Zap, color: 'text-cyan-400' },
  ];

  if (loading) return (
     <div className="flex-1 flex flex-col items-center justify-center bg-bg-dark space-y-6 animate-pulse">
        <div className="h-20 w-20 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex items-center justify-center">
            <Activity className="h-10 w-10 text-primary" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">Syncing Personal Data...</p>
     </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-bg-dark animate-fade-in-up custom-scrollbar">
      {/* Profile Header */}
      <section className="relative px-8 pt-12 pb-16 overflow-hidden">
         <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/5 via-bg-dark/20 to-bg-dark" />
         <div className="relative z-10">
            <button onClick={onBack} className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-primary transition-colors group mb-10">
               <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
               <span>Back to Home</span>
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between space-y-8 md:space-y-0">
               <div className="flex items-center space-x-8">
                  <div className="h-32 w-32 glass rounded-[3rem] p-1 border border-white/5 relative group">
                     <div className="w-full h-full bg-slate-950 rounded-[2.8rem] flex items-center justify-center text-primary font-black text-5xl shadow-inner group-hover:bg-primary/5 transition-colors duration-500">
                        {user.name?.charAt(0) || <UserIcon className="h-14 w-14" />}
                     </div>
                     <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-bg-dark shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                        <ShieldCheck className="h-5 w-5 text-slate-900" />
                     </div>
                  </div>
                  <div>
                     <h2 className="text-5xl font-black text-white tracking-tighter mb-3">{user.name}</h2>
                     <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                           <div className="h-2 w-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Profile Verified</p>
                        </div>
                        <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{user.phone}</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="flex space-x-4">
                  <button 
                    onClick={onUpdateProfile}
                    className="btn-primary !py-3 !px-10 !text-[10px] !rounded-2xl"
                  >
                     Update Identity
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Stats Dashboard */}
      <section className="px-8 -mt-6 pb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                  <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all duration-500 group">
                      <div className="flex items-center justify-between mb-6">
                         <div className={`p-3 bg-bg-dark rounded-2xl border border-white/5 group-hover:border-primary/10 transition-colors`}>
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                         </div>
                         <ChevronRight className="h-4 w-4 text-slate-800" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-2">{stat.label}</p>
                      <h4 className="text-4xl font-black text-white tracking-tighter">{stat.value}</h4>
                  </div>
              ))}
          </div>
      </section>

      {/* Activity Timeline */}
      <section className="px-8 pb-32">
          <div className="bg-bg-card/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 overflow-hidden">
             <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between space-y-6 md:space-y-0 bg-white/[0.01]">
                <div className="flex items-center space-x-4">
                   <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                      <History className="h-5 w-5 text-primary" />
                   </div>
                   <h3 className="text-xl font-black text-white uppercase tracking-widest">My Activity</h3>
                </div>

                <div className="flex bg-slate-900/50 p-1.5 rounded-[1.5rem] border border-white/5">
                   <button 
                      onClick={() => setActiveTab('donations')}
                      className={`px-8 py-3 rounded-[1.2rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'donations' ? 'bg-primary text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'text-slate-600 hover:text-slate-200'}`}
                   >
                      My Donations
                   </button>
                   <button 
                      onClick={() => setActiveTab('claims')}
                      className={`px-8 py-3 rounded-[1.2rem] text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === 'claims' ? 'bg-primary text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'text-slate-600 hover:text-slate-200'}`}
                   >
                      My Rescues
                   </button>
                </div>
             </div>

             <div className="p-10">
                {activeTab === 'donations' ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {activity.donations.length > 0 ? activity.donations.map((item, idx) => (
                         <div key={idx} className="glass p-8 rounded-[2.8rem] border border-white/5 group hover:bg-white/[0.02] transition-all duration-300">
                             <div className="flex justify-between items-start mb-6">
                                <div className="space-y-2">
                                   <h4 className="text-2xl font-black text-white tracking-tighter group-hover:text-primary transition-colors">{item.name}</h4>
                                   <div className="flex items-center space-x-3">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white/5 px-3 py-1 rounded-lg border border-white/5">{item.quantity}</p>
                                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-700 italic">{item.location?.address?.split(',')[0]} Sector</p>
                                   </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-white/10 ${item.status === 'available' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-800 text-slate-500'}`}>
                                   {item.status}
                                </div>
                             </div>
                             <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 flex items-center">
                                   <Clock className="w-3 h-3 mr-2 text-primary" />
                                   Broadcast {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                </span>
                                <button className="text-[9px] font-black text-primary uppercase tracking-[0.3em] hover:brightness-125">Edit Posting</button>
                             </div>
                         </div>
                      )) : (
                         <div className="col-span-full py-20 text-center animate-fade-in">
                            <Package className="h-16 w-16 text-slate-800 mx-auto mb-6 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">No active surplus broadcasts found.</p>
                         </div>
                      )}
                   </div>
                ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {activity.claims.length > 0 ? activity.claims.map((item, idx) => (
                        <div key={idx} className="glass p-8 rounded-[2.8rem] border border-emerald-500/10 group bg-emerald-500/[0.01] hover:bg-emerald-500/[0.03] transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                               <div className="space-y-2">
                                  <h4 className="text-2xl font-black text-white tracking-tighter group-hover:text-emerald-400 transition-colors">{item.name}</h4>
                                  <div className="flex items-center space-x-3">
                                     <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">Rescue Successful</p>
                                  </div>
                               </div>
                               <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                               </div>
                            </div>
                            <div className="space-y-4">
                               <div className="flex items-center space-x-4">
                                  <div className="h-8 w-8 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-400 text-xs font-black border border-white/5">
                                     {item.donor?.name?.charAt(0)}
                                  </div>
                                  <div>
                                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Donated By</p>
                                     <p className="text-xs font-black text-white tracking-tight leading-none">{item.donor?.name}</p>
                                  </div>
                               </div>
                               <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Rescued {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true })}</span>
                                  <button className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] hover:brightness-125">View Details</button>
                               </div>
                            </div>
                        </div>
                     )) : (
                        <div className="col-span-full py-20 text-center animate-fade-in">
                           <Target className="h-16 w-16 text-slate-800 mx-auto mb-6 opacity-20" />
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">No completed rescue missions documented.</p>
                        </div>
                     )}
                   </div>
                )}
             </div>
          </div>
      </section>
    </div>
  );
};

export default UserDashboard;
