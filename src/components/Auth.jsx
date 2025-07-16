import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Auth.css";

const Auth = ({ onClose, initialMode = "login" }) => {
  const [mode, setMode] = useState(initialMode); // 'login', 'signup', 'forgot'
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();
  //
  const {
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    loading: authLoading,
  } = useAuth();

  // Clear form when mode changes
  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    });
    setError("");
    setSuccess("");
  }, [mode]);

  // Password strength checker
  useEffect(() => {
    if (formData.password) {
      let strength = 0;
      if (formData.password.length >= 8) strength += 1;
      if (formData.password.match(/[a-z]/)) strength += 1;
      if (formData.password.match(/[A-Z]/)) strength += 1;
      if (formData.password.match(/[0-9]/)) strength += 1;
      if (formData.password.match(/[^a-zA-Z0-9]/)) strength += 1;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    const { email, password, confirmPassword, fullName } = formData;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (mode === "signup" && password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    // Signup specific validations
    if (mode === "signup") {
      if (!fullName.trim()) {
        setError("Full name is required");
        return false;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let result;

      if (mode === "login") {
        result = await signIn(formData.email, formData.password);
      } else if (mode === "signup") {
        result = await signUp(formData.email, formData.password, {
          full_name: formData.fullName.trim(),
        });
      } else if (mode === "forgot") {
        result = await resetPassword(formData.email);
      }

      if (result?.error) {
        // Handle specific Supabase errors with user-friendly messages
        const errorMsg = result.error.message;
        if (errorMsg.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials.");
        } else if (errorMsg.includes("Email not confirmed")) {
          setError(
            "Please check your email and click the confirmation link before signing in."
          );
        } else if (errorMsg.includes("User already registered")) {
          setError(
            "An account with this email already exists. Please sign in instead."
          );
          setMode("login");
        } else if (errorMsg.includes("Password should be at least")) {
          setError("Password must be at least 6 characters long.");
        } else if (errorMsg.includes("Unable to validate email address")) {
          setError("Please enter a valid email address.");
        } else if (errorMsg.includes("Signup is disabled")) {
          setError(
            "Account creation is currently disabled. Please contact support."
          );
        } else {
          setError(errorMsg || "An error occurred. Please try again.");
        }
        return;
      }

      // Handle success cases
      if (mode === "login") {
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          onClose();
          navigate("/workspace");
        }, 1000);
      } else if (mode === "signup") {
        setSuccess(
          "Account created! Please check your email to confirm your account before signing in."
        );
        setTimeout(() => {
          setMode("login");
          setFormData((prev) => ({
            ...prev,
            password: "",
            confirmPassword: "",
            fullName: "",
          }));
        }, 3000);
      } else if (mode === "forgot") {
        setSuccess("Password reset email sent! Please check your inbox.");
        setTimeout(() => {
          setMode("login");
        }, 3000);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();

      if (result?.error) {
        setError(
          result.error.message || "Google sign-in failed. Please try again."
        );
        return;
      }

      setSuccess("Google sign-in successful! Redirecting...");
      setTimeout(() => {
        onClose();
        // Navigation will be handled by the auth state change
      }, 1000);
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "#ef4444";
      case 2:
        return "#f97316";
      case 3:
        return "#eab308";
      case 4:
      case 5:
        return "#22c55e";
      default:
        return "#ef4444";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
      case 5:
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <motion.div
      className="auth-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="auth-modal"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-auth" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">T</div>
          </div>
          <h2>
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Reset Password"}
          </h2>
          <p>
            {mode === "login" && "Sign in to continue to Translatea2z"}
            {mode === "signup" && "Get started with your free account"}
            {mode === "forgot" && "Enter your email to reset your password"}
          </p>
        </div>

        {error && (
          <motion.div
            className="message error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            className="message success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <i className="fas fa-check-circle"></i>
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                className="form-input"
                disabled={loading || authLoading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="form-input"
              disabled={loading || authLoading}
            />
          </div>

          {mode !== "forgot" && (
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                className="form-input"
                disabled={loading || authLoading}
              />
              {mode === "signup" && formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        backgroundColor: getPasswordStrengthColor(),
                      }}
                    />
                  </div>
                  <span
                    className="strength-text"
                    style={{ color: getPasswordStrengthColor() }}
                  >
                    {getPasswordStrengthText()}
                  </span>
                </div>
              )}
            </div>
          )}

          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required
                className="form-input"
                disabled={loading || authLoading}
              />
            </div>
          )}

          {mode === "login" && (
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <button
                type="button"
                className="forgot-password"
                onClick={() => setMode("forgot")}
              >
                Forgot password?
              </button>
            </div>
          )}

          <motion.button
            type="submit"
            className="submit-button"
            whileHover={{ scale: loading ? 1 : 1.05 }}
            whileTap={{ scale: loading ? 1 : 0.95 }}
            disabled={loading || authLoading}
          >
            {loading || authLoading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                Processing...
              </div>
            ) : (
              <>
                {mode === "login" && "Sign In"}
                {mode === "signup" && "Create Account"}
                {mode === "forgot" && "Send Reset Email"}
              </>
            )}
          </motion.button>

          {mode !== "forgot" && (
            <>
              <div className="divider">
                <span>Or continue with</span>
              </div>

              <motion.button
                type="button"
                className="google-button"
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                onClick={handleGoogleSignIn}
                disabled={loading || authLoading}
              >
                <i className="fab fa-google"></i>
                Continue with Google
              </motion.button>
            </>
          )}
        </form>

        <div className="auth-footer">
          {mode === "login" && (
            <p>
              Don't have an account?{" "}
              <button className="toggle-mode" onClick={() => setMode("signup")}>
                Sign Up
              </button>
            </p>
          )}
          {mode === "signup" && (
            <p>
              Already have an account?{" "}
              <button className="toggle-mode" onClick={() => setMode("login")}>
                Sign In
              </button>
            </p>
          )}
          {mode === "forgot" && (
            <p>
              Remember your password?{" "}
              <button className="toggle-mode" onClick={() => setMode("login")}>
                Sign In
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Auth;
