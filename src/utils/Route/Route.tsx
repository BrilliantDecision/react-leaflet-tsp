import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import { getRouteInstance } from "./RouteInstance";

export type Route = React.ForwardRefExoticComponent<
  Pick<any, string | number | symbol> & React.RefAttributes<L.Routing.Control>
>;

export const createRoute = (waypoints: L.LatLng[]): Route => {
  const instance = getRouteInstance(waypoints);
  return createControlComponent((props: any) => instance);
};
