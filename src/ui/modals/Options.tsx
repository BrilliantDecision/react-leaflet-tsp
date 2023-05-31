import { Dialog, RadioGroup, Transition } from "@headlessui/react";
import { Dispatch, FC, Fragment, SetStateAction } from "react";
import { TSPAlgorithm } from "../../App";
import { TSPAlgorithmsArray } from "../../utils/static/algorithms";
import { CheckIcon, WrenchIcon } from "@heroicons/react/24/outline";

interface Props {
  algorithm: TSPAlgorithm;
  setAlgorithm: (value: TSPAlgorithm) => void;
  isShowing?: boolean;
  setIsShowing: Dispatch<SetStateAction<boolean>>;
}

export const Options: FC<Props> = ({
  algorithm,
  setAlgorithm,
  isShowing,
  setIsShowing,
}) => {
  return (
    <>
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control leaflet-bar bg-white">
          <button
            className="p-2"
            onClick={() => setIsShowing((prevState) => !prevState)}
          >
            <WrenchIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <Transition appear show={isShowing} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[9999999999999999]"
          onClose={() => setIsShowing(() => false)}
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
                    Выберите алгоритм расчета маршрута
                  </Dialog.Title>
                  <div className="mt-2">
                    <RadioGroup value={algorithm} onChange={setAlgorithm}>
                      <RadioGroup.Label className="sr-only">
                        Algorithm type
                      </RadioGroup.Label>
                      <div className="space-y-2">
                        {TSPAlgorithmsArray.map((algorithm) => (
                          <RadioGroup.Option
                            key={algorithm.name}
                            value={algorithm.value}
                            className={({ active, checked }) =>
                              `${
                                active
                                  ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                                  : ""
                              } ${
                                checked
                                  ? "bg-sky-900 bg-opacity-75 text-white"
                                  : "bg-white"
                              } relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                            }
                          >
                            {({ active, checked }) => (
                              <>
                                <div className="flex w-full items-center justify-between">
                                  <div className="flex items-center">
                                    <div className="text-sm">
                                      <RadioGroup.Label
                                        as="p"
                                        className={`font-medium  ${
                                          checked
                                            ? "text-white"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {algorithm.name}
                                      </RadioGroup.Label>
                                      <RadioGroup.Description
                                        as="span"
                                        className={`inline ${
                                          checked
                                            ? "text-sky-100"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        <span>{algorithm.description}</span>{" "}
                                        <span aria-hidden="true">&middot;</span>
                                      </RadioGroup.Description>
                                    </div>
                                  </div>
                                  {checked && (
                                    <div className="shrink-0 text-white">
                                      <CheckIcon className="h-6 w-6" />
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
