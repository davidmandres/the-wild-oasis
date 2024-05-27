import styled from "styled-components";
import { CabinObj } from "../../utils/config";
import { formatCurrency } from "../../utils/helpers";
import CreateCabinForm from "./CreateCabinForm";
import useDeleteCabin from "./useDeleteCabin.hooks";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import useCreateCabin from "./useCreateCabin.hooks";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

interface CabinRowProps {
  cabin: CabinObj;
}

export default function CabinRow({ cabin }: CabinRowProps) {
  const [isDeleting, mutateDeleteCabin] = useDeleteCabin();
  const [isCreating, mutateCreateCabin] = useCreateCabin();
  const {
    name,
    maxCapacity,
    regPrice,
    discount,
    imgURL,
    desc,
    id: cabinID,
  } = cabin;

  function handleDuplicate() {
    mutateCreateCabin({
      name: `Copy of ${name}`,
      max_capacity: maxCapacity,
      regular_price: regPrice,
      discount,
      imgURL,
      description: desc,
    });
  }

  return (
    <Table.Row>
      <Img src={imgURL} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {maxCapacity} guests</div>
      <Price>{formatCurrency(regPrice)}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={cabinID} />

            <Menus.List id={cabinID}>
              <Menus.Button
                icon={<HiSquare2Stack />}
                onClick={handleDuplicate}
                disabled={isCreating}
              >
                Duplicate
              </Menus.Button>

              <Modal.Open opens="edit-cabin-form">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete-cabin-confirmation">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>
          </Menus.Menu>

          <Modal.Window name="edit-cabin-form">
            <CreateCabinForm cabinToEdit={cabin} />
          </Modal.Window>

          <Modal.Window name="delete-cabin-confirmation">
            <ConfirmDelete
              resourceName="cabin"
              disabled={isDeleting}
              onConfirm={() => mutateDeleteCabin(cabinID)}
            />
          </Modal.Window>
        </Modal>
      </div>
    </Table.Row>
  );
}
