import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./output.css"; // Changed to a local CSS file to avoid external dependency issues

const generateAESCode = () => {
  const hexChars = "0123456789ABCDEF";
  let code = "";
  for (let i = 0; i < 32; i++) {
    code += hexChars[Math.floor(Math.random() * hexChars.length)];
  }
  return code;
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
          x: Math.random() * window.innerWidth,
          y: Math.random() * (window.innerHeight - 150), // Prevent overlapping with content section
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
    <div className="relative w-full h-screen bg-gradient-to-r from-gray-900 to-black overflow-hidden text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between p-6 bg-black bg-opacity-50 z-10">
        <h1 className="text-3xl font-bold tracking-wide text-cyan-300 font-mono">
        Secure your data with trng* encryption
        </h1>
        <button className="px-6 py-2 text-lg bg-cyan-500 hover:bg-cyan-600 rounded-lg shadow-lg transition-all">
          Watch Video
        </button>
      </div>
      
      {/* Content Section */}
      <div className="relative z-20 flex flex-col items-end justify-center text-right mt-24 p-6">
        <div className="bg-black bg-opacity-50 p-6 rounded-lg max-w-2xl font-mono">
          <img src="./Image/logo512.png" alt="Logo" className="w-24 h-24 mb-4 opacity-90" />
          <p className="text-lg text-gray-300 leading-relaxed">
            Our cutting-edge IoT solution harnesses real-time temperature data from a Raspberry Pi to generate
            real randomised data for unique AES encryption keys enhancing data security with unpredictable cryptographic randomness.
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
      
      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center p-4 bg-black bg-opacity-50">
        <h2 className="text-xl font-semibold text-cyan-400">Embeddedgods</h2>
        <a href="https://github.com/rrroooyyywang/ICL_ES_CW1_Embeddedgods" 
           target="_blank" 
           rel="noopener noreferrer" 
           className="mt-2 flex items-center gap-2 text-gray-300 hover:text-cyan-300">
          <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
               alt="GitHub" className="w-6 h-6" />
          View on GitHub
        </a>
      </footer>
    </div>
  );
}
