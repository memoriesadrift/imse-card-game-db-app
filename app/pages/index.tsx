import type { NextPage } from 'next'
import Navbar from '../src/components/Navbar'

const Home: NextPage = () => {
  return (
    <>      
      <Navbar />
      <h1 className="uk-heading-medium uk-text-center">Home</h1>
        <div className='uk-flex uk-flex-center uk-button-group'>
          <button className="uk-button uk-button-large" onClick={() => {}}>Populate Database</button>  
          <button className="uk-button uk-button-large" onClick={() => {}}>Migrate SQL to NoSQL</button>  
        </div>
    </>
  )
}

export default Home
