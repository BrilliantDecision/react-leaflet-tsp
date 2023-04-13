import L from "leaflet";

export const getRouteInstance = (waypoints: L.LatLng[]) => {
  const instance = L.Routing.control({
    waypoints,
    lineOptions: {
      styles: [{ color: "rgb(255,0,0)", weight: 4 }],
      extendToWaypoints: false,
      missingRouteTolerance: 1,
    },
    show: false,
    addWaypoints: false,
    routeWhileDragging: true,
    fitSelectedRoutes: true,
    showAlternatives: false,
  });
  return instance;
};
