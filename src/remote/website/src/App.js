import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./output.css"; // Local CSS file for styling

const generateAESCode = () => {
  const hexChars = "0123456789ABCDEF";
  return Array.from({ length: 32 }, () => hexChars[Math.floor(Math.random() * hexChars.length)]).join('');
};

const getRandomColdColor = () => {
  const coldColors = [
    "#00FFFF", "#008B8B", "#1E90FF", "#4169E1", "#5F9EA0", "#4682B4", "#6495ED", "#00CED1"
  ];
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
          x: Math.random() * (window.innerWidth - 100), // Prevent off-screen overflow
          y: Math.random() * (window.innerHeight - 200),
          color: getRandomColdColor(),
        },
      ]);
      
      setCodes((prev) => prev.filter(code => Date.now() - code.id < 5000)); // Remove old codes
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-r from-gray-900 to-black overflow-hidden text-white font-sans">
      {/* Header */}
      <div className="w-full flex flex-col items-center text-center p-6 bg-transparent z-10">
        <h1 className="text-4xl font-bold tracking-wide text-white font-mono uppercase">
          Secure Your Data with TRNG Encryption
        </h1>
        <button className="mt-4 px-6 py-2 text-lg bg-cyan-500 hover:bg-cyan-600 rounded-lg shadow-lg transition-all transform hover:scale-105">
          Watch Video
        </button>
      </div>
      
      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center mt-24 p-6 min-h-screen">
        <div className="bg-black bg-opacity-60 p-8 rounded-lg max-w-3xl font-mono shadow-lg backdrop-blur-md border border-cyan-500">
          <img src="./Image/logo512.png" alt="Embeddedgods IoT Security Logo" className="w-32 h-32 mb-4 opacity-90 mx-auto" />
          <p className="text-xl text-gray-300 leading-relaxed">
            Our cutting-edge IoT solution harnesses real-time temperature data from a Raspberry Pi to generate
            truly randomized AES encryption keys, enhancing data security with unpredictable cryptographic randomness.
          </p>
        </div>
      </div>
      
      {/* Floating AES Codes */}
      <AnimatePresence>
        {codes.map(({ id, text, x, y, color }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.8, filter: "blur(5px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(5px)" }}
            transition={{ duration: 2 }}
            className="absolute font-mono text-sm md:text-lg font-semibold z-10"
            style={{ left: x, top: y, color: color }}
          >
            {text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Scrollable Sections */}
      <div className="w-full bg-black bg-opacity-80 py-20 text-center text-white min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-cyan-400">How It Works</h2>
        <p className="max-w-2xl text-lg mt-4 text-gray-300 leading-relaxed">
          Using real-time sensor data, our system generates encryption keys dynamically to ensure maximum security.
          Learn more about our cutting-edge cryptographic techniques.
        </p>
      </div>
      <div className="w-full bg-gray-900 py-20 text-center text-white min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-cyan-400">Get Started</h2>
        <p className="max-w-2xl text-lg mt-4 text-gray-300 leading-relaxed">
          Implement our technology into your IoT devices today and experience unparalleled security.
        </p>
      </div>
      
      {/* Footer */}
      <footer className="w-full flex flex-col items-center justify-center p-6 bg-black bg-opacity-80 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-cyan-400">Embeddedgods</h2>
        <a href="https://github.com/rrroooyyywang/ICL_ES_CW1_Embeddedgods" 
           target="_blank" 
           rel="noopener noreferrer" 
           className="mt-2 flex items-center gap-2 text-gray-300 hover:text-cyan-300">
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
               alt="GitHub Repository" className="w-6 h-6" />
          View on GitHub
        </a>
      </footer>
    </div>
  );
}
