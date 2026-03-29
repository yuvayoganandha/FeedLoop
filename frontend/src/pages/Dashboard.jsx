import React, { useState, useEffect } from 'react';
import { Search, MapPin, LayoutGrid, Navigation, Power, ArrowRight as ArrowRightRight, Plus, User as UserIcon, PhoneCall, History, Settings, HelpCircle, ShieldCheck } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import MapComponent from '../components/MapComponent';
import DonateModal from '../components/DonateModal';
import UserDashboard from './UserDashboard';
import ProfileSetup from './ProfileSetup';
import { io } from 'socket.io-client';
import { API_BASE_URL, API_ENDPOINTS } from '../config';

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
    const newSocket = io(API_BASE_URL);
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
          const res = await fetch(`${API_ENDPOINTS.FOOD}?${params}`);
          const data = await res.json();
          setFoods(data);
      } catch(err) {
          console.error(err);
      }
  };

  useEffect(() => {
    fetchFoods();
  }, [liveLocation]);

  if (showProfileSetup || (!user.name && !showProfile)) {
    return <ProfileSetup user={user} onComplete={(updatedUser) => {
        onProfileUpdate(updatedUser);
        setShowProfileSetup(false);
    }} />;
  }

  if (showProfile) {
    return <UserDashboard user={user} onBack={() => setShowProfile(false)} onUpdateProfile={onProfileUpdate} />;
  }

  const filteredFoods = foods.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f8f9fa] text-[#202124] overflow-hidden font-sans">
      {/* Google-Style Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-[#dadce0] flex flex-col pt-8 pb-4 shrink-0 shadow-sm z-30">
        <div className="px-8 mb-10 flex items-center space-x-3">
           <div className="h-10 w-10 bg-google-blue rounded-xl flex items-center justify-center shadow-sm">
              <Plus className="h-6 w-6 text-white" />
           </div>
           <h1 className="text-2xl font-medium tracking-tight text-[#5f6368]">FeedLoop</h1>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <button 
            onClick={() => setViewMode('list')}
            className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-r-full transition-all text-sm font-medium ${viewMode === 'list' ? 'bg-[#e8f0fe] text-google-blue' : 'text-[#3c4043] hover:bg-[#f1f3f4]'}`}
          >
            <LayoutGrid className="h-5 w-5" />
            <span>Active Donations</span>
          </button>
          
          <button 
            onClick={() => setViewMode('map')}
            className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-r-full transition-all text-sm font-medium ${viewMode === 'map' ? 'bg-[#e8f0fe] text-google-blue' : 'text-[#3c4043] hover:bg-[#f1f3f4]'}`}
          >
            <MapPin className="h-5 w-5" />
            <span>Rescue Radar</span>
          </button>

          <button 
            onClick={() => setShowProfile(true)}
            className="w-full flex items-center space-x-4 px-5 py-3.5 rounded-r-full transition-all text-sm font-medium text-[#3c4043] hover:bg-[#f1f3f4]"
          >
            <History className="h-5 w-5" />
            <span>My Contributions</span>
          </button>

          <div className="pt-6 mt-6 border-t border-[#f1f3f4] mx-5">
             <p className="text-[11px] font-bold text-[#70757a] uppercase tracking-widest pl-1 mb-4">Support & Cloud</p>
             <div className="space-y-1">
                <button className="w-full flex items-center space-x-4 px-3 py-2.5 rounded-lg text-sm text-[#5f6368] hover:bg-[#f1f3f4] transition-colors">
                  <HelpCircle className="h-4 w-4" />
                  <span>Assistance</span>
                </button>
                <button className="w-full flex items-center space-x-4 px-3 py-2.5 rounded-lg text-sm text-[#5f6368] hover:bg-[#f1f3f4] transition-colors">
                  <Settings className="h-4 w-4" />
                  <span>Preferences</span>
                </button>
             </div>
          </div>
        </nav>

        <div className="px-6 pt-4 border-t border-[#f1f3f4]">
          <button onClick={onLogout} className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all">
            <Power className="h-5 w-5" />
            <span>Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Superior Top Bar (Google Integrated) */}
        <header className="h-20 bg-white border-b border-[#dadce0] flex items-center justify-between px-10 z-20">
          <div className="flex-1 max-w-2xl relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#5f6368]" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for surplus food..."
              className="w-full bg-[#f1f3f4] border-transparent rounded-lg py-3 pl-12 pr-4 text-[#202124] focus:bg-white focus:ring-2 focus:ring-[#4285f4]/20 focus:border-google-blue focus:shadow-md transition-all outline-none"
            />
          </div>

          <div className="flex items-center space-x-6 ml-10">
            <div className="flex flex-col items-end">
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => setIsEditingLocation(true)}
                        className="text-xs font-bold text-google-blue hover:text-blue-700 flex items-center transition-colors"
                    >
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {locationName}
                    </button>
                </div>
            </div>

            <button 
              onClick={() => setIsDonateModalOpen(true)}
              className="bg-google-blue hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all flex items-center space-x-2 active:scale-95"
            >
              <Plus className="h-5 w-5" />
              <span>Donate</span>
            </button>
            
            <div className="h-10 w-10 bg-[#e8f0fe] rounded-full border border-google-blue/20 flex items-center justify-center text-google-blue font-bold shadow-sm">
                {user.name?.charAt(0) || <UserIcon className="h-5 w-5" />}
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
          {viewMode === 'list' ? (
            <div className="max-w-7xl mx-auto animate-fade-in">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h2 className="text-3xl font-normal text-[#202124]">Available Surpluses</h2>
                    <p className="text-sm text-[#5f6368] mt-1 font-medium italic">Showing results near your proximity</p>
                 </div>
                 <div className="flex bg-[#f1f3f4] p-1 rounded-lg">
                    <button onClick={() => setViewMode('list')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-google-blue shadow-sm' : 'text-[#5f6368]'}`}>LIST</button>
                    <button onClick={() => setViewMode('map')} className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-white text-google-blue shadow-sm' : 'text-[#5f6368]'}`}>RADAR</button>
                 </div>
              </div>

              {filteredFoods.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredFoods.map(food => (
                    <FoodCard key={food._id} food={food} user={user} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-dashed border-[#dadce0] animate-pulse">
                   <LayoutGrid className="h-20 w-20 text-[#dadce0] mb-6" />
                   <p className="text-lg font-medium text-[#5f6368]">No transmissions found in this sector.</p>
                   <button onClick={() => setSearchQuery('')} className="mt-4 text-google-blue font-bold hover:underline">Clear active scanner</button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full w-full rounded-[2.5rem] overflow-hidden border border-[#dadce0] shadow-sm animate-fade-in relative">
               <MapComponent foods={foods} userLocation={liveLocation} />
            </div>
          )}
        </div>
      </main>

      <DonateModal 
        isOpen={isDonateModalOpen} 
        onClose={() => setIsDonateModalOpen(false)} 
        userLocation={liveLocation}
        user={user}
        onSuccess={() => {
            setIsDonateModalOpen(false);
            fetchFoods();
        }}
      />
      
      {/* Location Settings Modal (Google Minimalist) */}
      {isEditingLocation && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-10 w-full max-w-sm shadow-2xl animate-fade-in-up">
                <h3 className="text-2xl font-normal text-[#202124] mb-2 text-center">Set Location</h3>
                <p className="text-sm text-[#5f6368] mb-8 text-center">Find food in a different proximity</p>
                <div className="space-y-6">
                    <input 
                        type="text" 
                        placeholder="Search for city or area..."
                        className="input-dark text-center !rounded-md"
                        value={locationInput}
                        onChange={(e) => setLocationInput(e.target.value)}
                    />
                    <div className="flex space-x-3">
                        <button onClick={() => setIsEditingLocation(false)} className="flex-1 py-2 text-[#5f6368] font-medium hover:bg-[#f1f3f4] rounded-md transition-colors">Cancel</button>
                        <button 
                            onClick={() => {
                                setLocationName(locationInput);
                                setIsEditingLocation(false);
                            }}
                            className="flex-1 py-2 bg-google-blue text-white font-medium rounded-md hover:shadow-md transition-all shadow-sm"
                        >
                            Updates
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
