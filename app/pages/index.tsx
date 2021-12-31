import type { NextPage } from 'next'
import Navbar from '../src/components/Navbar'

const Home: NextPage = () => {
  return (
    <>      
      <Navbar />
      <h1 className="uk-heading-medium uk-text-center">Home</h1>
    </>
  )
}

export default Home
