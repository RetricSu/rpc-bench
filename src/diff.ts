import fs from "fs/promises";
import path from "path";

export interface Benches {
  [method: string]: BenchResult;
}

export interface BenchResult {
  tps: string;
  latency: string;
}

export interface BenchDiff {
  [method: string]: {
    tps: string;
    latency: string;
  };
}

const lastFile = path.resolve(__dirname, "../cache/last");

export const loadLastResult = async () => {
  try {
    const d = await fs.readFile(lastFile, { encoding: "utf8" });
    const data: Benches = JSON.parse(d);
    return data;
  } catch (error) {
    return {};
  }
};

export const writeLastResult = async (data: Benches) => {
  await fs.writeFile(lastFile, JSON.stringify(data), { encoding: "utf8" });
};

export const diff = async (current: Benches) => {
  const last = await loadLastResult();
  const diffRes = await calcDiff(last, current);
  // write to last;
  await writeLastResult(current);
  return diffRes;
};

export const calcDiff = async (oldB: Benches, newB: Benches) => {
  const result: BenchDiff = {};
  const methods = Object.keys(newB);
  for (const m of methods) {
    const originTps = oldB[m] ? +oldB[m].tps : 1;
    const diTps = (+newB[m].tps - originTps) / originTps;

    const originLat = oldB[m] ? +oldB[m].latency : 1;
    const diLat = (+newB[m].latency - originLat) / originLat;
    result[m] = {
      tps: (diTps * 100).toFixed(2),
      latency: (diLat * 100).toFixed(2),
    };
  }
  return result;
};
