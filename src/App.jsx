import Navbar from "./components/Navbar.jsx";
import { APP_NAME } from "./lib/constants.js";
import DustBackground from "./components/DustBackground.jsx";
import HomePage from "./components/HomePage.jsx";
import { Link, Route, Routes } from "react-router-dom";
import VideoGame from "./components/VideoGame.jsx";
import Series from "./components/Series.jsx";
import GameCompany from "./components/GameCompany.jsx";
import Person from "./components/Person.jsx";
import NotFound from "./components/NotFound.jsx";
import React from "react";
import {SkeletonTheme} from "react-loading-skeleton";

export default function App() {
    const gameData = {
        url: "http://dbpedia.org/resource/The_Legend_of_Zelda",  // DBpedia resource URI
        name: "Super Mario 64 DS",
    };

    return (
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <div className="relative flex flex-col h-screen bg-gray-950 text-white">
            <DustBackground />
            <Navbar />

            <div className="flex flex-col flex-grow z-10">
                {/* Simple Links for navigation */}
                <div className="text-center mt-4">
                    <Link to="/videoGame/Super Mario 64 DS" className="text-blue-500 hover:text-blue-700">Go to VideoGame Page</Link>
                    <br />
                    <Link to="/series/Super Mario" className="text-blue-500 hover:text-blue-700">Go to Series Page</Link>
                </div>

                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/videoGame/:id" element={<VideoGame />} />
                    <Route path="/series/:id" element={<Series />} />
                    <Route path="/gameCompany/:id" element={<GameCompany />} />
                    <Route path="/person/:id" element={<Person />} />
                    <Route path="*" element={<NotFound />} /> {/* 404 */}
                </Routes>
            </div>

            <footer className="text-center p-4 z-10">
                <p>Copyright © 2024 {APP_NAME}. Tous droits réservés.</p>
            </footer>
        </div>
        </SkeletonTheme>
    );
}
