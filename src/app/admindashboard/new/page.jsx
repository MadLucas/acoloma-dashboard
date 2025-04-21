// app/admin/page.jsx
"use client";

import { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function AdminDashboard() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoCalculo, setTipoCalculo] = useState("m2");
  const [precioM2, setPrecioM2] = useState("");
  const [archivoTabla, setArchivoTabla] = useState(null);
  const [imagenProducto, setImagenProducto] = useState(null);
  const [anchoMin, setAnchoMin] = useState("");
  const [anchoMax, setAnchoMax] = useState("");

  const [variantes, setVariantes] = useState([]);
  const [nuevaVariante, setNuevaVariante] = useState("");
  const [nuevoStock, setNuevoStock] = useState("disponible");
  const [nuevaImagenVariante, setNuevaImagenVariante] = useState(null);

  const [accesorios, setAccesorios] = useState([]);
  const [accesorioNombre, setAccesorioNombre] = useState("");
  const [accesorioValor, setAccesorioValor] = useState("");

  const [mensaje, setMensaje] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const agregarVariante = async () => {
    if (!nuevaVariante.trim()) return;
    let imagenUrl = null;
    if (nuevaImagenVariante) {
      const refImg = ref(storage, `variantes/${Date.now()}_${nuevaImagenVariante.name}`);
      const snap = await uploadBytes(refImg, nuevaImagenVariante);
      imagenUrl = await getDownloadURL(snap.ref);
    }
    setVariantes((prev) => [...prev, { nombre: nuevaVariante, stock: nuevoStock, imagenUrl }]);
    setNuevaVariante("");
    setNuevoStock("disponible");
    setNuevaImagenVariante(null);
  };

  const eliminarVariante = (index) => {
    setVariantes((prev) => prev.filter((_, i) => i !== index));
  };

  const agregarAccesorio = () => {
    if (accesorioNombre && accesorioValor) {
      setAccesorios((prev) => [...prev, { nombre: accesorioNombre, valor: Number(accesorioValor) }]);
      setAccesorioNombre("");
      setAccesorioValor("");
    }
  };

  const eliminarAccesorio = (index) => {
    setAccesorios((prev) => prev.filter((_, i) => i !== index));
  };

  const guardarProducto = async () => {
    setSubiendo(true);
    let imagenUrl = null;
    let archivoTablaUrl = null;

    if (imagenProducto) {
      const refImg = ref(storage, `productos/${Date.now()}_${imagenProducto.name}`);
      const snap = await uploadBytes(refImg, imagenProducto);
      imagenUrl = await getDownloadURL(snap.ref);
    }

    if (tipoCalculo === "tabla" && archivoTabla) {
      const refTabla = ref(storage, `tablas/${archivoTabla.name}`);
      const snap = await uploadBytes(refTabla, archivoTabla);
      archivoTablaUrl = await getDownloadURL(snap.ref);
    }

    await addDoc(collection(db, "productos"), {
      nombre,
      descripcion,
      tipoCalculo,
      precioM2: tipoCalculo === "m2" ? Number(precioM2) : null,
      archivoTablaUrl,
      variantes,
      accesorios,
      anchoMin: Number(anchoMin),
      anchoMax: Number(anchoMax),
      imagenUrl,
      creadoEn: serverTimestamp(),
    });

    setMensaje("Producto guardado correctamente");
    setSubiendo(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Crear nuevo producto</h2>

      {mensaje && <p className="text-green-600 mb-4">{mensaje}</p>}

      <div className="grid gap-4">
        <div>
          <Label>Nombre del producto</Label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div>
          <Label>Descripción</Label>
          <Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
        </div>
        <div>
          <Label>Imagen del producto</Label>
          <Input type="file" onChange={(e) => setImagenProducto(e.target.files[0])} />
        </div>
        <div>
          <Label>Tipo de cálculo</Label>
          <Select value={tipoCalculo} onValueChange={setTipoCalculo}>
            <SelectTrigger><SelectValue placeholder="Selecciona tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="m2">Por m²</SelectItem>
              <SelectItem value="tabla">Por tabla Excel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {tipoCalculo === "m2" && (
          <div>
            <Label>Precio por m²</Label>
            <Input type="number" value={precioM2} onChange={(e) => setPrecioM2(e.target.value)} />
          </div>
        )}
        {tipoCalculo === "tabla" && (
          <div>
            <Label>Archivo Excel</Label>
            <Input type="file" onChange={(e) => setArchivoTabla(e.target.files[0])} />
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Ancho mínimo (cm)</Label>
            <Input type="number" value={anchoMin} onChange={(e) => setAnchoMin(e.target.value)} />
          </div>
          <div>
            <Label>Ancho máximo (cm)</Label>
            <Input type="number" value={anchoMax} onChange={(e) => setAnchoMax(e.target.value)} />
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Variantes</h3>
          <div className="flex gap-2 mb-2">
            <Input placeholder="Nombre" value={nuevaVariante} onChange={(e) => setNuevaVariante(e.target.value)} />
            <Select value={nuevoStock} onValueChange={setNuevoStock}>
              <SelectTrigger><SelectValue placeholder="Stock" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="agotado">Agotado</SelectItem>
              </SelectContent>
            </Select>
            <Input type="file" onChange={(e) => setNuevaImagenVariante(e.target.files[0])} />
            <Button onClick={agregarVariante}>Agregar</Button>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {variantes.map((v, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>{v.nombre} – {v.stock}</span>
                <Button variant="outline" size="sm" onClick={() => eliminarVariante(i)}>
                  Eliminar
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Accesorios</h3>
          <div className="flex gap-2 mb-2">
            <Input placeholder="Nombre" value={accesorioNombre} onChange={(e) => setAccesorioNombre(e.target.value)} />
            <Input placeholder="Valor" type="number" value={accesorioValor} onChange={(e) => setAccesorioValor(e.target.value)} />
            <Button onClick={agregarAccesorio}>Agregar</Button>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {accesorios.map((a, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>{a.nombre}: ${a.valor}</span>
                <Button variant="outline" size="sm" onClick={() => eliminarAccesorio(i)}>
                  Eliminar
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <Button onClick={guardarProducto} disabled={subiendo}>Guardar producto</Button>
      </div>
    </div>
  );
}
