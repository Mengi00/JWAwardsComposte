import { useState, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import CategoryCard from "@/components/CategoryCard";
import VoterForm, { VoterFormData } from "@/components/VoterForm";
import VoteSummary from "@/components/VoteSummary";
import SuccessMessage from "@/components/SuccessMessage";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, Home, Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Category, Dj, DjCategory } from "@shared/schema";

type Step = "voting" | "form" | "summary" | "success";

export default function Voting() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("voting");
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [voterData, setVoterData] = useState<VoterFormData | null>(null);
  const { toast } = useToast();

  const { data: settings } = useQuery<{ votingOpen: boolean }>({
    queryKey: ["/api/settings"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: djs, isLoading: djsLoading } = useQuery<Dj[]>({
    queryKey: ["/api/djs"],
  });

  const { data: djCategories, isLoading: assignmentsLoading } = useQuery<DjCategory[]>({
    queryKey: ["/api/dj-categories"],
  });

  const votingOpen = settings?.votingOpen ?? true;

  const categoriesWithArtists = useMemo(() => {
    if (!categories || !djs || !djCategories) return [];

    return categories.map(category => {
      const categoryDjs = djCategories
        .filter(assignment => assignment.categoryId === category.id)
        .map(assignment => {
          const dj = djs.find(d => d.id === assignment.djId);
          return dj ? { id: dj.id, name: dj.name } : null;
        })
        .filter(Boolean) as { id: string; name: string }[];

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        artists: categoryDjs,
      };
    });
  }, [categories, djs, djCategories]);

  const isLoading = categoriesLoading || djsLoading || assignmentsLoading;

  const submitVoteMutation = useMutation({
    mutationFn: async (data: { votes: Record<string, string>; voterData: VoterFormData }) => {
      const response = await apiRequest("POST", "/api/votes", {
        nombre: data.voterData.nombre,
        rut: data.voterData.rut,
        correo: data.voterData.correo,
        telefono: data.voterData.telefono,
        voteData: JSON.stringify(data.votes),
      });
      return response;
    },
    onSuccess: () => {
      setStep("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (error: any) => {
      toast({
        title: "Error al registrar voto",
        description: error.message || "Hubo un problema al enviar tu voto. Por favor intenta nuevamente.",
        variant: "destructive",
      });
    },
  });

  const handleSelectArtist = (categoryId: string, artistId: string) => {
    setVotes((prev) => ({ ...prev, [categoryId]: artistId }));
  };

  const handleContinueToForm = () => {
    setStep("form");
    setTimeout(() => {
      document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleFormSubmit = (data: VoterFormData) => {
    setVoterData(data);
    setStep("summary");
    setTimeout(() => {
      document.getElementById("summary-section")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleEditVotes = () => {
    setStep("voting");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const handleConfirmVote = () => {
    if (voterData) {
      submitVoteMutation.mutate({ votes, voterData });
    }
  };

  const handleBackToHome = () => {
    setLocation("/");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const allCategoriesVoted = categoriesWithArtists.every((cat) => votes[cat.id]);

  const voteSummary = categoriesWithArtists.map((cat) => {
    const artistId = votes[cat.id];
    const artist = cat.artists.find((a) => a.id === artistId);
    return {
      category: cat.name,
      artistName: artist?.name || "No seleccionado",
    };
  }).filter((v) => v.artistName !== "No seleccionado");

  if (step === "success") {
    return <SuccessMessage onBackToHome={handleBackToHome} />;
  }

  if (!votingOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackToHome}
            className="border-4"
            data-testid="button-back-home"
          >
            <Home className="w-5 h-5" />
          </Button>
          <ThemeToggle />
        </div>
        <Card className="w-full max-w-md border-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-muted flex items-center justify-center border-4 border-border">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl font-black uppercase">
              Votaciones Cerradas
            </CardTitle>
            <CardDescription className="text-base font-semibold">
              El período de votación ha finalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 font-semibold text-muted-foreground">
              Gracias por tu interés. Las votaciones para Johnnie Walker DJ Awards 2024 han sido cerradas.
              Consulta los resultados en la página principal.
            </p>
            <Button
              onClick={handleBackToHome}
              className="font-black uppercase border-4"
              data-testid="button-return-home"
            >
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBackToHome}
          className="border-4"
          data-testid="button-back-home"
        >
          <Home className="w-5 h-5" />
        </Button>
        <ThemeToggle />
      </div>

      <section id="voting-section" className="py-16 px-4 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black uppercase mb-4">
              Categorías
            </h1>
            <p className="text-xl font-semibold text-muted-foreground">
              Selecciona tu artista favorito en cada categoría
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-xl font-semibold text-muted-foreground">
                Cargando categorías...
              </p>
            </div>
          ) : categoriesWithArtists.length === 0 ? (
            <div className="text-center py-16">
              <Card className="max-w-md mx-auto border-4">
                <CardContent className="pt-6">
                  <p className="text-lg font-semibold text-muted-foreground">
                    No hay categorías disponibles en este momento.
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {categoriesWithArtists.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category.name}
                  description={category.description}
                  artists={category.artists}
                  selectedArtist={votes[category.id]}
                  onSelectArtist={(artistId) =>
                    handleSelectArtist(category.id, artistId)
                  }
                />
              ))}
            </div>
          )}

          {step === "voting" && (
            <div className="text-center">
              <Button
                size="lg"
                onClick={handleContinueToForm}
                disabled={!allCategoriesVoted}
                className="text-xl px-16 py-8 font-black uppercase border-4"
                data-testid="button-continue-to-form"
              >
                Continuar
              </Button>
              {!allCategoriesVoted && (
                <p className="mt-4 text-muted-foreground font-semibold">
                  Debes votar en todas las categorías para continuar
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {(step === "form" || step === "summary") && (
        <section id="form-section" className="py-16 px-4 bg-muted/20">
          <VoterForm onSubmit={handleFormSubmit} isLoading={submitVoteMutation.isPending} />
        </section>
      )}

      {step === "summary" && (
        <section id="summary-section" className="py-16 px-4">
          <VoteSummary
            votes={voteSummary}
            onEdit={handleEditVotes}
            onConfirm={handleConfirmVote}
          />
        </section>
      )}

      <Button
        size="icon"
        variant="default"
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-14 h-14 border-4 z-50"
        data-testid="button-scroll-top"
      >
        <ChevronUp className="w-6 h-6" />
      </Button>

      <footer className="border-t-4 border-border py-8 px-4 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-black text-lg mb-2">JOHNNIE WALKER DJ AWARDS 2024</p>
          <p className="text-sm text-muted-foreground font-semibold mb-4">
            © 2024 Johnnie Walker. Todos los derechos reservados.
          </p>
          <p className="italic font-bold text-primary">Keep Walking</p>
        </div>
      </footer>
    </div>
  );
}
