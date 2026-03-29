import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { Polyline, useMap } from "react-leaflet";

// Ensure Leaflet is globally available BEFORE the plugin is imported
if (typeof window !== 'undefined') {
    window.L = L;
}
import "leaflet-routing-machine";

const RoutingControl = ({ start, end }) => {
  const map = useMap();
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (!map || !start || !end) {
        setPositions([]);
        return;
    }

    console.log("🛣️ Manual Routing: Fetching directions from OSRM...");

    const router = L.Routing.osrmv1({
      serviceUrl: `https://routing.openstreetmap.de/routed-car/route/v1/driving`,
      timeout: 10000
    });

    const waypoints = [
      L.Routing.waypoint(L.latLng(start[0], start[1])),
      L.Routing.waypoint(L.latLng(end[0], end[1]))
    ];

    router.route(waypoints, (err, routes) => {
      if (err) {
        console.error("❌ OSRM Routing Error:", err.message);
        return;
      }

      if (routes && routes.length > 0) {
        // Extract smooth coordinates for the polyline
        const coords = routes[0].coordinates.map(c => [c.lat, c.lng]);
        setPositions(coords);
        
        // Use fitBounds instead of fitSelectedRoutes for a clean React feel
        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    });

    return () => {
        setPositions([]);
    };
  }, [map, start, end]);

  if (positions.length === 0) return null;

  return (
    <>
        {/* Core Route Path - High Visibility Google Blue */}
        <Polyline 
            positions={positions} 
            pathOptions={{
                color: '#4285F4',
                weight: 10,
                opacity: 0.9,
                lineJoin: 'round',
                lineCap: 'round',
                pane: 'overlayPane' // Ensures it stays above the tiles
            }}
        />
        {/* White Highlight for premium contrast */}
        <Polyline 
            positions={positions} 
            pathOptions={{
                color: 'white',
                weight: 3,
                opacity: 0.5,
                lineJoin: 'round',
                lineCap: 'round',
                pane: 'overlayPane'
            }}
        />
    </>
  );
};

export default RoutingControl;
