"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Search, Filter, Leaf } from "lucide-react"
import { products } from "@/data/products"
import Link from "next/link"

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [selectedSustainability, setSelectedSustainability] = useState("all")

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    // Search filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (selectedCategory !== "all" && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    
    // Condition filter
    if (selectedCondition !== "all" && product.condition.toLowerCase() !== selectedCondition.toLowerCase()) {
      return false;
    }
    
    // Return all products that match filters
    return true;
  });

  // Get unique categories from products
  const categories = ["all", ...new Set(products.map(product => product.category.toLowerCase()))];
  
  // Get unique conditions from products
  const conditions = ["all", ...new Set(products.map(product => product.condition.toLowerCase()))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Marketplace</h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Leaf className="h-4 w-4" />
            Sustainable Shopping
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="md:col-span-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category, index) => (
                <SelectItem key={index} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedCondition} onValueChange={setSelectedCondition}>
            <SelectTrigger>
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              {conditions.map((condition, index) => (
                <SelectItem key={index} value={condition}>
                  {condition === "all" ? "All Conditions" : condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/product/${product.id}`} className="block">
              <div className="aspect-square relative">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                <Badge
                  className="absolute top-2 right-2"
                  variant="default"
                >
                  {product.condition}
                </Badge>
              </div>
            </Link>
            <CardContent className="p-4">
              <Link href={`/product/${product.id}`} className="block">
                <h3 className="font-medium mb-1 hover:text-primary">{product.name}</h3>
              </Link>
              <p className="text-sm text-muted-foreground mb-2">by {product.sellerName}</p>
              <div className="flex justify-between items-center">
                <p className="font-bold text-primary">{product.currency} {product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Rating: {product.sellerRating}/5</span>
                </div>
              </div>
              <Link href={`/product/${product.id}`} className="w-full block mt-4">
                <Button className="w-full">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

