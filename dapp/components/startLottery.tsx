import { useState } from "react"
import {
    useContractWrite,
    useContractRead,
    useContract,
    Web3Button,
} from "@thirdweb-dev/react"
interface StartLotteryProps{
    lotContractAddress: string
}
export default function StartLottery({lotContractAddress}: StartLotteryProps) {
    const [lotteryRules, setLotteryRules] = useState({
        numOfWinners: "",
        playersLimit: "",
        registrationAmount: "",
        adminFee: "",
        tokenAddress: "",
    })

    const inputHandler = (e: any, values: any) => {
        setLotteryRules({ ...lotteryRules, [values]: e.target.value })
    }
    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-center text-2xl m-2 p-2">Start Lottery</h1>

            <div className="flex flex-col justify-center">
                <label htmlFor="numOfWinners" className="m-2 p-2">
                    Number of Winners:
                </label>
                <input
                    type="text"
                    name="numOfWinners"
                    onChange={(e) => inputHandler(e, "numOfWinners")}
                    value={lotteryRules.numOfWinners}
                    className="rounded m-2 p-2 text-black"
                />
                <label htmlFor="playersLimit" className="m-2 p-2">
                    Players Limit:
                </label>
                <input
                    type="text"
                    name="playersLimit"
                    onChange={(e) => inputHandler(e, "playersLimit")}
                    value={lotteryRules.playersLimit}
                    className="rounded m-2 p-2 text-black"
                />
                <label htmlFor="registrationAmount" className="m-2 p-2">
                    Registration Amount:
                </label>
                <input
                    type="text"
                    name="registrationAmount"
                    onChange={(e) => inputHandler(e, "registrationAmount")}
                    value={lotteryRules.registrationAmount}
                    className="rounded m-2 p-2 text-black"
                />
                <label htmlFor="adminFee" className="m-2 p-2">
                    Admin Fee Percentage:
                </label>
                <input
                    type="text"
                    name="adminFee"
                    onChange={(e) => inputHandler(e, "adminFee")}
                    value={lotteryRules.adminFee}
                    className="rounded m-2 p-2 text-black"
                />
                <label htmlFor="tokenAddress" className="m-2 p-2">
                    Token Address:
                </label>
                <input
                    type="text"
                    name="tokenAddress"
                    onChange={(e) => inputHandler(e, "tokenAddress")}
                    value={lotteryRules.tokenAddress}
                    className="rounded m-2 p-2 text-black"
                />
                <Web3Button
                    contractAddress={lotContractAddress}
                    action={(contract) =>
                        contract.call(
                            "setLotteryRules",
                            lotteryRules.numOfWinners,
                            lotteryRules.playersLimit,
                            lotteryRules.registrationAmount,
                            lotteryRules.adminFee,
                            lotteryRules.tokenAddress
                        )
                    }
                >
                    Start Lottery
                </Web3Button>
            </div>
        </div>
    )
}
