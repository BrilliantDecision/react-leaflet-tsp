import L from "leaflet";

export const getRouteInstance = (waypoints: L.LatLng[]) => {
  const instance = L.Routing.control({
    waypoints,
    lineOptions: {
      styles: [
        {
          color: "rgb(255,0,0)",
          weight: 4,
          dashArray: [10, 10],
          dashOffset: "5",
        },
      ],
      extendToWaypoints: false,
      missingRouteTolerance: 1,
    },
    show: true,
    addWaypoints: true,
    routeWhileDragging: true,
    fitSelectedRoutes: true,
    showAlternatives: true,
  });
  return instance;
};
