import {
    useContractRead,
    useContract,
    Web3Button,
    useAddress,
} from "@thirdweb-dev/react"
import { ThirdwebSDK } from "@thirdweb-dev/sdk"
import millify from "millify"
import { useState } from "react"

interface SwapProps {
    swapContractAddress: string
    rate: string
}

const erc20Abi = [
    {
        inputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_value",
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
                internalType: "address",
                name: "from",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Burn",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_to",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_from",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_to",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    { payable: true, stateMutability: "payable", type: "fallback" },
    {
        constant: false,
        inputs: [],
        name: "acceptOwnership",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            { internalType: "address", name: "_owner", type: "address" },
            { internalType: "address", name: "_spender", type: "address" },
        ],
        name: "allowance",
        outputs: [
            { internalType: "uint256", name: "remaining", type: "uint256" },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { internalType: "address", name: "_spender", type: "address" },
            { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [{ internalType: "address", name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [
            { internalType: "uint256", name: "balance", type: "uint256" },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "newOwner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { internalType: "address", name: "_to", type: "address" },
            { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { internalType: "address", name: "_from", type: "address" },
            { internalType: "address", name: "_to", type: "address" },
            { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "success", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            { internalType: "address", name: "_newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
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
                Swap Gamiso to BUSD
            </h1>
            <div className="flex flex-col justify-center">
                <p className="m-2 p-2">
                    Amount:{" "}
                    {`${millify(
                        (parseInt(amount) * parseInt(rate)) / 100
                    )} BUSD `}
                    Balance: {`${tokenBalance / 1e18} ${symbol}`}
                    Enter amount of Gamiso to sell
                </p>
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
