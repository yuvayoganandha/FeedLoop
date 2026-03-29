import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

// Ensure the plugin is attached to L
if (typeof window !== 'undefined' && !window.L) {
    window.L = L;
}

const RoutingControl = ({ start, end }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !start || !end) return;

    // Remove any existing routing controls
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline && layer.options.interactive === false) {
        // This is a naive way to find LRM layers, standard LRM puts them into a pane
      }
    });

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
          { color: '#06b6d4', opacity: 0.8, weight: 6 }, // Neon Cyan
          { color: 'white', opacity: 0.3, weight: 2 }    // Inner highlight
        ]
      },
      createMarker: () => null, // Hide default numbered markers
      show: false // Hide the textual directions panel by default
    }).addTo(map);

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, start, end]);

  return null;
};

export default RoutingControl;
