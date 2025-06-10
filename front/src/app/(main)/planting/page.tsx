"use client";

import { useState, useEffect } from "react";
import type { PlantingRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PlantingForm } from "./components/planting-form";
import { PlantingDataTable } from "./components/planting-data-table";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlantingPage() {
  const [plantingRecords, setPlantingRecords] = useState<PlantingRecord[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PlantingRecord | undefined>(undefined);

  useEffect(() => {
    const storedRecords = localStorage.getItem("agriassist_planting_records");
    if (storedRecords) {
      const parsedRecords = JSON.parse(storedRecords).map((record: PlantingRecord) => ({
        ...record,
        plantingDate: new Date(record.plantingDate),
      }));
      setPlantingRecords(parsedRecords);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("agriassist_planting_records", JSON.stringify(plantingRecords));
  }, [plantingRecords]);

  const handleAddRecord = () => {
    setEditingRecord(undefined);
    setIsFormOpen(true);
  };

  const handleEditRecord = (record: PlantingRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const handleDeleteRecord = (recordId: string) => {
    setPlantingRecords((prev) => prev.filter((rec) => rec.id !== recordId));
    toast.success("Plantación eliminada", {
      description: "El registro de la plantación ha sido eliminado correctamente.",
    });
  };

  const handleFormSubmit = (data: PlantingRecord) => {
    if (editingRecord) {
      setPlantingRecords((prev) =>
        prev.map((rec) => (rec.id === editingRecord.id ? { ...rec, ...data } : rec))
      );
      toast.success("Registro actualizado", {
        description: `La plantación ${data.cropName} ha sido actualizada.`,
      });
    } else {
      setPlantingRecords((prev) => [...prev, data]);
      toast.success("Agregar registro", {
        description: `La plantación ${data.cropName} ha sido agregada.`,
      });
    }
    setIsFormOpen(false);
    setEditingRecord(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline mb-2">Control de plantaciones</h1>
          <p className="text-muted-foreground">
            Controla las actividades de plantación de tu predio
          </p>
        </div>
        <Button onClick={handleAddRecord}>
          <PlusCircle className="mr-2 h-4 w-4" /> Agregar plantación
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Plantaciones registradas</CardTitle>
          <CardDescription>Ver y manejar todos los registros de las plantaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <PlantingDataTable
            data={plantingRecords}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
          />
        </CardContent>
      </Card>

      {isFormOpen && (
        <PlantingForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingRecord(undefined);
          }}
          onSubmit={handleFormSubmit}
          defaultValues={editingRecord}
        />
      )}
    </div>
  );
}
