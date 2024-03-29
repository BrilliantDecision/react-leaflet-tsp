import { AlgInput, AlgResponse } from "../type";
import { generateRandomNodes, getFitness } from "../utils";

export const doNearestSearch = (data: AlgInput): AlgResponse => {
  const { matrix } = data;
  const time = Date.now();
  let bestPath = generateRandomNodes(matrix[0].length);
  const vertexes = [];

  for (let i = 0; i < bestPath.length; i++) {
    vertexes.push(i);
  }

  for (let i = 0; i < vertexes.length; i++) {
    const path = [vertexes[i]];
    const allowNodes = [...vertexes];
    allowNodes.splice(i, 1);
    let previousVertex = path[0];

    while (allowNodes.length !== 0) {
      const vertexAndDurations: [number, number][] = [];

      for (const allow of allowNodes) {
        vertexAndDurations.push([allow, matrix[previousVertex][allow]]);
      }

      vertexAndDurations.sort((a, b) => a[1] - b[1]);
      path.push(vertexAndDurations[0][0]);
      previousVertex = vertexAndDurations[0][0];
      allowNodes.splice(
        allowNodes.findIndex((v) => v === vertexAndDurations[0][0]),
        1
      );
    }

    if (getFitness(bestPath, matrix) > getFitness(path, matrix)) {
      bestPath = path;
    }
  }

  return {
    time: Date.now() - time,
    duration: Math.ceil(getFitness(bestPath, matrix)),
    path: bestPath,
  };
};
