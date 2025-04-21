import { useEffect, useState } from "react"
import { collection, getDocs, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  DollarSign,
  Users,
  CreditCard,
  Package,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsCards() {
  const [ingresos, setIngresos] = useState(0)
  const [clientes, setClientes] = useState(0)
  const [ventas, setVentas] = useState(0)
  const [productos, setProductos] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      const pedidosSnap = await getDocs(query(collection(db, "pedidos")))
      const clientesSnap = await getDocs(query(collection(db, "clientes")))
      const productosSnap = await getDocs(query(collection(db, "productos")))

      let totalIngresos = 0
      pedidosSnap.forEach((doc) => {
        const data = doc.data()
        if (data.estado === "pagado") {
          totalIngresos += Number(data.total || 0)
        }
      })

      setIngresos(totalIngresos)
      setClientes(clientesSnap.size)
      setVentas(pedidosSnap.size)
      setProductos(productosSnap.size)
    }

    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${ingresos.toLocaleString("es-CL")}</div>
          <p className="text-xs text-muted-foreground mt-1">desde el mes pasado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{clientes}</div>
          <p className="text-xs text-muted-foreground mt-1">desde el mes pasado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventas</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{ventas}</div>
          <p className="text-xs text-muted-foreground mt-1">desde el mes pasado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{productos}</div>
          <p className="text-xs text-muted-foreground mt-1">desde el mes pasado</p>
        </CardContent>
      </Card>
    </div>
  )
}
