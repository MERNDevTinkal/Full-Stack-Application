"use client"

import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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
} from "@/components/ui/alert-dialog"

import { toast } from 'sonner'
import axios from 'axios'
import { Message } from "@/model/User"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ message, onMessageDelete }) => {

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.post(`/api/deletemessage/${message._id}`);
            if (response.status === 200) {
                toast.success("Message deleted!");
                onMessageDelete(message._id);
            } else {
                toast.error("Failed to delete message.");
            }
        } catch (error) {
            toast.error("Something went wrong.");
        }
    }

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>Message from {message.senderName}</CardTitle>
                <CardDescription>{message.content}</CardDescription>
            </CardHeader>

            <CardFooter>
                <AlertDialog>
                    <AlertDialogTrigger className="text-red-500">Delete</AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. It will permanently delete this message.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>
                                Yes, Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    )
}

export default MessageCard
