const DecentralizedAuction = artifacts.require("DecentralizedAuction");

module.exports = function (deployer) {
  deployer.deploy(DecentralizedAuction);
};
