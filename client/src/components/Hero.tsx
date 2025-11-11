import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import heroImage from "@assets/generated_images/DJ_performing_at_festival_56512bcb.png";
import geometricPattern from "@assets/generated_images/Geometric_neobrutalist_pattern_e3b05fc9.png";

interface HeroProps {
  votingOpen?: boolean;
}

export default function Hero({ votingOpen = true }: HeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      <div 
        className="absolute top-0 right-0 w-1/3 h-full opacity-20 bg-cover bg-center mix-blend-overlay"
        style={{ backgroundImage: `url(${geometricPattern})` }}
      />

      <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-black text-primary mb-4 tracking-tight uppercase" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.3)' }}>
            JOHNNIE WALKER
          </h1>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-2 uppercase">
            DJ AWARDS 2024
          </h2>
          <p className="text-xl md:text-2xl text-white/90 font-bold uppercase tracking-wide">
            Vota por los mejores DJs de música electrónica
          </p>
        </div>

        <div className="max-w-2xl mb-12">
          <p className="text-lg md:text-xl text-white font-semibold">
            Celebramos a los artistas que están redefiniendo la escena electrónica.
            Tu voto decide quién lleva a casa el premio más prestigioso.
          </p>
        </div>

        {votingOpen ? (
          <Link href="/votar" data-testid="link-start-voting">
            <Button 
              size="lg" 
              className="text-xl px-16 py-8 font-black uppercase border-4 hover:scale-105 transition-transform"
              data-testid="button-start-voting"
            >
              Votar Ahora
            </Button>
          </Link>
        ) : (
          <Badge variant="secondary" className="text-xl px-16 py-6 font-black uppercase border-4">
            Votaciones Cerradas
          </Badge>
        )}

        <div className="absolute bottom-8 left-8 text-white/80 italic font-bold text-lg">
          Keep Walking
        </div>
      </div>
    </section>
  );
}
