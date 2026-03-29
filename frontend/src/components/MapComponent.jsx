import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Clock, Navigation, LocateFixed as MapPinUser, Trash2, PhoneCall } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import RoutingControl from './RoutingControl';

// Create a custom div icon using an emoji
const createEmojiIcon = (emoji, color = 'rgba(249, 115, 22, 0.5)') => {
  return L.divIcon({
    html: `<div style="font-size: 24px; background: rgba(15, 23, 42, 0.82); backdrop-filter: blur(8px); border-radius: 12px; width: 44px; height: 44px; display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); border: 2px solid ${color};">${emoji}</div>`,
    className: 'custom-emoji-icon',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
};

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
};

const MapComponent = ({ foods, userLocation }) => {
  const [routeTarget, setRouteTarget] = useState(null);
  
  const center = userLocation ? [userLocation.lat, userLocation.lng] : [13.0827, 80.2707];

  return (
    <div className="h-full w-full rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl z-0 relative">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapUpdater center={center} />
        
        {/* Navigation Layer */}
        {userLocation && routeTarget && (
            <RoutingControl start={[userLocation.lat, userLocation.lng]} end={routeTarget} />
        )}

        {/* User Location Marker */}
        {userLocation && (
           <Marker position={[userLocation.lat, userLocation.lng]} icon={createEmojiIcon('📍', '#06b6d4')}>
              <Popup className="premium-popup">
                  <div className="font-extrabold text-slate-800 text-center text-[10px] uppercase tracking-widest p-1">Your Position</div>
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
                     icon={createEmojiIcon('🍱')}
                 >
                    <Popup className="premium-popup">
                        <div className="p-2 space-y-3 min-w-[240px] bg-white rounded-3xl shadow-xl">
                            <h4 className="font-black text-xl text-slate-900 leading-tight tracking-tighter">{food.name}</h4>
                            <div className="flex items-center justify-between">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">{food.quantity}</span>
                                
                                <span className="flex items-center text-slate-500 text-[10px] font-bold">
                                     <Clock className="w-3 h-3 mr-1 text-primary" />
                                     {formatDistanceToNow(new Date(food.expiryTime), { addSuffix: true })}
                                </span>
                            </div>
                            
                            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 mb-2">
                                <div className="flex flex-col">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 text-left">Contact Number</p>
                                    <p className="text-sm font-black text-slate-900 tracking-tight leading-none select-all">{food.phone || (food.donor && food.donor.phone) || 'Contact Donor'}</p>
                                </div>
                                <a 
                                    href={`tel:${food.phone || (food.donor && food.donor.phone) || ''}`}
                                    className="p-2 bg-primary text-slate-950 rounded-lg hover:scale-110 active:scale-95 transition-all shadow-md"
                                    title="Call Donor"
                                >
                                    <PhoneCall className="h-3 w-3" />
                                </a>
                            </div>

                            <div className="pt-1 flex space-x-2">
                                <button 
                                    onClick={() => setRouteTarget(latLng)}
                                    className="flex-1 btn-primary !py-2.5 !text-[9px] !rounded-xl flex items-center justify-center space-x-2 shadow-lg"
                                >
                                    <Navigation className="h-3 w-3" />
                                    <span>Get Directions</span>
                                </button>
                                
                                {routeTarget && routeTarget[0] === lat && (
                                    <button 
                                        onClick={() => setRouteTarget(null)}
                                        className="p-2.5 bg-slate-100 text-slate-500 hover:text-red-500 rounded-xl transition-colors border border-slate-200"
                                        title="Clear Path"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex items-start space-x-2 pt-2 mt-2 border-t border-slate-100">
                                <MapPinUser className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
                                <p className="text-[9px] text-slate-400 font-medium italic truncate tracking-tight text-left">{food.location.address || 'Location Hidden'}</p>
                            </div>
                        </div>
                    </Popup>
                 </Marker>
             );
        })}
      </MapContainer>

      {/* Manual Route Clear Overlay (Visible only when routing) */}
      {routeTarget && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[400] animate-fade-in">
              <div className="glass px-6 py-2 rounded-full border border-primary/20 flex items-center space-x-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <div className="flex items-center space-x-2">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full animate-ping" />
                    <p className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Active Navigation</p>
                  </div>
                  <div className="h-4 w-[1px] bg-white/10" />
                  <button onClick={() => setRouteTarget(null)} className="text-[10px] font-black text-rose-400 hover:text-rose-300 uppercase tracking-widest transition-colors flex items-center">
                      <Trash2 className="h-3 w-3 mr-1.5" />
                      Clear Path
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default MapComponent;
