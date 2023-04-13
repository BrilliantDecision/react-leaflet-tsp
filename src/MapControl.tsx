import { LeafletMouseEvent } from "leaflet";
import { Dispatch, FC, SetStateAction } from "react";
import { useMapEvents } from "react-leaflet";

interface Props {
  setPoints: Dispatch<SetStateAction<L.LatLng[]>>;
}

const MapControl: FC<Props> = ({ setPoints }) => {
  const onClickMap = (e: LeafletMouseEvent) => {
    setPoints((prevState) => {
      const isMarkerExist =
        prevState.findIndex(
          (val) => val.lat === e.latlng.lat && val.lng === e.latlng.lng
        ) !== -1;
      if (isMarkerExist) return prevState;
      return [...prevState, e.latlng];
    });
  };
  useMapEvents({
    click: (e) => onClickMap(e),
  });

  return null;
};

export default MapControl;
