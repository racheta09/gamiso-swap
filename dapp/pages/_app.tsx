import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react"

const activeChainId = ChainId.BinanceSmartChainMainnet

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThirdwebProvider activeChain={activeChainId}>
            <Component {...pageProps} />
        </ThirdwebProvider>
    )
}
