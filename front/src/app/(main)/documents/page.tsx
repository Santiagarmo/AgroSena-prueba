"use client";

import { useState, useEffect } from "react";
import type { DocumentFile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DocumentForm } from "./components/document-form";
import { DocumentDataTable } from "./components/document-data-table";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentFile | undefined>(undefined);

  useEffect(() => {
    const storedDocuments = localStorage.getItem("agriassist_documents");
    if (storedDocuments) {
      const parsedDocs = JSON.parse(storedDocuments).map((doc: DocumentFile) => ({
        ...doc,
        uploadDate: new Date(doc.uploadDate),
        file: undefined,
      }));
      setDocuments(parsedDocs);
    }
  }, []);

  useEffect(() => {
        // cuando se actualizan los documentos, se guardan en localStorage
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const docsToStore = documents.map(({ file, ...rest }) => rest);
    localStorage.setItem("agriassist_documents", JSON.stringify(docsToStore));
  }, [documents]);

  const handleAddDocument = () => {
    setEditingDocument(undefined);
    setIsFormOpen(true);
  };

  const handleEditDocument = (doc: DocumentFile) => {
    setEditingDocument(doc);
    setIsFormOpen(true);
  };

  const handleDeleteDocument = (file: DocumentFile) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== file.id));
    toast.success("Documento eliminado", {
      description: "El documento ha sido eliminado correctamente.",
    });
  };

  const handleFormSubmit = (data: DocumentFile) => {
    if (editingDocument) {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === editingDocument.id ? { ...editingDocument, ...data, file: data.file || editingDocument.file } : doc))
      );
       toast.success("Documento actualizado", {
        description: `La información para ${data.name} ha sido actualizada.`,
      });
    } else {
      setDocuments((prev) => [...prev, data]);
      toast.success("Documento enviado", {
        description: `${data.name} ha sido cargado correctamente.`,
      });
    }
    setIsFormOpen(false);
    setEditingDocument(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
          <h1 className="text-3xl font-bold font-headline mb-2">Manejo de documentos</h1>
          <p className="text-muted-foreground">
            Manejo de contratos, nóminas y otros documentos importantes
          </p>
        </div>
        <Button onClick={handleAddDocument}>
          <PlusCircle className="mr-2 h-4 w-4" /> Cargar documento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documentos cargados</CardTitle>
          <CardDescription>Ver, descargar y manejar todos los documetos de la granja</CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentDataTable
            data={documents}
            onEdit={handleEditDocument}
            onDelete={handleDeleteDocument}
          />
        </CardContent>
      </Card>

      {isFormOpen && (
        <DocumentForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingDocument(undefined);
          }}
          onSubmit={handleFormSubmit}
          defaultValues={editingDocument}
        />
      )}
    </div>
  );
}
