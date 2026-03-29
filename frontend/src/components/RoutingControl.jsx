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

    console.log("📍 Long-distance Routing Initialized:", start, "to", end);

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      router: L.Routing.osrmv1({
        serviceUrl: `https://routing.openstreetmap.de/routed-car/route/v1/driving`
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
    }).addTo(map);

    // Ensure the routing panel container is hidden to prevent glitches
    const container = document.querySelector('.leaflet-routing-container');
    if (container) container.style.display = 'none';

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, start, end]);

  return null;
};

export default RoutingControl;
