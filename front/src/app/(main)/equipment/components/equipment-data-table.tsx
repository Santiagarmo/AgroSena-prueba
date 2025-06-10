"use client";

import type { Equipment } from "@/lib/types";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Badge } from "@/components/ui/badge";

interface EquipmentDataTableProps {
  data: Equipment[];
  onEdit: (equipment: Equipment) => void;
  onDelete: (equipment: Equipment) => void;
}

const statusMap: Record<Equipment["status"], {label: string, variant: "default" | "secondary" | "destructive" | "outline"}> = {
    bueno: { label: "Buenas condiciones", variant: "default" },
    necesita_mantenimiento: { label: "Necesita mantenimiento", variant: "secondary" },
    fuera_de_servicio: { label: "Fuera de servicio", variant: "destructive" },
};

export function EquipmentDataTable({ data, onEdit, onDelete} : EquipmentDataTableProps) {
    if (data.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No hay registros de maquinaria</p>;
    }
    return (
        <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Referencia</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha de compra</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.reference}</TableCell>
              <TableCell>
                <Badge variant={statusMap[item.status].variant}>
                  {statusMap[item.status].label}
                </Badge>
              </TableCell>
              <TableCell>{format(new Date(item.purchaseDate), "PPP")}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(item)} aria-label="Edit equipment">
                  <Edit className="h-4 w-4" />
                </Button>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Delete equipment">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará el registro para la maquinaria {item.name} con referencias ({item.reference}).
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(item)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    )
}