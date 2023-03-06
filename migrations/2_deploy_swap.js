const SwapContract = artifacts.require("Swap")
const BusdContract = artifacts.require("BUSD")
const ErcContract = artifacts.require("ERC")

module.exports = async function (deployer, network, accounts) {
    deployer.deploy(SwapContract, BusdContract.address, ErcContract.address, accounts[0] )
}
