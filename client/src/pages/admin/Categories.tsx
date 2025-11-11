import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCategorySchema } from "@shared/schema";
import type { Category, InsertCategory } from "@shared/schema";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Categories() {
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/admin/categories"],
  });

  const addForm = useForm<InsertCategory>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      order: 0,
    },
  });

  const editForm = useForm<InsertCategory>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      order: 0,
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: InsertCategory) => {
      return await apiRequest("POST", "/api/admin/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({
        title: "Categoría creada",
        description: "La categoría ha sido creada exitosamente",
      });
      setAddOpen(false);
      addForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        variant: "destructive",
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertCategory }) => {
      return await apiRequest("PUT", `/api/admin/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({
        title: "Categoría actualizada",
        description: "La categoría ha sido actualizada exitosamente",
      });
      setEditOpen(false);
      setEditingCategory(null);
      editForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la categoría",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/categories/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    editForm.reset({
      name: category.name,
      description: category.description,
      order: category.order,
    });
    setEditOpen(true);
  };

  const onAddSubmit = (data: InsertCategory) => {
    addMutation.mutate(data);
  };

  const onEditSubmit = (data: InsertCategory) => {
    if (editingCategory) {
      editMutation.mutate({ id: editingCategory.id, data });
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black uppercase mb-2">Categorías</h1>
            <p className="text-muted-foreground font-bold">
              Gestiona las categorías de votación
            </p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="font-black uppercase border-4" data-testid="button-add-category">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Categoría
              </Button>
            </DialogTrigger>
            <DialogContent className="border-4">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black uppercase">Nueva Categoría</DialogTitle>
                <DialogDescription className="font-semibold">
                  Crea una nueva categoría de votación
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Nombre</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-4" data-testid="input-category-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Descripción</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="border-4" data-testid="input-category-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Orden</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            className="border-4"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-category-order"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="font-black uppercase border-4"
                      disabled={addMutation.isPending}
                      data-testid="button-submit-category"
                    >
                      {addMutation.isPending ? "Creando..." : "Crear Categoría"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12 font-bold text-muted-foreground">Cargando categorías...</div>
        ) : (
          <div className="border-4 border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-b-4">
                  <TableHead className="font-black uppercase">Nombre</TableHead>
                  <TableHead className="font-black uppercase">Descripción</TableHead>
                  <TableHead className="font-black uppercase">Orden</TableHead>
                  <TableHead className="font-black uppercase text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.map((category) => (
                  <TableRow key={category.id} className="border-b-4" data-testid={`row-category-${category.id}`}>
                    <TableCell className="font-bold">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.description}</TableCell>
                    <TableCell className="font-bold">{category.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-4 font-bold"
                          onClick={() => handleEdit(category)}
                          data-testid={`button-edit-category-${category.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-4 font-bold"
                              data-testid={`button-delete-category-${category.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="border-4">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl font-black uppercase">
                                ¿Eliminar categoría?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="font-semibold">
                                Esta acción no se puede deshacer. Se eliminará la categoría "{category.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-4 font-bold">Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="border-4 font-bold"
                                onClick={() => deleteMutation.mutate(category.id)}
                                data-testid={`button-confirm-delete-${category.id}`}
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="border-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase">Editar Categoría</DialogTitle>
              <DialogDescription className="font-semibold">
                Actualiza la información de la categoría
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Nombre</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-4" data-testid="input-edit-category-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Descripción</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="border-4" data-testid="input-edit-category-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Orden</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="border-4"
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          data-testid="input-edit-category-order"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    className="font-black uppercase border-4"
                    disabled={editMutation.isPending}
                    data-testid="button-submit-edit-category"
                  >
                    {editMutation.isPending ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
