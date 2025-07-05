"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import "../styles/FAQ.css"

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null)

  const faqData = [
    {
      question: "How accurate is the AI transcription?",
      answer:
        "Our AI transcription achieves up to 95% accuracy for clear audio in supported languages. Accuracy may vary based on audio quality, background noise, and speaker clarity.",
    },
    {
      question: "Which languages are supported for transcription and translation?",
      answer:
        "We support transcription in 125+ languages and translation between 125+ language pairs. This includes major world languages like English, Spanish, French, German, Chinese, Japanese, and many more.",
    },
    {
      question: "What file formats do you accept?",
      answer:
        "We accept most common audio and video formats including MP3, WAV, MP4, MOV, AVI, and more. Files can be up to 10GB in size depending on your plan.",
    },
    {
      question: "How long does processing take?",
      answer:
        "Processing time varies by file length and complexity. Typically, a 1-hour audio file takes 2-5 minutes to transcribe and an additional 1-2 minutes per target language for translation.",
    },
    {
      question: "Can I edit the transcriptions and translations?",
      answer:
        "Yes! Our built-in editor allows you to make corrections, adjust timing, and refine translations. You can also collaborate with team members in real-time.",
    },
    {
      question: "Is my content secure and private?",
      answer:
        "Absolutely. We use enterprise-grade encryption for all uploads and processing. Your files are automatically deleted after 30 days, and we never use your content for training our AI models.",
    },
    {
      question: "Do you offer API access?",
      answer:
        "Yes, API access is available on Pro plans and above. Our RESTful API allows you to integrate transcription and translation directly into your applications.",
    },
    {
      question: "What export formats are available?",
      answer:
        "You can export in multiple formats including SRT, VTT, TXT, DOCX, and JSON. We also support direct integration with popular video platforms.",
    },
  ]

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="faq-section">
      <div className="container">
        <div className="section-header">
          <h2 className="gradient-glow">Frequently Asked Questions</h2>
          <p>Find answers to common questions about our transcription and translation services.</p>
        </div>

        <div className="faq-container">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              className={`faq-item ${activeIndex === index ? "active" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                <span>{item.question}</span>
                <i className="fas fa-chevron-down"></i>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    className="faq-answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
