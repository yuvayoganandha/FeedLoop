import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

// Map standard Leaflet to window so the plugin can find it
if (typeof window !== 'undefined') {
    window.L = L;
}

const RoutingControl = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    console.log("📍 Routing initialized targeting:", end);

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [
          { color: '#4285F4', opacity: 0.9, weight: 12 }, // Thicker Google Blue
          { color: 'white', opacity: 0.5, weight: 4 }     // Inner highlight
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      createMarker: () => null, // Hide default marker icons
      show: false // Hide text instructions panel
    }).addTo(map);

    // Force a map resize/refresh after adding control
    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    return () => {
      if (map && routingControl) {
        console.log("🗑️ Clearing previous route");
        map.removeControl(routingControl);
      }
    };
  }, [map, start, end]);

  return null;
};

export default RoutingControl;
