/*
Este componente mostrará la tabla de productos, con sus columnas, imágenes, acciones, y callbacks para editar o eliminar productos.
*/
"use client";

import { Product } from "@/types/producto_admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  ImageIcon,
} from "lucide-react";
import React from "react";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onRequestSort: (key: keyof Product) => void;
  sortKey?: keyof Product;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
  onRequestSort,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead className="min-w-[200px]">
              <button
                className="flex items-center gap-1"
                onClick={() => onRequestSort("name")}
              >
                Nombre
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead>
              <button
                className="flex items-center gap-1"
                onClick={() => onRequestSort("price")}
              >
                Precio
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>
              <button
                className="flex items-center gap-1"
                onClick={() => onRequestSort("stock")}
              >
                Stock
                <ArrowUpDown className="h-4 w-4" />
              </button>
            </TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No se encontraron productos
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {product.images?.length > 0 ? (
                      <img
                        src={
                          product.images.find((img) => img.isMain)?.url ||
                          product.images[0].url
                        }
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-muted flex items-center justify-center rounded-md">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    {product.name}
                  </div>
                </TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.category || "-"}</TableCell>
                <TableCell>
                  <span className={product.stock <= 5 ? "text-red-500" : ""}>
                    {product.stock}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/producto/${product.id}`}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Ver</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Eliminar</span>
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
  );
};
