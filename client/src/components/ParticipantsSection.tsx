import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

// Import DJ images
import dj1 from "@assets/stock_images/professional_dj_perf_51b2c07a.jpg";
import dj2 from "@assets/stock_images/professional_dj_perf_f3488244.jpg";
import dj3 from "@assets/stock_images/professional_dj_perf_ac188dbd.jpg";
import dj4 from "@assets/stock_images/professional_dj_perf_bf5b7cb6.jpg";
import dj5 from "@assets/stock_images/professional_dj_perf_bf4c01a9.jpg";
import dj6 from "@assets/stock_images/professional_dj_perf_1dda7ebd.jpg";
import dj7 from "@assets/stock_images/professional_dj_perf_ffb5c00a.jpg";
import dj8 from "@assets/stock_images/professional_dj_perf_506902c2.jpg";
import dj9 from "@assets/stock_images/professional_dj_perf_c517bac3.jpg";
import dj10 from "@assets/stock_images/professional_dj_perf_4da9ee55.jpg";
import dj11 from "@assets/stock_images/techno_dj_at_nightcl_3255af1f.jpg";
import dj12 from "@assets/stock_images/techno_dj_at_nightcl_f137eb36.jpg";
import dj13 from "@assets/stock_images/techno_dj_at_nightcl_37026543.jpg";
import dj14 from "@assets/stock_images/techno_dj_at_nightcl_ff49c739.jpg";
import dj15 from "@assets/stock_images/techno_dj_at_nightcl_0957c319.jpg";
import dj16 from "@assets/stock_images/techno_dj_at_nightcl_204cc882.jpg";
import dj17 from "@assets/stock_images/techno_dj_at_nightcl_ac022fdd.jpg";
import dj18 from "@assets/stock_images/techno_dj_at_nightcl_d063ed1c.jpg";
import dj19 from "@assets/stock_images/techno_dj_at_nightcl_8a412ba1.jpg";
import dj20 from "@assets/stock_images/techno_dj_at_nightcl_22f134d3.jpg";
import dj21 from "@assets/stock_images/house_music_dj_perfo_0ceb341b.jpg";
import dj22 from "@assets/stock_images/house_music_dj_perfo_93983842.jpg";
import dj23 from "@assets/stock_images/house_music_dj_perfo_d84e9f29.jpg";
import dj24 from "@assets/stock_images/house_music_dj_perfo_70e0c2e8.jpg";
import dj25 from "@assets/stock_images/house_music_dj_perfo_4f4ffeb6.jpg";
import dj26 from "@assets/stock_images/house_music_dj_perfo_fdf91ccd.jpg";
import dj27 from "@assets/stock_images/house_music_dj_perfo_dcd8f5ac.jpg";
import dj28 from "@assets/stock_images/house_music_dj_perfo_4b6c50de.jpg";
import dj29 from "@assets/stock_images/house_music_dj_perfo_e02c9b2a.jpg";
import dj30 from "@assets/stock_images/house_music_dj_perfo_f0d5fcc9.jpg";
import dj31 from "@assets/stock_images/bass_music_dj_live_p_694ad3f3.jpg";
import dj32 from "@assets/stock_images/bass_music_dj_live_p_a1ee8bd7.jpg";

const PARTICIPANTS = [
  // House DJs
  { id: "house-1", name: "DJ Solar", photo: dj1, category: "House" },
  { id: "house-2", name: "Midnight Echo", photo: dj2, category: "House" },
  { id: "house-3", name: "Pulse Wave", photo: dj3, category: "House" },
  { id: "house-4", name: "Neon Lights", photo: dj4, category: "House" },
  
  // Techno DJs
  { id: "techno-1", name: "Dark Matter", photo: dj11, category: "Techno" },
  { id: "techno-2", name: "Industrial Pulse", photo: dj12, category: "Techno" },
  { id: "techno-3", name: "Circuit Break", photo: dj13, category: "Techno" },
  { id: "techno-4", name: "Analog Dreams", photo: dj14, category: "Techno" },
  
  // Progressive DJs
  { id: "prog-1", name: "Horizon", photo: dj21, category: "Progressive" },
  { id: "prog-2", name: "Skyline", photo: dj22, category: "Progressive" },
  { id: "prog-3", name: "Aurora", photo: dj23, category: "Progressive" },
  { id: "prog-4", name: "Elevation", photo: dj24, category: "Progressive" },
  
  // Melodic Techno DJs
  { id: "melodic-1", name: "Ethereal", photo: dj5, category: "Melodic Techno" },
  { id: "melodic-2", name: "Cosmic Flow", photo: dj6, category: "Melodic Techno" },
  { id: "melodic-3", name: "Deep Space", photo: dj7, category: "Melodic Techno" },
  { id: "melodic-4", name: "Lunar Waves", photo: dj8, category: "Melodic Techno" },
  
  // Bass DJs
  { id: "bass-1", name: "SubWave", photo: dj31, category: "Bass" },
  { id: "bass-2", name: "Heavy Drop", photo: dj32, category: "Bass" },
  { id: "bass-3", name: "Bass Titan", photo: dj15, category: "Bass" },
  { id: "bass-4", name: "Low Frequency", photo: dj16, category: "Bass" },
  
  // Newcomer DJs
  { id: "new-1", name: "Fresh Beat", photo: dj17, category: "Newcomer" },
  { id: "new-2", name: "Rising Star", photo: dj18, category: "Newcomer" },
  { id: "new-3", name: "New Wave", photo: dj19, category: "Newcomer" },
  { id: "new-4", name: "Breakthrough", photo: dj20, category: "Newcomer" },
  
  // Live Set DJs
  { id: "live-1", name: "Live Energy", photo: dj25, category: "Live Set" },
  { id: "live-2", name: "Stage Master", photo: dj26, category: "Live Set" },
  { id: "live-3", name: "Crowd Control", photo: dj27, category: "Live Set" },
  { id: "live-4", name: "Festival King", photo: dj28, category: "Live Set" },
  
  // DJ of the Year
  { id: "dj-1", name: "Ultimate Mix", photo: dj9, category: "DJ of the Year" },
  { id: "dj-2", name: "Champion Sound", photo: dj10, category: "DJ of the Year" },
  { id: "dj-3", name: "Legendary", photo: dj29, category: "DJ of the Year" },
  { id: "dj-4", name: "Icon", photo: dj30, category: "DJ of the Year" },
];

export default function ParticipantsSection() {
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
            Conoce a los 32 DJs nominados en Johnnie Walker DJ Awards 2024
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {PARTICIPANTS.map((participant) => (
            <Card
              key={participant.id}
              className="border-4 border-foreground bg-card overflow-hidden hover-elevate transition-all"
              data-testid={`participant-card-${participant.id}`}
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={participant.photo}
                  alt={participant.name}
                  className="w-full h-full object-cover"
                  data-testid={`participant-photo-${participant.id}`}
                />
              </div>
              <div className="p-3 text-center border-t-4 border-foreground">
                <h3 className="font-black text-sm text-foreground mb-1 uppercase">
                  {participant.name}
                </h3>
                <p className="text-xs text-muted-foreground font-bold">
                  {participant.category}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
