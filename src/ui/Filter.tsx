import { useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";
import { OperationOptionObj } from "../utils/config";

const StyledFilter = styled.div`
  border: 1px solid var(--color-grey-100);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  border-radius: var(--border-radius-sm);
  padding: 0.4rem;
  display: flex;
  gap: 0.4rem;
`;

const FilterButton = styled.button<{ active?: "true" | "false" }>`
  background-color: var(--color-grey-0);
  border: none;

  ${(props) =>
    props.active === "true" &&
    css`
      background-color: var(--color-brand-600);
      color: var(--color-brand-50);
    `}

  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;
  /* To give the same height as select */
  padding: 0.44rem 0.8rem;
  transition: all 0.3s;

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

interface FilterProps<T extends string> {
  filterField: string;
  options: OperationOptionObj<T>[];
}

export default function Filter<T extends string>({
  filterField,
  options,
}: FilterProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currFilter = (searchParams.get(filterField) as T) || options[0].value;

  function handleClick(value: T) {
    searchParams.set(filterField, value);
    if (searchParams.get("page")) searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  return (
    <StyledFilter>
      {options.map((option) => (
        <FilterButton
          onClick={() => handleClick(option.value)}
          key={option.value}
          active={String(option.value === currFilter) as "true" | "false"}
          disabled={option.value === currFilter}
        >
          {option.label}
        </FilterButton>
      ))}
    </StyledFilter>
  );
}
