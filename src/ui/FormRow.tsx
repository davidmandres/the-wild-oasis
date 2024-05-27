import { PropsWithChildren } from "react";
import styled, { css } from "styled-components";

const StyledFormRow = styled.div<{ type: "horizontal" | "vertical" }>`
  ${(props) =>
    props.type === "horizontal" &&
    css`
      display: grid;
      align-items: center;
      grid-template-columns: 24rem 1fr 1.2fr;
      gap: 2.4rem;

      &:has(button) {
        display: flex;
        justify-content: flex-end;
        gap: 1.2rem;
      }
    `}

  ${(props) =>
    props.type === "vertical" &&
    css`
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    `}

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

interface FormRowProps extends PropsWithChildren {
  type: "horizontal" | "vertical";
  label?: string;
  error?: string;
}

export default function FormRow({
  type,
  label,
  error,
  children,
}: FormRowProps) {
  const htmlFor = label
    ?.split(" ")
    .map((word, i) =>
      i === 0 ? word.toLowerCase() : word[0].toUpperCase() + word.substring(1)
    )
    .join("");

  return (
    <StyledFormRow type={type}>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}
