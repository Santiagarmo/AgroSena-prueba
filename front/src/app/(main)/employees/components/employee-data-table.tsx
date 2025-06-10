"use client";

import type { Employee } from "@/lib/types";
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

interface EmployeeDataTableProps {
    data: Employee[];
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
}

export function EmployeeDataTable({ data, onEdit, onDelete }: EmployeeDataTableProps) {
  if (data.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay registros de empleados</p>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cedula</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.card}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>{employee.contact}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(employee)} aria-label="Edit employee">
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Delete employee">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esta acción eliminará permanentemente el registro del empleado {employee.name}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(employee)}
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
  );
}