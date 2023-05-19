import { LeafletMouseEvent, Map } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MapControl from "./utils/Map/MapControl";
import { CreatedRoute, createRoute } from "./utils/Route/Route";
import { doAnnealing } from "./algorithms/annealing/annealing";
import L from "leaflet";
import { doNearestSearch } from "./algorithms/nearestSearch/nearestSearch";
import { ComputedRouteInfo } from "./ui/modals/ComptedRouteInfo";
import { NavigateModal } from "./ui/modals/NavigateModal";
import axios from "axios";

export interface Info {
  time?: number;
  oldLen?: number;
  newLen?: number;
}

export interface ResponseDurationTable {
  code: "Ok" | unknown;
  durations: number[][];
}

export interface RouteResponse {
  routes: Route[];
}

export interface Route {
  distance: number;
}

function App() {
  const [map, setMap] = useState<Map | null>(null);
  const [points, setPoints] = useState<L.LatLng[]>([]);
  const [routes, setRoutes] = useState<CreatedRoute[]>([]);
  const [info, setInfo] = useState<Info>();
  const [showInfo, setShowInfo] = useState(false);
  const [isShowingNavigate, setIsShowingNavigate] = useState(false);

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

  const onClickStart = () => {
    const parsedPoints = points.map((val) => [val.lat, val.lng]).join(";");
    axios
      .get<ResponseDurationTable>(
        `https://router.project-osrm.org/table/v1/driving/${parsedPoints}`
      )
      .then((data) => setRoute(data.data.durations));
  };

  // draw routes and start algorithm
  const setRoute = async (durations: number[][]) => {
    const timeBefore = new Date().getTime();
    const { path: nearestSearchPath } = doNearestSearch(durations);
    const { path: annealingPath, len: newLen } = doAnnealing(
      { it: 1000, itPerTemp: 100, tMax: 100 },
      durations,
      { path: nearestSearchPath }
    );
    const time = (new Date().getTime() - timeBefore) / 1000;

    let newPoints: L.LatLng[] = [];

    annealingPath.forEach((val) => {
      newPoints.push(points[val]);
    });

    let oldLen = 0;
    const response = await axios.get<RouteResponse>(
      `http://router.project-osrm.org/route/v1/driving/${[
        ...points.map((val) => [val.lat, val.lng]),
        [points[0].lat, points[0].lng],
      ].join(";")}?overview=false`
    );
    oldLen += response.data.routes[0].distance;

    setRoutes(() => [createRoute([...newPoints, newPoints[0]])]);
    setInfo(() => ({
      time,
      oldLen: Math.round((oldLen / 1000) * 100) / 100,
      newLen: Math.round((newLen / 1000) * 100) / 100,
    }));
    setShowInfo(() => true);
  };

  useEffect(() => {
    if (points.length > 1) {
      setIsShowingNavigate(() => true);
    } else {
      setIsShowingNavigate(() => false);
    }
  }, [points]);

  return (
    <div className="relative">
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
        <MapControl setPoints={setPoints} />
        {points.map((val) => (
          <Marker
            key={`${val.lat}${val.lng}`}
            eventHandlers={{
              click: (e) => onClickMarker(e),
            }}
            position={val}
          ></Marker>
        ))}
        {routes.map((NewRoute, index) => (
          <NewRoute key={index} />
        ))}
      </MapContainer>
      <NavigateModal
        isShowing={isShowingNavigate}
        onClickStart={() => onClickStart()}
      />
    </div>
  );
}

export default App;
