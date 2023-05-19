export interface AlgResponse {
  time: number;
  duration: number;
  path: number[];
}

export interface AlgInput {
  matrix: number[][];
  previousPath?: number[];
}
