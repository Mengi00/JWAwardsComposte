import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Users, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useMemo } from "react";

type Category = {
  id: string;
  name: string;
  description: string;
  order: number;
};

type DJ = {
  id: string;
  name: string;
  photo: string | null;
  bio: string | null;
};

type DJCategory = {
  id: string;
  djId: string;
  categoryId: string;
};

interface CategoryStats {
  [categoryId: string]: {
    [djId: string]: number;
  };
}

type CategoryWithDJs = {
  category: Category;
  djs: DJ[];
};

export default function StatsSection() {
  const { data: stats, isLoading: statsLoading } = useQuery<CategoryStats>({
    queryKey: ["/api/stats"],
    refetchInterval: 5000,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: djs = [], isLoading: djsLoading } = useQuery<DJ[]>({
    queryKey: ["/api/djs"],
  });

  const { data: djCategories = [], isLoading: assignmentsLoading } = useQuery<DJCategory[]>({
    queryKey: ["/api/dj-categories"],
  });

  const categoriesWithDJs = useMemo<CategoryWithDJs[]>(() => {
    return [...categories]
      .sort((a, b) => a.order - b.order)
      .map((category) => {
        const categoryDJIds = djCategories
          .filter((dc) => dc.categoryId === category.id)
          .map((dc) => dc.djId);
        
        const categoryDJs = djs.filter((dj) => categoryDJIds.includes(dj.id));
        
        return {
          category,
          djs: categoryDJs,
        };
      })
      .filter((item) => item.djs.length > 0);
  }, [categories, djs, djCategories]);

  const isLoading = statsLoading || categoriesLoading || djsLoading || assignmentsLoading;

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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categoriesWithDJs.map(({ category, djs: categoryDJs }) => {
            const categoryStats = stats?.[category.id] || {};
            const categoryTotal = Object.values(categoryStats).reduce(
              (sum, votes) => sum + votes,
              0
            );

            const djsWithVotes = categoryDJs
              .map((dj) => ({
                dj,
                votes: categoryStats[dj.id] || 0,
                percentage: categoryTotal > 0 ? ((categoryStats[dj.id] || 0) / categoryTotal) * 100 : 0,
              }))
              .sort((a, b) => b.votes - a.votes);

            const topDJ = djsWithVotes[0];
            const hasVotes = categoryTotal > 0;

            return (
              <Card
                key={category.id}
                className="border-4 border-foreground bg-card p-6"
                data-testid={`stats-category-${category.id}`}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-black text-foreground mb-2 uppercase">
                    {category.name}
                  </h3>
                  <div className="text-4xl font-black text-primary">
                    {categoryTotal}
                  </div>
                  <p className="text-sm text-muted-foreground font-bold">
                    votos
                  </p>
                </div>

                {hasVotes && topDJ && topDJ.votes > 0 && (
                  <div className="mb-6 p-4 border-4 border-primary bg-primary/5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      <span className="text-xs font-black text-muted-foreground uppercase">
                        Líder
                      </span>
                    </div>
                    <p className="font-black text-lg text-foreground uppercase">
                      {topDJ.dj.name}
                    </p>
                    <p className="text-sm text-muted-foreground font-bold">
                      {topDJ.votes} votos ({topDJ.percentage.toFixed(1)}%)
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {djsWithVotes.map(({ dj, votes, percentage }) => (
                    <div key={dj.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-bold text-foreground truncate mr-2">
                          {dj.name}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-black text-foreground">{votes}</span>
                          <span className="text-muted-foreground text-xs">
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-2 border-2 border-foreground"
                        data-testid={`progress-${dj.id}`}
                      />
                    </div>
                  ))}
                </div>

                {!hasVotes && (
                  <div className="py-8 flex items-center justify-center">
                    <p className="text-muted-foreground font-bold text-center text-sm">
                      No hay votos aún en esta categoría
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
