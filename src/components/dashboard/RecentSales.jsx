import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  const [ventas, setVentas] = useState([])

  useEffect(() => {
    const fetchVentas = async () => {
      const q = query(collection(db, "pedidos"), orderBy("creadoEn", "desc"), limit(5))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setVentas(data.filter((v) => v.estado === "pagado"))
    }

    fetchVentas()
  }, [])

  return (
    <div className="space-y-8">
      {ventas.map((venta, i) => (
        <div key={venta.id || i} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/0${(i + 1)}.png`} alt="Avatar" />
            <AvatarFallback>
              {venta.cliente?.nombre?.split(" ")[0]?.charAt(0)}
              {venta.cliente?.apellidos?.split(" ")[0]?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {venta.cliente?.nombre} {venta.cliente?.apellidos}
            </p>
            <p className="text-sm text-muted-foreground">
              {venta.cliente?.email || "Sin correo"}
            </p>
          </div>
          <div className="ml-auto font-medium">
            +${Number(venta.total).toLocaleString("es-CL")}
          </div>
        </div>
      ))}
    </div>
  )
}