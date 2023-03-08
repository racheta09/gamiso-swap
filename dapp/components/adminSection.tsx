import { Web3Button, useContract, useContractRead } from "@thirdweb-dev/react"
import { useState } from "react"
import millify from "millify"

interface AdminSectionProps {
    swapContractAddress: string
}

export default function AdminSection({
    swapContractAddress,
}: AdminSectionProps) {
    const [formData, setFormData] = useState({ fees: "", rate: "", end: "" })
    const { data: swapContract } = useContract(swapContractAddress)
    const { data: busdSold } = useContractRead(swapContract, "busdSold")
    return (
        <div className="flex flex-col justify-center gap-1">
            <h1 className="text-3xl text-center m-2 p-2"> Admin Function</h1>
            <h4 className="text-xl text-center m-2 p-2"> BUSD Sold: { millify(busdSold*10**-18)}</h4>
            <label htmlFor="fees" className="m-2 p-2">
                Fees (20 is 0.20%):
            </label>
            <input
                type="text"
                name="amount"
                value={formData.fees}
                onChange={(e) =>
                    setFormData({ ...formData, fees: e.target.value })
                }
                className="rounded m-2 p-2 text-black"
            />
            <Web3Button
                contractAddress={swapContractAddress}
                action={(contract) => {
                    contract.call("setFees", formData.fees)
                }}
            >
                Set Fees
            </Web3Button>
            <label htmlFor="rate" className="m-2 p-2">
                Rate (in cents):
            </label>
            <input
                type="text"
                name="rate"
                value={formData.rate}
                onChange={(e) =>
                    setFormData({ ...formData, rate: e.target.value })
                }
                className="rounded m-2 p-2 text-black"
            />
            <Web3Button
                contractAddress={swapContractAddress}
                action={(contract) => {
                    contract.call("setRate", formData.rate)
                }}
            >
                Set Rate
            </Web3Button>
            <label htmlFor="end" className="m-2 p-2">
                End Swap:
            </label>
            <select
                name="end"
                value={formData.end}
                onChange={(e) =>
                    setFormData({ ...formData, end: e.target.value })
                }
                className="rounded m-2 p-2 text-black"
            >
                <option>true</option>
                <option>false</option>
            </select>
            <Web3Button
                contractAddress={swapContractAddress}
                action={(contract) => {
                    contract.call("setEnd", formData.end)
                }}
            >
                Set End
            </Web3Button>

            <Web3Button
                contractAddress={swapContractAddress}
                action={(contract) => {
                    contract.call("wihdrawTokens")
                }}
            >
                Withdraw Tokens
            </Web3Button>
        </div>
    )
}
