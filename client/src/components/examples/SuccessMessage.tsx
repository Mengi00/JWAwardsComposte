import SuccessMessage from "../SuccessMessage";

export default function SuccessMessageExample() {
  return <SuccessMessage onBackToHome={() => console.log("Back to home")} />;
}
