var DummyHashRegistrar = artifacts.require("DummyHashRegistrar");
var TestResolver = artifacts.require("TestResolver");
var ENS = artifacts.require("ENS");
var FIFSRegistrar = artifacts.require("FIFSRegistrar.sol");

var namehash = require('eth-ens-namehash');
var sha3 = require('js-sha3').keccak_256;
var Promise = require('bluebird');

var domainnames = require('../app/js/domains.json');

module.exports = function(deployer, network, accounts) {
  function stage2(ens, dhr) {
    return deployer.deploy(FIFSRegistrar, ens.address, namehash.hash('resolver.eth')).then(function() {
      return FIFSRegistrar.deployed();
    }).then(function(registrar) {

      var events = registrar.allEvents([], function(error, log){
         console.log(error,log.args);
      });

      var events2 = ens.allEvents([], function(error, log){
         console.log(error,log.args);
      });      


      return ens.setSubnodeOwner(namehash.hash('eth'), '0x' + sha3('resolver'), registrar.address, {from: accounts[0]}).then(function() {
        return FIFSRegistrar.deployed().then((fifs)=>{fifs.register('0x'+sha3('test'), '0x972e45b1e7E468466276305aB20E4cB09B1AD0E6', {from: accounts[0]}).then((tx)=>{
          // console.log(tx)
          ens.owner(namehash.hash('test.resolver.eth')).then(console.log)
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


  console.log('test')
  // if (network == "test") {
    return deployer.deploy(ENS).then(function() {
      return ENS.deployed();
    }).then(function(ens) {
      console.log('from: '+accounts[0])
      return deployer.deploy([[DummyHashRegistrar, ens.address], [TestResolver, ens.address]]).then(function() {
        // Set `resolver.eth` to resolve to the test resolver
        return ens.setSubnodeOwner(0, '0x' + sha3('eth'), accounts[0], {from: accounts[0]});
      }).then(function() {
        return ens.setSubnodeOwner(namehash.hash('eth'), '0x' + sha3('resolver'), accounts[0], {from: accounts[0]});
      }).then(function() {
        return TestResolver.deployed();
      }).then(function(resolver) {
        return ens.setResolver(namehash.hash('resolver.eth'), resolver.address, {from: accounts[0]});
      }).then(function() {
        return DummyHashRegistrar.deployed();
      }).then(function(dhr) {
        return ens.setSubnodeOwner(0, '0x' + sha3('eth'), dhr.address, {from: accounts[0]}).then(function() {
          return stage2(ens, dhr);
        });
      });
    });
  // } else {
  //   return ENS.deployed().then(stage2);
  //  }
};
