import Head from "next/head"
import { useContractRead, useContract, useAddress } from "@thirdweb-dev/react"

import AdminSection from "@/components/adminSection"
import NavBar from "@/components/navBar"
import Swap from "@/components/swap"

export default function Home() {
    const address = useAddress()
    const busdAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
    const swapContractAddress = "0xE66865eece8c92cedbb62f381Cb0a88486069B52"
    const { data: swapContract } = useContract(swapContractAddress)
    const { data: owner } = useContractRead(swapContract, "owner")
    const { data: rate } = useContractRead(swapContract, "rate")
    const { data: ended } = useContractRead(swapContract, "saleEnded")

    return (
        <>
            <Head>
                <title>Gamiso Swap</title>
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
                        Welcome to The Gamiso Swap Dapp
                    </h1>
                    <h4 className="text-xl text-center m-2 p-2">
                        Rate: ${rate && rate/100}
                    </h4>
                    {ended ? (
                        <h2 className="text2xl text-center m-2 p-2">
                            Swap Ended
                        </h2>
                    ) : (
                        <Swap
                            swapContractAddress={swapContractAddress}
                            rate={rate}
                        />
                    )}

                    {owner && owner == address ? (
                        <AdminSection
                            swapContractAddress={swapContractAddress}
                            busdContractAddress={busdAddress}
                        />
                    ) : (
                        ""
                    )}
                </div>
            </main>
        </>
    )
}
