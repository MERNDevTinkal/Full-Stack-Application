"use client"

import React from 'react'
import { useSession, signOut } from "next-auth/react"
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const NavbarComponent = () => {

  const { data: session } = useSession()
  const user = session?.user

  return (
    <header className="w-full px-6 py-4 bg-white shadow-sm flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition">
        TrueFeedback
      </Link>

      {session ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">
            Welcome, <strong>{user?.username || user?.email}</strong>
          </span>
          <Button variant="outline" onClick={() => signOut()}>
            Logout
          </Button>
        </div>
      ) : (
        <Link href="/signin">
          <Button>Login</Button>
        </Link>
      )}
    </header>
  )
}

export default NavbarComponent
