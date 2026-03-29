import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Create a custom div icon using an emoji
const createEmojiIcon = (emoji) => {
  return L.divIcon({
    html: `<div style="font-size: 24px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(8px); border-radius: 12px; width: 44px; height: 44px; display: flex; justify-content: center; align-items: center; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5); border: 2px solid rgba(249, 115, 22, 0.5);">${emoji}</div>`,
    className: 'custom-emoji-icon',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22]
  });
};

const MapUpdater = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center[0], center[1], map]);
  return null;
};

const MapComponent = ({ foods, userLocation }) => {
  const [claiming, setClaiming] = useState(null);
  
  const handleClaim = async (foodId) => {
      setClaiming(foodId);
      try {
          await fetch(`http://localhost:5000/api/food/${foodId}/claim`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
          });
      } catch(err) {
          console.error('Map claim err', err);
      } finally {
          setClaiming(null);
      }
  };

  const center = userLocation ? [userLocation.lat, userLocation.lng] : [13.0827, 80.2707];

  return (
    <div className="h-full w-full rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl z-0 relative">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MapUpdater center={center} />
        
        {/* User Location Marker */}
        {userLocation && (
           <Marker position={[userLocation.lat, userLocation.lng]} icon={createEmojiIcon('📍')}>
              <Popup className="premium-popup">
                  <div className="font-black text-slate-800 text-center text-xs uppercase tracking-widest p-1">You are here</div>
              </Popup>
           </Marker>
        )}

        {/* Food Markers */}
        {foods.map((food, index) => {
             const coords = food.location.coordinates; // [lng, lat]
             
             // Add a tiny 'jitter' based on index to prevent perfect overlap
             const jitter = 0.0002;
             const lat = coords[1] + (Math.sin(index) * jitter);
             const lng = coords[0] + (Math.cos(index) * jitter);
             const latLng = [lat, lng];
             
             return (
                 <Marker 
                     key={food._id}
                     position={latLng} 
                     icon={createEmojiIcon('🍱')}
                 >
                    <Popup className="premium-popup">
                        <div className="p-2 space-y-3 min-w-[220px] bg-white rounded-3xl">
                            <h4 className="font-black text-xl text-slate-900 leading-tight tracking-tighter">{food.name}</h4>
                            <div className="flex items-center justify-between">
                                <span className="bg-primary/10 text-primary px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">{food.quantity}</span>
                                
                                <span className="flex items-center text-slate-500 text-[10px] font-bold">
                                     <Clock className="w-3 h-3 mr-1 text-primary" />
                                     {formatDistanceToNow(new Date(food.expiryTime), { addSuffix: true })}
                                </span>
                            </div>
                            
                            <p className="text-[11px] text-slate-600 font-medium line-clamp-3 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                {food.description || 'No additional details provided.'}
                            </p>
                            
                            <p className="text-[10px] text-slate-400 font-medium line-clamp-2 italic pt-1 truncate">{food.location.address || 'No exact address'}</p>
                        </div>
                    </Popup>
                 </Marker>
             );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
