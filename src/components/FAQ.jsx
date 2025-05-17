"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import "../styles/FAQ.css"

const faqs = [
  {
    question: "What file formats does the platform support?",
    answer:
      "Our platform supports a wide range of audio and video formats including MP4, MOV, MP3, WAV, AAC, and many more. You can upload files directly or connect to cloud storage services.",
  },
  {
    question: "How accurate is the speech recognition?",
    answer:
      "Our speech recognition technology achieves up to 95% accuracy for clear audio in supported languages. Factors that can affect accuracy include audio quality, background noise, accents, and specialized terminology.",
  },
  {
    question: "Which languages are supported for transcription and translation?",
    answer:
      "We support transcription and translation in over 125 languages. Our free plan includes 36 languages, while paid plans provide access to all supported languages.",
  },
  {
    question: "How does the collaborative editing feature work?",
    answer:
      "Our collaborative editing feature allows multiple team members to work on the same project simultaneously. Team members can make edits, add comments, and see changes in real-time. Role-based access control ensures that team members only have access to the features they need.",
  },
  {
    question: "Can I customize the output format of subtitles?",
    answer:
      "Yes, you can export subtitles in various formats including SRT, VTT, and XML. Our advanced editor also allows you to customize timing, formatting, and styling to meet specific requirements for different platforms.",
  },
  {
    question: "Is my content secure on your platform?",
    answer:
      "Yes, we take security seriously. All uploads are encrypted, and we implement strict access controls. Your content is only accessible to you and team members you explicitly grant access to. We never use your content for training our models.",
  },
  {
    question: "How long does it take to process my media?",
    answer:
      "Processing time depends on the length and quality of your media. Typically, a 1-hour audio file takes about 2 minutes to process. Video files may take slightly longer depending on quality and resolution.",
  },
  {
    question: "Can I integrate with my existing workflow tools?",
    answer:
      "Yes, we offer integrations with popular platforms like Google Drive, Dropbox, YouTube, and more. Enterprise plans include custom API integrations with your existing workflow tools.",
  },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const accordionRefs = useRef([])

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="faq-section" ref={ref} id="faq">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <p>Find answers to common questions about our platform and services.</p>
        </motion.div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <motion.div
              className={`faq-item ${openIndex === index ? "open" : ""}`}
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              ref={(el) => (accordionRefs.current[index] = el)}
            >
              <motion.button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
                whileHover={{ backgroundColor: "var(--primary-light)" }}
                whileTap={{ scale: 0.98 }}
              >
                {faq.question}
                <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <i className="fas fa-chevron-down"></i>
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.3, delay: 0.1 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.3 },
                        opacity: { duration: 0.2 },
                      },
                    }}
                  >
                    <div className="faq-answer-content">
                      <p>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="support-cta"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p>Still have questions? Our support team is here to help.</p>
          <motion.a
            href="#"
            className="btn btn-primary"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(0, 112, 243, 0.4)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Support
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ
