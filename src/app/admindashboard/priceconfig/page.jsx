// app/components/EditorListaPrecios.jsx
"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function EditorListaPrecios() {
  const [listas, setListas] = useState([]);
  const [listaSeleccionada, setListaSeleccionada] = useState(null);
  const [datos, setDatos] = useState(null);
  const [comision, setComision] = useState(0);
  const [iva, setIva] = useState(19);
  const [margenes, setMargenes] = useState({});
  const [nuevaLista, setNuevaLista] = useState(null);
  const [nombreNuevaLista, setNombreNuevaLista] = useState("");

  useEffect(() => {
    const obtenerListas = async () => {
      const snapshot = await getDocs(collection(db, "listaDePrecios"));
      const nombres = snapshot.docs.map((doc) => doc.id);
      setListas(nombres);
    };
    obtenerListas();
  }, []);

  const cargarLista = async (nombre) => {
    setListaSeleccionada(nombre);
    const docRef = doc(db, "listaDePrecios", nombre);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      setDatos(snap.data().tabla);
    }
  };

  const eliminarLista = async () => {
    if (!listaSeleccionada) return;
    const confirmacion = confirm(`¿Estás seguro de eliminar la lista "${listaSeleccionada}"?`);
    if (!confirmacion) return;
    await deleteDoc(doc(db, "listaDePrecios", listaSeleccionada));
    setListas((prev) => prev.filter((id) => id !== listaSeleccionada));
    setListaSeleccionada(null);
    setDatos(null);
    alert("Lista eliminada exitosamente.");
  };

  const calcularLista = () => {
    if (!datos) return;
    const nueva = {};
    Object.entries(datos).forEach(([alto, fila]) => {
      nueva[alto] = { ancho: {} };
      Object.entries(fila.ancho).forEach(([ancho, valor]) => {
        const margen = margenes[ancho] || 0;
        const base = valor + margen;
        const conComision = base * (1 + comision / 100);
        const conIVA = conComision * (1 + iva / 100);
        nueva[alto].ancho[ancho] = Math.round(conIVA);
      });
    });
    setNuevaLista(nueva);
  };

  const guardarLista = async () => {
    if (!nuevaLista || !nombreNuevaLista) return;
    await setDoc(doc(db, "listaDePrecios", nombreNuevaLista), {
      tabla: nuevaLista,
      creadoEn: new Date(),
    });
    alert("✅ Lista guardada correctamente como: " + nombreNuevaLista);
  };

  const columnasUnicas = nuevaLista
    ? Array.from(new Set(Object.values(nuevaLista).flatMap((fila) => Object.keys(fila.ancho)))).sort(
        (a, b) => parseFloat(a) - parseFloat(b)
      )
    : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <h2 className="text-2xl font-bold">Editor de Lista de Precios</h2>

      <div className="grid gap-4 md:grid-cols-4 items-end">
        <div>
          <Label>Seleccionar lista de precios base</Label>
          <Select onValueChange={cargarLista} value={listaSeleccionada || undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Elige una lista" />
            </SelectTrigger>
            <SelectContent>
              {listas.map((id) => (
                <SelectItem key={id} value={id}>
                  {id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="destructive" onClick={eliminarLista} disabled={!listaSeleccionada}>
          Eliminar lista
        </Button>
        <div>
          <Label>Comisión pasarela (%)</Label>
          <Input type="number" value={comision} onChange={(e) => setComision(Number(e.target.value))} />
        </div>
        <div>
          <Label>IVA (%)</Label>
          <Input type="number" value={iva} onChange={(e) => setIva(Number(e.target.value))} />
        </div>
      </div>

      {datos && (
        <>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Margen por ancho (CLP)</h3>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(Object.values(datos)[0].ancho).sort((a, b) => parseFloat(a) - parseFloat(b)).map((ancho) => (
                <div key={ancho}>
                  <Label>{ancho}</Label>
                  <Input
                    type="number"
                    value={margenes[ancho] || ""}
                    onChange={(e) =>
                      setMargenes((prev) => ({ ...prev, [ancho]: Number(e.target.value) }))
                    }
                  />
                </div>
              ))}
            </div>
            <Button className="mt-4" onClick={calcularLista}>
              Crear nueva lista
            </Button>
          </div>

          {nuevaLista && (
            <>
              <div className="mt-6">
                <Label>Nombre de la nueva lista</Label>
                <Input
                  placeholder="Ej: sl_38publica"
                  value={nombreNuevaLista}
                  onChange={(e) => setNombreNuevaLista(e.target.value)}
                />
              </div>
              <h3 className="font-semibold mt-6">Vista previa</h3>
              <div className="overflow-auto border rounded-lg max-h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alto \ Ancho</TableHead>
                      {columnasUnicas.map((ancho) => (
                        <TableHead key={ancho}>{ancho}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(nuevaLista)
                      .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
                      .map(([alto, fila]) => (
                        <TableRow key={alto}>
                          <TableCell className="font-semibold">{alto}</TableCell>
                          {columnasUnicas.map((ancho) => (
                            <TableCell key={ancho}>{fila.ancho[ancho] || "-"}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <Button onClick={guardarLista} className="mt-4">
                Guardar en Firebase
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
}
