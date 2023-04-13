import { LeafletMouseEvent } from "leaflet";
import { useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MapControl from "./MapControl";
import { Route, createRoute } from "./Route";
import { createMatrix } from "./algorithms/utils";
import { doAnnealing } from "./algorithms/annealing/annealing";

function App() {
  const [points, setPoints] = useState<L.LatLng[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [info, setInfo] = useState({ oldLen: 0, newLen: 0 });
  const index = useRef(0)

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

  // draw routes and start algorithm
  const onClickStart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    const matrix: number[][] = createMatrix(points);
    const { path, len: newLen } = doAnnealing(
      { it: 1000, itPerTemp: 100, tMax: 100 },
      matrix
    );
    let oldLen = 0;
    points.forEach((_, index) => {
      oldLen += points[index].distanceTo(
        points[index + 1 >= points.length ? 0 : index + 1]
      );
    });
    setInfo(() => ({ oldLen, newLen }));

    path.forEach((_, index) => {
      setRoutes((prevState) => {
        const newState = [...prevState];
        newState.push(
          createRoute([
            points[path[index]],
            points[index + 1 >= points.length ? path[0] : path[index + 1]],
          ])
        );
        return newState;
      });
    });
  };

  return (
    <MapContainer
      id="map"
      center={[55.75222, 37.61556]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <button
        onClick={(e) => onClickStart(e)}
        className="absolute z-[999999999] m-2 ml-32 px-2 py-1 bg-green-500 text-white rounded-md scale-125"
      >
        Start
      </button>
      <div className="flex flex-col gap-2 absolute z-[999999999] m-2 ml-20 px-2 py-1 text-white rounded-md scale-125 bg-slate-500/50">
        <p>{info.oldLen}</p>
        <p>{info.newLen}</p>
      </div>
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
      {routes.map((NewRoute, index) => (
        <NewRoute key={index} />
      ))}
    </MapContainer>
  );
}

export default App;
