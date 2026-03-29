import { useState, useEffect } from "react";
import L from "leaflet";
import { Polyline, useMap } from "react-leaflet";

/**
 * RoutingControl: A robust, plugin-free navigation path component.
 * Uses direct fetch() to OSRM APIs and renders via standard React-Leaflet Polyline.
 */
const RoutingControl = ({ start, end }) => {
  const map = useMap();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!map || !start || !end) {
        setPositions([]);
        return;
    }

    const fetchRoute = async () => {
        setLoading(true);
        // OSRM expects coordinates in [longitude,latitude] order
        const startCoords = `${start[1]},${start[0]}`;
        const endCoords = `${end[1]},${end[0]}`;
        
        // Use Project OSRM as primary (proper CORS headers)
        // Use OpenStreetMap Deutschland as secondary fallback
        const servers = [
            `https://router.project-osrm.org/route/v1/driving/${startCoords};${endCoords}?overview=full&geometries=geojson`,
            `https://routing.openstreetmap.de/routed-car/route/v1/driving/${startCoords};${endCoords}?overview=full&geometries=geojson`
        ];

        let success = false;
        
        for (const url of servers) {
            if (success) break;
            
            try {
                console.log(`🌐 Fetching Navigation Path from: ${new URL(url).hostname}...`);
                const response = await fetch(url, { 
                    method: 'GET', 
                    mode: 'cors',
                    credentials: 'omit',
                    headers: { 'Accept': 'application/json' }
                });
                
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                
                if (data.routes && data.routes.length > 0) {
                    // GeoJSON coordinates are [lng, lat], Leaflet wants [lat, lng]
                    const routeCoords = data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
                    
                    setPositions(routeCoords);
                    
                    // Zoom the map to fit the entire route with nice padding
                    const bounds = L.latLngBounds(routeCoords);
                    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15, animate: true, duration: 1 });
                    
                    success = true;
                    console.log("✅ Navigation Path Rendered Successfully.");
                }
            } catch (err) {
                console.error(`⚠️ Routing attempt failed on ${new URL(url).hostname}:`, err.message);
            }
        }
        
        if (!success) {
            console.error("❌ CRITICAL: All routing servers failed. Please check your internet connection.");
        }
        setLoading(false);
    };

    fetchRoute();

    return () => {
        setPositions([]);
    };
  }, [map, start, end]);

  if (positions.length === 0) return null;

  return (
    <>
        {/* Core High-Visibility Route Line */}
        <Polyline 
            positions={positions} 
            pathOptions={{
                color: '#4285F4', // Google Blue
                weight: 10,
                opacity: 0.9,
                lineJoin: 'round',
                lineCap: 'round',
                pane: 'overlayPane' // Ensures visibility above all tiles
            }}
        />
        {/* Superior Contrast Inner Line */}
        <Polyline 
            positions={positions} 
            pathOptions={{
                color: 'white',
                weight: 3,
                opacity: 0.6,
                lineJoin: 'round',
                lineCap: 'round',
                pane: 'overlayPane'
            }}
        />
    </>
  );
};

export default RoutingControl;
