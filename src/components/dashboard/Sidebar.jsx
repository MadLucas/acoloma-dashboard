"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Ruler,
  Palette,
  Truck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarLinks = [
  { title: "Dashboard", href: "/admindashboard", icon: LayoutDashboard },
  { title: "Productos", href: "/admindashboard/new", icon: Package },
  { title: "Pedidos", href: "/dashboard/pedidos", icon: ShoppingBag },
  { title: "Clientes", href: "/dashboard/clientes", icon: Users },
  { title: "Materiales", href: "/dashboard/materiales", icon: Palette },
  { title: "Medidas", href: "/dashboard/medidas", icon: Ruler },
  { title: "Envíos", href: "/dashboard/envios", icon: Truck },
  { title: "Estadísticas", href: "/dashboard/estadisticas", icon: BarChart3 },
  { title: "Configuración", href: "/dashboard/configuracion", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <span className="font-bold">Cortinas Admin</span>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-all duration-200 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-full max-w-xs border-r bg-background p-6 shadow-lg transition-transform duration-200",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">Cortinas Admin</span>
            </div>
            <Button variant="outline" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close Menu</span>
            </Button>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                  pathname === link.href ? "bg-muted" : "text-muted-foreground"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-4">
            <Button variant="outline" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden w-64 shrink-0 border-r bg-background md:block">
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <span className="font-bold">Cortinas Admin</span>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
                pathname === link.href ? "bg-muted" : "text-muted-foreground"
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.title}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t p-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </>
  )
}
