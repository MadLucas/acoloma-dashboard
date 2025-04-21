"use client"

import { useState, Suspense } from "react"
import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { RecentOrders } from "@/components/dashboard/RecentOrders"
import { RecentSales } from "@/components/dashboard/RecentSales"
import { SalesChart } from "@/components/dashboard/SalesChart"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { Header } from "@/components/dashboard/Header"
import { Sidebar } from "@/components/dashboard/Sidebar"
 



export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Resumen general de tu tienda de cortinas" />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<StatsCardsSkeleton />}>
            <StatsCards />
          </Suspense>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Ventas Recientes</CardTitle>
                <CardDescription>Ventas de los últimos 30 días</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Suspense fallback={<SalesChartSkeleton />}>
                  <SalesChart />
                </Suspense>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Clientes Recientes</CardTitle>
                <CardDescription>Últimas compras realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<RecentSalesSkeleton />}>
                  <RecentSales />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recientes</CardTitle>
              <CardDescription>Últimos pedidos realizados en tu tienda</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<RecentOrdersSkeleton />}>
                <RecentOrders />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Ventas</CardTitle>
              <CardDescription>Análisis detallado de ventas por producto y categoría</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Contenido de análisis detallado (en desarrollo)</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reportes</CardTitle>
              <CardDescription>Reportes personalizados y exportación de datos</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Módulo de reportes (en desarrollo)</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(null)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-28 mb-1" />
              <Skeleton className="h-4 w-36" />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

function SalesChartSkeleton() {
  return <Skeleton className="h-[350px] w-full" />
}

function RecentSalesSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="ml-auto h-4 w-16" />
          </div>
        ))}
    </div>
  )
}

function RecentOrdersSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full" />
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
    </div>
  )
}

export function DashboardShell({ children }) {
  return <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">{children}</div>
}

export function DashboardHeader({ heading, text, children }) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="font-heading text-3xl md:text-4xl">{heading}</h1>
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  )
}
