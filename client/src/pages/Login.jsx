import { Link, Navigate } from "react-router-dom"
import LoginImg from "../assets/login.jpg"
import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext";
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false); 
  const {setUserInfo} = useContext(UserContext); 

  async function login(e){
    e.preventDefault();
    const result = await fetch('http://mern-api.westeurope.azurecontainer.io/login',{
      method:'POST',
      body:JSON.stringify({email,password}), 
      headers:{'Content-Type':'application/json'}, 
      credentials: 'include', 
    })
    if(result.ok){
    
      result.json().then((data) => {
        const {token,userInfo}=data;
        Cookies.set('token', token, { expires: 7, path: '/' });
        setUserInfo(userInfo); 
        setRedirect(true); 
      })
    }else{
      alert("Wrong Credentials");
    }
  }

  if(redirect){
    return <Navigate to={'/'} />
  }

  return (
    <div className="flex w-full h-screen items-center">
      <div className="relative hidden md:w-1/2 h-full md:flex md:flex-col">
          <div className="absolute top-[25%] left-[10%] flex flex-col">
            <h2 className="text-3xl font-extrabold my-4 text-amber-500 px-2">Chronicles of the Mind</h2>
            <p className="text-xl font-semibold bg-white rounded-sm px-2">Unleashing Ideas through Blogging</p>
          </div>
          <img 
            src={LoginImg} 
            alt="" 
            className="w-full h-full object-cover"
          />
      </div>

      <div className="md:w-1/2 w-full h-full flex flex-col p-20 justify-between">
        <Link to={'/'}>
          <h2 className="text-xl font-semibold hover:text-amber-500 ">BLOG</h2>
        </Link>

        <div className="w-full flex flex-col max-w-[400px] mx-auto">
          <div className="w-full flex flex-col">
            <h3 className="text-2xl font-semibold mb-5">Login</h3>
            <p className="text-sm mb-2">Welcome Back 👋</p>
          </div>

          <form className="w-full flex flex-col" onSubmit={login}>
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

            <div className="w-full flex items-center mb-8">
              <button className="w-full font-semibold bg-white hover:bg-amber-300 border-2 border-amber-500 rounded-md p-2 text-center mt-8">
                Log in
              </button>
            </div>
          </form>

          <div className="w-full flex items-center justify-between">
            <div className="w-full flex items-center gap-x-1">
              <input type="checkbox" className="w-4 h-4 "/>
              <p>Remenber me</p>
            </div>

            <p className="text-xs font-semibold underline underline-offset-2 whitespace-nowrap cursor-pointer">Forgot Password ?</p>
          </div>
        </div>

        <Link to="/signup">
          <div className="w-full flex items-center justify-center">
            <p className="text-sm text-zinc-500">Don t have an account ? <span className="font-semibold underline underline-offset-2 cursor-pointer">Sign up for free from here</span></p>
          </div>
        </Link>

      </div>
    </div>
  )
}
export default Login