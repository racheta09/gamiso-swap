const erc = artifacts.require("ERC")
const busd = artifacts.require("BUSD")

module.exports = function (deployer) {
    deployer.deploy(erc)
    deployer.deploy(busd)
}
