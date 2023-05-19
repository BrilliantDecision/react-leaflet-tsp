import { Transition } from "@headlessui/react";
import { FC } from "react";

interface Props {
  isShowing?: boolean;
  onClickStart?: () => void;
}

export const NavigateModal: FC<Props> = ({ isShowing, onClickStart }) => {
  return (
    <Transition
      as="div"
      className="z-[10000] absolute bg-transparent rounded-xl p-12 bottom-0 w-full backdrop-blur-lg"
      show={isShowing}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <button
        onClick={() => onClickStart?.()}
        className="bg-blue-500 px-5 py-2 rounded-md text-xl text-white border-2 border-white hover:border-gray-300 active:bg-blue-400 transition-colors"
      >
        <p>В путь</p>
      </button>
    </Transition>
  );
};
