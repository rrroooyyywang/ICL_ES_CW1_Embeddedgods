import React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./tailwind-output.css";

const generateAESCode = () => {
  const hexChars = "0123456789ABCDEF";
  let code = "";
  for (let i = 0; i < 32; i++) {
    code += hexChars[Math.floor(Math.random() * hexChars.length)];
  }
  return code;
};

const getRandomColdColor = () => {
  const coldColors = ["#00FFFF", "#008B8B", "#1E90FF", "#4169E1", "#5F9EA0", "#4682B4", "#6495ED", "#00CED1"];
  return coldColors[Math.floor(Math.random() * coldColors.length)];
};

export default function AESBackground() {
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCodes((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: generateAESCode(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          color: getRandomColdColor(),
        },
      ]);
      
      setTimeout(() => {
        setCodes((prev) => prev.slice(1));
      }, 5000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center">
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <h1 className="text-white text-4xl md:text-6xl font-bold text-center z-10">
          Secure your data with TRNG* encryption
        </h1>
        <button className="mt-4 px-6 py-2 bg-transparent backdrop-blur-md text-white text-lg font-semibold rounded-lg shadow-md border border-white hover:bg-white hover:text-black transition">
          Video
        </button>
      </div>
      
      <div className="w-full py-20 flex flex-col md:flex-row items-center justify-center gap-10 px-10">
        <img src="./Image/logo512.png" alt="Description" className="w-full md:w-1/3 rounded-lg shadow-lg" />
        <p className="text-white text-lg md:w-1/2">
          Here you can add some descriptive text about the encryption process, security features, or anything relevant to your project. This section allows for a detailed explanation and visual representation.
        </p>
      </div>

      <AnimatePresence>
        {codes.map(({ id, text, x, y, color }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(5px)" }}
            transition={{ duration: 2 }}
            className="absolute text-xs font-mono"
            style={{ left: x, top: y, color: color }}
          >
            {text}
          </motion.div>
        ))}
      </AnimatePresence>

      <footer className="w-full py-10 flex flex-col items-center text-white">
        <h2 className="text-2xl font-bold">Embeddedgods</h2>
        <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="mt-2">
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" className="w-6 h-6 rounded-full" />
        </a>
      </footer>
    </div>
  );
}