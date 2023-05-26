import { LeafletMouseEvent, Map } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MapControl from "./utils/Map/MapControl";
import { CreatedRoute, createRoute } from "./utils/Route/Route";
import { doAnnealing } from "./algorithms/annealing/annealing";
import L from "leaflet";
import { doNearestSearch } from "./algorithms/nearestSearch/nearestSearch";
import { ComputedRouteInfo, Info } from "./ui/modals/ComptedRouteInfo";
import { NavigateModal } from "./ui/modals/NavigateModal";
import axios from "axios";
import { CalculateRouteBlock } from "./ui/components/CalculateRouteBlock";
import { Options } from "./ui/modals/Options";

export interface ResponseDurationTable {
  code: "Ok" | unknown;
  durations: number[][];
}

export interface RouteResponse {
  routes: Route[];
}

export interface Route {
  distance: number;
  duration: number;
}

export type TSPAlgorithm = "nearest" | "annealing" | "hybrid";

function App() {
  const [map, setMap] = useState<Map | null>(null); // map itself
  const [points, setPoints] = useState<L.LatLng[]>([]); // markers on map
  const [routes, setRoutes] = useState<CreatedRoute[]>([]); // created routes on map
  const [info, setInfo] = useState<Info>(); // info about route
  const [showInfo, setShowInfo] = useState(false); // show info about route
  const [isShowingNavigate, setIsShowingNavigate] = useState(false); //  open navigate modal
  const [isShowingOptions, setIsShowingOptions] = useState(false); // open algorithms and options
  const [algorithm, setAlgorithm] = useState<TSPAlgorithm>("hybrid"); // choose algorithm to run
  const [previousPoint, setPreviousPoint] = useState<L.LatLng>(); // save point on dragStart event and remove it when dragEnd event
  const [draggedEnd, setDraggedEnd] = useState(false); // dragEnd event was invoked

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

  // running calculating route
  const onClickStart = () => {
    const parsedPoints = points
      .map((val) => [val.lng, val.lat].join(","))
      .join(";");

    // get duration table
    axios
      .get<ResponseDurationTable>(
        `https://router.project-osrm.org/table/v1/driving/${parsedPoints}`
      )
      .then((data) => setRoute(data.data.durations));
  };

  const runAlgorithm = (matrix: number[][]) => {
    if (algorithm === "nearest") {
      // nearest

      const { path } = doNearestSearch({
        matrix,
      });
      return path;
    } else if (algorithm === "annealing") {
      // annealing

      const { path } = doAnnealing(
        { it: 1000, itPerTemp: 200, tMax: 100 },
        { matrix }
      );
      return path;
    } else {
      // hybrid

      // run nearest
      const { path: nearestSearchPath } = doNearestSearch({
        matrix,
      });

      // run annealing on nearest path
      const { path: annealingPath } = doAnnealing(
        { it: 1000, itPerTemp: 100, tMax: 100 },
        { matrix, previousPath: nearestSearchPath }
      );
      return annealingPath;
    }
  };

  // draw routes and start algorithm
  const setRoute = async (durations: number[][]) => {
    // start time
    const timeBefore = new Date().getTime();

    // run algorithm
    const calculatedPath = runAlgorithm(durations);

    // final time
    const time = (new Date().getTime() - timeBefore) / 1000;

    // new order of coordinates (new path)
    let newPoints: L.LatLng[] = [];

    calculatedPath.forEach((val) => {
      newPoints.push(points[val]);
    });

    // old path info
    const responseOldPath = await axios.get<RouteResponse>(
      `http://router.project-osrm.org/route/v1/driving/${[
        ...points.map((val) => [val.lng, val.lat].join(",")),
        [points[0].lng, points[0].lat].join(","),
      ].join(";")}?overview=false`
    );

    // new path info
    const responseNewPath = await axios.get<RouteResponse>(
      `http://router.project-osrm.org/route/v1/driving/${[
        ...newPoints.map((val) => [val.lng, val.lat].join(",")),
        [newPoints[0].lng, newPoints[0].lat].join(","),
      ].join(";")}?overview=false`
    );

    // old
    const oldDistance =
      Math.round((responseOldPath.data.routes[0].distance / 1000) * 100) / 100;
    const oldDuration = responseOldPath.data.routes[0].duration;

    // new
    const newDistance =
      Math.round((responseNewPath.data.routes[0].distance / 1000) * 100) / 100;
    const newDuration = responseNewPath.data.routes[0].duration;

    // draw route (FIX - now request running)
    setRoutes(() => [createRoute([...newPoints, newPoints[0]])]);

    // set info
    setInfo(() => ({
      time,
      oldDistance,
      newDistance,
      oldDuration,
      newDuration,
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

  useEffect(() => {
    if (!draggedEnd || !routes.length) return;
    setDraggedEnd(() => false);
    onClickStart();
  }, [draggedEnd]);

  return (
    <div className="relative">
      <MapContainer
        id="map"
        ref={setMap}
        center={[58.5213, 31.271]}
        zoom={13}
        scrollWheelZoom={true}
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
              dragstart: (e) => {
                setPreviousPoint(() => val);
              },
              dragend: (e) => {
                setPoints((prevState) => {
                  if (!previousPoint) return prevState;

                  const newState = [...prevState];
                  const targetIndex = newState.findIndex(
                    (val) =>
                      val.lat === previousPoint.lat &&
                      val.lng === previousPoint.lng
                  );

                  if (targetIndex === -1) return prevState;

                  newState.splice(targetIndex, 1);
                  newState.push(e.target._latlng as L.LatLng);

                  return newState;
                });
                setDraggedEnd(() => true);
              },
            }}
            position={val}
            draggable
          ></Marker>
        ))}
        {routes.map((NewRoute, index) => (
          <NewRoute key={index} />
        ))}
        <CalculateRouteBlock
          isShowing={points.length > 1}
          onClickStart={onClickStart}
        />
      </MapContainer>
      {/* <NavigateModal
        isShowing={isShowingNavigate}
        onClickStart={() => onClickStart()}
      /> */}
      <Options
        algorithm={algorithm}
        setAlgorithm={(value) => setAlgorithm(() => value)}
        isShowing={isShowingOptions}
        setIsShowing={setIsShowingOptions}
      />
    </div>
  );
}

export default App;
