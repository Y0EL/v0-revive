import type React from "react"
import type { Metadata } from "next"
import { Inter, Dancing_Script } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { NetworkToggle } from "@/components/network-toggle"
import { NetworkProvider } from "@/contexts/network-context"
import { WalletProvider } from "@/contexts/wallet-context"
import { TokenProvider } from "@/contexts/token-context"
import { TransactionProvider } from "@/contexts/transaction-context"
import { CartProvider } from "@/contexts/cart-context"
import { WishlistProvider } from "@/contexts/wishlist-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { VeChainProvider } from '@/providers/VeChainProvider'
import { I18nProvider } from '@/contexts/i18n-context'

/**
 * Root Layout Component
 * 
 * This file sets up the application layout, font configuration,
 * metadata, and the provider hierarchy for the entire application.
 */

// Configure the main fonts for the application
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
})

// Define application metadata for SEO
export const metadata: Metadata = {
  title: "ReVive - Sustainable Second-Hand Marketplace",
  description: "Buy and sell pre-loved items, earn rewards for sustainable choices",
  keywords: "sustainable, second-hand, marketplace, eco-friendly, pre-owned, B3TR tokens",
  generator: 'v0.dev'
}

/**
 * Root Layout Component
 * 
 * Provides the base structure for all pages including:
 * - Font configuration
 * - Context providers for state management
 * - Main layout structure (navbar, main content, footer)
 * - Theme provider for light/dark mode
 * - VeChain integration for blockchain functionality
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${dancingScript.variable} font-sans antialiased`}>
      <body className={inter.className}>
        {/* VeChain Provider for blockchain wallet integration */}
        <VeChainProvider>
          {/* Theme Provider for light/dark mode */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="revive-theme"
          >
            {/* Internationalization Provider */}
            <I18nProvider>
              {/* Network Provider for blockchain network selection */}
              <NetworkProvider>
                {/* Authentication Provider for user management */}
                <AuthProvider>
                  {/* Wallet Provider for cryptocurrency operations */}
                  <WalletProvider>
                    {/* Token Provider for B3TR token ecosystem */}
                    <TokenProvider>
                      {/* Transaction Provider for blockchain transactions */}
                      <TransactionProvider>
                        {/* Cart Provider for shopping cart functionality */}
                        <CartProvider>
                          {/* Wishlist Provider for saved items */}
                          <WishlistProvider>
                            <div className="relative min-h-screen flex flex-col bg-background">
                              <Navbar />
                              <main className="flex-1 pt-16">{children}</main>
                              <Footer />
                              <NetworkToggle />
                              <Toaster />
                            </div>
                          </WishlistProvider>
                        </CartProvider>
                      </TransactionProvider>
                    </TokenProvider>
                  </WalletProvider>
                </AuthProvider>
              </NetworkProvider>
            </I18nProvider>
          </ThemeProvider>
        </VeChainProvider>
      </body>
    </html>
  )
}