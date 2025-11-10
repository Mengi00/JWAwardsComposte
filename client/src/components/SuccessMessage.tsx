import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import trophyImage from "@assets/generated_images/Golden_angular_trophy_award_b538eb25.png";

interface SuccessMessageProps {
  onBackToHome?: () => void;
}

export default function SuccessMessage({ onBackToHome }: SuccessMessageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="max-w-2xl w-full p-12 border-4 border-primary shadow-[12px_12px_0px_0px_rgba(0,0,0,0.2)] text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-48 h-48 relative">
            <img
              src={trophyImage}
              alt="Trophy"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-20 h-20 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase mb-4">
            ¡Voto Registrado!
          </h1>
          <p className="text-xl font-semibold text-muted-foreground mb-2">
            Tu voto ha sido contabilizado exitosamente
          </p>
          <p className="text-lg font-semibold text-muted-foreground">
            Gracias por participar en los Johnnie Walker DJ Awards 2024
          </p>
        </div>

        <div className="mb-8 p-6 border-4 border-border bg-muted/30">
          <p className="font-black uppercase text-lg mb-2">
            Los ganadores se anunciarán
          </p>
          <p className="text-2xl font-black text-primary">
            31 de Diciembre, 2024
          </p>
        </div>

        {onBackToHome && (
          <Button
            size="lg"
            variant="outline"
            onClick={onBackToHome}
            className="text-lg px-12 py-6 font-black uppercase border-4"
            data-testid="button-back-home"
          >
            Volver al Inicio
          </Button>
        )}

        <div className="mt-8 text-sm text-muted-foreground italic font-bold">
          Keep Walking
        </div>
      </Card>
    </div>
  );
}
