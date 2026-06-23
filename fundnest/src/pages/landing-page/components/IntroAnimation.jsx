import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const IntroAnimation = ({ onComplete }) => {
  useEffect(() => {
    // Hide intro after 3.8 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090D21] overflow-hidden select-none"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.05,
        transition: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }
      }}
    >
      <div className="relative flex flex-col items-center space-y-6 max-w-lg text-center px-4">
        {/* Glow behind the logo */}
        <motion.div 
          className="absolute w-64 h-64 bg-[#00C2CB]/10 rounded-full blur-3xl -z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.8, 0.4] }}
          transition={{ duration: 2, times: [0, 0.5, 1], ease: "easeInOut" }}
        />

        {/* Logo Container */}
        <motion.div
          className="w-24 h-24 bg-gradient-to-br from-[#0f1533] via-[#0F4B8F] to-[#00C2CB] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(0,194,203,0.3)]"
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ 
            scale: [0, 1.15, 1], 
            rotate: [0, 15, 0], 
            opacity: 1 
          }}
          transition={{ 
            duration: 1.2, 
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.2 
          }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <Icon name="TrendingUp" size={48} color="white" strokeWidth={3} />
          </motion.div>
        </motion.div>

        {/* Name */}
        <div className="overflow-hidden py-2">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-[#00C2CB] bg-clip-text text-transparent font-sans tracking-wider"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 1.0 
            }}
          >
            FundNest
          </motion.h1>
        </div>

        {/* Tagline */}
        <div className="overflow-hidden py-1">
          <motion.p
            className="text-lg md:text-xl text-zinc-400 font-medium tracking-wide"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              delay: 1.7 
            }}
          >
            Nest Your Dreams, Fund Your Future
          </motion.p>
        </div>

        {/* Dynamic Line Animation */}
        <div className="w-48 overflow-hidden rounded-full mt-4 bg-zinc-800 h-1">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#0F4B8F] to-[#00C2CB] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.0, delay: 2.2, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default IntroAnimation;
