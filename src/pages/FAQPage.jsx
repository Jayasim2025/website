"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Auth from "../components/Auth";
import BackgroundScene from "../components/BackgroundScene";
import FAQ from "../components/FAQ";
import "../styles/FAQPage.css";

function FAQPage({ theme, toggleTheme }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questionSubmitted, setQuestionSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: "",
  });

  useEffect(() => {
    // Listen for custom event to open login modal
    const handleOpenLoginModal = () => setShowLoginModal(true);
    window.addEventListener("open-login-modal", handleOpenLoginModal);

    return () => {
      window.removeEventListener("open-login-modal", handleOpenLoginModal);
    };
  }, []);

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Question submitted:", formData);
    // Here you would typically send this data to your backend
    setQuestionSubmitted(true);

    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        question: "",
      });
      setQuestionSubmitted(false);
    }, 3000);
  };

  return (
    <>
      <div className="background-container">
        <Canvas className="background-canvas">
          <Suspense fallback={null}>
            <BackgroundScene />
            <Environment preset="city" />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Always render the Navbar, but conditionally hide it when sidebar is open */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={sidebarOpen}
      />

      <Sidebar
        theme={theme}
        toggleTheme={toggleTheme}
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        toggleLoginModal={toggleLoginModal}
      />

      <main className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="faq-page">
          <div className="container">
            <motion.div
              className="faq-page-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="gradient-text">Frequently Asked Questions</h1>
            </motion.div>

            <FAQ />

            <motion.div
              className="ask-question-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2>Can't find what you're looking for?</h2>
              <p>
                Submit your question and our team will get back to you as soon
                as possible.
              </p>

              <div className="question-form-container">
                <form onSubmit={handleSubmit} className="question-form">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email address"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="question">Your Question</label>
                    <textarea
                      id="question"
                      name="question"
                      value={formData.question}
                      onChange={handleInputChange}
                      placeholder="Type your question here..."
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    className="btn btn-primary submit-question-btn"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(0, 112, 243, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    disabled={questionSubmitted}
                  >
                    {questionSubmitted
                      ? "Question Submitted!"
                      : "Submit Question"}
                  </motion.button>
                </form>

                <AnimatePresence>
                  {questionSubmitted && (
                    <motion.div
                      className="submission-success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <i className="fas fa-check-circle"></i>
                      <p>
                        Thank you for your question! We'll respond to you
                        shortly.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </main>

      <AnimatePresence>
        {showLoginModal && <Auth onClose={toggleLoginModal} key="auth-modal" />}
      </AnimatePresence>
    </>
  );
}

export default FAQPage;
