"use client";

import { motion } from "framer-motion";
import { CheckCircle, Copy} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string;
  totalAmount: number;
}

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  orderCode,
  totalAmount,
}: OrderConfirmationModalProps) {
  const { toast } = useToast();

  const copyOrderCode = () => {
    navigator.clipboard.writeText(orderCode);
    toast({
      title: "Copied!",
      description: "Order code copied to clipboard",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-center text-gray-900 dark:text-white">
            Order Confirmation
          </DialogTitle>
        </DialogHeader>

        <div className="text-center space-y-6 py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              ✅ Thank you for your order!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your order has been successfully placed.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Your order code:
            </div>
            <div className="flex items-center justify-center gap-2">
              <code className="text-lg font-bold text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-700 px-3 py-2 rounded border">
                {orderCode}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={copyOrderCode}
                className="p-2"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Please save this code to check your order status.
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              Order Total:
            </div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${totalAmount.toFixed(2)}
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/orders">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Track Your Order
              </Button>
            </Link>
            <Link href="/shop">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Continue Shopping
              </Button>
            </Link>
            <Button variant="outline" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
