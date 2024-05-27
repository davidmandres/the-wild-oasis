import {
  LegacyRef,
  PropsWithChildren,
  cloneElement,
  createContext,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import useOutsideClick from "../hooks/useOutsideClick.hooks";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

interface ModalContextObj {
  openModal: React.Dispatch<React.SetStateAction<string>>;
  openName: string;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextObj | null>(null);

export default function Modal({ children }: PropsWithChildren) {
  const [openName, setOpenName] = useState("");
  const openModal = setOpenName;
  const closeModal = () => setOpenName("");

  return (
    <ModalContext.Provider value={{ openModal, openName, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

interface OpenProps extends PropsWithChildren {
  opens: string;
}

Modal.Open = function Open({ children, opens }: OpenProps) {
  const openModal = useContext(ModalContext)?.openModal;

  return cloneElement(children as React.ReactElement, {
    onClick: () => openModal?.(opens),
  });
};

interface WindowProps extends PropsWithChildren {
  name: string;
}

Modal.Window = function Window({ children, name }: WindowProps) {
  const context = useContext(ModalContext);
  const openName = context?.openName;
  const closeModal = context?.closeModal;
  const ref = useOutsideClick(closeModal);

  if (name !== openName) return;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref as LegacyRef<HTMLDivElement>}>
        <Button onClick={() => closeModal?.()}>
          <HiXMark />
        </Button>
        <div>
          {cloneElement(children as React.ReactElement, {
            onCloseModal: closeModal,
          })}
        </div>
      </StyledModal>
    </Overlay>,
    document.body
  );
};
