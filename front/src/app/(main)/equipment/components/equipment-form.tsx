"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { Equipment } from "@/lib/types";
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
import { Calendar } from "@/components/ui/calendar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
}from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const equipmentSchema = z.object({
  id: z.string().optional(), 
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    reference: z.string().min(1, { message: "La referencia es obligatoria" }),
    status : z.enum(["bueno", "necesita_mantenimiento", "fuera_de_servicio"], {required_error: "El estado es obligatorio"}),
    purchaseDate: z.date({
        required_error: "La fecha de compra es obligatoria",
    }),
});
type EquipmentFormValues = z.infer<typeof equipmentSchema>;

interface EquipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Equipment) => void;
  defaultValues?: Partial<Equipment>;
}

export function EquipmentForm({ isOpen, onClose, onSubmit, defaultValues }: EquipmentFormProps) {
  const form = useForm<EquipmentFormValues>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      id: defaultValues?.id || undefined,
      name: defaultValues?.name || "",
      reference: defaultValues?.reference || "",
      status: defaultValues?.status || "bueno",
      purchaseDate: defaultValues?.purchaseDate ? new Date(defaultValues.purchaseDate) : undefined,
    },
  });

  const handleSubmit = (values: EquipmentFormValues) => {
    const equipmentData: Equipment = {
      id: defaultValues?.id || crypto.randomUUID(),
      name: values.name,
      reference: values.reference,
      status: values.status,
      purchaseDate: values.purchaseDate,
    };
    onSubmit(equipmentData);
    form.reset({ name: "", reference: "", status: "bueno", purchaseDate: undefined});
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{defaultValues?.id ? "Editar maquinaria" : "Agregar nueva maquinaria"}</DialogTitle>
          <DialogDescription>
            {defaultValues?.id ? "Actualiza la información de los equipos" : "Digita los detalles de la nueva maquinaria"}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la maquinaria</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Tractor Renault 5075E" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numero de referencia / Serial</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. JD5075E-12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bueno">Buenas condiciones</SelectItem>
                      <SelectItem value="necesita_mantenimiento">Necesita reparación</SelectItem>
                      <SelectItem value="fuera_de_servicio">Fuera de servicio</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de compra</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Elige una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
              <Button type="submit">Guardar maquinaria</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
