"use client"

import { useState, useEffect } from "react"

// Credit system configuration
const CREDIT_PLANS = {
  free: {
    name: "Free",
    monthlyCredits: 100,
    processingCost: {
      video: 10, // credits per minute
      audio: 5, // credits per minute
    },
  },
  pro: {
    name: "Pro",
    monthlyCredits: 2000,
    processingCost: {
      video: 8,
      audio: 4,
    },
  },
  super: {
    name: "Super",
    monthlyCredits: 5000,
    processingCost: {
      video: 6,
      audio: 3,
    },
  },
  business: {
    name: "Business",
    monthlyCredits: 15000,
    processingCost: {
      video: 4,
      audio: 2,
    },
  },
}

export const useCreditSystem = () => {
  const [currentPlan, setCurrentPlan] = useState(() => {
    return localStorage.getItem("userPlan") || "free"
  })

  const [credits, setCredits] = useState(() => {
    const savedCredits = localStorage.getItem("userCredits")
    return savedCredits ? Number.parseInt(savedCredits) : CREDIT_PLANS.free.monthlyCredits
  })

  const [lastReset, setLastReset] = useState(() => {
    return localStorage.getItem("lastCreditReset") || new Date().toISOString()
  })

  // Check if credits should be reset (monthly)
  useEffect(() => {
    const now = new Date()
    const lastResetDate = new Date(lastReset)
    const daysSinceReset = (now - lastResetDate) / (1000 * 60 * 60 * 24)

    if (daysSinceReset >= 30) {
      const planCredits = CREDIT_PLANS[currentPlan].monthlyCredits
      setCredits(planCredits)
      setLastReset(now.toISOString())
      localStorage.setItem("userCredits", planCredits.toString())
      localStorage.setItem("lastCreditReset", now.toISOString())
    }
  }, [currentPlan, lastReset])

  // Save to localStorage when credits change
  useEffect(() => {
    localStorage.setItem("userCredits", credits.toString())
  }, [credits])

  // Save to localStorage when plan changes
  useEffect(() => {
    localStorage.setItem("userPlan", currentPlan)
  }, [currentPlan])

  const upgradePlan = (newPlan) => {
    if (CREDIT_PLANS[newPlan]) {
      setCurrentPlan(newPlan)
      setCredits(CREDIT_PLANS[newPlan].monthlyCredits)
      console.log(`Upgraded to ${CREDIT_PLANS[newPlan].name} plan with ${CREDIT_PLANS[newPlan].monthlyCredits} credits`)
    }
  }

  const deductCredits = (fileType, durationMinutes) => {
    const cost = CREDIT_PLANS[currentPlan].processingCost[fileType] * durationMinutes
    const roundedCost = Math.ceil(cost)

    if (credits >= roundedCost) {
      setCredits((prev) => prev - roundedCost)
      console.log(`Deducted ${roundedCost} credits for ${fileType} processing (${durationMinutes} minutes)`)
      return { success: true, cost: roundedCost }
    } else {
      console.log(`Insufficient credits. Need ${roundedCost}, have ${credits}`)
      return { success: false, cost: roundedCost, needed: roundedCost - credits }
    }
  }

  const canProcess = (fileType, durationMinutes) => {
    const cost = CREDIT_PLANS[currentPlan].processingCost[fileType] * durationMinutes
    return credits >= Math.ceil(cost)
  }

  return {
    currentPlan,
    credits,
    planInfo: CREDIT_PLANS[currentPlan],
    allPlans: CREDIT_PLANS,
    upgradePlan,
    deductCredits,
    canProcess,
    lastReset,
  }
}

export default useCreditSystem
