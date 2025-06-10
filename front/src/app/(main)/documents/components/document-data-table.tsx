"use client";

import type { DocumentFile } from "@/lib/types";
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
import { Edit, Trash2, Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "sonner";

interface DocumentDataTableProps {
    data: DocumentFile[];
    onEdit: (file: DocumentFile) => void;
    onDelete: (file: DocumentFile) => void;
}

function formatFileSize(bytes?: number): string{
    if (bytes === 0) return "0 KB";
    if (bytes === undefined) return "N/A";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k)); //Determinar el indice del tamaño
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function DocumentDataTable({ data, onEdit, onDelete }: DocumentDataTableProps) {

  const handleDownload = (doc: DocumentFile) => {
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName || doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Download Started", { description: `${doc.fileName || doc.name} is downloading.` });
    } else {
       toast.error("Download Failed", { description: "File data not available for download." });
    }
  };
  
  const handleView = (doc: DocumentFile) => {
     if (doc.file && doc.file.type.startsWith('image/')) { 
      const url = URL.createObjectURL(doc.file);
      window.open(url, '_blank');
      
    } else if (doc.file) {
        handleDownload(doc); 
    }
    else {
       toast.error("View Failed", { description: "File data not available for viewing." });
    }
  }


  if (data.length === 0) {
    return <p className="text-muted-foreground text-center py-8">No hay documentos aún.</p>;
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo de archivo</TableHead>
            <TableHead>Tamaño del archivo</TableHead>
            <TableHead>Fecha de subida</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.name}</TableCell>
              <TableCell><Badge variant={doc.type === 'contract' ? 'default' : doc.type === 'payroll' ? 'secondary' : 'outline'}>{doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}</Badge></TableCell>
              <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
              <TableCell>{format(new Date(doc.uploadDate), "PPP p")}</TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="ghost" size="icon" onClick={() => handleView(doc)} aria-label="View document" disabled={!doc.file}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)} aria-label="Download document" disabled={!doc.file}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(doc)} aria-label="Edit document info">
                  <Edit className="h-4 w-4" />
                </Button>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Delete document">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no puede ser disuelta, está seguro de eliminar el archivo:{doc.name}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(doc)}
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