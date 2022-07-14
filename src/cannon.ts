import autocannon from "autocannon";
import { getNetworkUrl } from "./network";

export async function cannon(
  url: string,
  method: string = "eth_blockNumber",
  params: any[] = []
) {
  const connections = 100;
  const pipelining = 10;
  const duration = 40;

  //console.log(`conn: ${connections}, pipe: ${pipelining}, duration: ${duration}`);

  const result = await autocannon({
    url,
    connections,
    pipelining,
    duration,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{"jsonrpc":"2.0","id":"[<id>]","method":"${method}","params":${JSON.stringify(
      params
    )}}`,
    idReplacement: true,
  });

  // console.log(
  //   "single execution, tps: ",
  //   result.requests.average,
  //   "latency: ",
  //   result.latency.average
  // );
  // console.log("----------");

  return {
    tps: result.requests.average,
    latency: result.latency.average,
  };
}

export async function runMultiTimes(method: string, params: any[], count = 3) {
  const url = getNetworkUrl();

  // console.log(`Using network: ${url}`);
  // console.log(
  //   `rpc method: ${method}, params: ${JSON.stringify(
  //     params
  //   )}`
  // );

  let tps = 0;
  let latency = 0;
  for (let i = 0; i < count; i++) {
    const res = await cannon(url, method, params);
    tps = tps + res.tps;
    latency = latency + res.latency;
  }

  const tpsStr = (tps / count).toFixed(2);
  const latencyStr = (latency / count).toFixed(2);

  //console.log(`=> RPC: ${method}, TPS: ${tpsStr}, Latency: ${latencyStr} ms`);
  return { method, tpsStr, latencyStr };
}
