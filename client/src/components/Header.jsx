import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { BsPencilSquare } from "react-icons/bs"
import { UserContext } from "../context/UserContext"

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext)

  useEffect(() => {
    fetch('https://mern-blog-backend-nu.vercel.app/profile', {
      credentials: 'include',
    }).then(res => {
      res.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);


  function logout() {
    fetch('https://mern-blog-backend-nu.vercel.app/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }


  const email = userInfo?.email;

  return (
    <header className="py-4 flex items-center justify-between">
      <Link to={"/"}>
        <h1 className="text-2xl font-semibold"><span className="text-amber-500">B</span>log</h1>
      </Link>
      <div className="flex gap-x-4 items-center">
        {email && (
          <>
            <Link to="/write" className="flex items-center gap-x-1">
              <button className="flex items-center gap-x-1 border border-zinc-200 hover:border-amber-500 px-4 py-1 rounded">
                <BsPencilSquare />
                <p>Write</p>
              </button>
            </Link>
            <button
              onClick={logout}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1 rounded"
            >
              Log out
            </button>
          </>
        )}
        {!email && (
          <>
            <Link to="/login">
              <button>
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1 rounded"
              >
                Signup
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
