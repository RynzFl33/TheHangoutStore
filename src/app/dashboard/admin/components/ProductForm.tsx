"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { createClient } from "../../../../supabase/client";
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
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
  category_id?: string;
}

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  subcategories: Subcategory[];
  onSuccess: (product: Product) => void;
  onCancel: () => void;
}

type FormData = {
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  image_url: string;
  is_on_sale: boolean;
  is_featured: boolean;
  stock_quantity: number;
  category_id: string;
  subcategory_id: string;
};

export default function ProductForm({
  product,
  categories,
  subcategories,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [colors, setColors] = useState<string[]>(product?.colors || []);
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newImage, setNewImage] = useState("");
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<FormData>({
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      sale_price: product?.sale_price || undefined,
      image_url: product?.image_url || "",
      is_on_sale: product?.is_on_sale || false,
      is_featured: product?.is_featured || false,
      stock_quantity: product?.stock_quantity || 0,
      category_id: product?.category_id || "",
      subcategory_id: product?.subcategory_id || "",
    },
  });

  const selectedCategoryId = form.watch("category_id");
  const filteredSubcategories = subcategories.filter(
    (sub) => sub.category_id === selectedCategoryId,
  );

  useEffect(() => {
    if (selectedCategoryId && product?.subcategory_id) {
      const subcategory = subcategories.find(
        (sub) => sub.id === product.subcategory_id,
      );
      if (subcategory?.category_id !== selectedCategoryId) {
        form.setValue("subcategory_id", "");
      }
    }
  }, [selectedCategoryId, form, product, subcategories]);

  const addSize = () => {
    if (newSize.trim() && !sizes.includes(newSize.trim())) {
      setSizes([...sizes, newSize.trim()]);
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size));
  };

  const addColor = () => {
    if (newColor.trim() && !colors.includes(newColor.trim())) {
      setColors([...colors, newColor.trim()]);
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
  };

  const addImage = () => {
    if (newImage.trim() && !images.includes(newImage.trim())) {
      setImages([...images, newImage.trim()]);
      setNewImage("");
    }
  };

  const removeImage = (image: string) => {
    setImages(images.filter((i) => i !== image));
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const productData = {
        ...data,
        sizes: sizes.length > 0 ? sizes : null,
        colors: colors.length > 0 ? colors : null,
        images: images.length > 0 ? images : null,
        sale_price: data.sale_price || null,
      };

      let result;
      if (product) {
        // Update existing product
        result = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id)
          .select(
            `
            *,
            categories(name),
            subcategories(name)
          `,
          )
          .single();
      } else {
        // Create new product
        result = await supabase
          .from("products")
          .insert(productData)
          .select(
            `
            *,
            categories(name),
            subcategories(name)
          `,
          )
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: product ? "Product Updated" : "Product Created",
        description: `${data.name} has been successfully ${product ? "updated" : "created"}.`,
      });

      onSuccess(result.data);
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: `Failed to ${product ? "update" : "create"} product. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Product name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            rules={{
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="sale_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sale Price ($) - Optional</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock_quantity"
            rules={{
              required: "Stock quantity is required",
              min: { value: 0, message: "Stock must be non-negative" },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subcategory_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredSubcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <FormLabel>Available Sizes</FormLabel>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => (
              <Badge
                key={size}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {size}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeSize(size)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add size (e.g., S, M, L, XL)"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSize())
              }
            />
            <Button type="button" onClick={addSize} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <FormLabel>Available Colors</FormLabel>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <Badge
                key={color}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {color}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeColor(color)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add color (e.g., Red, Blue, Black)"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addColor())
              }
            />
            <Button type="button" onClick={addColor} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Additional Images */}
        <div className="space-y-3">
          <FormLabel>Additional Images</FormLabel>
          <div className="space-y-2">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
              >
                <span className="flex-1 text-sm truncate">{image}</span>
                <X
                  className="w-4 h-4 cursor-pointer text-red-500"
                  onClick={() => removeImage(image)}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add image URL"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addImage())
              }
            />
            <Button type="button" onClick={addImage} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="is_on_sale"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>On Sale</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured Product</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 pt-6">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading
              ? "Saving..."
              : product
                ? "Update Product"
                : "Create Product"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
