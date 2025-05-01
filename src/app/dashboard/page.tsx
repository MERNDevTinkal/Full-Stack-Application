"use client"

import React, { useCallback, useEffect, useState } from "react"
import { Message } from "@/model/User"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiRespoce"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, ClipboardCopy } from "lucide-react"

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: { acceptMessages: false },
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get(`/api/accept-message`)
      setValue("acceptMessages", response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Something went wrong")
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/get-messages`)
      setMessages(response.data.messages || [])
    } catch (error) {
      toast.error("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post(`/api/accept-message`, {
        acceptMessages: !acceptMessages,
      })
      setValue("acceptMessages", !acceptMessages)
      toast.success(response.data.message)
    } catch (error) {
      toast.error("Switch update failed")
    }
  }

  const handleDeleteMessages = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const username = session?.user?.username
  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : ""
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Copied to clipboard")
  }

  if (!session || !session.user) {
    return <div className="text-center py-10 text-xl text-red-500">Please login</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Accepting Messages:</span>
          {isSwitchLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Switch checked={acceptMessages} onCheckedChange={handleSwitchChange} />
          )}
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2">Your Profile URL:</p>
        <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded">
          <code className="text-sm truncate">{profileUrl}</code>
          <Button variant="ghost" size="icon" onClick={copyToClipboard}>
            <ClipboardCopy className="w-5 h-5 hover:text-green-400 transition-colors" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Messages</h2>
        {loading ? (
          <div>Loading...</div>
        ) : messages.length === 0 ? (
          <p>No messages found.</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-gray-800 p-4 rounded-md flex justify-between items-start hover:shadow-md transition-shadow"
            >
              <div>
                <p className="text-sm text-gray-300">{msg.content}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteMessages(msg._id)}
                className="hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default DashboardPage
