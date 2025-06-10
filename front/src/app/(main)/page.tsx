
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart, LineChart, PieChart } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Tablero</h1>
            <p className="text-muted-foreground">
                Bievenidos al tablero de control de AgroSena. Aquí puedes acceder a las diferentes secciones del sistema y visualizar información relevante.
            </p>

            <div className="grid gap-6 md:grid-cols-6 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Acciones rápidas</CardTitle>
                        <CardDescription>Maneja tus recursos eficientemente</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button asChild className="w-full justify-start hover:bg-gray-200">
                        <Link href="/employees">Manejar empleados</Link>
                        </Button>
                        <Button asChild className="w-full justify-start hover:bg-gray-200">
                        <Link href="/equipment">Manejar equipos</Link>
                        </Button>
                        <Button asChild className="w-full justify-start hover:bg-gray-200">
                        <Link href="/planting">Panel de control</Link>
                        </Button>
                        <Button asChild className="w-full justify-start hover:bg-gray-200">
                        <Link href="/documents">Manejar docuemtos</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Notificaciones</CardTitle>
                        <CardDescription>Mantente al día con tus tareas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                        Tienes 3 notificaciones nuevas. Haz clic en el botón para verlas.
                        </p>
                        <Button asChild variant="link" className="px-0">
                        <Link href="/notifications">Ver notifiaciones</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Estadisticas agrarias</CardTitle>
                        <CardDescription>Contenido para las tablas visuales</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-40 space-y-2">
                        <div className="flex space-x-4 text-muted-foreground">
                        <BarChart className="h-10 w-10" />
                        <LineChart className="h-10 w-10" />
                        <PieChart className="h-10 w-10" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                        Las gráficas se verán acá
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        SMS & notificaciones SMS
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        AgroSena implementará las opciones de SMS en un futuro.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}


