"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

export function PedidoDetalleModal({ open, onClose, pedido }) {
  const exportarExcel = () => {
    console.log("CLICK: Generar Excel");

    const rollers = pedido?.carrito || [];

    if (!rollers.length) {
      console.warn("No hay rollers para exportar.");
      return;
    }

    const data = [
      [
        "LOCACION",
        "PRODUCTO",
        "TELA",
        "TUBO",
        "KIT",
        "MANDO",
        "ANCHO",
        "ALTO",
        "CAÍDA",
        "MOTOR",
        "COLOR CONTRAPESO",
        "CANTIDAD",
        "ID INTERNO",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      ...rollers.map((item) => [
        item.locacion || "",
        item.codigoProducto || item.producto || "",
        `${item.producto || ""} ${item.variante || ""}`.trim(),
        item.tubo || "",
        item.colorContrapeso || "",
        item.tipoAccionamiento || "",
        item.ancho || "",
        item.alto || "",
        item.tipoCaida || "",
        item.motorSeleccionado || "",
        "", // COLOR CONTRAPESO vacío
        item.cantidad || 1,
        item.id || "",
        "",
        "",
        "",
        "",
        "",
        "",
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    worksheet["!cols"] = Array(19).fill({ wch: 13 });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OrdenTrabajo");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const finalBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(finalBlob, `OrdenTrabajo_${pedido.id}.xlsx`);
  };

  // 🔥 Evita render innecesario del modal si no hay pedido
  if (!pedido) return null;

  return (
    <>
      {/* 🔧 Botón externo temporal para pruebas */}
      <div className="p-2">
        <Button onClick={exportarExcel}>[TEST] Generar Excel (fuera del modal)</Button>
      </div>

      <Dialog key={pedido?.id || "modal"} open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl" aria-describedby="descripcion-pedido">
          <DialogHeader>
            <DialogTitle>Detalle del Pedido</DialogTitle>
          </DialogHeader>

          <p id="descripcion-pedido" className="sr-only">
            Detalle del pedido seleccionado
          </p>

          <div className="text-sm space-y-2">
            <p><strong>ID:</strong> {pedido.id}</p>
            <p><strong>Cliente:</strong> {pedido.cliente?.nombre} {pedido.cliente?.apellidos}</p>
            <p><strong>Comuna:</strong> {pedido.cliente?.comuna}</p>
            <p><strong>Total:</strong> ${Number(pedido.total || 0).toLocaleString("es-CL")}</p>
            <p><strong>Estado:</strong> {pedido.estado}</p>
          </div>

          {pedido.carrito?.length > 0 && (
            <div className="overflow-auto mt-4">
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border px-2 py-1">Producto</th>
                    <th className="border px-2 py-1">Variante</th>
                    <th className="border px-2 py-1">Ancho</th>
                    <th className="border px-2 py-1">Alto</th>
                    <th className="border px-2 py-1">Precio</th>
                    <th className="border px-2 py-1">Accionamiento</th>
                    <th className="border px-2 py-1">Tirador</th>
                    <th className="border px-2 py-1">Caida</th>
                    <th className="border px-2 py-1">Kit</th>
                    <th className="border px-2 py-1">Motor</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.carrito.map((item, index) => (
                    <tr key={index}>
                      <td className="border px-2 py-1">{item.producto}</td>
                      <td className="border px-2 py-1">{item.variante}</td>
                      <td className="border px-2 py-1">{item.ancho}</td>
                      <td className="border px-2 py-1">{item.alto}</td>
                      <td className="border px-2 py-1">${Number(item.precio || 0).toLocaleString("es-CL")}</td>
                      <td className="border px-2 py-1">{item.tipoAccionamiento}</td>
                      <td className="border px-2 py-1">{item.tirador}</td>
                      <td className="border px-2 py-1">{item.tipoCaida}</td>
                      <td className="border px-2 py-1">{item.colorContrapeso}</td>
                      <td className="border px-2 py-1">{item.motorSeleccionado || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <Button onClick={() => {
              console.log("Botón dentro del modal presionado");
              exportarExcel();
            }}>
              Crear Orden de Trabajo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
