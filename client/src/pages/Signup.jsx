import { Link } from "react-router-dom"
import SignupImg from "../assets/signup.jpg"
import { useState } from "react"

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function signup(e){
    e.preventDefault();
    const result = await fetch('http://localhost:5000/signup',{
      method: 'POST',
      body: JSON.stringify({username,email,password}),
      headers: {'Content-Type' : 'application/json'},
    });
    if(result.status === 200){
      alert('Sign up successfull')
    }else{
      alert('Sign up failed')
    }
  }

  return (
    <div className="md:flex w-full h-screen items-start">
      <div className="md:w-1/2 h-full flex flex-col p-20 justify-between">
        <Link to={'/'}>
          <h2 className="text-xl font-semibold hover:text-amber-500">BLOG</h2>
        </Link>

        <div className="w-full flex flex-col max-w-[400px] mx-auto">
          <div className="w-full flex flex-col">
            <h3 className="text-2xl font-semibold mb-5">Create your account</h3>
            <p className="text-sm mb-2">Let's get started for free !</p>
          </div>

          <form className="w-full flex flex-col" onSubmit={signup}>
            <input 
              type="text"
              placeholder="username"
              className="w-full bg-transparent border-b border-black outline-none focus:outline-none py-2 my-4"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input 
              type="email"
              placeholder="email@example.com"
              className="w-full bg-transparent border-b border-black outline-none focus:outline-none py-2 my-4"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input 
              type="password"
              placeholder="enter your password"
              className="w-full bg-transparent border-b border-black outline-none focus:outline-none py-2 my-4"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />


            <div className="w-full flex items-center">
              <button className="w-full font-semibold bg-white hover:bg-amber-300 border-2 border-amber-500 rounded-md p-2 text-center mt-8">
                Sign up
              </button>
            </div>
          </form>
        </div>

        <Link to="/login">
          <div className="w-full flex items-center justify-center">
            <p className="text-sm text-zinc-500">Already have an account ? <span className="font-semibold underline underline-offset-2 cursor-pointer">Log in from here</span></p>
          </div>
        </Link>

      </div>

      <div className="hidden md:w-1/2 h-full md:flex md:flex-col">
          <img 
            src={SignupImg} 
            alt="" 
            className="w-full h-full object-cover"
          />
      </div>

  </div>
  )
}
export default Signup