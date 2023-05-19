import { TSPAlgorithmsArrayEntity } from "./type";

export const TSPAlgorithmsArray: TSPAlgorithmsArrayEntity[] = [
  {
    name: "Алгоритм ближайшего соседа",
    value: "nearest",
    description: "Очень высокая скорость выполнения, низкое качество решений",
  },
  {
    name: "Алгоритм отжига",
    value: "annealing",
    description: "Средняя скорость выполнения, высокое качество решений",
  },
  {
    name: "Гибридный алгоритм",
    value: "hybrid",
    description: "Высокая скорость выполнения, высокое качество решений",
  },
];
