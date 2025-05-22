import React, { useState, useEffect } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import registerAnimation from "../assets/animations/registerAnimation";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Loading, error, message, authenticated, pendingVerification } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (message) {
      toast.success(message);
    }
  }, [error, message]);

  // Redirect to OTP verification if registration was successful
  useEffect(() => {
    if (pendingVerification) {
      navigate(`/otp-verification/${pendingVerification}`);
    }
  }, [pendingVerification, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    if (e.target.name === 'confirmPassword' || e.target.name === 'password') {
      if (e.target.name === 'confirmPassword') {
        setPasswordMatch(e.target.value === formData.password);
      } else {
        setPasswordMatch(e.target.value === formData.confirmPassword);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    const { name, email, password } = formData;
    dispatch(register({ name, email, password }));
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
            <AnimatedHeading className="mt-6">Create a new account</AnimatedHeading>
            <AnimatedText className="mt-2">
              Or{" "}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all duration-300">
                sign in to your existing account
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
                <AnimatedFormField label="Full Name">
                  <AnimatedInput
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </AnimatedFormField>

                <AnimatedFormField label="Email address">
                  <AnimatedInput
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </AnimatedFormField>

                <AnimatedFormField label="Password">
                  <AnimatedInput
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
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
                    {Loading ? "Creating account..." : "Create account"}
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
              animationData={registerAnimation}
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

export default Register;
