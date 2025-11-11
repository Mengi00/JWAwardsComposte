import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDjSchema } from "@shared/schema";
import type { Dj, InsertDj } from "@shared/schema";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export default function DJs() {
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingDj, setEditingDj] = useState<Dj | null>(null);

  const { data: djs, isLoading } = useQuery<Dj[]>({
    queryKey: ["/api/admin/djs"],
  });

  const addForm = useForm<InsertDj>({
    resolver: zodResolver(insertDjSchema),
    defaultValues: {
      name: "",
      photo: null,
      bio: null,
    },
  });

  const editForm = useForm<InsertDj>({
    resolver: zodResolver(insertDjSchema),
    defaultValues: {
      name: "",
      photo: null,
      bio: null,
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: InsertDj) => {
      return await apiRequest("POST", "/api/admin/djs", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/djs"] });
      toast({
        title: "DJ agregado",
        description: "El DJ ha sido agregado exitosamente",
      });
      setAddOpen(false);
      addForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo agregar el DJ",
        variant: "destructive",
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertDj }) => {
      return await apiRequest("PUT", `/api/admin/djs/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/djs"] });
      toast({
        title: "DJ actualizado",
        description: "El DJ ha sido actualizado exitosamente",
      });
      setEditOpen(false);
      setEditingDj(null);
      editForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el DJ",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/djs/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/djs"] });
      toast({
        title: "DJ eliminado",
        description: "El DJ ha sido eliminado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el DJ",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (dj: Dj) => {
    setEditingDj(dj);
    editForm.reset({
      name: dj.name,
      photo: dj.photo || "",
      bio: dj.bio || "",
    });
    setEditOpen(true);
  };

  const onAddSubmit = (data: InsertDj) => {
    addMutation.mutate(data);
  };

  const onEditSubmit = (data: InsertDj) => {
    if (editingDj) {
      editMutation.mutate({ id: editingDj.id, data });
    }
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black uppercase mb-2">DJs</h1>
            <p className="text-muted-foreground font-bold">
              Gestiona los DJs nominados
            </p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="font-black uppercase border-4" data-testid="button-add-dj">
                <Plus className="w-4 h-4 mr-2" />
                Agregar DJ
              </Button>
            </DialogTrigger>
            <DialogContent className="border-4">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black uppercase">Nuevo DJ</DialogTitle>
                <DialogDescription className="font-semibold">
                  Agrega un nuevo DJ a la plataforma
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
                          <Input {...field} className="border-4" data-testid="input-dj-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="photo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">URL de Foto</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-4" placeholder="https://..." data-testid="input-dj-photo" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold">Biografía</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="border-4" rows={4} data-testid="input-dj-bio" />
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
                      data-testid="button-submit-dj"
                    >
                      {addMutation.isPending ? "Agregando..." : "Agregar DJ"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12 font-bold text-muted-foreground">Cargando DJs...</div>
        ) : (
          <div className="border-4 border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-b-4">
                  <TableHead className="font-black uppercase">Foto</TableHead>
                  <TableHead className="font-black uppercase">Nombre</TableHead>
                  <TableHead className="font-black uppercase">Biografía</TableHead>
                  <TableHead className="font-black uppercase text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {djs?.map((dj) => (
                  <TableRow key={dj.id} className="border-b-4" data-testid={`row-dj-${dj.id}`}>
                    <TableCell>
                      <Avatar className="border-4 border-border w-12 h-12">
                        <AvatarImage src={dj.photo || ""} alt={dj.name} />
                        <AvatarFallback className="font-black uppercase">
                          {dj.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-bold">{dj.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-md truncate">
                      {dj.bio || "Sin biografía"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-4 font-bold"
                          onClick={() => handleEdit(dj)}
                          data-testid={`button-edit-dj-${dj.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-4 font-bold"
                              data-testid={`button-delete-dj-${dj.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="border-4">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-2xl font-black uppercase">
                                ¿Eliminar DJ?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="font-semibold">
                                Esta acción no se puede deshacer. Se eliminará el DJ "{dj.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-4 font-bold">Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="border-4 font-bold"
                                onClick={() => deleteMutation.mutate(dj.id)}
                                data-testid={`button-confirm-delete-${dj.id}`}
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
              <DialogTitle className="text-2xl font-black uppercase">Editar DJ</DialogTitle>
              <DialogDescription className="font-semibold">
                Actualiza la información del DJ
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
                        <Input {...field} className="border-4" data-testid="input-edit-dj-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">URL de Foto</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-4" placeholder="https://..." data-testid="input-edit-dj-photo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Biografía</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="border-4" rows={4} data-testid="input-edit-dj-bio" />
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
                    data-testid="button-submit-edit-dj"
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
