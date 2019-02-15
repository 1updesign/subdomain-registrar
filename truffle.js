require('babel-register');
var PrivateKeyProvider = require("truffle-privatekey-provider");
let privateKey = "01909c8db5de11f0e94572d1fef04f197df5e121810ce279d6c7b839e25d34cc";
let stagingPrivateKey = "bc5b578e0dcb2dbf98dd6e5fe62cb5a28b84a55e15fc112d4ca88e1f62bd7c35";
let productionPrivateKey = "BCE32EA63E75B5E302FF2E2519FCF3F6FE099CCB88CD0E8DCD8DC1CCC56227DB";

module.exports = {
  networks: {
    development: {
      provider: new PrivateKeyProvider(privateKey, "http://localhost:8545"),
      port: 8545,
      network_id: "*"
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
    },
    staging: {
      provider: new PrivateKeyProvider(privateKey, "http://46.101.44.145:8545"),      
      network_id: "6660001"
    },
    testnetDev: {
      provider: new PrivateKeyProvider(stagingPrivateKey, "http://209.97.190.111:8545"),      
      network_id: "6660001"
    }
    ,
    testnetProd: {
      provider: new PrivateKeyProvider(productionPrivateKey, "http://178.128.196.190:8545"),      
      network_id: "6660001"
    }
  }
};
