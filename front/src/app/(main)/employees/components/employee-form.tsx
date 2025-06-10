"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Employee } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";


const employeeSchema = z.object({
  id: z.string().optional(), // Optional for new employees, present for editing
  name: z.string().min(2, { message: "Pon almenos 2 caracteres" }),
  card: z.string().min(2, {message: "El numero de cedula debe tener almenos 2 caracteres"}), // Optional, can be used for employee ID or card number
  role: z.string().min(2, { message: "El rol debe tener almenos 2 caracteres" }),
  contact: z.string().min(5, { message: "La información es obligatoria" }),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Employee) => void;
  defaultValues?: Partial<Employee>;
}

export function EmployeeForm({ isOpen, onClose, onSubmit, defaultValues }: EmployeeFormProps) {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      id: defaultValues?.id || undefined,
      name: defaultValues?.name || "",
      card: defaultValues?.card || "",
      role: defaultValues?.role || "",
      contact: defaultValues?.contact || "",
    },
  });

  const handleSubmit = (values: EmployeeFormValues) => {
    const employeeData: Employee = {
      // Si defaultValues.id existe entonces estamos editando un empleado existente.
      // Sino entonces generamos un nuevo ID.
      id: defaultValues?.id || crypto.randomUUID(), 
      name: values.name,
        card: values.card,
      role: values.role,
      contact: values.contact,
    };
    onSubmit(employeeData);
    form.reset(); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{defaultValues?.id ? "Edit Employee" : "Add New Employee"}</DialogTitle>
          <DialogDescription>
            {defaultValues?.id ? "Update the employee's details." : "Enter the details for the new employee."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="card"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero de cedula</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingresa el número de cédula" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol/Posición</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Técnico agricola" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Información de contacto</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. +1234567890 or email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Guardar empleado</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
