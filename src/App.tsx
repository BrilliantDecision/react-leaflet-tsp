import { LeafletMouseEvent, Map } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MapControl from "./MapControl";
import { Route, createRoute } from "./Route";
import { createMatrix } from "./algorithms/utils";
import { doAnnealing } from "./algorithms/annealing/annealing";
import L from "leaflet";
import "leaflet-easybutton/src/easy-button.js";
import "leaflet-easybutton/src/easy-button.css";
import { doNearestSearch } from "./algorithms/nearestSearch/nearestSearch";
import { ComputedRouteInfo } from "./ui/modals/ComptedRouteInfo";

export interface Info {
  time?: number;
  oldLen?: number;
  newLen?: number;
}

function App() {
  const [map, setMap] = useState<Map | null>(null);
  const [points, setPoints] = useState<L.LatLng[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [info, setInfo] = useState<Info>();
  const [showInfo, setShowInfo] = useState(false);

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

    let oldLen = 0;
    points.forEach((_, index) => {
      oldLen += points[index].distanceTo(
        points[index + 1 >= points.length ? 0 : index + 1]
      );
    });

    const matrix: number[][] = createMatrix(points);
    const timeBefore = new Date().getTime();
    const { path: nearestSearchPath } = doNearestSearch(matrix);
    const { path: annealingPath, len: newLen } = doAnnealing(
      { it: 1000, itPerTemp: 100, tMax: 100 },
      matrix,
      { path: nearestSearchPath }
    );
    const time = (new Date().getTime() - timeBefore) / 1000;

    let newPoints: L.LatLng[] = [];
    annealingPath.forEach((val) => {
      newPoints.push(points[val]);
    });
    setInfo(() => ({
      time,
      oldLen: Math.round((oldLen / 1000) * 100) / 100,
      newLen: Math.round((newLen / 1000) * 100) / 100,
    }));
    setRoutes((prevState) => [createRoute([...newPoints, newPoints[0]])]);
    setShowInfo(() => true);
  };

  useEffect(() => {
    if (!map) return;

    L.easyButton("fa-globe", () => {
      map.locate().on("locationfound", function (e) {
        map.flyTo(e.latlng, map.getZoom());
      });
    }).addTo(map);
  }, [map]);

  return (
    <MapContainer
      id="map"
      ref={setMap}
      center={[55.75222, 37.61556]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ComputedRouteInfo
        show={showInfo}
        onClose={() => setShowInfo(false)}
        info={info}
      />
      <button
        onClick={(e) => onClickStart(e)}
        className="absolute z-[999999999] m-2 ml-32 px-2 py-1 bg-green-500 text-white rounded-md scale-125"
      >
        Start
      </button>
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
