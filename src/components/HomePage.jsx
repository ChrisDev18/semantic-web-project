import React, { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const words = ["jeux vidéo", "développeurs de jeux vidéo", "séries de jeux vidéo"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [fade, setFade] = useState(true); // Controls the fade effect

  useEffect(() => {
    const interval = setInterval(() => {
      // Trigger fade-out
      setFade(false);

      // Wait for fade-out to complete before updating the word
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setFade(true); // Trigger fade-in
      }, 400); // The fade-out duration + 100
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col flex-grow justify-center gap-4 p-10 text-2xl font-semibold text-center">
      <p>Rechercher des</p>
      <p className="transition-opacity duration-300 ease-in-out text-3xl"
         style={{
            opacity: fade ? 1 : 0,
          }}>
        {words[currentWordIndex]}
      </p>
    </div>
  );
};
