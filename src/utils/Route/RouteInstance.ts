import L from "leaflet";

export const getRouteInstance = (waypoints: L.LatLng[]) => {
  const instance = L.Routing.control({
    waypoints,
    collapsible: true,
    show: window.innerWidth > 640 ? true : false,
    addWaypoints: true,
    routeWhileDragging: true,
    fitSelectedRoutes: true,
    showAlternatives: true,
    plan: L.Routing.plan(waypoints, {
      createMarker() {
        return false;
      },
    }),
    router: L.Routing.osrmv1({
      language: "ru",
    }),
  });
  return instance;
};
