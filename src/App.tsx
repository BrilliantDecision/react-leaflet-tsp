import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MapControl from "./MapControl";

export interface LatLng {
  lat: number;
  lng: number;
}

function App() {
  const [points, setPoints] = useState<LatLng[]>([]);
  alert(points.length);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapControl setPoints={setPoints} />
    </MapContainer>
  );
}

export default App;
