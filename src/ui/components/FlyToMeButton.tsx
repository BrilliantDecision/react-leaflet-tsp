import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import L, { Map } from "leaflet";
import { FC, useEffect, useRef } from "react";

interface Props {
  map: Map | null;
}

export const FlyToMeButton: FC<Props> = ({ map }) => {
  const flyToMeButton = useRef<HTMLButtonElement>(null);

  // stop propagation (tricky I know =))
  useEffect(() => {
    if (flyToMeButton.current) {
      L.DomEvent.disableClickPropagation(flyToMeButton.current);
    }
  });

  return (
    <div className="leaflet-top leaflet-left mt-20">
      <div className="leaflet-control leaflet-bar bg-white">
        <button
          ref={flyToMeButton}
          className="p-2"
          onClick={(e) => {
            if (map) map.locate({ setView: true, maxZoom: 22 }).setZoom(22);
          }}
        >
          <QuestionMarkCircleIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
