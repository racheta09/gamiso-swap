import { useState } from "react"
import {
    useContractWrite,
    useContractRead,
    useContract,
    Web3Button,
} from "@thirdweb-dev/react"

interface EnterLotteryProps {
    ercContractAddress: string
    lotContractAddress: string
    registrationAmount: string,
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

export default function EnterLottery({
    ercContractAddress,
    lotContractAddress,
    registrationAmount,
}: EnterLotteryProps) {
    return (
        <div className="flex flex-col justify-center">
            <h2 className="text-center text-3xl m-2 p-2">Lottery</h2>
            <h3 className="text-center text-xl m-2 p-2">Approve tokens and Enter Lottery</h3>
            <Web3Button
                contractAddress={ercContractAddress}
                contractAbi={erc20Abi}
                action={(contract) =>
                    contract.call(
                        "approve",
                        lotContractAddress,
                        registrationAmount
                    )
                }
            >
                Approve {(parseInt(registrationAmount) * 10 ** -18).toFixed(2)} tokens
            </Web3Button>
            <h2 className="text-center text-xl m-2 p-2">Buy Ticket</h2>
            <Web3Button
                contractAddress={lotContractAddress}
                action={(contract) => contract.call("enterLottery")}
            >
                Enter Lottery
            </Web3Button>
        </div>
    )
}
