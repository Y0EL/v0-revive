"use client"

import { Suspense, lazy, useEffect, useState } from 'react'

// Fallback component untuk WalletDemo
const WalletDemoFallback = () => (
  <div className="max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold mb-6 text-primary-600">Wallet Demo</h1>
    <div className="p-8 text-center border rounded-lg shadow-sm">
      <p className="text-lg mb-2">Memuat komponen wallet...</p>
      <div className="animate-pulse flex space-x-4 mt-4 justify-center">
        <div className="rounded-full bg-slate-200 h-10 w-10"></div>
        <div className="flex-1 space-y-6 py-1 max-w-sm">
          <div className="h-2 bg-slate-200 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-200 rounded col-span-2"></div>
              <div className="h-2 bg-slate-200 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function WalletDemoPage() {
  // State untuk menangani lazy loading
  const [isClient, setIsClient] = useState(false)
  
  // Hanya jalankan di sisi klien
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Jika di server, tampilkan fallback
  if (!isClient) {
    return <WalletDemoFallback />
  }

  // Lazy load komponen wallet hanya di sisi klien
  const DynamicWalletDemo = lazy(() => import('@/components/wallet-demo-content'))
  
  return (
    <Suspense fallback={<WalletDemoFallback />}>
      <DynamicWalletDemo />
    </Suspense>
  )
} 