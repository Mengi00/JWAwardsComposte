import Hero from "../Hero";

export default function HeroExample() {
  return <Hero onStartVoting={() => console.log("Start voting clicked")} />;
}
