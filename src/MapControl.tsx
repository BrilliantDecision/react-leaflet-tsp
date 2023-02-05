import { LeafletMouseEvent } from "leaflet";
import { Dispatch, FC, SetStateAction } from "react";
import { useMapEvents } from "react-leaflet";
import { LatLng } from "./App";

interface Props {
  setPoints: Dispatch<SetStateAction<LatLng[]>>;
}

const MapControl: FC<Props> = ({ setPoints }) => {
  const onClickMap = (e: LeafletMouseEvent) => {
    setPoints((prevState) => [
      ...prevState,
      { lat: e.latlng.lat, lng: e.latlng.lng },
    ]);
  };
  useMapEvents({
    click: (e) => onClickMap(e),
  });

  return null;
};

export default MapControl;
