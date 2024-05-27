import SignUpForm from "../features/authentication/SignUpForm";
import Heading from "../ui/Heading";

export default function Users() {
  return (
    <>
      <Heading as="h1">Create a new user</Heading>
      <SignUpForm />
    </>
  );
}
