import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { login } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetAllPopups } from "../store/slices/popUpSlice";
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
import loginAnimation from "../assets/animations/loginAnimation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { Loading, error, message, authenticated } = useSelector((state) => state.auth);

  // Clean up any lingering modals or auth state on component mount
  useEffect(() => {
    // Clear any modals
    dispatch(resetAllPopups());
    
    // Force body styles to normal in case any modal styles persisted
    document.body.style.overflow = 'auto';
    document.body.classList.remove('modal-open');
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
    }
  }, [error, message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  if (authenticated) {
    return <Navigate to="/" />;
  }

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
            <AnimatedHeading className="mt-6">Sign in to your account</AnimatedHeading>
            <AnimatedText className="mt-2">
              Or{" "}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all duration-300">
                create a new account
              </Link>
            </AnimatedText>
          </div>

          <AnimatedFormContainer className="mt-8">
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

                <AnimatedFormField label="Password">
                  <AnimatedInput
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </AnimatedFormField>

                <motion.div 
                  className="flex items-center justify-between"
                  variants={fadeIn}
                >
                  <motion.div 
                    className="text-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Link 
                      to="/password/forgot" 
                      className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all duration-300"
                    >
                      Forgot your password?
                    </Link>
                  </motion.div>
                </motion.div>

                <div>
                  <AnimatedButton
                    type="submit"
                    disabled={Loading}
                  >
                    {Loading ? "Signing in..." : "Sign in"}
                  </AnimatedButton>
                </div>
              </form>
            </motion.div>
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
              animationData={loginAnimation}
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

export default Login;
