"use client";

import { useState, useEffect } from "react";
import type { Employee } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EmployeeForm } from "./components/employee-form";
import { EmployeeDataTable } from "./components/employee-data-table";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);

  // Load employees from localStorage on initial render
  useEffect(() => {
    const storedEmployees = localStorage.getItem("agriassist_employees");
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    }
  }, []);

  // Save employees to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("agriassist_employees", JSON.stringify(employees));
  }, [employees]);

  const handleAddEmployee = () => {
    setEditingEmployee(undefined);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== employee.id));
    toast.success("Empleado eliminado", {
      description: "El registro del empleado ha sido eliminado correctamente.",
    });
  };

  const handleFormSubmit = (data: Employee) => {
    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editingEmployee.id ? { ...emp, ...data } : emp))
      );
      toast.success("Empleado actualizado", {
        description: `La información del empleado ${data.name} ha sido actualizada.`,
      });
    } else {
      setEmployees((prev) => [...prev, data]);
      toast.success("Empleado agregado", {
        description: `El empleado ${data.name} ha sido agregado al registro.`,
      });
    }
    setIsFormOpen(false);
    setEditingEmployee(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline mb-2">Registro de empleados</h1>
          <p className="text-muted-foreground">
           Maneja el registro de tus empleados, incluyendo su información personal y laboral.
          </p>
        </div>
        <Button onClick={handleAddEmployee}>
          <PlusCircle className="mr-2 h-4 w-4" /> Agregar empleado
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Empleados registrados</CardTitle>
          <CardDescription>Ver y manejar empleados registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeDataTable
            data={employees}
            onEdit={handleEditEmployee}
            onDelete={handleDeleteEmployee}
          />
        </CardContent>
      </Card>

      {isFormOpen && (
        <EmployeeForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingEmployee(undefined);
          }}
          onSubmit={handleFormSubmit}
          defaultValues={editingEmployee}
        />
      )}
    </div>
  );
}
