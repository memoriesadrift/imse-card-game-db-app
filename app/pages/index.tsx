import type { NextPage } from 'next'
import { MutationGuard } from '../src/components/Guards'
import Navbar from '../src/components/Navbar'
import { usePopulateDatabase, useMigrateDatabase } from '../src/dataLayer/mutations'

const Home: NextPage = () => {
  const populateDatabase = usePopulateDatabase()
  const migrateDatabase = useMigrateDatabase()

  return (
    <>      
      <Navbar />
      <h1 className="uk-heading-medium uk-text-center">Home</h1>
        <div className='uk-flex uk-flex-center uk-button-group'>
          <button className="uk-button uk-button-large" onClick={async () => await populateDatabase.mutateAsync()}>Populate Database</button>  
          <button className="uk-button uk-button-large" onClick={async () => await migrateDatabase.mutateAsync()}>Migrate SQL to NoSQL</button>  
        </div>
      <MutationGuard {...populateDatabase} />
      <MutationGuard {...migrateDatabase} />
    </>
  )
}

export default Home
