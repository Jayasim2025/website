"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import "../styles/Pricing.css"

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const pricingPlans = [
    {
      name: "Free",
      description: "For individuals and hobby projects",
      price: "$0",
      period: "/month",
      popular: false,
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
      description: "For content creators and small teams",
      price: "$20",
      period: "/month",
      popular: true,
      buttonText: "Get Started",
      features: [
        { name: "Up to 20 hours of speech processing", included: true },
        { name: "20 GB storage limit per month", included: true },
        { name: "Transcription in 125 languages", included: true },
        { name: "Translation in 125 languages", included: true },
        { name: "Up to 2 translations per media project", included: true },
        { name: "Advanced subtitle editor", included: true },
        { name: "Priority support", included: true },
      ],
    },
    {
      name: "Super",
      description: "For growing teams and agencies",
      price: "$60",
      period: "/month",
      popular: false,
      buttonText: "Get Started",
      features: [
        { name: "Up to 50 hours of speech processing", included: true },
        { name: "50 GB storage limit per month", included: true },
        { name: "Transcription in 125 languages", included: true },
        { name: "Translation in 125 languages", included: true },
        { name: "Up to 10 translations per media project", included: true },
        { name: "Advanced subtitle editor with batch processing", included: true },
        { name: "Dedicated account manager", included: true },
      ],
    },
  ]

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
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Simple, Transparent Pricing</h2>
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
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{
                y: -10,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
              }}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}

              <div className="plan-header">
                <h3>{plan.name}</h3>
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
                <span className="price">{calculatePrice(plan.price, isAnnual)}</span>
                <span className="period">{calculatePeriod(isAnnual)}</span>
              </motion.div>

              <motion.button
                className="plan-button"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0, 112, 243, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {plan.buttonText}
              </motion.button>

              <div className="plan-features">
                {plan.features.map((feature, featureIndex) => (
                  <motion.div
                    className="feature"
                    key={featureIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ duration: 0.3, delay: 0.6 + featureIndex * 0.05 + index * 0.1 }}
                  >
                    {feature.included ? <i className="fas fa-check"></i> : <i className="fas fa-times"></i>}
                    <span>{feature.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="enterprise-plan"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="enterprise-content">
            <div className="enterprise-info">
              <h3>Enterprise</h3>
              <p>Custom solutions for media companies and broadcasters with high-volume needs</p>
              <ul className="enterprise-features">
                <li>
                  <i className="fas fa-check"></i> Unlimited processing hours
                </li>
                <li>
                  <i className="fas fa-check"></i> Custom API integrations
                </li>
                <li>
                  <i className="fas fa-check"></i> Dedicated account manager
                </li>
                <li>
                  <i className="fas fa-check"></i> 99.9% uptime SLA
                </li>
                <li>
                  <i className="fas fa-check"></i> Custom training and onboarding
                </li>
              </ul>
              <motion.button
                className="enterprise-button"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0, 112, 243, 0.2)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Sales
              </motion.button>
            </div>
            <div className="enterprise-image">
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=600&auto=format&fit=crop"
                alt="Enterprise team"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing
