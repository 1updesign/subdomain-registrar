var DummyHashRegistrar = artifacts.require("DummyHashRegistrar");
var PublicResolver = artifacts.require("PublicResolver");
var ENS = artifacts.require("ENS");
var FIFSRegistrar = artifacts.require("FIFSRegistrar.sol");

var namehash = require('eth-ens-namehash');
var sha3 = require('js-sha3').keccak_256;
var Promise = require('bluebird');

var domainnames = require('../app/js/domains.json');

module.exports = function(deployer, network, accounts) {
  function stage2(ens, dhr) {
    return deployer.deploy(FIFSRegistrar, ens.address, namehash.hash('datafund.eth')).then(function() {
      return FIFSRegistrar.deployed();
    }).then(function(registrar) {
      registrarAddr = registrar.address;
      var events = registrar.allEvents([], function(error, log){
         console.log(error,log.args);
      });

      var events2 = ens.allEvents([], function(error, log){
         console.log(error,log.args);
      });

      return ens.setOwner(namehash.hash('datafund.eth'), registrar.address, {from: accounts[0]}).then(function() {
        return FIFSRegistrar.deployed().then((fifs)=>{fifs.register('0x'+sha3('test'), '0x627306090abab3a6e1400e9345bc60c78a8bef57', {from: accounts[0]}).then((tx)=>{
      //     console.log(tx)
          ens.owner(namehash.hash('test.datafund.eth')).then(console.log)
        })})
      });



      // if(dhr != undefined) {
      //   // Configuration of test domains
      //   return Promise.map(domainnames, async function(domain) {
      //     if(domain.registrar !== undefined) return;
      //     await dhr.setSubnodeOwner('0x' + sha3(domain.name), accounts[0]);
      //     await dhr.transfer('0x' + sha3(domain.name), registrar.address);
      //     // await registrar.configureDomain(domain.name, 1e16, 100000);
      //   });
      // }
    });
  }


  let ensAddr = null;
  let resolverAddr = null;
  let registrarAddr = null;

  // if (network == "test") {
    return deployer.deploy(ENS).then(function() {
      return ENS.deployed();
    }).then(function(ens) {
      ensAddr = ens.address;
      console.log('from: '+accounts[0])
      return deployer.deploy([[DummyHashRegistrar, ens.address], [PublicResolver, ens.address]]).then(function() {
        // Set `datafund.eth` to resolve to the test resolver
        return ens.setSubnodeOwner(0, '0x' + sha3('eth'), accounts[0], {from: accounts[0]});
      }).then(function() {
        return ens.setSubnodeOwner(namehash.hash('eth'), '0x' + sha3('resolver'), accounts[0], {from: accounts[0]});
      }).then(function() {
        return PublicResolver.deployed();
      }).then(function(resolver) {
        resolverAddr = resolver.address;
        return ens.setResolver(namehash.hash('datafund.eth'), resolver.address, {from: accounts[0]});
      }).then(function() {
        return DummyHashRegistrar.deployed();
      }).then(function(dhr) {
        return ens.setSubnodeOwner(0, '0x' + sha3('eth'), dhr.address, {from: accounts[0]}).then(function() {
          return stage2(ens, dhr).then(()=>{
          console.log(`
REACT_APP_ENS_ADDRESS=${ensAddr}
REACT_APP_FIFS_REGISTRAR_ADDRESS=${registrarAddr}
REACT_APP_RESOLVER_ADDRESS=${resolverAddr}
            `)
          });
        });
      });
    });
  // } else {
  //   return ENS.deployed().then(stage2);
  //  }
};
