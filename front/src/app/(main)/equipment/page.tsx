"use client";

import { useState, useEffect } from "react";
import type { Equipment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EquipmentForm } from "./components/equipment-form";
import { EquipmentDataTable } from "./components/equipment-data-table";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function EquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | undefined>(undefined);

  useEffect(() => {
    const storedEquipment = localStorage.getItem("agriassist_equipment");
    if (storedEquipment) {
      // Dates need to be parsed back into Date objects
      const parsedEquipment = JSON.parse(storedEquipment).map((item: Equipment) => ({
        ...item,
        purchaseDate: new Date(item.purchaseDate),
      }));
      setEquipmentList(parsedEquipment);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("agriassist_equipment", JSON.stringify(equipmentList));
  }, [equipmentList]);

  const handleAddEquipment = () => {
    setEditingEquipment(undefined);
    setIsFormOpen(true);
  };

  const handleEditEquipment = (item: Equipment) => {
    setEditingEquipment(item);
    setIsFormOpen(true);
  };

  const handleDeleteEquipment = (equipment: Equipment) => {
    setEquipmentList((prev) => prev.filter((item) => item.id !== equipment.id));
     toast.success("Maquinaria eliminada", {
      description: "El registro de la maquinaria ha sido eliminado.",
    });
  };

  const handleFormSubmit = (data: Equipment) => {
    if (editingEquipment) {
      setEquipmentList((prev) =>
        prev.map((item) => (item.id === editingEquipment.id ? { ...item, ...data } : item))
      );
       toast.success("Maquinaria actualizada", {
        description: `Los detalles de la maquinaria ${data.name} han sido actualizados.`,
      });
    } else {
      setEquipmentList((prev) => [...prev, data]);
      toast.success("Maquinaria registrada", {
        description: `${data.name} ha sido registrada en el inventario.`,
      });
    }
    setIsFormOpen(false);
    setEditingEquipment(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
          <h1 className="text-3xl font-bold font-headline mb-2">Registro de maquinaria</h1>
          <p className="text-muted-foreground">
            Administra y registra todas las herramientas y maquinaria
          </p>
        </div>
        <Button onClick={handleAddEquipment}>
          <PlusCircle className="mr-2 h-4 w-4" /> Agregar maquinaria
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maquinaria registrada</CardTitle>
          <CardDescription>Administra todas tus herramientas y maquinaria</CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentDataTable
            data={equipmentList}
            onEdit={handleEditEquipment}
            onDelete={handleDeleteEquipment}
          />
        </CardContent>
      </Card>

      {isFormOpen && (
        <EquipmentForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingEquipment(undefined);
          }}
          onSubmit={handleFormSubmit}
          defaultValues={editingEquipment}
        />
      )}
    </div>
  );
}
