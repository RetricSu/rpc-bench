import { runMultiTimes } from "./cannon";
import dotenv from "dotenv";
import { BenchDiff, Benches, diff } from "./diff";
import { Requests } from "./req";

dotenv.config({ path: "./.env" });

const pickMethods: string[] = process.env.methods?.split(",") || [];

const pickTests =
  pickMethods.length > 0
    ? Requests.filter((t) => pickMethods.includes(t.method))
    : Requests;

const output = (b: Benches, di: BenchDiff) => {
  const methods = Object.keys(b);
  for (const m of methods) {
    const diTps = di[m].tps.startsWith("-") ? di[m].tps : "+" + di[m].tps;
    const diLatency = di[m].latency.startsWith("-")
      ? di[m].latency
      : "+" + di[m].latency;
    console.log(
      `${m} => TPS: ${b[m].tps} (${diTps}%), Latency: ${b[m].latency}ms (${diLatency}%)`
    );
  }
};

const run = async () => {
  const result: Benches = {};
  for (const test of pickTests) {
    const res = await runMultiTimes(test.method, test.params);
    result[res.method] = {
      tps: res.tpsStr,
      latency: res.latencyStr,
    };
  }
  const di = await diff(result);
  output(result, di);
};

run();
