import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export function RecentOrders() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "pedidos"), orderBy("creado", "desc"), limit(5))
        const snapshot = await getDocs(q)
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        setOrders(data)
      } catch (error) {
        console.error("Error al obtener pedidos:", error)
      }
    }

    fetchOrders()
  }, [])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Pedido</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Comuna</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">#{order.id.slice(0, 6).toUpperCase()}</TableCell>
            <TableCell>
              {order.cliente?.nombre} {order.cliente?.apellidos || "-"}
            </TableCell>
            <TableCell>{order.cliente?.comuna || "-"}</TableCell>
            <TableCell>
              {order.creado?.toDate?.().toLocaleDateString("es-CL") || "-"}
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  order.estado === "pagado"
                    ? "default"
                    : order.estado === "pendiente"
                    ? "outline"
                    : order.estado === "procesando"
                    ? "secondary"
                    : "destructive"
                }
              >
                {order.estado || "Desconocido"}
              </Badge>
            </TableCell>
            <TableCell>${Number(order.total || 0).toLocaleString("es-CL")}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon">
                <Eye className="h-4 w-4" />
                <span className="sr-only">Ver detalles</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
