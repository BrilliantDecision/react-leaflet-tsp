import { LeafletMouseEvent } from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MapControl from "./MapControl";
import Routing from "./Routing";

export interface LatLng {
  lat: number;
  lng: number;
}

function App() {
  const [points, setPoints] = useState<LatLng[]>([]);

  const onClickMarker = (e: LeafletMouseEvent) => {
    const targetMarkerIndex = points.findIndex(
      (val) => val.lat === e.latlng.lat && val.lng === e.latlng.lng
    );
    setPoints((prevState) => {
      const newState = [...prevState];
      newState.splice(targetMarkerIndex, 1);
      return newState;
    });
  };

  return (
    <MapContainer id="map" center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapControl setPoints={setPoints} />
      {points.map((val) => (
        <Marker
          key={`${val.lat}${val.lng}`}
          eventHandlers={{
            click: (e) => onClickMarker(e),
            mouseover: (e) => console.log(e.sourceTarget),
          }}
          position={val}
        >
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      ))}
      <Routing />
    </MapContainer>
  );
}

export default App;
