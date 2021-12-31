import type { NextPage } from 'next'
import Navbar from '../../src/components/Navbar'

const AddGame: NextPage = () => {
  return (
    <>
      <Navbar />
      <h1 className="uk-heading-medium uk-text-center">Add Game</h1>
    </>
  )
}

export default AddGame
