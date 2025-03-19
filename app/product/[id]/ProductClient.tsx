"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/contexts/wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { useToken } from "@/contexts/token-context"
import { useCart } from "@/contexts/cart-context"
import { useWishlist } from "@/contexts/wishlist-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, ArrowLeft, AlertTriangle, Tag, ExternalLink, ShoppingCart, Check } from "lucide-react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Product } from "@/data/products"
import { CheckoutModal } from "@/components/checkout-modal"
import { useToast } from "@/components/ui/use-toast"
import { LoginModal } from "@/components/login-modal"
import { PurchaseFlow } from "@/components/purchase-flow"

interface ProductClientProps {
  product: Product | undefined;
  productId: string;
}

export default function ProductClient({ product, productId }: ProductClientProps) {
  const router = useRouter()
  const { isConnected } = useWallet()
  const { network, isTestnetMaintenance } = useNetwork()
  const { calculateIncentive, getImpactCategory } = useToken()
  const { addToCart, isInCart, isPurchased } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isPurchaseFlowOpen, setIsPurchaseFlowOpen] = useState(false)

  if (!product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    )
  }

  const alreadyInCart = isInCart(product.id)
  const alreadyPurchased = isPurchased(product.id)
  const isWishlisted = isInWishlist(product.id)

  const handleToggleWishlist = () => {
    if (!isAuthenticated || !user) {
      setIsLoginModalOpen(true)
      return
    }

    if (product) {
      toggleWishlist(product)
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated || !user) {
      setIsLoginModalOpen(true)
      return
    }

    addToCart(product)
  }

  const handleBuy = async () => {
    if (!isAuthenticated || !user) {
      setIsLoginModalOpen(true)
      return
    }

    setIsPurchaseFlowOpen(true)
  }

  const handlePurchaseSuccess = () => {
    toast({
      title: "Your order has been placed!",
      description: "Thank you for contributing to sustainability.",
      variant: "success",
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const impactCategory = getImpactCategory(product.category)
  const tokenIncentive = calculateIncentive(product.price, product.category)

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-green-500 text-white"
      case "medium":
        return "bg-green-400 text-white"
      case "low":
        return "bg-green-300 text-green-800"
      default:
        return "bg-gray-200 text-gray-800"
    }
  }

  const getImpactLabel = (impact: string) => {
    switch (impact) {
      case "high":
        return "High Impact - Higher Rewards"
      case "medium":
        return "Medium Impact - Medium Rewards"
      case "low":
        return "Low Impact - Lower Rewards"
      default:
        return "Standard Reward"
    }
  }

  return (
    <div className="container py-20">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/categories/${product.category.toLowerCase()}`}>{product.category}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/categories/${product.category.toLowerCase()}/${product.subcategory.toLowerCase()}`}>
              {product.subcategory}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {network === "testnet" && isTestnetMaintenance && (
        <Alert variant="warning" className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertTitle className="text-amber-800 dark:text-amber-400">Network Maintenance</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            The testnet is currently under maintenance. Purchases and other features are temporarily unavailable.
          </AlertDescription>
        </Alert>
      )}

      {alreadyPurchased && (
        <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
          <AlertTitle className="text-green-800 dark:text-green-400">Already Purchased</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            You've already purchased this item. View your purchase history in your profile.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <img
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white">Pre-owned</Badge>
              <Badge className={getImpactBadge(impactCategory)}>{getImpactLabel(impactCategory)}</Badge>
            </div>
            <Badge className="absolute top-4 right-4 bg-white text-black hover:bg-gray-100" variant="outline">
              <Tag className="h-3 w-3 mr-1" />
              {product.marketplace.charAt(0).toUpperCase() + product.marketplace.slice(1)}
            </Badge>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative rounded-md overflow-hidden border-2 ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <div className="w-20 h-20">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2 space-x-4">
              <span className="text-2xl font-bold text-primary">
                {product.currency} {product.price.toFixed(2)}
              </span>
              <Badge variant="outline">{product.condition}</Badge>
            </div>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="bg-secondary p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Environmental Impact</h3>
                <p className="text-sm text-muted-foreground">This purchase helps the planet</p>
              </div>
              <Badge className={getImpactBadge(impactCategory)}>{getImpactLabel(impactCategory)}</Badge>
            </div>
            <div className="mt-2 pt-2 border-t border-muted-foreground/20">
              <div className="flex justify-between items-center text-sm">
                <span>B3TR Token Reward</span>
                <span className="font-medium text-primary">{tokenIncentive.toFixed(2)} B3TR</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                className="flex-1 gap-2"
                onClick={handleBuy}
                disabled={isTestnetMaintenance || alreadyPurchased}
              >
                Buy Now
              </Button>
              <Button
                variant={alreadyInCart ? "outline" : "secondary"}
                size="icon"
                onClick={handleAddToCart}
                disabled={alreadyInCart || isTestnetMaintenance || alreadyPurchased}
                title={alreadyInCart ? "Already in cart" : "Add to cart"}
              >
                {alreadyInCart ? <Check className="h-5 w-5 text-primary" /> : <ShoppingCart className="h-5 w-5" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleWishlist}
                className={isWishlisted ? "text-red-500 border-red-200" : ""}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500" : ""}`} />
              </Button>
            </div>

            <div className="border rounded-lg divide-y">
              <div className="p-3 flex justify-between">
                <span className="text-sm font-medium">Seller</span>
                <span className="text-sm">{product.sellerName} ({formatAddress(product.seller)})</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-sm font-medium">Listed</span>
                <span className="text-sm">{formatDate(product.listedDate)}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-sm font-medium">Shipping</span>
                <span className="text-sm">{product.shipping.methods.join(", ")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="history">Price History</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(product.details).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="text-sm font-medium capitalize">{key}</span>
                  <span className="text-sm">{value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="history" className="mt-6">
            <div className="space-y-4">
              {product.history.map((event, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{event.event}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                  </div>
                  <p className="font-medium">{product.currency} {event.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="shipping" className="mt-6">
            <div className="space-y-4">
              <div className="border rounded-lg divide-y">
                <div className="p-3 flex justify-between">
                  <span className="text-sm font-medium">Shipping Methods</span>
                  <span className="text-sm">{product.shipping.methods.join(", ")}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-sm font-medium">Shipping To</span>
                  <span className="text-sm">{product.shipping.locations.join(", ")}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-sm font-medium">Shipping Cost</span>
                  <span className="text-sm">
                    {product.currency} {product.shipping.cost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Original Listing Link */}
      <div className="mt-8 border rounded-lg p-4 flex justify-between items-center">
        <div>
          <h3 className="font-medium">Original Listing</h3>
          <p className="text-sm text-muted-foreground">View this product on the original marketplace</p>
        </div>
        <a
          href={product.productLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:underline"
        >
          View on {product.marketplace.charAt(0).toUpperCase() + product.marketplace.slice(1)}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <CheckoutModal product={product} isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
      <PurchaseFlow
        productId={product.id}
        productName={product.name}
        productPrice={product.price}
        productCurrency={product.currency}
        productCategory={product.category}
        productImage={product.images[0] || "/placeholder.svg"}
        isOpen={isPurchaseFlowOpen}
        onClose={() => setIsPurchaseFlowOpen(false)}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  )
} 