Simple RPC Bench
==

```sh
$ cat > .env <<EOF
# execute all if methods is null
methods=eth_getBlockByNumber,eth_chainId
network=devnet
```

```sh
yarn && yarn start
```
