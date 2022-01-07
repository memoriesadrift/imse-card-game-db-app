import type { NextPage } from 'next'
import Navbar from '../src/components/Navbar'
import { usePopulateDatabase } from '../src/dataLayer/mutations'

const Home: NextPage = () => {
  const populateDatabase = usePopulateDatabase()

  const mutationsAreLoading = populateDatabase.isLoading
  const mutationsHaveError = populateDatabase.isError
  const mutationsSuccessful = populateDatabase.isSuccess

  return (
    <>      
      <Navbar />
      <h1 className="uk-heading-medium uk-text-center">Home</h1>
        <div className='uk-flex uk-flex-center uk-button-group'>
          <button className="uk-button uk-button-large" onClick={async () => await populateDatabase.mutateAsync()}>Populate Database</button>  
          <button className="uk-button uk-button-large" onClick={() => {}}>Migrate SQL to NoSQL</button>  
        </div>
      <p className='uk-flex uk-flex-center'>
      {(() => {
        if (mutationsAreLoading) {
          return 'Loading...'
        }
        if (mutationsHaveError) {
          return 'There was en error executing the request...'
        }
        if (mutationsSuccessful) {
          return 'Successfuly executed your request!'
        }
      })()}
      </p>
    </>
  )
}

export default Home
