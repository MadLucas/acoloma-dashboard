"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { collection, getDocs, Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function SalesChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const pedidosSnap = await getDocs(collection(db, "pedidos"))
      const monthlyTotals = Array(12).fill(0)

      pedidosSnap.forEach((doc) => {
        const data = doc.data()
        if (data.estado === "pagado" && data.creadoEn instanceof Timestamp) {
          const date = data.creadoEn.toDate()
          const month = date.getMonth()
          monthlyTotals[month] += Number(data.total || 0)
        }
      })

      const formatted = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
      ].map((name, i) => ({ name, total: monthlyTotals[i] }))

      setData(formatted)
    }

    fetchData()
  }, [])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value) => [`$${value}`, "Ventas"]} cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
        <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
