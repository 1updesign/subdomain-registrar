require('babel-register');
var PrivateKeyProvider = require("truffle-privatekey-provider");
let privateKey = "11326DD444147C6A34A82EB3F428B1F27046FEBD0C54ED5ECB699F71F6F1A713";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    ropsten: {
      host: "139.59.135.220",
      port: 8545,
      network_id: 3 // official id of the ropsten network
    },
    kovan: {
      provider: new PrivateKeyProvider(privateKey, "https://rinkeby.infura.io/v3/259f29869f834d4fa24dc62f13828f3c"),
      port: 80,
      network_id: 42
    },
    test: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  }
};
