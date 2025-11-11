import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Vote } from "@shared/schema";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface VotersResponse {
  votes: Vote[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Voters() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: votersData, isLoading } = useQuery<VotersResponse>({
    queryKey: [`/api/admin/voters?page=${page}&limit=${limit}`],
  });

  const handleExport = async () => {
    try {
      const response = await fetch("/api/admin/voters/export", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Error al exportar");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `votantes-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Exportación exitosa",
        description: "El archivo Excel ha sido descargado",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo exportar los datos",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-CL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = votersData?.totalPages || 1;
  const currentPage = votersData?.page || 1;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black uppercase mb-2">Votantes</h1>
            <p className="text-muted-foreground font-bold">
              Lista de todos los votantes registrados
            </p>
          </div>
          <Button
            className="font-black uppercase border-4"
            onClick={handleExport}
            data-testid="button-export-excel"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar a Excel
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12 font-bold text-muted-foreground">
            Cargando votantes...
          </div>
        ) : (
          <>
            <div className="border-4 border-border mb-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-4">
                    <TableHead className="font-black uppercase">Nombre</TableHead>
                    <TableHead className="font-black uppercase">RUT</TableHead>
                    <TableHead className="font-black uppercase">Correo</TableHead>
                    <TableHead className="font-black uppercase">Teléfono</TableHead>
                    <TableHead className="font-black uppercase">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {votersData?.votes?.map((vote) => (
                    <TableRow key={vote.id} className="border-b-4" data-testid={`row-voter-${vote.id}`}>
                      <TableCell className="font-bold">{vote.nombre}</TableCell>
                      <TableCell className="font-mono">{vote.rut}</TableCell>
                      <TableCell className="text-muted-foreground">{vote.correo}</TableCell>
                      <TableCell className="text-muted-foreground">{vote.telefono}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(vote.createdAt.toString())}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground font-semibold" data-testid="text-pagination-info">
                Mostrando {((currentPage - 1) * limit) + 1} - {Math.min(currentPage * limit, votersData?.total || 0)} de {votersData?.total || 0} votantes
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="border-4 font-bold"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      className="border-4 font-black w-10 h-10"
                      onClick={() => setPage(pageNum)}
                      data-testid={`button-page-${pageNum}`}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="border-4 font-bold"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  data-testid="button-next-page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
