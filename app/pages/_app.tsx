import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import UIKit from '../src/components/Uikit'
import '../../node_modules/uikit/dist/css/uikit.css'
import '../styles/globals.css'

// This is used by Next to render pages
function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()
  
  return (
      <UIKit>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </UIKit>
  )
}

export default MyApp
