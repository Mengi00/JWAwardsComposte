import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Music } from "lucide-react";

export interface Artist {
  id: string;
  name: string;
  image?: string;
}

interface CategoryCardProps {
  category: string;
  description: string;
  artists: Artist[];
  selectedArtist?: string;
  onSelectArtist: (artistId: string) => void;
}

export default function CategoryCard({
  category,
  description,
  artists,
  selectedArtist,
  onSelectArtist,
}: CategoryCardProps) {
  return (
    <Card className="p-8 border-4 border-border hover-elevate" data-testid={`card-category-${category.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Music className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-black uppercase">{category}</h3>
        </div>
        <p className="text-sm text-muted-foreground font-semibold">{description}</p>
      </div>

      <RadioGroup value={selectedArtist} onValueChange={onSelectArtist}>
        <div className="space-y-3">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className={`border-4 border-border p-4 hover-elevate active-elevate-2 cursor-pointer transition-all ${
                selectedArtist === artist.id ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => onSelectArtist(artist.id)}
              data-testid={`artist-option-${artist.id}`}
            >
              <div className="flex items-center gap-4">
                <RadioGroupItem value={artist.id} id={artist.id} data-testid={`radio-${artist.id}`} />
                {artist.image && (
                  <div className="w-16 h-16 bg-secondary border-4 border-border overflow-hidden">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <Label
                  htmlFor={artist.id}
                  className="text-lg font-bold cursor-pointer flex-1"
                >
                  {artist.name}
                </Label>
                {selectedArtist === artist.id && (
                  <Badge variant="default" className="font-black uppercase">
                    Seleccionado
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>
    </Card>
  );
}
