const SwapContract = artifacts.require("Swap")
const ERCContract = artifacts.require("ERC")
const BUSDContract = artifacts.require("BUSD")

contract("SwapContract", (accounts) => {
    it("should approve tokens for swap", async () => {
        const ercInstance = await ERCContract.deployed()
        const busdInstance = await BUSDContract.deployed()
        await busdInstance.approve(SwapContract.address, "1000000", {
            from: accounts[0],
        })
        await ercInstance.transfer(accounts[1], "10000")
        await ercInstance.approve(SwapContract.address, "10000", {
            from: accounts[1],
        })
        const approved = await busdInstance.allowance(
            accounts[0],
            SwapContract.address
        )
        assert.equal(approved, "1000000", "allowance not met")
    })
    it("should swap tokens", async () => {
        const swapInstance = await SwapContract.deployed()
        const busdInstance = await BUSDContract.deployed()
        const ercInstance = await ERCContract.deployed()
        await swapInstance.swapToBUSD("10000", {
            from: accounts[1],
        })
        const busdBalance = await busdInstance.balanceOf(accounts[1])
        const ercBalance = await ercInstance.balanceOf(accounts[1])
        const busdAllowance = await busdInstance.allowance(
            accounts[0],
            SwapContract.address
        )
        const contractErcBalance = await ercInstance.balanceOf(SwapContract.address)
        assert.equal(busdBalance, "998", "busd not equal")
        assert.equal(ercBalance, "0", "erc not equal")
        assert.equal(busdAllowance, "999002", "busd allowance not equal")
        assert.equal(contractErcBalance, "10000", "contract balance not equal")
    })
})
