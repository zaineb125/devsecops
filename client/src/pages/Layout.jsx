import { Outlet } from "react-router-dom"
import Header from "../components/Header"

const Layout = () => {
  return (
    <main className="max-w-[1000px] mx-auto p-2">
      <Header />
      <Outlet />
    </main>
  )
}
export default Layout