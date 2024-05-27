import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateCabinForm from "./CreateCabinForm";

export default function AddCabin() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="add-cabin-form">
          <Button variation="primary" size="large">
            Add new cabin
          </Button>
        </Modal.Open>
        <Modal.Window name="add-cabin-form">
          <CreateCabinForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}
