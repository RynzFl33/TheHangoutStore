"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Eye } from "lucide-react";
import { createClient } from "../../../../../supabase/client";
import { useToast } from "@/components/ui/use-toast";

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

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  const handleDelete = async (product: Product) => {
    setDeletingId(product.id);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) {
        throw error;
      }

      onDelete(product.id);
      toast({
        title: "Product Deleted",
        description: `${product.name} has been successfully deleted.`,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No products found. Add your first product to get started!</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img
                  src={
                    product.image_url ||
                    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&q=80"
                  }
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{product.name}</p>
                  {product.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {product.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  {product.categories?.name && (
                    <Badge variant="outline" className="text-xs">
                      {product.categories.name}
                    </Badge>
                  )}
                  {product.subcategories?.name && (
                    <Badge variant="secondary" className="text-xs">
                      {product.subcategories.name}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formatPrice(product.sale_price || product.price)}
                  </span>
                  {product.sale_price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`text-sm ${
                    (product.stock_quantity || 0) > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {product.stock_quantity || 0} units
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {product.is_featured && (
                    <Badge className="text-xs bg-purple-600">Featured</Badge>
                  )}
                  {product.is_on_sale && (
                    <Badge variant="destructive" className="text-xs">
                      Sale
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      window.open(`/product/${product.id}`, "_blank")
                    }
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === product.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{product.name}
                          &quot;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(product)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
