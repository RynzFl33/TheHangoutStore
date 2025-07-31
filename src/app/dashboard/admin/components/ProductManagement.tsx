"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import ProductTable from "./ProductTable";
import ProductForm from "./ProductForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  image_url?: string;
  images?: string[];
  is_on_sale?: boolean;
  is_featured?: boolean;
  sizes?: string[];
  colors?: string[];
  stock_quantity?: number;
  category_id?: string;
  subcategory_id?: string;
  created_at?: string;
  updated_at?: string;
  categories?: { name: string };
  subcategories?: { name: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  category_id?: string;
}

interface ProductManagementProps {
  initialProducts: Product[];
  categories: Category[];
  subcategories: Subcategory[];
}

export default function ProductManagement({
  initialProducts,
  categories,
  subcategories,
}: ProductManagementProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const handleFormSuccess = (product: Product) => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      // Add new product
      setProducts([product, ...products]);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Product Management
        </CardTitle>
        <Button
          onClick={handleAddProduct}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </CardHeader>
      <CardContent>
        <ProductTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </CardContent>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            categories={categories}
            subcategories={subcategories}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
} 
