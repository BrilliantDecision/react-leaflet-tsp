import { Transition } from "@headlessui/react";
import { ChevronDoubleUpIcon } from "@heroicons/react/24/outline";
import L from "leaflet";
import { FC, useEffect, useRef } from "react";

interface Props {
  isShowing?: boolean;
  onClickStart?: () => void;
}

export const CalculateRouteBlock: FC<Props> = ({ isShowing, onClickStart }) => {
  const сalculateRouteButton = useRef<HTMLButtonElement>(null);

  // stop propagation (tricky I know =))
  useEffect(() => {
    if (сalculateRouteButton.current) {
      L.DomEvent.disableClickPropagation(сalculateRouteButton.current);
    }
  });

  return (
    <Transition
      as="div"
      className="leaflet-top leaflet-left mt-20"
      show={isShowing}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="leaflet-control leaflet-bar bg-white">
        <button
          ref={сalculateRouteButton}
          className="p-2"
          onClick={(e) => {
            console.log(e);
            onClickStart?.();
          }}
        >
          <ChevronDoubleUpIcon className="h-5 w-5" />
        </button>
      </div>
    </Transition>
  );
};
