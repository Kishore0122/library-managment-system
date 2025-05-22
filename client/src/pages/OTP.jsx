import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpverification, register } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import api from "../api/axios";
import { motion } from "framer-motion";
import { 
  AnimatedFormContainer, 
  AnimatedButton, 
  AnimatedFormField, 
  AnimatedLogo, 
  AnimatedHeading, 
  AnimatedText,
  AnimatedOtpInput,
  fadeIn,
  slideInFromLeft,
  slideInFromRight,
  staggeredContainer
} from "../components/AnimatedComponents";
import LottiePlayer from "react-lottie-player";
import otpAnimation from "../assets/animations/otpAnimation";

const OTP = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [activeTimer, setActiveTimer] = useState(true);
  const inputRefs = useRef([]);
  const { Loading, error, message, authenticated } = useSelector((state) => state.auth);

  // Redirect if authenticated
  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated, navigate]);

  // Show toast messages for errors and successes
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
    }
  }, [error, message]);

  // Timer for resending OTP
  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setActiveTimer(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer]);

  // Focus input field when component loads
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle input change for OTP fields
  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Only accept numbers
    if (!/^[0-9]*$/.test(value)) return;
    
    // Create a new array with the updated value
    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1); // Only take the first character
    setOtp(newOtp);
    
    // Auto-focus to next input if a number was entered
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input when backspace is pressed on an empty input
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste for OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().substring(0, 6);
    
    if (!/^[0-9]{1,6}$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
    
    // Focus the appropriate field after paste
    if (pastedData.length < 6 && inputRefs.current[pastedData.length]) {
      inputRefs.current[pastedData.length].focus();
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    try {
      setIsResending(true);
      const response = await api.post('/auth/resend-otp', { email });
      toast.success("OTP has been resent to your email");
      setTimer(60);
      setActiveTimer(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP");
      return;
    }
    dispatch(otpverification(email, otpString));
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
            <AnimatedHeading className="mt-6">Verify Your Email</AnimatedHeading>
            <AnimatedText className="mt-2">
              We've sent a 6-digit verification code to <span className="font-semibold">{email}</span>
            </AnimatedText>
            <AnimatedText className="mt-1 text-xs text-gray-500">
              Please check your email and enter the code below to complete your registration.Also add " 0 " in first box
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
                <AnimatedFormField label="Verification Code">
                  <motion.div 
                    className="flex gap-2 justify-between"
                    variants={staggeredContainer}
                  >
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <AnimatedOtpInput
                        key={index}
                        inputRef={(el) => (inputRefs.current[index] = el)}
                        value={otp[index]}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={index === 0 ? handlePaste : null}
                      />
                    ))}
                  </motion.div>
                </AnimatedFormField>

                <div>
                  <AnimatedButton
                    type="submit"
                    disabled={Loading || otp.join('').length !== 6}
                    className={otp.join('').length !== 6 ? "bg-indigo-400 hover:bg-indigo-400" : ""}
                  >
                    {Loading ? "Verifying..." : "Verify OTP"}
                  </AnimatedButton>
                </div>
              </form>

              <motion.div 
                className="mt-6 text-center"
                variants={fadeIn}
              >
                <AnimatedText>
                  Didn't receive the code?{' '}
                  {activeTimer ? (
                    <motion.span 
                      className="text-gray-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={timer} // This forces re-animation when timer changes
                    >
                      Resend in {timer}s
                    </motion.span>
                  ) : (
                    <motion.button
                      onClick={handleResendOTP}
                      disabled={isResending || activeTimer}
                      className="text-indigo-600 hover:text-indigo-500 font-medium disabled:text-gray-400 hover:underline transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isResending ? "Resending..." : "Resend OTP"}
                    </motion.button>
                  )}
                </AnimatedText>
                <AnimatedText className="mt-4">
                  {/* <button
                    type="button"
                    onClick={() => {
                      navigate("/register");
                    }}
                    className="text-indigo-600 hover:text-indigo-500 font-medium hover:underline transition-all duration-300"
                  >
                    Back to Registration
                  </button> */}
                </AnimatedText>
              </motion.div>
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
              animationData={otpAnimation}
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

export default OTP;
