// app/admindashboard/new/
"use client";

import { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"; // importa Dialog
import { doc, updateDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoCalculo, setTipoCalculo] = useState("m2");
  const [precioM2, setPrecioM2] = useState("");
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

  const [listasDisponibles, setListasDisponibles] = useState([]);
  const [listaSeleccionada, setListaSeleccionada] = useState("");

  const [motores, setMotores] = useState([]);
  const [nombreMotor, setNombreMotor] = useState("");
  const [valorMotor, setValorMotor] = useState("");

  const [productos, setProductos] = useState([]);
  const [productoEditandoId, setProductoEditandoId] = useState(null);
  const [abrirModalProductos, setAbrirModalProductos] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      const listasSnapshot = await getDocs(collection(db, "listaDePrecios"));
      const nombresListas = listasSnapshot.docs.map((doc) => doc.id);
      setListasDisponibles(nombresListas);

      const productosSnapshot = await getDocs(collection(db, "productos"));
      const productosData = productosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(productosData);
    };
    obtenerDatos();
  }, []);

  const agregarVariante = async () => {
    if (!nuevaVariante.trim()) return;
    let imagenUrl = null;
    if (nuevaImagenVariante) {
      const refImg = ref(
        storage,
        `variantes/${Date.now()}_${nuevaImagenVariante.name}`
      );
      const snap = await uploadBytes(refImg, nuevaImagenVariante);
      imagenUrl = await getDownloadURL(snap.ref);
    }
    setVariantes((prev) => [
      ...prev,
      { nombre: nuevaVariante, stock: nuevoStock, imagenUrl },
    ]);
    setNuevaVariante("");
    setNuevoStock("disponible");
    setNuevaImagenVariante(null);
  };

  const eliminarVariante = (index) => {
    setVariantes((prev) => prev.filter((_, i) => i !== index));
  };

  const agregarAccesorio = () => {
    if (accesorioNombre && accesorioValor) {
      setAccesorios((prev) => [
        ...prev,
        { nombre: accesorioNombre, valor: Number(accesorioValor) },
      ]);
      setAccesorioNombre("");
      setAccesorioValor("");
    }
  };

  const agregarMotor = () => {
    if (nombreMotor && valorMotor) {
      setMotores((prev) => [
        ...prev,
        { nombre: nombreMotor, valor: Number(valorMotor) },
      ]);
      setNombreMotor("");
      setValorMotor("");
    }
  };

  const eliminarMotor = (index) => {
    setMotores((prev) => prev.filter((_, i) => i !== index));
  };

  const eliminarAccesorio = (index) => {
    setAccesorios((prev) => prev.filter((_, i) => i !== index));
  };

  const guardarProducto = async () => {
    setSubiendo(true);
    let imagenUrlFinal = imagenProducto || null;

    try {
      if (imagenProducto && typeof imagenProducto !== "string") {
        const refImg = ref(
          storage,
          `productos/${Date.now()}_${imagenProducto.name}`
        );
        const snap = await uploadBytes(refImg, imagenProducto);
        imagenUrlFinal = await getDownloadURL(snap.ref);
      }

      const datosProducto = {
        nombre,
        descripcion,
        tipoCalculo,
        precioM2: tipoCalculo === "m2" ? Number(precioM2) : null,
        listaDePrecios: tipoCalculo === "tabla" ? listaSeleccionada : null,
        variantes,
        accesorios,
        motores,
        anchoMin: anchoMin ? Number(anchoMin) : null,
        anchoMax: anchoMax ? Number(anchoMax) : null,
        imagenUrl: imagenUrlFinal,
        actualizadoEn: serverTimestamp(),
      };

      if (productoEditandoId) {
        const productoRef = doc(db, "productos", productoEditandoId);
        await updateDoc(productoRef, datosProducto);
        setMensaje("Producto actualizado correctamente");
      } else {
        await addDoc(collection(db, "productos"), {
          ...datosProducto,
          creadoEn: serverTimestamp(),
        });
        setMensaje("Producto guardado correctamente");
      }

      // Reset
      setProductoEditandoId(null);
      setNombre("");
      setDescripcion("");
      setTipoCalculo("m2");
      setPrecioM2("");
      setImagenProducto(null);
      setAnchoMin("");
      setAnchoMax("");
      setVariantes([]);
      setAccesorios([]);
      setMotores([]);
      setListaSeleccionada("");
    } catch (error) {
      console.error("Error al guardar producto:", error);
      setMensaje(`Error: ${error.message}`);
    } finally {
      setSubiendo(false);
    }
  };

  const cargarProductoEnFormulario = (producto) => {
    setProductoEditandoId(producto.id);
    setNombre(producto.nombre || "");
    setDescripcion(producto.descripcion || "");
    setTipoCalculo(producto.tipoCalculo || "m2");
    setPrecioM2(producto.precioM2 || "");
    setListaSeleccionada(producto.listaDePrecios || "");
    setVariantes(producto.variantes || []);
    setAccesorios(producto.accesorios || []);
    setMotores(producto.motores || []);
    setAnchoMin(producto.anchoMin || "");
    setAnchoMax(producto.anchoMax || "");
    setAbrirModalProductos(false);
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
          <Textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div>
          <Label>Imagen del producto</Label>
          <Input
            type="file"
            onChange={(e) => setImagenProducto(e.target.files[0])}
          />
        </div>
        <div>
          <Label>Tipo de cálculo</Label>
          <Select value={tipoCalculo} onValueChange={setTipoCalculo}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="m2">Por m²</SelectItem>
              <SelectItem value="tabla">Por tabla</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {tipoCalculo === "m2" && (
          <div>
            <Label>Precio por m²</Label>
            <Input
              type="number"
              value={precioM2}
              onChange={(e) => setPrecioM2(e.target.value)}
            />
          </div>
        )}
        {tipoCalculo === "tabla" && (
          <div>
            <Label>Lista de precios</Label>
            <Select
              value={listaSeleccionada}
              onValueChange={setListaSeleccionada}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una lista" />
              </SelectTrigger>
              <SelectContent>
                {listasDisponibles.map((nombre) => (
                  <SelectItem key={nombre} value={nombre}>
                    {nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Ancho mínimo (cm)</Label>
            <Input
              type="number"
              value={anchoMin}
              onChange={(e) => setAnchoMin(e.target.value)}
            />
          </div>
          <div>
            <Label>Ancho máximo (cm)</Label>
            <Input
              type="number"
              value={anchoMax}
              onChange={(e) => setAnchoMax(e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Variantes</h3>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Nombre"
              value={nuevaVariante}
              onChange={(e) => setNuevaVariante(e.target.value)}
            />
            <Select value={nuevoStock} onValueChange={setNuevoStock}>
              <SelectTrigger className="min-w-[150px]">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="agotado">Agotado</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="file"
              onChange={(e) => setNuevaImagenVariante(e.target.files[0])}
            />
            <Button onClick={agregarVariante}>Agregar</Button>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {variantes.map((v, i) => (
              <li key={i} className="flex justify-between items-center gap-4">
                <span className="flex-1">{v.nombre}</span>
                <Select
                  value={v.stock}
                  onValueChange={(valor) => {
                    const nuevas = [...variantes];
                    nuevas[i].stock = valor;
                    setVariantes(nuevas);
                  }}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="agotado">Agotado</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => eliminarVariante(i)}
                >
                  Eliminar
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Accesorios</h3>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Nombre"
              value={accesorioNombre}
              onChange={(e) => setAccesorioNombre(e.target.value)}
            />
            <Input
              placeholder="Valor"
              type="number"
              value={accesorioValor}
              onChange={(e) => setAccesorioValor(e.target.value)}
            />
            <Button onClick={agregarAccesorio}>Agregar</Button>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {accesorios.map((a, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>
                  {a.nombre}: ${a.valor}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => eliminarAccesorio(i)}
                >
                  Eliminar
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold">Motorizaciones</h3>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Nombre del motor"
              value={nombreMotor}
              onChange={(e) => setNombreMotor(e.target.value)}
            />
            <Input
              placeholder="Valor"
              type="number"
              value={valorMotor}
              onChange={(e) => setValorMotor(e.target.value)}
            />
            <Button onClick={agregarMotor}>Agregar</Button>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {motores.map((m, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>
                  {m.nombre}: ${m.valor}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => eliminarMotor(i)}
                >
                  Eliminar
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <Button onClick={guardarProducto} disabled={subiendo}>
          Guardar producto
        </Button>
      </div>
      <Dialog open={abrirModalProductos} onOpenChange={setAbrirModalProductos}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4">
            Editar productos
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Editar productos</DialogTitle>{" "}
          {/* 🔧 ESTA LÍNEA SOLUCIONA EL ERROR */}
          <h3 className="font-semibold text-lg mb-2">
            Selecciona un producto para editar
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {productos.map((producto) => (
              <div
                key={producto.id}
                className="border p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => cargarProductoEnFormulario(producto)}
              >
                {producto.nombre}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
