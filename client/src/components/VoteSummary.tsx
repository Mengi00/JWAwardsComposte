import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Edit } from "lucide-react";

interface VoteSummaryItem {
  category: string;
  artistName: string;
}

interface VoteSummaryProps {
  votes: VoteSummaryItem[];
  onEdit: () => void;
  onConfirm: () => void;
}

export default function VoteSummary({ votes, onEdit, onConfirm }: VoteSummaryProps) {
  return (
    <Card className="max-w-3xl mx-auto p-8 border-4 border-border shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Check className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-black uppercase">Resumen de Votos</h2>
        </div>
        <p className="text-muted-foreground font-semibold">
          Revisa tus selecciones antes de enviar
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {votes.map((vote, index) => (
          <div key={index}>
            <div className="flex justify-between items-center py-4">
              <div>
                <h3 className="font-black text-lg uppercase text-muted-foreground">
                  {vote.category}
                </h3>
                <p className="text-xl font-bold mt-1" data-testid={`summary-artist-${index}`}>
                  {vote.artistName}
                </p>
              </div>
              <Check className="w-6 h-6 text-primary" />
            </div>
            {index < votes.length - 1 && <Separator className="bg-border h-[2px]" />}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={onEdit}
          className="flex-1 text-lg py-6 font-black uppercase border-4"
          data-testid="button-edit-votes"
        >
          <Edit className="w-5 h-5 mr-2" />
          Editar
        </Button>
        <Button
          size="lg"
          onClick={onConfirm}
          className="flex-1 text-lg py-6 font-black uppercase border-4"
          data-testid="button-confirm-votes"
        >
          <Check className="w-5 h-5 mr-2" />
          Confirmar
        </Button>
      </div>
    </Card>
  );
}
