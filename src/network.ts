import { env } from "process";
import dotenv from "dotenv";
import CONFIG from "./config.json";

dotenv.config({ path: "./.env" });

export type Network = "devnet" | "alphanet" | "testnet";

export const getNetworkUrl = () => {
  const network: Network = (env.network as Network) || "devnet";
  return (CONFIG as any)["url"][network] as string;
};
