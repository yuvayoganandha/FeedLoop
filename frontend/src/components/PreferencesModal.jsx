import React, { useState } from 'react';
import { X, Settings, Bell, Moon, Shield, Volume2 } from 'lucide-react';

const PreferencesModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  const [sound, setSound] = useState(true);

  if (!isOpen) return null;

  const handleDarkModeToggle = () => {
     setDarkMode(prev => {
        const next = !prev;
        if(next) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return next;
     });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center animate-fade-in p-4">
       <div className="bg-white rounded-3xl p-10 w-full max-w-md shadow-2xl relative animate-scale-in border border-[#dadce0]">
           <button onClick={onClose} className="absolute top-6 right-6 text-[#5f6368] hover:text-[#202124] bg-[#f8f9fa] rounded-full p-2 border border-[#dadce0] transition-colors"><X className="h-5 w-5" /></button>
           
           <div className="text-center mb-8 flex flex-col items-center">
              <div className="h-14 w-14 bg-[#f8f9fa] border border-[#dadce0] rounded-2xl flex items-center justify-center text-[#5f6368] mb-4 shadow-sm">
                 <Settings className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-[#202124] tracking-tight mb-2">Cloud Preferences</h3>
              <p className="text-sm text-[#5f6368] font-medium leading-relaxed">Customize your mission control layout</p>
           </div>
           
           <div className="space-y-6">
              
              <div className="flex items-center justify-between p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-2xl transition-all hover:bg-white hover:shadow-sm">
                  <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-[#dadce0] flex items-center justify-center text-[#4285f4]">
                          <Bell className="h-5 w-5" />
                      </div>
                      <div>
                          <p className="font-bold text-[#202124] tracking-tight text-sm">Push Notifications</p>
                          <p className="text-[11px] font-medium text-[#70757a] uppercase tracking-wider mt-1">Alerts for nearby rescues</p>
                      </div>
                  </div>
                  <button 
                     onClick={() => setNotifications(!notifications)} 
                     className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${notifications ? 'bg-[#34a853]' : 'bg-[#dadce0]'}`}
                  >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${notifications ? 'right-1' : 'left-1'}`} />
                  </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-2xl transition-all hover:bg-white hover:shadow-sm">
                  <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-[#dadce0] flex items-center justify-center text-[#202124]">
                          <Moon className="h-5 w-5" />
                      </div>
                      <div>
                          <p className="font-bold text-[#202124] tracking-tight text-sm">Dark Theme</p>
                          <p className="text-[11px] font-medium text-[#70757a] uppercase tracking-wider mt-1">Night operation mode</p>
                      </div>
                  </div>
                  <button 
                     onClick={handleDarkModeToggle} 
                     className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${darkMode ? 'bg-[#4285f4]' : 'bg-[#dadce0]'}`}
                  >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${darkMode ? 'right-1' : 'left-1'}`} />
                  </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#f8f9fa] border border-[#dadce0] rounded-2xl transition-all hover:bg-white hover:shadow-sm">
                  <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-[#dadce0] flex items-center justify-center text-[#ea4335]">
                          <Volume2 className="h-5 w-5" />
                      </div>
                      <div>
                          <p className="font-bold text-[#202124] tracking-tight text-sm">Sound Effects</p>
                          <p className="text-[11px] font-medium text-[#70757a] uppercase tracking-wider mt-1">Haptic audiovisuals</p>
                      </div>
                  </div>
                  <button 
                     onClick={() => setSound(!sound)} 
                     className={`w-12 h-6 rounded-full transition-colors relative shadow-inner ${sound ? 'bg-[#ea4335]' : 'bg-[#dadce0]'}`}
                  >
                     <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${sound ? 'right-1' : 'left-1'}`} />
                  </button>
              </div>

           </div>
           
           <button 
               onClick={onClose} 
               className="w-full mt-8 bg-white border border-[#dadce0] text-[#5f6368] hover:text-[#202124] font-black py-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-xs tracking-widest active:scale-95"
           >
               DONE
           </button>
       </div>
    </div>
  );
};

export default PreferencesModal;
