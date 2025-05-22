import React, { useState, useEffect } from "react";
import { Link, Navigate, useParams, useNavigate } from "react-router-dom";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../store/slices/authSlice";
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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { Loading, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
      setResetSuccess(true);
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [error, message, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (e.target.name === 'confirmPassword') {
      setPasswordMatch(e.target.value === formData.password);
    } else if (e.target.name === 'password') {
      setPasswordMatch(e.target.value === formData.confirmPassword);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    dispatch(resetPassword(token, formData.password));
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
            <AnimatedHeading className="mt-6">Reset Your Password</AnimatedHeading>
            <AnimatedText className="mt-2">
              Create a new password for your account
            </AnimatedText>
          </div>

          <AnimatedFormContainer className="mt-8">
            {resetSuccess ? (
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
                      Password reset successfully
                    </motion.h3>
                    <motion.div 
                      className="mt-2 text-sm text-green-700"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <p>Redirecting you to the login page...</p>
                    </motion.div>
                                        <motion.div                       className="mt-2 h-1 bg-green-500 rounded-full"                      initial={{ width: "0%" }}                      animate={{ width: "100%" }}                      transition={{ duration: 3 }}                    />
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
                  <AnimatedFormField label="New Password">
                    <AnimatedInput
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength="6"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </AnimatedFormField>

                  <AnimatedFormField label="Confirm Password">
                    <motion.div
                      animate={!passwordMatch ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <AnimatedInput
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`${
                          passwordMatch ? '' : 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        }`}
                      />
                    </motion.div>
                    {!passwordMatch && (
                      <motion.p 
                        className="mt-1 text-sm text-red-600"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        Passwords do not match
                      </motion.p>
                    )}
                  </AnimatedFormField>

                  <div>
                    <AnimatedButton
                      type="submit"
                      disabled={Loading || !passwordMatch}
                      className={!passwordMatch ? "bg-indigo-400 hover:bg-indigo-400" : ""}
                    >
                      {Loading ? "Resetting Password..." : "Reset Password"}
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

export default ResetPassword;
