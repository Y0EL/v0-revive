"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

/**
 * Token Context Module
 * 
 * This file handles the token economy system for sustainable marketplace.
 * It manages token balances, incentives based on environmental impact,
 * and provides token-related utilities throughout the application.
 */

// Define environmental impact categories
export type ImpactCategory = "high" | "medium" | "low"

// Define token incentive rates based on impact category
const TOKEN_INCENTIVE_RATES: Record<ImpactCategory, number> = {
  high: 0.1, // 10% of purchase price
  medium: 0.05, // 5% of purchase price
  low: 0.02, // 2% of purchase price
}

// Define category impact mappings
export const CATEGORY_IMPACT_MAP: Record<string, ImpactCategory> = {
  clothing: "high",
  electronics: "high",
  furniture: "high",
  books: "medium",
  toys: "medium",
  sports: "medium",
  accessories: "low",
  other: "low",
}

/**
 * Token context interface defining available token operations
 */
interface TokenContextType {
  balance: number
  addTokens: (amount: number) => void
  withdrawTokens: (amount: number) => Promise<boolean>
  calculateIncentive: (price: number, category: string) => number
  getImpactCategory: (category: string) => ImpactCategory
}

/**
 * Creates the token context with default values
 */
const TokenContext = createContext<TokenContextType>({
  balance: 0,
  addTokens: () => {},
  withdrawTokens: async () => false,
  calculateIncentive: () => 0,
  getImpactCategory: () => "low",
})

/**
 * Custom hook to access the token context
 * @returns The token context
 */
export const useToken = () => useContext(TokenContext)

/**
 * Token Provider Component
 * Manages token state and provides token functionality to the application
 */
export function TokenProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(0)

  /**
   * Adds tokens to the user's balance
   * @param amount - The amount of tokens to add
   */
  const addTokens = (amount: number) => {
    setBalance((prev) => prev + amount)
  }

  /**
   * Withdraws tokens from the user's balance
   * @param amount - The amount of tokens to withdraw
   * @returns Promise resolving to success state of the withdrawal
   */
  const withdrawTokens = async (amount: number): Promise<boolean> => {
    if (amount > balance) return false

    // Simulate withdrawal delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setBalance((prev) => prev - amount)
    return true
  }

  /**
   * Gets the environmental impact category for a product category
   * @param category - The product category
   * @returns The impact category (high, medium, or low)
   */
  const getImpactCategory = (category: string): ImpactCategory => {
    return CATEGORY_IMPACT_MAP[category.toLowerCase()] || "low"
  }

  /**
   * Calculates token incentive based on price and product category
   * @param price - The product price
   * @param category - The product category
   * @returns The calculated token incentive amount
   */
  const calculateIncentive = (price: number, category: string): number => {
    const impactCategory = getImpactCategory(category)
    const rate = TOKEN_INCENTIVE_RATES[impactCategory]
    return price * rate
  }

  return (
    <TokenContext.Provider
      value={{
        balance,
        addTokens,
        withdrawTokens,
        calculateIncentive,
        getImpactCategory,
      }}
    >
      {children}
    </TokenContext.Provider>
  )
}

