import * as React from "react";
import Plot from "react-plotly.js";

import "./styles.css";

const population = [1, 43, 54, 34, 234, 5];
type PairOfCoordinates = [number, number];
type CoordinatesMap = PairOfCoordinates[];

const data: CoordinatesMap = [[1, 4], [3, 6], [5, 10], [5, 12], [6, 13]];
// const data: CoordinatesMap = [[1, 2], [3, 5], [5, 10], [9, 21], [12, 25]];

const splitXY = (array: CoordinatesMap) => {
  const x = array.map(coord => coord[0]);
  const y = array.map(coord => coord[1]);
  return { x, y };
};
const Sum = (array: number[]) => {
  return array.reduce((s: number, n: number) => s + n);
};
const Mean = (array: number[]) => {
  return Sum(array) / array.length;
};
const Deviation = (population: number[]) => {
  const mean = Mean(population);
  return population.map(n => n - mean);
};

const SquaredDeviation = (population: number[]) => {
  const deviation = Deviation(population);
  return deviation.map(n => n * n);
};

const DeviationScore = (population: number[]) => {
  const deviation = Deviation(population);
  return Sum(deviation);
};

const SquaredDeviationScore = (population: number[]) => {
  const deviation = SquaredDeviation(population);
  return Sum(deviation);
};

const Variation = (population: number[], sample = false) => {
  const squaredDeviationScore = SquaredDeviationScore(population);
  const length = sample ? population.length - 1 : population.length;
  return squaredDeviationScore / length;
};

const StandardVariation = (population: number[], sample = false) => {
  return Math.sqrt(Variation(population, sample));
};

const Correlation = (data: CoordinatesMap) => {
  const x = Deviation(data.map(coord => coord[0]));
  const y = Deviation(data.map(coord => coord[1]));
  let xy: number[] = [];
  for (let i = 0; i < x.length; i++) {
    xy[i] = x[i] * y[i];
  }

  const xSquareDeviation = SquaredDeviationScore(x);
  const ySquareDeviation = SquaredDeviationScore(y);
  return Sum(xy) / Math.sqrt(xSquareDeviation * ySquareDeviation);
};

const RegressionLine = (data: CoordinatesMap) => {
  const { x, y } = splitXY(data);
  const slope =
    (Correlation(data) * StandardVariation(y)) / StandardVariation(x);
  const intercept = Mean(y) - slope * Mean(x);
  return data.map(coords => slope * coords[0] + intercept);
};
const RegressionLineSumOfSquares = (data: CoordinatesMap) => {
  const estimates = RegressionLine(data);
  const { y } = splitXY(data);
  const ySquareDeviationScore = SquaredDeviationScore(y);
  const explainedSquareDeviationScore = SquaredDeviationScore(estimates);
  let difference: number[] = [];
  for (let i = 0; i < y.length; i++) {
    difference[i] = y[i] - estimates[i];
  }
  const notExplainedSquareDeviationScore = SquaredDeviationScore(difference);
  return `${ySquareDeviationScore} = ${explainedSquareDeviationScore} + ${notExplainedSquareDeviationScore}`;
};

export default function App() {
  const mean = Mean(population);
  console.log(RegressionLineSumOfSquares(data));

  const { x, y } = splitXY(data);
  const trace1 = {
    x: x,
    y: y,
    type: "scatter",
    mode: "lines",
    // mode: "lines+markers",
    marker: { color: "red" }
  };
  const trace10 = {
    x: x,
    y: RegressionLine(data),
    type: "scatter",
    mode: "lines",
    // mode: "lines+markers",
    marker: { color: "black" }
  };
  const trace2 = { type: "bar", y: population };
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <p>Mean: {mean}</p>
      <p>Variation: {Variation(population)}</p>
      <p>Standard Variation: {StandardVariation(population)}</p>
      <Plot
        data={[trace1, trace10]}
        layout={{ width: 320, height: 240, title: "Linear Regression" }}
        config={{ scrollZoom: true }}
      />
      <p>Correlation: {Correlation(data)}</p>
    </div>
  );
}
