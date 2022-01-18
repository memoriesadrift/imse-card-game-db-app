import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import UIKit from '../src/components/Uikit'
import '../node_modules/uikit/dist/css/uikit.css'
import '../styles/globals.css'

// This is used by Next to render pages
function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()
  
  return (
      <UIKit>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
        <footer>
            <hr></hr>
            <div className="uk-width-1-1 uk-text-center" uk-grid="">
                <div className="uk-card-body uk-width-1-2">
                <p className="uk-text-break">App created by Samuel Šulovský and Michal Robert Žák for the IMSE course in WS2021/22.</p>
                </div>
                <div className="uk-card-body uk-width-1-2">
                <span className="text-tiny uk-text-break">Card game and card type data provided by the wonderful <a href="https://www.pagat.com" >John McLeod of pagat.com</a></span>
                </div>
            </div>
        </footer>
      </UIKit>
  )
}

export default MyApp
