import styled from "styled-components";
import { OperationOptionObj } from "../utils/config";
import { ComponentPropsWithoutRef } from "react";

const StyledSelect = styled.select<{ type: "white" | "grey" }>`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${(props) =>
      props.type === "white"
        ? "var(--color-grey-100)"
        : "var(--color-grey-300)"};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`;

interface SelectProps<T extends string>
  extends ComponentPropsWithoutRef<"select"> {
  options: OperationOptionObj<T>[];
  value: T;
  onChange: (..._args: never[]) => void;
}

export default function Select<T extends string>({
  options,
  value,
  onChange,
  ...props
}: SelectProps<T>) {
  return (
    <StyledSelect value={value} type="white" onChange={onChange} {...props}>
      {options.map((option) => (
        <option value={option.value} key={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
}
