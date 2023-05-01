import {
    useContractRead,
    useContract,
    Web3Button,
    useAddress,
} from "@thirdweb-dev/react"
import { Erc20 } from "@thirdweb-dev/sdk"
// import { ThirdwebSDK } from "@thirdweb-dev/sdk"
import millify from "millify"
import { useState } from "react"

interface SwapProps {
    swapContractAddress: string
    rate: string
}
const erc20abi = [
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "_spender",
                type: "address",
            },
            {
                name: "_value",
                type: "uint256",
            },
        ],
        name: "approve",
        outputs: [
            {
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [
            {
                name: "",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "_from",
                type: "address",
            },
            {
                name: "_to",
                type: "address",
            },
            {
                name: "_value",
                type: "uint256",
            },
        ],
        name: "transferFrom",
        outputs: [
            {
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [
            {
                name: "",
                type: "uint8",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                name: "balance",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
            {
                name: "",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                name: "_to",
                type: "address",
            },
            {
                name: "_value",
                type: "uint256",
            },
        ],
        name: "transfer",
        outputs: [
            {
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address",
            },
            {
                name: "_spender",
                type: "address",
            },
        ],
        name: "allowance",
        outputs: [
            {
                name: "",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        payable: true,
        stateMutability: "payable",
        type: "fallback",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                name: "value",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                name: "from",
                type: "address",
            },
            {
                indexed: true,
                name: "to",
                type: "address",
            },
            {
                indexed: false,
                name: "value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
]
export default function Swap({ swapContractAddress, rate }: SwapProps) {
    const address = useAddress()
    const [amount, setAmount] = useState("0")
    const { data: swapContract } = useContract(swapContractAddress)
    const { data: tokenAddress } = useContractRead(swapContract, "token")
    // const sdk = new ThirdwebSDK("binance")
    // const tokenContract  =  await sdk.getContractFromAbi(tokenAddress, erc20Abi)
    const { data: tokenContract } = useContract(tokenAddress, "token")
    const { data: symbol } = useContractRead(tokenContract, "symbol")
    const { data: tokenBalance } = useContractRead(
        tokenContract,
        "balanceOf",
        address
    )
    const { data: tokenAllowance } = useContractRead(
        tokenContract,
        "allowance",
        address,
        swapContractAddress
    )
    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-center text-2xl m-2 p-2">
                Swap Gamiso to USDT
            </h1>
            <div className="flex flex-col justify-center">
                <p className="m-2 p-2">
                    Amount:{" "}
                    {`${millify(
                        (parseInt(amount) * parseInt(rate)) / 100
                    )} USDT `}
                    Balance: {`${tokenBalance / 1e18} ${symbol}`}
                    <br />
                    Enter amount of Gamiso to sell
                </p>
                <input
                    type="text"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="rounded m-2 p-2 text-black"
                />
                <Web3Button
                    contractAddress={tokenAddress}
                    contractAbi={erc20abi}
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
                <Web3Button
                    contractAddress={swapContractAddress}
                    action={(contract) => {
                        contract.call(
                            "swapToBUSD",
                            (parseFloat(amount) * 10 ** 18).toString()
                        )
                    }}
                >
                    Swap to USDT
                </Web3Button>
            </div>
        </div>
    )
}
