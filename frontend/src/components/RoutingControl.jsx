import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { useMap } from "react-leaflet";

// Ensure Leaflet is globally available BEFORE the plugin is used
if (typeof window !== 'undefined') {
    window.L = L;
}

// We import the plugin here. In Vite, this usually works better if L is already global.
import "leaflet-routing-machine";

const RoutingControl = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    console.log("📍 Long-distance Routing Initializing From:", start, "To:", end);

    // Create the Routing Control using a more stable OSRM instance
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      router: L.Routing.osrmv1({
        serviceUrl: `https://routing.openstreetmap.de/routed-car/route/v1/driving`,
        timeout: 10000 // 10 seconds timeout for long distances
      }),
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [
          { color: '#4285F4', opacity: 0.9, weight: 10 }, // Robust Google Blue
          { color: 'white', opacity: 0.4, weight: 3 }     // Inner highlight for contrast
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      createMarker: () => null, // Marker management is handled by MapComponent
      show: false // Explicitly hide the instructions panel
    });

    // Handle routing errors (Log them so the user can see in F12)
    routingControl.on('routingerror', (e) => {
        console.error("❌ Routing Error:", e.error?.message || "Check network/coordinates");
    });

    routingControl.addTo(map);

    // Ensure the routing panel container is hidden to prevent glitches
    const hidePanel = () => {
        const container = document.querySelector('.leaflet-routing-container');
        if (container) container.style.display = 'none';
    };
    
    hidePanel();
    const interval = setInterval(hidePanel, 500); // Periodic check to suppress flicker

    return () => {
      clearInterval(interval);
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, start, end]);

  return null;
};

export default RoutingControl;
