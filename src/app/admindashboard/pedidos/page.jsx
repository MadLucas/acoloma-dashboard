"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { PedidoDetalleModal } from "@/components/PedidoDetalleModal";

export default function PedidosDashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const q = query(collection(db, "pedidos"), orderBy("creado", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPedidos(data);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      }
    };

    fetchPedidos();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">ID</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Comuna</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido.id}>
              <TableCell className="font-medium">
                #{pedido.id.slice(0, 6).toUpperCase()}
              </TableCell>
              <TableCell>
                {pedido.cliente?.nombre} {pedido.cliente?.apellidos || "-"}
              </TableCell>
              <TableCell>{pedido.cliente?.comuna || "-"}</TableCell>
              <TableCell>
                {pedido.creado?.toDate?.().toLocaleDateString("es-CL") || "-"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    pedido.estado === "pagado"
                      ? "default"
                      : pedido.estado === "pendiente"
                      ? "outline"
                      : pedido.estado === "procesando"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {pedido.estado || "Desconocido"}
                </Badge>
              </TableCell>
              <TableCell>
                ${Number(pedido.total || 0).toLocaleString("es-CL")}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPedido(pedido)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <PedidoDetalleModal open={!!selectedPedido} onClose={() => setSelectedPedido(null)} pedido={selectedPedido} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
