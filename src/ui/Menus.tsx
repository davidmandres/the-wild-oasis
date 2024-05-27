import React, {
  LegacyRef,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";
import useOutsideClick from "../hooks/useOutsideClick.hooks";

const StyledMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

interface Position2DObj {
  x: number;
  y: number;
}

const StyledList = styled.ul<{ position: Position2DObj }>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

interface MenusContextObj {
  openID: string;
  open: React.Dispatch<React.SetStateAction<string>>;
  close: VoidFunction;
  position: Position2DObj | undefined;
  setPosition: React.Dispatch<React.SetStateAction<Position2DObj | undefined>>;
}

const MenusContext = createContext<MenusContextObj | null>(null);

export default function Menus({ children }: PropsWithChildren) {
  const [openID, setOpenID] = useState("");
  const [position, setPosition] = useState<Position2DObj>();

  const open = setOpenID;
  const close = () => setOpenID("");

  return (
    <MenusContext.Provider
      value={{ openID, open, close, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

Menus.Menu = function Menu({ children }: PropsWithChildren) {
  return <StyledMenu>{children}</StyledMenu>;
};

interface IDProp {
  id: number;
}

Menus.Toggle = function Toggle({ id }: IDProp) {
  const context = useContext(MenusContext);
  if (!context) return;

  const { openID, open, close, setPosition } = context;

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();

    const rect = (e.target as HTMLElement)
      .closest("button")
      ?.getBoundingClientRect();

    setPosition({
      x: window.innerWidth - Number(rect?.width) - Number(rect?.x),
      y: Number(rect?.y) + Number(rect?.height) + 8,
    });

    openID === "" || openID !== String(id) ? open(String(id)) : close();
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
};

Menus.List = function List({ children, id }: IDProp & PropsWithChildren) {
  const context = useContext(MenusContext);
  const openID = context?.openID;
  const position = context?.position;
  const close = context?.close;
  const ref = useOutsideClick(close, false);

  if (openID !== String(id) || !position) return;

  return createPortal(
    <StyledList position={position} ref={ref as LegacyRef<HTMLUListElement>}>
      {children}
    </StyledList>,
    document.body
  );
};

interface ButtonProps extends PropsWithChildren {
  icon: React.ReactNode;
  onClick?: VoidFunction;
  disabled?: boolean;
}

Menus.Button = function Button({
  children,
  icon,
  onClick,
  disabled,
}: ButtonProps) {
  const close = useContext(MenusContext)?.close;

  function handleClick() {
    onClick?.();
    close?.();
  }

  return (
    <li>
      <StyledButton onClick={handleClick} disabled={disabled}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  );
};
