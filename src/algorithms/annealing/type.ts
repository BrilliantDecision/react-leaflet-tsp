export interface AnnealingOptions {
  it: number;
  itPerTemp: number;
  tMax: number;
}

export interface AnnealingResponse {
  time: number;
  len: number;
  path: number[];
}
