// src/app/admindashboard/layout.jsx
"use client"

import { Sidebar } from "@/components/dashboard/Sidebar"
import Header from "@/components/dashboard/Header"


export default function AdminDashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}
