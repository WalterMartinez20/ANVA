"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, ArrowUpDown, Loader2, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Material {
  id: number
  name: string
  description: string | null
  stock: number
  unit: string | null
  createdAt: string
  updatedAt: string
}

interface ProductMaterial {
  productId: number
  materialId: number
  quantity: number
  product: {
    id: number
    name: string
  }
}

export default function AdminInventario() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  } | null>(null)

  // Estado para el diálogo de ajustar stock
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [newStock, setNewStock] = useState(0)
  const [stockAdjustment, setStockAdjustment] = useState(0)
  const [adjustmentType, setAdjustmentType] = useState<"add" | "subtract">("add")
  const [materialUsage, setMaterialUsage] = useState<ProductMaterial[]>([])

  // Cargar materiales
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch("/api/materials")
        if (!response.ok) throw new Error("Error al cargar materiales")

        const data = await response.json()
        setMaterials(data.materials || [])
      } catch (error) {
        console.error("Error al cargar materiales:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los materiales",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaterials()
  }, [])

  // Filtrar materiales por término de búsqueda
  const filteredMaterials = materials.filter(
    (material) =>
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.description && material.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Ordenar materiales
  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    if (!sortConfig) return 0

    const key = sortConfig.key as keyof Material

    if (a[key] < b[key]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })
  }

  // Abrir diálogo para ajustar stock
  const handleAdjustStock = async (material: Material) => {
    setEditingMaterial(material)
    setNewStock(material.stock)
    setStockAdjustment(0)
    setAdjustmentType("add")

    try {
      // Cargar información de uso del material
      const response = await fetch(`/api/materials/${material.id}`)
      if (!response.ok) throw new Error("Error al cargar detalles del material")

      const data = await response.json()
      setMaterialUsage(data.material.products || [])
    } catch (error) {
      console.error("Error al cargar detalles del material:", error)
      setMaterialUsage([])
    }

    setIsDialogOpen(true)
  }

  // Manejar cambio en el ajuste de stock
  const handleAdjustmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0
    setStockAdjustment(value)

    if (adjustmentType === "add") {
      setNewStock(editingMaterial?.stock ? editingMaterial.stock + value : value)
    } else {
      setNewStock(editingMaterial?.stock ? Math.max(0, editingMaterial.stock - value) : 0)
    }
  }

  // Cambiar tipo de ajuste
  const handleAdjustmentTypeChange = (type: "add" | "subtract") => {
    setAdjustmentType(type)

    if (type === "add") {
      setNewStock(editingMaterial?.stock ? editingMaterial.stock + stockAdjustment : stockAdjustment)
    } else {
      setNewStock(editingMaterial?.stock ? Math.max(0, editingMaterial.stock - stockAdjustment) : 0)
    }
  }

  // Guardar ajuste de stock
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingMaterial) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/materials/${editingMaterial.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingMaterial,
          stock: newStock,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al actualizar stock")
      }

      const data = await response.json()

      // Actualizar material en la lista
      setMaterials(materials.map((m) => (m.id === editingMaterial.id ? data.material : m)))

      toast({
        title: "Stock actualizado",
        description: `El stock de ${editingMaterial.name} ha sido actualizado a ${newStock} ${editingMaterial.unit || "unidades"}`,
      })

      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error al actualizar stock:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar stock",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
        <Button className="flex items-center gap-2" asChild>
          <a href="/admin/materiales">
            <Plus className="h-4 w-4" />
            Nuevo Material
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Materiales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Materiales con Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{materials.filter((m) => m.stock <= 10).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Materiales Agotados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{materials.filter((m) => m.stock <= 0).length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar materiales..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="min-w-[200px]">
                <button className="flex items-center gap-1" onClick={() => requestSort("name")}>
                  Nombre
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>
                <button className="flex items-center gap-1" onClick={() => requestSort("stock")}>
                  Stock
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMaterials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No se encontraron materiales
                </TableCell>
              </TableRow>
            ) : (
              sortedMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.id}</TableCell>
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.description || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={`${
                        material.stock <= 0
                          ? "text-red-500 font-bold"
                          : material.stock <= 10
                            ? "text-amber-500 font-medium"
                            : ""
                      }`}
                    >
                      {material.stock}
                      {material.stock <= 10 && material.stock > 0 && (
                        <AlertTriangle className="h-4 w-4 inline ml-1 text-amber-500" />
                      )}
                      {material.stock <= 0 && <AlertTriangle className="h-4 w-4 inline ml-1 text-red-500" />}
                    </span>
                  </TableCell>
                  <TableCell>{material.unit || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={() => handleAdjustStock(material)}
                        >
                          <Edit className="h-4 w-4" />
                          <span>Ajustar Stock</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo para ajustar stock */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar Stock de {editingMaterial?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentStock" className="text-right">
                  Stock Actual
                </Label>
                <Input id="currentStock" value={editingMaterial?.stock || 0} disabled className="col-span-3 bg-muted" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Ajuste</Label>
                <div className="col-span-3 flex gap-2">
                  <Button
                    type="button"
                    variant={adjustmentType === "add" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => handleAdjustmentTypeChange("add")}
                  >
                    Añadir
                  </Button>
                  <Button
                    type="button"
                    variant={adjustmentType === "subtract" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => handleAdjustmentTypeChange("subtract")}
                  >
                    Restar
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="adjustment" className="text-right">
                  Cantidad
                </Label>
                <Input
                  id="adjustment"
                  type="number"
                  min="0"
                  step="0.1"
                  value={stockAdjustment}
                  onChange={handleAdjustmentChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newStock" className="text-right">
                  Nuevo Stock
                </Label>
                <Input id="newStock" value={newStock} disabled className="col-span-3 bg-muted" />
              </div>

              {/* Mostrar productos que usan este material */}
              {materialUsage.length > 0 && (
                <div className="col-span-4 mt-2">
                  <Label className="mb-2 block">Productos que utilizan este material:</Label>
                  <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                    <ul className="space-y-1">
                      {materialUsage.map((usage) => (
                        <li key={usage.productId} className="text-sm">
                          {usage.product.name} - {usage.quantity} {editingMaterial?.unit || "unidades"} por producto
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
