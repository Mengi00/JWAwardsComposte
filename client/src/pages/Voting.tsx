import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import CategoryCard from "@/components/CategoryCard";
import VoterForm, { VoterFormData } from "@/components/VoterForm";
import VoteSummary from "@/components/VoteSummary";
import SuccessMessage from "@/components/SuccessMessage";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ChevronUp, Home } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = [
  {
    id: "house",
    name: "Best House DJ",
    description: "El mejor DJ de House del año",
    artists: [
      { id: "house-1", name: "DJ Solar" },
      { id: "house-2", name: "Midnight Echo" },
      { id: "house-3", name: "Pulse Wave" },
      { id: "house-4", name: "Neon Lights" },
    ],
  },
  {
    id: "techno",
    name: "Best Techno DJ",
    description: "El mejor DJ de Techno del año",
    artists: [
      { id: "techno-1", name: "Dark Matter" },
      { id: "techno-2", name: "Industrial Pulse" },
      { id: "techno-3", name: "Circuit Break" },
      { id: "techno-4", name: "Analog Dreams" },
    ],
  },
  {
    id: "progressive",
    name: "Best Progressive DJ",
    description: "El mejor DJ de Progressive del año",
    artists: [
      { id: "prog-1", name: "Horizon" },
      { id: "prog-2", name: "Skyline" },
      { id: "prog-3", name: "Aurora" },
      { id: "prog-4", name: "Elevation" },
    ],
  },
  {
    id: "melodic",
    name: "Best Melodic Techno DJ",
    description: "El mejor DJ de Melodic Techno del año",
    artists: [
      { id: "melodic-1", name: "Ethereal" },
      { id: "melodic-2", name: "Cosmic Flow" },
      { id: "melodic-3", name: "Deep Space" },
      { id: "melodic-4", name: "Lunar Waves" },
    ],
  },
  {
    id: "bass",
    name: "Best Bass DJ",
    description: "El mejor DJ de Bass Music del año",
    artists: [
      { id: "bass-1", name: "SubWave" },
      { id: "bass-2", name: "Heavy Drop" },
      { id: "bass-3", name: "Bass Titan" },
      { id: "bass-4", name: "Low Frequency" },
    ],
  },
  {
    id: "newcomer",
    name: "Best Newcomer",
    description: "El mejor DJ revelación del año",
    artists: [
      { id: "new-1", name: "Fresh Beat" },
      { id: "new-2", name: "Rising Star" },
      { id: "new-3", name: "New Wave" },
      { id: "new-4", name: "Breakthrough" },
    ],
  },
  {
    id: "liveset",
    name: "Best Live Set",
    description: "El mejor set en vivo del año",
    artists: [
      { id: "live-1", name: "Live Energy" },
      { id: "live-2", name: "Stage Master" },
      { id: "live-3", name: "Crowd Control" },
      { id: "live-4", name: "Festival King" },
    ],
  },
  {
    id: "djofyear",
    name: "DJ of the Year",
    description: "El mejor DJ del año en todas las categorías",
    artists: [
      { id: "dj-1", name: "Ultimate Mix" },
      { id: "dj-2", name: "Champion Sound" },
      { id: "dj-3", name: "Legendary" },
      { id: "dj-4", name: "Icon" },
    ],
  },
];

type Step = "voting" | "form" | "summary" | "success";

export default function Voting() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("voting");
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [voterData, setVoterData] = useState<VoterFormData | null>(null);
  const { toast } = useToast();

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

  const allCategoriesVoted = CATEGORIES.every((cat) => votes[cat.id]);

  const voteSummary = CATEGORIES.map((cat) => {
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {CATEGORIES.map((category) => (
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
