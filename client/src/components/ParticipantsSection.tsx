import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
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

type CategoryWithDJs = {
  category: Category;
  djs: DJ[];
};

export default function ParticipantsSection() {
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

  const isLoading = categoriesLoading || djsLoading || assignmentsLoading;

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-muted/20" id="participants-section">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg text-muted-foreground font-bold">Cargando participantes...</p>
        </div>
      </section>
    );
  }

  if (categoriesWithDJs.length === 0) {
    return (
      <section className="py-16 px-4 bg-muted/20" id="participants-section">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-lg text-muted-foreground font-bold">
            No hay participantes disponibles
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-muted/20" id="participants-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-10 h-10 text-primary" />
            <h2 className="text-4xl sm:text-5xl font-black text-foreground uppercase">
              Participantes
            </h2>
          </div>
          <p className="text-lg text-muted-foreground font-bold">
            Conoce a los DJs nominados en Johnnie Walker DJ Awards 2024
          </p>
        </div>

        <div className="space-y-16">
          {categoriesWithDJs.map(({ category, djs: categoryDJs }) => (
            <div key={category.id} data-testid={`category-section-${category.id}`}>
              <div className="mb-8 text-center">
                <h3 className="text-3xl sm:text-4xl font-black text-primary uppercase mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground font-bold">
                  {category.description}
                </p>
              </div>

              <div className="flex overflow-hidden h-96 gap-1">
                {categoryDJs.map((dj, index) => (
                  <div
                    key={dj.id}
                    className="group relative flex-1 hover:flex-[2] transition-all duration-500 ease-in-out overflow-hidden"
                    style={{
                      minWidth: `${100 / Math.max(categoryDJs.length, 4)}%`,
                    }}
                    data-testid={`dj-stripe-${dj.id}`}
                  >
                    <div className="absolute inset-0">
                      {dj.photo ? (
                        <img
                          src={dj.photo}
                          alt={dj.name}
                          className="w-full h-full object-cover"
                          data-testid={`dj-photo-${dj.id}`}
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Users className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <h4 className="text-white font-black text-lg uppercase mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {dj.name}
                      </h4>
                      {dj.bio && (
                        <p className="text-white/80 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity line-clamp-2">
                          {dj.bio}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
