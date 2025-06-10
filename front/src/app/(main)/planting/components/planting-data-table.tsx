"use client";

import type { PlantingRecord } from "@/lib/types";
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
import { Edit, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger as AlertTrigger,
} from "@/components/ui/alert-dialog"


interface PlantingDataTableProps {
  data: PlantingRecord[];
  onEdit: (record: PlantingRecord) => void;
  onDelete: (recordId: string) => void;
}

export function PlantingDataTable({ data, onEdit, onDelete }: PlantingDataTableProps) {
  if (data.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay registros de plantaciones</p>;
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre del cultivo</TableHead>
            <TableHead>Fecha de plantación</TableHead>
            <TableHead>Cantidad/Area</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Foto</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.cropName}</TableCell>
              <TableCell>{format(new Date(record.plantingDate), "PPP")}</TableCell>
              <TableCell>{record.quantity}</TableCell>
              <TableCell>{record.location}</TableCell>
              <TableCell>
                {record.photo ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label="Ver foto de plantación">
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>{record.cropName} - {record.photoFileName || "Foto"}</DialogTitle>
                        <DialogDescription>Ubicación {record.location}</DialogDescription>
                      </DialogHeader>
                      <div className="relative w-full aspect-video rounded-md overflow-hidden mt-2">
                        <Image src={record.photo} alt={record.photoFileName || record.cropName} layout="fill" objectFit="contain" data-ai-hint="crop plant" />
                      </div>
                       <DialogClose asChild><Button className="mt-4">Cerrar</Button></DialogClose>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <span className="text-xs text-muted-foreground">No hay foto</span>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(record)} aria-label="Editar registro de plantación">
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Borrar registro de plantación">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estas seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esta acción eliminará el registro de la planta {record.cropName} ubicada en {record.location}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(record.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Borrar
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
  );
}
