const randomSolvesNumber = 1000;

export function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function getFitness(nodes: number[], matrix: number[][]) {
  let fitnessValue = 0;

  for (let i = 0; i < nodes.length - 1; i++)
    fitnessValue += matrix[nodes[i]][nodes[i + 1]];

  return (fitnessValue += matrix[nodes[nodes.length - 1]][nodes[0]]);
}

export function annealSwap(currentPath: number[]) {
  const nodesLen = currentPath.length;
  const i = getRndInteger(0, nodesLen);
  const k = getRndInteger(0, nodesLen);

  if (i < k + 1) {
    let newPath = currentPath.slice(0, i);
    newPath = newPath.concat(currentPath.slice(i, k + 1).reverse());
    newPath = newPath.concat(currentPath.slice(k + 1, currentPath.length));
    return newPath;
  } else {
    let newPath = currentPath.slice(0, k);
    newPath = newPath.concat(currentPath.slice(k, i + 1).reverse());
    newPath = newPath.concat(currentPath.slice(i + 1, currentPath.length));
    return newPath;
  }
}

export const setRandomSolve = (matrix: number[][]): [number[], number] => {
  let currentBestPath = generateRandomNodes(matrix[0].length);
  const randomSolves = [];

  for (let i = 0; i < randomSolvesNumber; i++) {
    randomSolves.push(generateRandomNodes(matrix[0].length));
  }

  for (let i = 0; i < randomSolvesNumber; i++) {
    if (
      getFitness(currentBestPath, matrix) > getFitness(randomSolves[i], matrix)
    ) {
      currentBestPath = randomSolves[i];
    }
  }

  return [currentBestPath, getFitness(currentBestPath, matrix)];
};

export const generateRandomNodes = (nodesLen: number) => {
  const nodes = [];

  for (let i = 0; i < nodesLen; i++) {
    nodes.push(i);
  }

  return shuffle(nodes);
};

function shuffle(oldArray: number[]) {
  const newArray: number[] = [];

  for (let i = 0; i < oldArray.length; i++) {
    newArray.push(oldArray[i]);
  }

  let counter = newArray.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    const index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = newArray[counter];
    newArray[counter] = newArray[index];
    newArray[index] = temp;
  }
  return newArray;
}
