"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { PlantingRecord } from "@/lib/types";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, XCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

const plantingSchema = z.object({
  id: z.string().optional(),
  cropName: z.string().min(2, { message: "Crop name is required." }),
  plantingDate: z.date({ required_error: "Planting date is required." }),
  inputsUsed: z.string().optional(),
  quantity: z.string().min(1, { message: "Quantity is required." }),
  location: z.string().min(2, { message: "Location is required." }),
  photo: z.string().optional(), // Store as data URL string
  photoFileName: z.string().optional(),
});

type PlantingFormValues = z.infer<typeof plantingSchema>;

interface PlantingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlantingRecord) => void;
  defaultValues?: Partial<PlantingRecord>;
}

export function PlantingForm({ isOpen, onClose, onSubmit, defaultValues }: PlantingFormProps) {
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(defaultValues?.photo);
  const [photoFileName, setPhotoFileName] = useState<string | undefined>(defaultValues?.photoFileName);

  const form = useForm<PlantingFormValues>({
    resolver: zodResolver(plantingSchema),
    defaultValues: {
      id: defaultValues?.id || undefined,
      cropName: defaultValues?.cropName || "",
      plantingDate: defaultValues?.plantingDate ? new Date(defaultValues.plantingDate) : undefined,
      inputsUsed: defaultValues?.inputsUsed || "",
      quantity: defaultValues?.quantity || "",
      location: defaultValues?.location || "",
      photo: defaultValues?.photo || undefined,
      photoFileName: defaultValues?.photoFileName || undefined,
    },
  });

 useEffect(() => {
    setPhotoPreview(defaultValues?.photo);
    setPhotoFileName(defaultValues?.photoFileName);
    form.reset({
      id: defaultValues?.id || undefined,
      cropName: defaultValues?.cropName || "",
      plantingDate: defaultValues?.plantingDate ? new Date(defaultValues.plantingDate) : undefined,
      inputsUsed: defaultValues?.inputsUsed || "",
      quantity: defaultValues?.quantity || "",
      location: defaultValues?.location || "",
      photo: defaultValues?.photo || undefined,
      photoFileName: defaultValues?.photoFileName || undefined,
    });
  }, [defaultValues, form]);


  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setPhotoFileName(file.name);
        form.setValue("photo", reader.result as string);
        form.setValue("photoFileName", file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(undefined);
    setPhotoFileName(undefined);
    form.setValue("photo", undefined);
    form.setValue("photoFileName", undefined);
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = (values: PlantingFormValues) => {
    const plantingData: PlantingRecord = {
      id: defaultValues?.id || crypto.randomUUID(),
      ...values,
      inputsUsed: values.inputsUsed ?? "", // Siempre tiene que se un String
      photo: photoPreview, 
      photoFileName: photoFileName,
    };
    onSubmit(plantingData);
    form.reset({ cropName: "", inputsUsed: "", quantity: "", location: ""});
    setPhotoPreview(undefined);
    setPhotoFileName(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{defaultValues?.id ? "Editar registro de siembra" : "Agragar un nuevo registro"}</DialogTitle>
          <DialogDescription>
            {defaultValues?.id ? "Actualizar el registro de siembra" : "Digite los detalles del nuevo registro de siembra."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="cropName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del cultivo</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Maiz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plantingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de la plantación</FormLabel>
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
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inputsUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Aditivos usados (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. Fertilizante XYZ, Semillas ABC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad/Area</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 10 metros cuadrados, 500 kg de semillas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Parcela A1 Campo norte" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Foto (Opcional)</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                </div>
              </FormControl>
              {photoPreview && (
                <div className="mt-2 relative w-full h-48 rounded-md overflow-hidden border">
                  <Image src={photoPreview} alt={photoFileName || "Photo preview"} layout="fill" objectFit="cover" data-ai-hint="crop field" />
                   <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={removePhoto}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                  {photoFileName && <p className="text-xs text-muted-foreground mt-1 truncate">{photoFileName}</p>}
                </div>
              )}
              <FormMessage />
            </FormItem>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
