import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const CATEGORIES = [
  {
    id: "house",
    name: "Best House DJ",
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
    artists: [
      { id: "dj-1", name: "Ultimate Mix" },
      { id: "dj-2", name: "Champion Sound" },
      { id: "dj-3", name: "Legendary" },
      { id: "dj-4", name: "Icon" },
    ],
  },
];

interface CategoryStats {
  [categoryId: string]: {
    [artistId: string]: number;
  };
}

export default function StatsSection() {
  const { data: stats, isLoading } = useQuery<CategoryStats>({
    queryKey: ["/api/stats"],
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-xl font-bold">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  const totalVotes = Object.values(stats || {}).reduce(
    (total, category) =>
      total + Object.values(category).reduce((sum, votes) => sum + votes, 0),
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-black text-foreground uppercase">
              Estadísticas en Vivo
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Users className="w-5 h-5" />
            <p className="text-lg font-bold">
              {totalVotes} votos totales • Actualización automática cada 5s
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CATEGORIES.map((category) => {
            const categoryStats = stats?.[category.id] || {};
            const categoryTotal = Object.values(categoryStats).reduce(
              (sum, votes) => sum + votes,
              0
            );

            const sortedArtists = [...category.artists].sort((a, b) => {
              const votesA = categoryStats[a.id] || 0;
              const votesB = categoryStats[b.id] || 0;
              return votesB - votesA;
            });

            return (
              <Card
                key={category.id}
                className="border-4 border-foreground bg-card p-6 hover-elevate"
                data-testid={`stats-category-${category.id}`}
              >
                <h2 className="text-2xl font-black text-foreground mb-2 uppercase">
                  {category.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-6 font-bold">
                  {categoryTotal} votos
                </p>

                <div className="space-y-4">
                  {sortedArtists.map((artist, index) => {
                    const votes = categoryStats[artist.id] || 0;
                    const percentage =
                      categoryTotal > 0 ? (votes / categoryTotal) * 100 : 0;
                    const isLeading = index === 0 && votes > 0;

                    return (
                      <div
                        key={artist.id}
                        className="space-y-2"
                        data-testid={`stats-artist-${artist.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isLeading && (
                              <TrendingUp className="w-4 h-4 text-primary" />
                            )}
                            <span
                              className={`font-bold ${
                                isLeading
                                  ? "text-primary text-lg"
                                  : "text-foreground"
                              }`}
                            >
                              {artist.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-lg text-foreground">
                              {votes}
                            </span>
                            <span className="text-muted-foreground text-sm ml-2">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>

                        <div className="relative h-3 bg-muted border-2 border-foreground">
                          <div
                            className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                              isLeading ? "bg-primary" : "bg-accent"
                            }`}
                            style={{ width: `${percentage}%` }}
                            data-testid={`stats-bar-${artist.id}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
