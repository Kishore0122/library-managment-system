import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  AnimatedFormContainer, 
  AnimatedInput, 
  AnimatedButton, 
  AnimatedFormField, 
  AnimatedLogo, 
  AnimatedHeading, 
  AnimatedText,
  fadeIn,
  slideInFromLeft,
  slideInFromRight,
  staggeredContainer
} from "../components/AnimatedComponents";
import LottiePlayer from "react-lottie-player";
import forgotPasswordAnimation from "../assets/animations/forgotPasswordAnimation";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const dispatch = useDispatch();
  const { Loading, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
      setSent(true);
    }
  }, [error, message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <motion.div 
      className="flex min-h-screen bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
        variants={slideInFromLeft}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <AnimatedLogo className="h-12 w-auto" src={logo} alt="Library Logo" />
            <AnimatedHeading className="mt-6">Forgot Password</AnimatedHeading>
            <AnimatedText className="mt-2">
              Enter your email and we'll send you a password reset link
            </AnimatedText>
          </div>

          <AnimatedFormContainer className="mt-8">
            {sent ? (
              <motion.div 
                className="rounded-md bg-green-50 p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <motion.svg 
                      className="h-5 w-5 text-green-400" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 360] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </motion.svg>
                  </div>
                  <div className="ml-3">
                    <motion.h3 
                      className="text-sm font-medium text-green-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      Email sent successfully
                    </motion.h3>
                    <motion.div 
                      className="mt-2 text-sm text-green-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <p>Please check your email for instructions to reset your password.</p>
                    </motion.div>
                    <motion.div 
                      className="mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <Link 
                        to="/login" 
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all duration-300"
                      >
                        Return to login
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="mt-6"
                variants={staggeredContainer}
                initial="hidden"
                animate="visible"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <AnimatedFormField label="Email address">
                    <AnimatedInput
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </AnimatedFormField>

                  <div>
                    <AnimatedButton
                      type="submit"
                      disabled={Loading}
                    >
                      {Loading ? "Sending..." : "Send Reset Link"}
                    </AnimatedButton>
                  </div>

                  <motion.div 
                    className="text-sm text-center"
                    variants={fadeIn}
                  >
                    <Link 
                      to="/login" 
                      className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all duration-300"
                    >
                      Back to Login
                    </Link>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatedFormContainer>
        </div>
      </motion.div>
      <motion.div 
        className="hidden lg:block relative w-0 flex-1"
        variants={slideInFromRight}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 h-full w-full object-cover bg-indigo-700 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <LottiePlayer
              loop
              animationData={forgotPasswordAnimation}
              play
              style={{ width: 300, height: 300 }}
            />
            <motion.img 
              src={logo_with_title} 
              alt="Library Management" 
              className="max-w-md mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
