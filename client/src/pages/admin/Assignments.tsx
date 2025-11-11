import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Category, Dj, DjCategory } from "@shared/schema";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface AssignmentData {
  djId: string;
  categoryId: string;
  id: string;
}

export default function Assignments() {
  const { toast } = useToast();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/admin/categories"],
  });

  const { data: djs, isLoading: djsLoading } = useQuery<Dj[]>({
    queryKey: ["/api/admin/djs"],
  });

  const { data: assignments, isLoading: assignmentsLoading } = useQuery<AssignmentData[]>({
    queryKey: ["/api/admin/dj-categories"],
  });

  const addAssignmentMutation = useMutation({
    mutationFn: async (data: { djId: string; categoryId: string }) => {
      return await apiRequest("POST", "/api/admin/dj-categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dj-categories"] });
      toast({
        title: "Asignación creada",
        description: "El DJ ha sido asignado a la categoría",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la asignación",
        variant: "destructive",
      });
    },
  });

  const removeAssignmentMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/dj-categories/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dj-categories"] });
      toast({
        title: "Asignación eliminada",
        description: "El DJ ha sido removido de la categoría",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la asignación",
        variant: "destructive",
      });
    },
  });

  const getAssignedDjs = (categoryId: string): Dj[] => {
    if (!assignments || !djs) return [];
    const assignedDjIds = assignments
      .filter((a) => a.categoryId === categoryId)
      .map((a) => a.djId);
    return djs.filter((dj) => assignedDjIds.includes(dj.id));
  };

  const getAvailableDjs = (categoryId: string): Dj[] => {
    if (!assignments || !djs) return [];
    const assignedDjIds = assignments
      .filter((a) => a.categoryId === categoryId)
      .map((a) => a.djId);
    return djs.filter((dj) => !assignedDjIds.includes(dj.id));
  };

  const getAssignmentId = (djId: string, categoryId: string): string | undefined => {
    return assignments?.find((a) => a.djId === djId && a.categoryId === categoryId)?.id;
  };

  const handleAddAssignment = (djId: string, categoryId: string) => {
    addAssignmentMutation.mutate({ djId, categoryId });
  };

  const handleRemoveAssignment = (djId: string, categoryId: string) => {
    const assignmentId = getAssignmentId(djId, categoryId);
    if (assignmentId) {
      removeAssignmentMutation.mutate(assignmentId);
    }
  };

  const isLoading = categoriesLoading || djsLoading || assignmentsLoading;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase mb-2">Asignaciones</h1>
          <p className="text-muted-foreground font-bold">
            Asigna DJs a categorías de votación
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 font-bold text-muted-foreground">
            Cargando asignaciones...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-4">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase">Categorías</CardTitle>
                <CardDescription className="font-semibold">
                  Selecciona una categoría para gestionar sus DJs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories?.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`w-full text-left p-4 border-4 border-border font-bold hover-elevate active-elevate-2 transition-colors ${
                      selectedCategoryId === category.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card"
                    }`}
                    data-testid={`button-category-${category.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-black uppercase">{category.name}</div>
                        <div className="text-sm opacity-80">{category.description}</div>
                      </div>
                      <Badge variant="outline" className="border-4">
                        {getAssignedDjs(category.id).length} DJs
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-4">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase">
                  {selectedCategoryId
                    ? categories?.find((c) => c.id === selectedCategoryId)?.name
                    : "Selecciona una categoría"}
                </CardTitle>
                <CardDescription className="font-semibold">
                  {selectedCategoryId
                    ? "Gestiona los DJs asignados a esta categoría"
                    : "Elige una categoría de la izquierda"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCategoryId ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black uppercase mb-3">DJs Asignados</h3>
                      <div className="space-y-2">
                        {getAssignedDjs(selectedCategoryId).length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground font-semibold">
                            No hay DJs asignados
                          </div>
                        ) : (
                          getAssignedDjs(selectedCategoryId).map((dj) => (
                            <div
                              key={dj.id}
                              className="flex items-center justify-between p-3 border-4 border-border bg-card"
                              data-testid={`assigned-dj-${dj.id}`}
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="border-4 border-border w-10 h-10">
                                  <AvatarImage src={dj.photo || ""} alt={dj.name} />
                                  <AvatarFallback className="font-black uppercase text-xs">
                                    {dj.name.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-bold">{dj.name}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-4"
                                onClick={() => handleRemoveAssignment(dj.id, selectedCategoryId)}
                                disabled={removeAssignmentMutation.isPending}
                                data-testid={`button-remove-dj-${dj.id}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-black uppercase mb-3">DJs Disponibles</h3>
                      <div className="space-y-2">
                        {getAvailableDjs(selectedCategoryId).length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground font-semibold">
                            Todos los DJs están asignados
                          </div>
                        ) : (
                          getAvailableDjs(selectedCategoryId).map((dj) => (
                            <div
                              key={dj.id}
                              className="flex items-center justify-between p-3 border-4 border-border bg-card"
                              data-testid={`available-dj-${dj.id}`}
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="border-4 border-border w-10 h-10">
                                  <AvatarImage src={dj.photo || ""} alt={dj.name} />
                                  <AvatarFallback className="font-black uppercase text-xs">
                                    {dj.name.substring(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-bold">{dj.name}</span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-4"
                                onClick={() => handleAddAssignment(dj.id, selectedCategoryId)}
                                disabled={addAssignmentMutation.isPending}
                                data-testid={`button-add-dj-${dj.id}`}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground font-semibold">
                    Selecciona una categoría para comenzar
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
