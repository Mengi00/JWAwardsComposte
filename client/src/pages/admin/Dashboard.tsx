import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AdminLayout from "./AdminLayout";
import { Users, Tag, Vote, ToggleLeft, ToggleRight } from "lucide-react";
import type { Admin } from "@shared/schema";
import { useState, useEffect } from "react";

interface StatsData {
  totalVotes: number;
  totalDJs: number;
  totalCategories: number;
}

interface VotingSettings {
  votingOpen: boolean;
}

export default function Dashboard() {
  const { toast } = useToast();
  const [votingOpen, setVotingOpen] = useState(false);

  const { data: admin } = useQuery<Admin | null>({
    queryKey: ["/api/auth/me"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<StatsData>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: settings, isLoading: settingsLoading } = useQuery<VotingSettings>({
    queryKey: ["/api/admin/settings"],
  });

  useEffect(() => {
    if (settings) {
      setVotingOpen(settings.votingOpen);
    }
  }, [settings]);

  const toggleVotingMutation = useMutation({
    mutationFn: async (open: boolean) => {
      return await apiRequest("PUT", "/api/admin/settings", { votingOpen: open });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: votingOpen ? "Votación cerrada" : "Votación abierta",
        description: votingOpen 
          ? "Los usuarios ya no pueden enviar votos" 
          : "Los usuarios pueden enviar sus votos",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de votación",
        variant: "destructive",
      });
      setVotingOpen(!votingOpen);
    },
  });

  const handleToggleVoting = (checked: boolean) => {
    setVotingOpen(checked);
    toggleVotingMutation.mutate(checked);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black uppercase mb-2" data-testid="text-welcome">
            Bienvenido, {admin?.username}
          </h1>
          <p className="text-muted-foreground font-bold">
            Panel de administración - Johnnie Walker DJ Awards 2024
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-4">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase">Total Votos</CardTitle>
              <Vote className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="text-2xl font-black text-muted-foreground">...</div>
              ) : (
                <div className="text-3xl font-black" data-testid="text-total-votes">
                  {stats?.totalVotes || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground font-semibold mt-1">
                Votos registrados
              </p>
            </CardContent>
          </Card>

          <Card className="border-4">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase">Total DJs</CardTitle>
              <Users className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="text-2xl font-black text-muted-foreground">...</div>
              ) : (
                <div className="text-3xl font-black" data-testid="text-total-djs">
                  {stats?.totalDJs || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground font-semibold mt-1">
                DJs nominados
              </p>
            </CardContent>
          </Card>

          <Card className="border-4">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-black uppercase">Categorías</CardTitle>
              <Tag className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="text-2xl font-black text-muted-foreground">...</div>
              ) : (
                <div className="text-3xl font-black" data-testid="text-total-categories">
                  {stats?.totalCategories || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground font-semibold mt-1">
                Categorías activas
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-4 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase flex items-center gap-2">
              {votingOpen ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
              Control de Votación
            </CardTitle>
            <CardDescription className="font-semibold">
              Abre o cierra el período de votación para los usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 bg-muted/30 border-4 border-border">
              <div>
                <Label htmlFor="voting-toggle" className="text-lg font-black uppercase">
                  Estado de Votación
                </Label>
                <p className="text-sm text-muted-foreground font-semibold mt-1">
                  {settingsLoading ? (
                    "Cargando..."
                  ) : (
                    <span data-testid="text-voting-status">
                      {votingOpen ? "Votación ABIERTA" : "Votación CERRADA"}
                    </span>
                  )}
                </p>
              </div>
              <Switch
                id="voting-toggle"
                checked={votingOpen}
                onCheckedChange={handleToggleVoting}
                disabled={toggleVotingMutation.isPending || settingsLoading}
                className="data-[state=checked]:bg-primary"
                data-testid="switch-voting"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-20 text-lg font-black uppercase border-4"
            onClick={() => window.location.href = "/admin/categories"}
            data-testid="button-nav-categories"
          >
            <Tag className="w-5 h-5 mr-2" />
            Gestionar Categorías
          </Button>
          <Button
            variant="outline"
            className="h-20 text-lg font-black uppercase border-4"
            onClick={() => window.location.href = "/admin/djs"}
            data-testid="button-nav-djs"
          >
            <Users className="w-5 h-5 mr-2" />
            Gestionar DJs
          </Button>
          <Button
            variant="outline"
            className="h-20 text-lg font-black uppercase border-4"
            onClick={() => window.location.href = "/admin/voters"}
            data-testid="button-nav-voters"
          >
            <Vote className="w-5 h-5 mr-2" />
            Ver Votantes
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
