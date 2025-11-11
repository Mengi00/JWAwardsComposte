import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryStats {
  [categoryId: string]: {
    [artistId: string]: number;
  };
}

export default function WinnersSection() {
  const { data: stats } = useQuery<CategoryStats>({
    queryKey: ["/api/stats"],
  });

  const { data: categories } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  if (!stats || !categories || categories.length === 0) {
    return null;
  }

  const getWinner = (categoryId: string) => {
    const categoryStats = stats[categoryId];
    if (!categoryStats) return null;

    let maxVotes = 0;
    let winnerId = "";

    for (const [artistId, votes] of Object.entries(categoryStats)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        winnerId = artistId;
      }
    }

    return { winnerId, votes: maxVotes };
  };

  const { data: djs } = useQuery<any[]>({
    queryKey: ["/api/djs"],
  });

  return (
    <section className="py-16 px-4 bg-primary/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary flex items-center justify-center border-4 border-border">
              <Trophy className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-black uppercase mb-4">
            Ganadores 2024
          </h2>
          <p className="text-xl font-semibold text-muted-foreground">
            Los artistas más votados de cada categoría
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const winner = getWinner(category.id);
            if (!winner || !winner.winnerId) return null;

            const winnerDj = djs?.find(dj => dj.id === winner.winnerId);

            return (
              <Card key={category.id} className="border-4 hover-elevate">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl font-black uppercase flex-1">
                      {category.name}
                    </CardTitle>
                    <Badge className="border-2 font-black">
                      <Trophy className="w-3 h-3 mr-1" />
                      GANADOR
                    </Badge>
                  </div>
                  <CardDescription className="font-semibold">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {winnerDj && (
                    <div className="flex items-center gap-4">
                      {winnerDj.photo && (
                        <img
                          src={winnerDj.photo}
                          alt={winnerDj.name}
                          className="w-16 h-16 object-cover border-4 border-border"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-black text-lg uppercase">{winnerDj.name}</p>
                        <p className="text-sm text-muted-foreground font-semibold">
                          {winner.votes} votos
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
