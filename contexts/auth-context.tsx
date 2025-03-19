"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useDemoWallet } from "@/providers/demo-wallet-provider"
import { useToast } from "@/components/ui/use-toast"

/**
 * Authentication Context Module
 * 
 * This file handles user authentication, profile management and wallet integration.
 * It provides authentication state and methods throughout the application.
 */

// Define user profile type
export type UserProfile = {
  id: string
  username: string
  email: string | null
  phone: string | null
  walletAddress: string
  createdAt: Date
  b3trBalance?: number // B3TR token balance
}

// Define authentication context type
interface AuthContextType {
  user: UserProfile | null
  isLoading: boolean
  isAuthenticated: boolean
  register: (username: string, email: string, password: string) => Promise<boolean>
  login: (identifier: string, password: string) => Promise<boolean>
  loginWithSocial: (provider: "veworld" | "x" | "google" | "phone", identifier: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<Omit<UserProfile, "id" | "walletAddress" | "createdAt">>) => Promise<boolean>
  updateB3TRBalance: (amount: number) => void // Method to update B3TR balance
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  register: async () => false,
  login: async () => false,
  loginWithSocial: async () => false,
  logout: () => {},
  updateProfile: async () => false,
  updateB3TRBalance: () => {},
})

/**
 * Generates a random mock wallet address for demo purposes
 * @returns A random Ethereum-style wallet address
 */
const generateWalletAddress = (): string => {
  return `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
}

/**
 * Generates a unique user ID
 * @returns A unique user identifier string
 */
const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Generates a random B3TR token balance for demo accounts
 * @returns A random balance between 100 and 1100
 */
const generateRandomB3TRBalance = (): number => {
  return Math.floor(Math.random() * 1000) + 100 // Random balance between 100 and 1100
}

/**
 * Authentication Provider Component
 * Manages authentication state and provides auth methods to the application
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const demoWallet = useDemoWallet()
  const { toast } = useToast()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser)

          // Add B3TR balance if it doesn't exist
          if (!parsedUser.b3trBalance) {
            parsedUser.b3trBalance = generateRandomB3TRBalance()
          }

          setUser(parsedUser)

          // Connect the demo wallet with the stored wallet address
          if (parsedUser.walletAddress) {
            await demoWallet.connect(parsedUser.walletAddress)
          }
        }
      } catch (error) {
        console.error("Error checking session:", error)
        // Don't clear user state if an error occurs
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [demoWallet])

  /**
   * Updates the user's B3TR token balance
   * @param amount - The new balance amount
   */
  const updateB3TRBalance = (amount: number) => {
    if (!user) return

    const updatedUser = {
      ...user,
      b3trBalance: amount,
    }

    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  /**
   * Registers a new user account
   * Uses actual wallet if available, otherwise generates a mock one
   */
  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Check if there's a wallet connected via VeChain provider before generating a random one
      const veChainWallet = (window as any).vechain?.selectedAddress || null;
      
      // Use connected wallet or generate a unique wallet address
      const walletAddress = veChainWallet || generateWalletAddress();

      // Create a new user profile
      const newUser: UserProfile = {
        id: generateUserId(),
        username,
        email,
        phone: null,
        walletAddress,
        createdAt: new Date(),
        b3trBalance: generateRandomB3TRBalance(),
      }

      // Store user in localStorage (in a real app, this would be a server call)
      localStorage.setItem("user", JSON.stringify(newUser))
      setUser(newUser)

      // Connect the demo wallet
      await demoWallet.connect(walletAddress)
      demoWallet.setUserProfile({ username, email })

      toast({
        title: "Registration successful",
        description: "Your account has been created and wallet generated",
      })

      return true
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Registration failed",
        description: "There was an error creating your account",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Authenticates a user with identifier (email/username) and password
   * Uses actual wallet if available, otherwise uses/generates a mock one
   */
  const login = async (identifier: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Check if there's a wallet connected via VeChain provider
      const veChainWallet = (window as any).vechain?.selectedAddress || null;
      
      // Check if user exists in localStorage
      const storedUser = localStorage.getItem("user")
      let userToLogin: UserProfile

      if (storedUser) {
        userToLogin = JSON.parse(storedUser)

        // Update wallet address if a real one is connected
        if (veChainWallet) {
          userToLogin.walletAddress = veChainWallet;
        }

        // Add B3TR balance if it doesn't exist
        if (!userToLogin.b3trBalance) {
          userToLogin.b3trBalance = generateRandomB3TRBalance()
        }
      } else {
        // Create a new user if one doesn't exist (for demo purposes)
        const walletAddress = veChainWallet || generateWalletAddress();
        userToLogin = {
          id: generateUserId(),
          username: identifier.includes("@") ? identifier.split("@")[0] : identifier,
          email: identifier.includes("@") ? identifier : null,
          phone: null,
          walletAddress,
          createdAt: new Date(),
          b3trBalance: generateRandomB3TRBalance(),
        }
      }

      // Save user to localStorage
      localStorage.setItem("user", JSON.stringify(userToLogin))

      // Update state
      setUser(userToLogin)

      // Connect the demo wallet with the actual wallet address
      await demoWallet.connect(userToLogin.walletAddress)
      demoWallet.setUserProfile({
        username: userToLogin.username,
        email: userToLogin.email || "",
      })

      console.log("Login successful, user state updated:", userToLogin)

      toast({
        title: "Login successful",
        description: `Welcome back, ${userToLogin.username}!`,
      })

      return true
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Authenticates a user with a social provider
   * Supports VeWorld, X (Twitter), Google, and phone authentication
   */
  const loginWithSocial = async (
    provider: "veworld" | "x" | "google" | "phone",
    identifier: string,
  ): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Generate user data based on provider
      let username: string
      let email: string | null = null
      let phone: string | null = null
      let walletAddress: string

      switch (provider) {
        case "veworld":
          // Use the actual wallet address as identifier and username
          walletAddress = identifier;
          username = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
          email = `${walletAddress.toLowerCase()}@veworld.user`;
          break;
        case "x":
          // Randomly choose between veHunt and veHunt3r
          if (Math.random() > 0.5) {
            username = "veHunt"
            email = "vehunt@example.com"
          } else {
            username = "veHunt3r"
            email = "vehunt3r@gmail.com"
          }
          walletAddress = generateWalletAddress();
          break
        case "google":
          // Randomly choose between the provided email and hershel
          if (Math.random() > 0.5) {
            username = identifier.split("@")[0]
            email = identifier
          } else {
            username = "hershel"
            email = "hershelbeen@gmail.com"
          }
          walletAddress = generateWalletAddress();
          break
        case "phone":
          username = `user_${identifier.replace(/\D/g, "").slice(-4)}`
          phone = identifier
          walletAddress = generateWalletAddress();
          break
        default:
          username = "user"
          walletAddress = generateWalletAddress();
      }

      // Create a new user profile with the correct wallet address
      const newUser: UserProfile = {
        id: generateUserId(),
        username,
        email,
        phone,
        walletAddress,
        createdAt: new Date(),
        b3trBalance: generateRandomB3TRBalance(),
      }

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(newUser))

      // Update state
      setUser(newUser)

      // Connect the demo wallet with the actual wallet address
      await demoWallet.connect(walletAddress)
      demoWallet.setUserProfile({
        username,
        email: email || "",
      })

      console.log("Social login successful, user state updated:", newUser)

      toast({
        title: "Login successful",
        description: `Welcome, ${username}!`,
      })

      return true
    } catch (error) {
      console.error("Social login error:", error)
      toast({
        title: "Login failed",
        description: "There was an error with social login",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Logs out the current user and clears session data
   */
  const logout = () => {
    setUser(null)
    demoWallet.disconnect()
    localStorage.removeItem("user")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  /**
   * Updates the user's profile information
   * @param data - The profile data to update
   */
  const updateProfile = async (
    data: Partial<Omit<UserProfile, "id" | "walletAddress" | "createdAt">>,
  ): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)
    try {
      // Check if there's a wallet connected via VeChain provider
      const veChainWallet = (window as any).vechain?.selectedAddress || null;
      
      // Update user data
      const updatedUser = {
        ...user,
        ...data,
        // Use connected wallet if available and different from stored one
        walletAddress: veChainWallet || user.walletAddress,
      }

      // Store updated user in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      // Update demo wallet profile
      demoWallet.setUserProfile({
        username: updatedUser.username,
        email: updatedUser.email || "",
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      })

      return true
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Update failed",
        description: "There was an error updating your profile",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        register,
        login,
        loginWithSocial,
        logout,
        updateProfile,
        updateB3TRBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook to access the auth context
 * @returns The authentication context
 */
export const useAuth = () => useContext(AuthContext)

