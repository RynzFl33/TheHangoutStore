"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../../supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Mail,
  MailOpen,
  Reply,
  Eye,
  Clock,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied";
  admin_reply?: string;
  replied_at?: string;
  replied_by?: string;
  created_at: string;
  updated_at: string;
}

export default function MessageManagement() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);

    // Mark as read if unread
    if (message.status === "unread") {
      await updateMessageStatus(message.id, "read");
    }
  };

  const handleReplyMessage = (message: Message) => {
    setSelectedMessage(message);
    setReplyText(message.admin_reply || "");
    setIsReplyDialogOpen(true);
  };

  const updateMessageStatus = async (messageId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", messageId);

      if (error) throw error;

      // Update local state
      setMessages(
        messages.map((msg) =>
          msg.id === messageId ? { ...msg, status: status as any } : msg,
        ),
      );
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setIsReplying(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("messages")
        .update({
          admin_reply: replyText,
          status: "replied",
          replied_at: new Date().toISOString(),
          replied_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedMessage.id);

      if (error) throw error;

      // Update local state
      setMessages(
        messages.map((msg) =>
          msg.id === selectedMessage.id
            ? {
                ...msg,
                admin_reply: replyText,
                status: "replied" as any,
                replied_at: new Date().toISOString(),
              }
            : msg,
        ),
      );

      toast({
        title: "Reply Sent",
        description: "Your reply has been saved successfully",
      });

      setIsReplyDialogOpen(false);
      setReplyText("");
      setSelectedMessage(null);
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      });
    } finally {
      setIsReplying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return (
          <Badge variant="destructive">
            <Mail className="w-3 h-3 mr-1" />
            Unread
          </Badge>
        );
      case "read":
        return (
          <Badge variant="secondary">
            <MailOpen className="w-3 h-3 mr-1" />
            Read
          </Badge>
        );
      case "replied":
        return (
          <Badge variant="default">
            <CheckCircle className="w-3 h-3 mr-1" />
            Replied
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter((msg) => msg.status === "unread").length;
  const totalMessages = messages.length;

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Message Management
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {totalMessages} total messages • {unreadCount} unread
          </p>
        </div>
        <Button
          onClick={fetchMessages}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow
                    key={message.id}
                    className={
                      message.status === "unread"
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }
                  >
                    <TableCell>{getStatusBadge(message.status)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{message.name}</div>
                        <div className="text-sm text-gray-500">
                          {message.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {message.subject}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(message.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReplyMessage(message)}
                        >
                          <Reply className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    From
                  </label>
                  <p className="text-sm">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <p className="text-sm">{selectedMessage.email}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subject
                </label>
                <p className="text-sm">{selectedMessage.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Message
                </label>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md text-sm">
                  {selectedMessage.message}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <div className="mt-1">
                  {getStatusBadge(selectedMessage.status)}
                </div>
              </div>
              {selectedMessage.admin_reply && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Admin Reply
                  </label>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm">
                    {selectedMessage.admin_reply}
                  </div>
                  {selectedMessage.replied_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Replied on {formatDate(selectedMessage.replied_at)}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                <p className="text-sm font-medium">Original Message:</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  From: {selectedMessage.name} ({selectedMessage.email})
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Subject: {selectedMessage.subject}
                </p>
                <div className="text-sm mt-2 max-h-20 overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Reply
                </label>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={6}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsReplyDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || isReplying}
                >
                  {isReplying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Reply className="w-4 h-4 mr-2" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
