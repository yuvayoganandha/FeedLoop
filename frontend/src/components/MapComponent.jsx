import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Clock, Navigation, LocateFixed, Trash2, PhoneCall } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import RoutingControl from './RoutingControl';

// Create a custom div icon using a Material-Style Emoji Carrier
const createEmojiIcon = (emoji, color = '#4285F4') => {
  return L.divIcon({
    html: `<div style="font-size: 24px; background: white; border-radius: 12px; width: 44px; height: 44px; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 3px solid ${color}; transform: translateY(-5px);">${emoji}</div>`,
    className: 'custom-emoji-icon',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
};

const MapUpdater = ({ center, triggerRecenter }) => {
  const map = useMap();
  useEffect(() => {
    if (center && triggerRecenter) {
      map.flyTo(center, 13, { animate: true, duration: 1.5 });
    }
  }, [center, triggerRecenter, map]);
  return null;
};

const MapComponent = ({ foods, userLocation }) => {
  const [routeTarget, setRouteTarget] = useState(null);
  const [shouldRecenter, setShouldRecenter] = useState(true);
  
  const center = userLocation ? [userLocation.lat, userLocation.lng] : [13.0827, 80.2707];

  // Stop auto-recentering after the first successful fly-to
  useEffect(() => {
    if (userLocation && shouldRecenter) {
      const timer = setTimeout(() => setShouldRecenter(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [userLocation, shouldRecenter]);

  return (
    <div className="h-full w-full rounded-[2rem] overflow-hidden border border-[#dadce0] shadow-sm z-0 relative bg-[#f1f3f4]">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapUpdater center={center} triggerRecenter={shouldRecenter} />
        
        {/* Navigation Layer */}
        {userLocation && routeTarget && (
            <RoutingControl start={[userLocation.lat, userLocation.lng]} end={routeTarget} />
        )}

        {/* User Location Marker (Google Style) */}
        {userLocation && (
           <Marker position={[userLocation.lat, userLocation.lng]} icon={createEmojiIcon('📍', '#EA4335')}>
              <Popup className="google-popup">
                  <div className="font-bold text-[#202124] text-center text-[10px] uppercase tracking-widest p-1">Current Sector</div>
              </Popup>
           </Marker>
        )}

        {/* Food Markers */}
        {foods.map((food, index) => {
             const coords = food.location.coordinates;
             const lat = coords[1];
             const lng = coords[0];
             const latLng = [lat, lng];
             
             return (
                 <Marker 
                     key={food._id}
                     position={latLng} 
                     icon={createEmojiIcon('🍱', '#4285F4')}
                 >
                    <Popup className="google-popup">
                        <div className="p-3 space-y-4 min-w-[260px] bg-white rounded-2xl shadow-xl border border-[#dadce0]">
                            <h4 className="font-bold text-xl text-[#202124] leading-tight tracking-tight">{food.name}</h4>
                            
                            <div className="flex items-center justify-between">
                                <span className="bg-[#e8f0fe] text-google-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#4285f4]/10">{food.quantity}</span>
                                
                                <span className="flex items-center text-[#5f6368] text-[10px] font-bold">
                                     <Clock className="w-3.5 h-3.5 mr-1 text-google-blue" />
                                     {formatDistanceToNow(new Date(food.expiryTime), { addSuffix: true })}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between bg-[#f8f9fa] p-4 rounded-xl border border-[#dadce0] mb-3">
                                <div className="flex flex-col">
                                    <p className="text-[9px] font-black text-[#70757a] uppercase tracking-widest leading-none mb-1 text-left">Donor Contact</p>
                                    <p className="text-sm font-bold text-[#202124] tracking-tight leading-none select-all">{food.phone || (food.donor && food.donor.phone) || 'Contact Required'}</p>
                                </div>
                                <a 
                                    href={`tel:${food.phone || (food.donor && food.donor.phone) || ''}`}
                                    className="p-2.5 bg-google-green text-white rounded-lg hover:bg-green-600 transition-all shadow-sm"
                                    title="Call Donor"
                                >
                                    <PhoneCall className="h-4 w-4" />
                                </a>
                            </div>

                            <div className="pt-1 flex space-x-2">
                                <button 
                                    onClick={() => setRouteTarget(latLng)}
                                    className="flex-1 bg-google-blue text-white py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center justify-center space-x-2 active:scale-95"
                                >
                                    <Navigation className="h-3.5 w-3.5" />
                                    <span>Plan Route</span>
                                </button>
                                
                                {routeTarget && routeTarget[0] === lat && (
                                    <button 
                                        onClick={() => setRouteTarget(null)}
                                        className="p-2.5 bg-[#fce8e6] text-google-red hover:bg-[#fad2cf] rounded-full transition-all border border-google-red/10"
                                        title="Clear Path"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            
                             <div className="flex items-start space-x-2 pt-3 mt-3 border-t border-[#f1f3f4]">
                                    <LocateFixed className="h-3.5 w-3.5 text-[#5f6368] shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-[#5f6368] font-medium italic truncate tracking-tight text-left leading-normal">{food.location.address || 'Address Protected'}</p>
                              </div>
                        </div>
                    </Popup>
                 </Marker>
             );
        })}
      </MapContainer>

      {/* Manual Recenter Button (Google Style) */}
      <button 
        onClick={() => setShouldRecenter(true)}
        className="absolute bottom-10 right-10 z-[400] h-12 w-12 bg-white rounded-full shadow-lg border border-[#dadce0] flex items-center justify-center text-[#5f6368] hover:text-google-blue hover:shadow-xl active:scale-90 transition-all"
        title="Recenter Map"
      >
        <LocateFixed className="h-6 w-6" />
      </button>

      {/* Manual Route Clear Overlay (Material Superior) */}
      {routeTarget && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[400] animate-fade-in">
              <div className="bg-white px-6 py-2.5 rounded-full border border-[#dadce0] flex items-center space-x-5 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-google-blue rounded-full animate-ping" />
                    <p className="text-[10px] font-black text-[#202124] uppercase tracking-widest">Navigation Active</p>
                  </div>
                  <div className="h-5 w-[1px] bg-[#dadce0]" />
                  <button onClick={() => setRouteTarget(null)} className="text-[10px] font-black text-google-red hover:text-red-700 uppercase tracking-widest transition-colors flex items-center group">
                      <Trash2 className="h-3.5 w-3.5 mr-2 group-hover:scale-110 transition-transform" />
                      Abort Path
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default MapComponent;
