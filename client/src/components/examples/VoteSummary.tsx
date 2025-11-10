import VoteSummary from "../VoteSummary";

export default function VoteSummaryExample() {
  const mockVotes = [
    { category: "Best House DJ", artistName: "DJ Solar" },
    { category: "Best Techno DJ", artistName: "Midnight Echo" },
    { category: "Best Progressive DJ", artistName: "Pulse Wave" },
  ];

  return (
    <VoteSummary
      votes={mockVotes}
      onEdit={() => console.log("Edit clicked")}
      onConfirm={() => console.log("Confirm clicked")}
    />
  );
}
