import VoterForm from "../VoterForm";

export default function VoterFormExample() {
  return (
    <VoterForm
      onSubmit={(data) => console.log("Form submitted:", data)}
      isLoading={false}
    />
  );
}
