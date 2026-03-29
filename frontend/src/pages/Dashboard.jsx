import React, { useState, useEffect } from 'react';
import { Search, MapPin, LayoutGrid, Navigation, Power, ArrowRight as ArrowRightRight, Plus, User as UserIcon, PhoneCall } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import MapComponent from '../components/MapComponent';
import DonateModal from '../components/DonateModal';
import UserDashboard from './UserDashboard';
import ProfileSetup from './ProfileSetup';
import { io } from 'socket.io-client';

const Dashboard = ({ user, onLogout, onProfileUpdate }) => {
  const [foods, setFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [liveLocation, setLiveLocation] = useState(user.homeLocation || { lat: 13.0827, lng: 80.2707 });
  const [socket, setSocket] = useState(null);
  
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [locationName, setLocationName] = useState(user.homeLocation?.address || 'Chennai');

  useEffect(() => {
    const newSocket = io('http://127.0.0.1:5000');
    setSocket(newSocket);

    newSocket.on('newFood', (food) => {
        setFoods(prev => [food, ...prev]);
    });

    newSocket.on('foodClaimed', (claimedFood) => {
        setFoods(prev => prev.filter(f => f._id !== claimedFood._id));
    });

    return () => newSocket.close();
  }, []);

  const fetchFoods = async () => {
      try {
          const params = new URLSearchParams({
              lat: liveLocation.lat,
              lng: liveLocation.lng
          });
          const res = await fetch(`http://127.0.0.1:5000/api/food?${params}`);
          const data = await res.json();
          setFoods(data);
      } catch(err) {
          console.error(err);
      }
  };

  useEffect(() => {
      fetchFoods();
      // eslint-disable-next-line
  }, [liveLocation]);

  const filteredFoods = foods.filter(food => 
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfileComplete = (updatedUser) => {
      onProfileUpdate(updatedUser);
      setShowProfileSetup(false);
  };

  if (showProfileSetup) {
      return <ProfileSetup user={user} onComplete={handleProfileComplete} />;
  }

  if (showProfile) {
    return (
        <div className="flex flex-col h-screen bg-bg-dark text-slate-100 relative selection:bg-primary/30">
            <UserDashboard 
                user={user} 
                onBack={() => setShowProfile(false)} 
                onUpdateProfile={() => setShowProfileSetup(true)}
            />
        </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bg-dark text-slate-100 relative selection:bg-primary/30">
      {/* Top Header Section */}
      <header className="glass px-8 py-8 z-40 flex flex-col space-y-6 sticky top-0 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 group">
               <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-all duration-500 shadow-[0_0_20px_rgba(6,182,212,0.1)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <MapPin className="h-6 w-6 text-primary animate-pulse" />
               </div>
               <div className="text-sm flex flex-col">
                   <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em] mb-1">Donation Zone</p>
                   {isEditingLocation ? (
                       <input 
                           type="text"
                           autoFocus
                           className="text-white text-base border-b-2 border-primary bg-transparent outline-none w-56 py-1 font-black animate-pulse placeholder:text-slate-700"
                           value={locationInput}
                           onChange={e => setLocationInput(e.target.value)}
                           onBlur={() => setIsEditingLocation(false)}
                           placeholder="Enter City..."
                           onKeyDown={async e => {
                               if (e.key === 'Enter' && locationInput) {
                                   try {
                                       const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}`);
                                       const data = await res.json();
                                       if (data && data.length > 0) {
                                           setLiveLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
                                           setLocationName(data[0].display_name.split(',')[0]);
                                       } else {
                                           alert("Location not found!");
                                       }
                                   } catch (err) {
                                       console.error(err);
                                   }
                                   setIsEditingLocation(false);
                               }
                           }}
                       />
                   ) : (
                       <p 
                           onClick={() => { setIsEditingLocation(true); setLocationInput(''); }}
                           className="text-white text-lg font-black truncate w-56 cursor-pointer hover:text-primary transition-all duration-300 flex items-center group/text"
                           title="Click to shift zone"
                       >
                           {locationName}
                           <ArrowRightRight className="h-4 w-4 ml-3 opacity-0 group-hover/text:opacity-100 transition-all -translate-x-2 group-hover/text:translate-x-0" />
                       </p>
                   )}
               </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div 
                onClick={() => setShowProfile(true)}
                className="hidden sm:flex items-center space-x-4 cursor-pointer group/prof hover:brightness-125 transition-all"
              >
                <div className="text-right">
                    <p className="text-white font-black text-sm tracking-tight">{user.name || 'Explorer'}</p>
                    <div className="flex items-center justify-end space-x-2 mt-1">
                        <div className="h-1.5 w-1.5 bg-primary rounded-full animate-ping" />
                        <p className="text-primary text-[9px] font-black uppercase tracking-widest">Profile Active</p>
                    </div>
                </div>
                <div className="h-14 w-14 glass rounded-[1.25rem] flex items-center justify-center border-white/10 group-hover/prof:border-primary/50 group-hover/prof:shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all">
                    <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-primary font-black shadow-inner border border-white/5 group-hover/prof:bg-primary/10 group-hover/prof:text-white transition-colors">
                        {user.name?.charAt(0) || <UserIcon className="h-5 w-5" />}
                    </div>
                </div>
              </div>

              <div className="h-10 w-[1px] bg-white/5" />

              <button onClick={onLogout} className="glass p-4 rounded-[1.25rem] text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all border-white/5 group">
                  <Power className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
        </div>

        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none group-focus-within:text-primary transition-colors">
                <Search className="h-5 w-5 text-slate-600" />
            </div>
            <input
                type="text"
                placeholder="Search for available food..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-dark pl-14"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <div className="bg-white/5 px-2 py-1 rounded text-[10px] font-mono text-slate-700 border border-white/5">⌘K</div>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative flex flex-col bg-bg-dark">
          {/* View Toggle */}
          <div className="px-8 py-5 flex justify-between items-center bg-bg-dark/80 z-10 backdrop-blur-xl border-b border-white/5">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                    Donations Available: <span className="text-white">{filteredFoods.length}</span>
                </h2>
              </div>
              
              <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5">
                  <button 
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 rounded-xl flex items-center justify-center transition-all duration-500 ${viewMode === 'list' ? 'bg-primary text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105' : 'text-slate-600 hover:text-slate-200'}`}
                  >
                      <LayoutGrid className="h-4 w-4 mr-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">List View</span>
                  </button>
                  <button 
                      onClick={() => setViewMode('map')}
                      className={`px-4 py-2 rounded-xl flex items-center justify-center transition-all duration-500 ${viewMode === 'map' ? 'bg-primary text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-105' : 'text-slate-600 hover:text-slate-200'}`}
                  >
                      <Navigation className="h-4 w-4 mr-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Map View</span>
                  </button>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-32 scroll-smooth">
              {viewMode === 'list' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                      {filteredFoods.map(food => (
                          <FoodCard key={food._id} food={food} user={user} />
                      ))}
                      {filteredFoods.length === 0 && (
                          <div className="col-span-full py-20 text-center glass rounded-[2.5rem] border-white/5 mt-4">
                              <div className="bg-white/5 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                <Search className="h-10 w-10 text-slate-700" />
                              </div>
                              <p className="font-black text-xl text-white">No results found</p>
                              <p className="text-slate-500 text-sm mt-1">Try expanding your search or post a donation!</p>
                          </div>
                      )}
                  </div>
              ) : (
                  <div className="h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 bg-bg-card animate-scale-in">
                       <MapComponent foods={filteredFoods} userLocation={liveLocation} />
                  </div>
              )}
          </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
          <button 
              onClick={() => setIsDonateModalOpen(true)}
              className="group bg-primary hover:bg-primary-dark text-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(6,182,212,0.3)] hover:shadow-[0_20px_50px_rgba(6,182,212,0.5)] hover:scale-110 active:scale-90 transition-all duration-500 flex items-center space-x-3 overflow-hidden"
          >
              <Plus className="h-8 w-8 transition-transform group-hover:rotate-90 duration-500" strokeWidth={3} />
              <span className="font-black uppercase tracking-[0.2em] text-sm pr-2 max-w-0 group-hover:max-w-xs transition-all duration-500 overflow-hidden whitespace-nowrap">Donate Now</span>
          </button>
      </div>

      {isDonateModalOpen && (
          <DonateModal 
              isOpen={isDonateModalOpen} 
              onClose={() => setIsDonateModalOpen(false)} 
              userLocation={liveLocation}
              user={user}
              onSuccess={fetchFoods}
          />
      )}
    </div>
  );
};

export default Dashboard;
