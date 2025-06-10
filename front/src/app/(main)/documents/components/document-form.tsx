"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { DocumentFile } from "@/lib/types";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import React, { useState, useEffect } from 'react';

const MaxFileSize = 5 * 1024 * 1024; // El peso máximo del archivo es de 5 MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]; // Tipos de archivos aceptados


const DocumentFormSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "El nombre es obligatorio"),
    type: z.enum(["contract", "payroll", "other"], {
        required_error: "El tipo de documento es obligatorio",
    }),
    file: z.any().refine((files) => files?.[0], "El archivo es obligatorio.")
    .refine((files) => files?.[0]?.size <= MaxFileSize, `El tamaño máximo es de 5MB.`)
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Formato invalido. Por favor sube un archivo .PDF, DOC, DOCX, JPG, o PNG."
    ).optional()
});

type DocumentFormValues = z.infer<typeof DocumentFormSchema>;

interface DocumentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DocumentFile) => void;
  defaultValues?: Partial<DocumentFile>;
}

export function DocumentForm({ isOpen, onClose, onSubmit, defaultValues }: DocumentFormProps) {
    const [fileName, setFileName] = useState<string | undefined>(defaultValues?.fileName);

    const formSchemaWithConditionalFile = defaultValues?.id
    ? DocumentFormSchema.omit({ file: true })
    : DocumentFormSchema;

    const form = useForm<DocumentFormValues>({
        resolver: zodResolver(formSchemaWithConditionalFile),
        defaultValues: {
            id: defaultValues?.id || "",
            name: defaultValues?.name || "",
            type: defaultValues?.type || "other",
        },
    });

    useEffect(() => {
    setFileName(defaultValues?.fileName);
    form.reset({
      id: defaultValues?.id || undefined,
      name: defaultValues?.name || defaultValues?.fileName || "", // Prefill name with filename if new and name is empty
      type: defaultValues?.type || "other",
    });
  }, [defaultValues, form]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!form.getValues("name")) { // If name field is empty, prefill with filename
        form.setValue("name", file.name.substring(0, file.name.lastIndexOf('.')) || file.name);
      }
    } else {
      setFileName(undefined);
    }
  };

  const handleSubmit = (values: DocumentFormValues) => {
    const actualFile = values.file?.[0] as File | undefined;
    const documentData: DocumentFile = {
      id: defaultValues?.id || crypto.randomUUID(),
      name: values.name,
      type: values.type,
      uploadDate: defaultValues?.id ? defaultValues.uploadDate! : new Date(),
      file: actualFile, 
      fileName: actualFile ? actualFile.name : defaultValues?.fileName,
      fileSize: actualFile ? actualFile.size : defaultValues?.fileSize,
    };
    onSubmit(documentData);
    form.reset({ name: "", type: "other", file: undefined});
    setFileName(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{defaultValues?.id ? "Editar información" : "Subir nuevo documento"}</DialogTitle>
          <DialogDescription>
            {defaultValues?.id ? "Actualizar la información del documento." : "Selecciona un archivo para subir."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del documento</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Contrato de empleado: Santiago García" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de documento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="contract">Contrato</SelectItem>
                      <SelectItem value="payroll">Pagos</SelectItem>
                      <SelectItem value="other">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>{defaultValues?.id ? "Replace File (Optional)" : "File"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      {...rest}
                      onChange={(e) => {
                        onChange(e.target.files); 
                        handleFileChange(e);    
                      }}
                      className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </FormControl>
                  {fileName && <p className="text-xs text-muted-foreground mt-1">Seleccionado: {fileName}</p>}
                  {defaultValues?.id && defaultValues.fileName && !fileName && <p className="text-xs text-muted-foreground mt-1">Documento actual {defaultValues.fileName}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Guardar documento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}