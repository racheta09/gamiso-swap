import Head from "next/head"
import { useContractRead, useContract, useAddress } from "@thirdweb-dev/react"

import EnterLottery from "@/components/enterLottery"
import ClaimReward from "@/components/swap"
import AdminSection from "@/components/adminSection"
import NavBar from "@/components/navBar"
import Swap from "@/components/swap"

export default function Home() {
    const address = useAddress()
    const busdAddress = "0xea9579a69EbD08217926B364E8c8de513FDf8E23"
    const tokenAddress = "0x7c19bC82119F535Ee18b759aAE81d4b5D95E4d3d"
    const swapContractAddress = "0x6D5d8febeDd57E41BF657dBdC4d3296C550FC6c9"
    const { data: swapContract } = useContract(swapContractAddress)
    const { data: owner } = useContractRead(swapContract, "owner")
    const { data: rate } = useContractRead(swapContract, "rate")
    const { data: ended } = useContractRead(swapContract, "saleEnded")

    return (
        <>
            <Head>
                <title>BUSD Swap</title>
                <meta name="description" content="Binance Smart Chain Swap" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavBar />
            <main className="flex flex-col m-2 p-2 align-middle justify-center">
                <div className="bg-slate-700 m-2 p-2 rounded-xl">
                    <h1 className="text-4xl text-center m-2 p-2">
                        Welcome to The BUSD Swap Dapp
                    </h1>
                    <h4 className="text-xl text-center m-2 p-2">Rate: {rate && rate.toString()} : 1</h4>
                    <Swap
                        swapContractAddress={swapContractAddress}
                        rate={rate}
                    />

                    {owner && owner == address ? (
                        <AdminSection
                            swapContractAddress={swapContractAddress}
                        />
                    ) : (
                        ""
                    )}
                </div>
            </main>
        </>
    )
}
