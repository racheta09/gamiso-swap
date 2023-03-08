import {
    useContractRead,
    useContract,
    Web3Button,
    useAddress,
} from "@thirdweb-dev/react"
import millify from "millify"
import { useState } from "react"

interface SwapProps {
    swapContractAddress: string
    rate: string
}
interface GetWinnerProps {
    i: number
    swapContractAddress: string
}
export default function Swap({ swapContractAddress, rate }: SwapProps) {
    const address = useAddress()
    const [amount, setAmount] = useState("0")
    const { data: swapContract } = useContract(swapContractAddress)
    const { data: tokenAddress } = useContractRead(swapContract, "token")
    const { data: tokenContract } = useContract(tokenAddress)
    const { data: tokenAllowance } = useContractRead(
        tokenContract,
        "allowance",
        address,
        swapContractAddress
    )

    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-center text-2xl m-2 p-2">Swap to BUSD</h1>
            <div className="flex flex-col justify-center">
                <label htmlFor="amount" className="m-2 p-2">
                    Amount: {millify((parseInt(amount) * parseInt(rate)) / 100)}{" "}
                    BUSD
                </label>
                <input
                    type="text"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="rounded m-2 p-2 text-black"
                />
                {tokenAllowance < parseFloat(amount) * 10 ** 18 ? (
                    <Web3Button
                        contractAddress={tokenAddress}
                        action={(contract) => {
                            contract.call(
                                "approve",
                                swapContractAddress,
                                (parseFloat(amount) * 10 ** 18).toString()
                            )
                        }}
                    >
                        Approve Token
                    </Web3Button>
                ) : (
                    <Web3Button
                        contractAddress={swapContractAddress}
                        action={(contract) => {
                            contract.call(
                                "swapToBUSD",
                                (parseFloat(amount) * 10 ** 18).toString()
                            )
                        }}
                    >
                        Swap to BUSD
                    </Web3Button>
                )}
            </div>
        </div>
    )
}

function GetWinner({ i, swapContractAddress }: GetWinnerProps) {
    const { data: lotcontract } = useContract(swapContractAddress)
    const { data: winnerIndex } = useContractRead(
        lotcontract,
        "winnerIndexes",
        i.toString()
    )
    const { data: winner } = useContractRead(
        lotcontract,
        "winnerAddresses",
        winnerIndex
    )
    console.log(winnerIndex, winner)
    return (
        <>
            <div className="text-xl">{winner && winner.toString()}</div>
        </>
    )
}
