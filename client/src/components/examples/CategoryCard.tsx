import { useState } from "react";
import CategoryCard from "../CategoryCard";

export default function CategoryCardExample() {
  const [selected, setSelected] = useState<string>("");

  return (
    <CategoryCard
      category="Best House DJ"
      description="El mejor DJ de House del año"
      artists={[
        { id: "1", name: "DJ Solar" },
        { id: "2", name: "Midnight Echo" },
        { id: "3", name: "Pulse Wave" },
      ]}
      selectedArtist={selected}
      onSelectArtist={setSelected}
    />
  );
}
