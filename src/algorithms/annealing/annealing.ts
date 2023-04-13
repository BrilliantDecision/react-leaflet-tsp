import {
  annealSwap,
  getFitness,
  getRndInteger,
  setRandomSolve,
} from "../utils";
import { AnnealingOptions, AnnealingResponse } from "./type";

export const doAnnealing = (
  values: AnnealingOptions,
  matrix: number[][]
): AnnealingResponse => {
  const { it, itPerTemp, tMax } = values;

  let [currentBestPath, currentBestLength] = setRandomSolve(matrix);
  let [challengerPath, challengerLength] = [
    [...currentBestPath],
    currentBestLength,
  ];
  let currentTemp = tMax;

  const time = Date.now();

  for (let i = 1; i <= it; i++) {
    for (let j = 1; j <= itPerTemp; j++) {
      challengerPath = annealSwap(challengerPath);
      challengerLength = getFitness(challengerPath, matrix);

      if (challengerLength < currentBestLength) {
        currentBestPath = challengerPath;
        currentBestLength = challengerLength;
      } else {
        const bound =
          100.0 *
          Math.exp(-(challengerLength - currentBestLength) / currentTemp);

        if (getRndInteger(1, 1001) / 10.0 < bound) {
          currentBestPath = challengerPath;
          currentBestLength = challengerLength;
        } else {
          challengerPath = currentBestPath;
        }
      }
    }
    currentTemp = tMax / i;
  }

  return {
    time: Date.now() - time,
    len: Math.ceil(currentBestLength),
    path: currentBestPath,
  };
};
