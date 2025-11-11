import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

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

const COLORS = ["#F5A623", "#E63946", "#457B9D", "#2A9D8F", "#E76F51", "#264653", "#F4A261", "#E9C46A"];

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
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-xl font-bold">Cargando estadísticas...</p>
          </div>
        </div>
      </section>
    );
  }

  const totalVotes = Object.values(stats || {}).reduce(
    (total, category) =>
      total + Object.values(category).reduce((sum, votes) => sum + votes, 0),
    0
  );

  return (
    <section className="py-16 px-4 bg-background" id="stats-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-primary" />
            <h2 className="text-4xl sm:text-5xl font-black text-foreground uppercase">
              Estadísticas en Vivo
            </h2>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Users className="w-5 h-5" />
            <p className="text-lg font-bold">
              {totalVotes} votos totales • Actualización automática cada 5s
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {CATEGORIES.map((category, categoryIndex) => {
            const categoryStats = stats?.[category.id] || {};
            const categoryTotal = Object.values(categoryStats).reduce(
              (sum, votes) => sum + votes,
              0
            );

            const chartData = category.artists
              .map((artist) => ({
                name: artist.name,
                value: categoryStats[artist.id] || 0,
              }))
              .filter((item) => item.value > 0);

            const hasVotes = chartData.length > 0;

            return (
              <Card
                key={category.id}
                className="border-4 border-foreground bg-card p-6"
                data-testid={`stats-category-${category.id}`}
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-black text-foreground mb-1 uppercase">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-bold">
                    {categoryTotal} votos
                  </p>
                </div>

                {hasVotes ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(1)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          strokeWidth={3}
                          stroke="hsl(var(--foreground))"
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "4px solid hsl(var(--foreground))",
                            borderRadius: 0,
                            fontWeight: "bold",
                          }}
                          formatter={(value: number) => [`${value} votos`, "Votos"]}
                        />
                        <Legend
                          wrapperStyle={{
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center">
                    <p className="text-muted-foreground font-bold text-center">
                      No hay votos aún en esta categoría
                    </p>
                  </div>
                )}

                <div className="mt-6 space-y-2 border-t-4 border-foreground pt-4">
                  {category.artists.map((artist) => {
                    const votes = categoryStats[artist.id] || 0;
                    const percentage =
                      categoryTotal > 0 ? (votes / categoryTotal) * 100 : 0;

                    return (
                      <div
                        key={artist.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="font-bold text-foreground">
                          {artist.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-foreground">{votes}</span>
                          <span className="text-muted-foreground">
                            ({percentage.toFixed(1)}%)
                          </span>
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
    </section>
  );
}
