import logo from '/app_logo.svg'
import {APP_NAME} from "../lib/constants.js";

export default function Navbar() {
  return (
    <nav className={"flex justify-between px-6 py-4 z-10 bg-gradient-to-b from-black"}>

      <span className="flex items-center gap-2">
        <img src={logo} alt={APP_NAME + " logo"} />
        <p className={"font-semibold"}>{APP_NAME}</p>
      </span>
      <input
        type="text"
        placeholder="Recherche..."
        className={"px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}
      />
    </nav>
  )
}