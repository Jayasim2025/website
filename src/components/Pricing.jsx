"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import "../styles/Pricing.css"

const pricingPlans = [
  {
    name: "Free",
    description: "For individuals and hobby projects. With Rate limits",
    price: "$0",
    period: "/month",
    popular: false,
    bestFor: "",
    buttonText: "Get started",
    features: [
      { name: "Up to 200 mb of media processing", included: true },
      { name: "Transcription in 36 languages", included: true },
      { name: "Translation in 36 languages", included: true },
      { name: "Basic subtitle editor", included: true },
      { name: "Export in SRT & VTT formats", included: true },
      { name: "Email support", included: false },
      { name: "Glossary customization", included: false },
    ],
  },
  {
    name: "Pro",
    description: "For podcasters, content creators, and small teams. Up to 15-20x higher rate limits than free",
    price: "$20",
    period: "/month",
    popular: true,
    bestFor: "Most Popular",
    buttonText: "Get Started",
    features: [
      { name: "Up to 20 hours of speech processing", included: true },
      { name: "20 GB storage limit per month", included: true },
      { name: "Transcription in 125 languages", included: true },
      { name: "Translation in 125 languages", included: true },
      { name: "Upto 2 translations per media project", included: true },
      { name: "Advanced subtitle editor with batch processing", included: true },
    ],
  },
  {
    name: "Super",
    description: "For growing teams and agencies. Up to 25-30x higher rate limits than free",
    price: "$60",
    period: "/month",
    popular: false,
    bestFor: "Best for Teams",
    buttonText: "Get Started",
    features: [
      { name: "Up to 50 hours of speech processing", included: true },
      { name: "50 GB storage limit per month", included: true },
      { name: "Transcription in 125 languages", included: true },
      { name: "Translation in 125 languages", included: true },
      { name: "Upto 10 translations per media project", included: true },
      { name: "Advanced subtitle editor with batch processing", included: true },
    ],
  },
]

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const calculatePrice = (price, isAnnual) => {
    if (price === "$0") return "$0"
    const numericPrice = Number.parseInt(price.replace("$", ""))
    const annualPrice = Math.floor(numericPrice * 10)
    return isAnnual ? `$${annualPrice}` : price
  }

  const calculatePeriod = (isAnnual) => {
    return isAnnual ? "/year" : "/month"
  }

  return (
    <section className="pricing-section" id="pricing" ref={ref}>
      <div className="pricing-background">
        <div className="pricing-gradient"></div>
      </div>

      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="gradient-glow">Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your needs. All plans include a 14-day free trial.</p>

          <motion.div
            className="pricing-toggle"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={!isAnnual ? "active" : ""}>Monthly</span>
            <motion.button
              className={`toggle ${isAnnual ? "active" : ""}`}
              onClick={() => setIsAnnual(!isAnnual)}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="toggle-thumb"
                animate={{ x: isAnnual ? 22 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <span className={isAnnual ? "active" : ""}>
              Annual <span className="save-badge">Save 20%</span>
            </span>
          </motion.div>
        </motion.div>

        <div className="pricing-plans">
          {pricingPlans.map((plan, index) => (
            <motion.div
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{
                y: -10,
                boxShadow: plan.popular ? "0 20px 40px rgba(138, 43, 226, 0.2)" : "0 20px 40px rgba(0, 0, 0, 0.1)",
              }}
            >
              {plan.bestFor && (
                <motion.div
                  className="best-for"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.15, duration: 0.3 }}
                >
                  {plan.bestFor}
                </motion.div>
              )}

              <div className="plan-header">
                <h3 className="gradient-text">{plan.name}</h3>
                <p>{plan.description}</p>
              </div>

              <motion.div
                className="plan-price"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 0.5,
                  delay: isAnnual ? 0.1 : 0,
                  ease: "easeInOut",
                }}
              >
                <span className="price gradient-text">{calculatePrice(plan.price, isAnnual)}</span>
                <span className="period">{calculatePeriod(isAnnual)}</span>
              </motion.div>

              <motion.a
                href="#"
                className="plan-button"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(138, 43, 226, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {plan.buttonText}
              </motion.a>

              <div className="plan-features">
                {plan.features.map((feature, featureIndex) => (
                  <motion.div
                    className="feature"
                    key={featureIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.3, delay: 0.6 + featureIndex * 0.05 + index * 0.1 }}
                  >
                    {feature.included ? (
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      >
                        <i className="fas fa-check"></i>
                      </motion.div>
                    ) : (
                      <i className="fas fa-times"></i>
                    )}
                    <span>{feature.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="enterprise-plan"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="enterprise-header">
            <h2 className="gradient-glow">High-Volume Media Solutions</h2>
            <p>
              Unlock enterprise-grade capabilities designed for media companies, broadcasters, and content networks with
              demanding workloads. Scale effortlessly with our high-performance infrastructure, dedicated support, and
              customizable workflows.
            </p>
          </div>

          <div className="enterprise-plans">
            <motion.div
              className="enterprise-card"
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="best-value">Best Value</div>
              <h3 className="gradient-text">Business</h3>
              <p>For power users and growing organizations. Up to 30-50x higher rate limits than free</p>

              <div className="plan-price">
                <span className="price gradient-text">{isAnnual ? "$1,800" : "$200"}</span>
                <span className="period">{isAnnual ? "/year" : "/month"}</span>
              </div>

              <motion.a
                href="#"
                className="plan-button"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(138, 43, 226, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.a>
            </motion.div>

            <motion.div
              className="enterprise-card"
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3 className="gradient-text">Enterprise</h3>
              <p>For media companies and broadcasters</p>

              <div className="plan-price">
                <p>Starts from</p>
                <span className="price gradient-text">$2k+</span>
                <span className="period">{isAnnual ? "/year" : "/month"}</span>
              </div>

              <motion.a
                href="#"
                className="plan-button contact"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(138, 43, 226, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Contact sales
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
