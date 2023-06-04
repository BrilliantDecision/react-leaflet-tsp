import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment } from "react";

interface Props {
  show: boolean;
  onClose: () => void;
  info?: Info;
}

export interface Info {
  time?: number;
  oldDistance?: number;
  newDistance?: number;
  oldDuration?: number;
  newDuration?: number;
}

export const ComputedRouteInfo: FC<Props> = ({ show, onClose, info }) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[9999999999999999]"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Маршрут успешно построен
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {`Затраченное время: ${info?.time} мс.`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {`Длина исходного пути: ${info?.oldDistance} км.`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {`Длина найденного пути: ${info?.newDistance} км.`}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Понятно, спасибо!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
