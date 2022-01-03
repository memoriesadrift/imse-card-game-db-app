import type { NextPage } from 'next'
import Navbar from '../src/components/Navbar'

const Login: NextPage = () => {
  return (
    <>
      <Navbar />
      <h1 className="uk-heading-medium uk-text-center">Log In</h1>
    </>
  )
}

export default Login
