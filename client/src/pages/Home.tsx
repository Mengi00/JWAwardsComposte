import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import ParticipantsSection from "@/components/ParticipantsSection";
import StatsSection from "@/components/StatsSection";
import WinnersSection from "@/components/WinnersSection";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const { data: settings } = useQuery<{ votingOpen: boolean }>({
    queryKey: ["/api/settings"],
  });

  const votingOpen = settings?.votingOpen ?? true;

  return (
    <div className="min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <Hero votingOpen={votingOpen} />

      <ParticipantsSection />

      {!votingOpen && <WinnersSection />}

      <StatsSection />

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
