import Button from "../../ui/Button";
import { useCheckOut } from "./useCheckOut.hooks";

interface CheckOutButtonProps {
  bookingID: number;
}

export default function CheckOutButton({ bookingID }: CheckOutButtonProps) {
  const [checkOut, isCheckingOut] = useCheckOut();

  return (
    <Button
      variation="primary"
      size="small"
      onClick={() => checkOut(bookingID)}
      disabled={isCheckingOut}
    >
      Check out
    </Button>
  );
}
