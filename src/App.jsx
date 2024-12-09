import Navbar from "./components/Navbar.jsx";
import {APP_NAME} from "./lib/constants.js";
import DustBackground from "./components/DustBackground.jsx";
import SeriesPage from "./components/SeriesPage.jsx";
import HomePage from "./components/HomePage.jsx";

export default function App() {
  return (
    <div className="relative flex flex-col h-screen bg-gray-950 text-white">
      <DustBackground />

      <Navbar />

      <div className="flex flex-col flex-grow z-10">
        {/*
        Each page will go here.
        For now, you can comment/uncomment whichever pages you wish to see
        */}
        <HomePage />
        {/*<SeriesPage />*/}
      </div>

      <footer className="text-center p-4 z-10">
        <p>Copyright © 2024 {APP_NAME}. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
