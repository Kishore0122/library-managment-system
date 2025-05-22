import React from 'react';
import { motion } from 'framer-motion';
import LottiePlayer from 'react-lottie-player';

// Animation variants for elements
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

export const slideInFromLeft = {
  hidden: { x: -60, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const slideInFromRight = {
  hidden: { x: 60, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const slideInFromTop = {
  hidden: { y: -60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const slideInFromBottom = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const staggeredContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Animated form components
export const AnimatedFormContainer = ({ children, className = "" }) => (
  <motion.div
    className={`${className}`}
    variants={fadeIn}
    initial="hidden"
    animate="visible"
  >
    {children}
  </motion.div>
);

export const AnimatedInput = ({ className = "", ...props }) => (
  <motion.input
    className={`appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
    variants={slideInFromBottom}
    whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.2)" }}
    transition={{ type: "spring", stiffness: 400 }}
    {...props}
  />
);

export const AnimatedButton = ({ children, className = "", ...props }) => (
  <motion.button
    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 ${className}`}
    variants={slideInFromBottom}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    {...props}
  >
    {children}
  </motion.button>
);

export const AnimatedFormField = ({ label, children, className = "" }) => (
  <motion.div className={`${className}`} variants={slideInFromBottom}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </motion.div>
);

export const AnimatedLogo = ({ src, alt, className = "" }) => (
  <motion.img
    src={src}
    alt={alt}
    className={`${className}`}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
  />
);

export const AnimatedHeading = ({ children, className = "" }) => (
  <motion.h2
    className={`text-3xl font-extrabold text-gray-900 ${className}`}
    variants={slideInFromTop}
    initial="hidden"
    animate="visible"
  >
    {children}
  </motion.h2>
);

export const AnimatedText = ({ children, className = "" }) => (
  <motion.p
    className={`text-sm text-gray-600 ${className}`}
    variants={slideInFromBottom}
    initial="hidden"
    animate="visible"
  >
    {children}
  </motion.p>
);

// OTP input component
export const AnimatedOtpInput = ({ value, onChange, onKeyDown, onPaste, inputRef, ...props }) => (
  <motion.input
    ref={inputRef}
    type="text"
    maxLength="1"
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    onPaste={onPaste}
    className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    variants={slideInFromBottom}
    whileFocus={{ scale: 1.1, boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.2)" }}
    transition={{ type: "spring", stiffness: 400 }}
    {...props}
  />
);

// Lottie animation component
export const LottieAnimation = ({ animationData, className = "", width = "100%", height = "100%" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <LottiePlayer
      loop
      animationData={animationData}
      play
      style={{ width, height }}
    />
  </motion.div>
);

export const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
); 