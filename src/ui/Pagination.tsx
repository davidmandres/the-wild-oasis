import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { PAGE_SIZE } from "../utils/config";

const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const P = styled.p`
  font-size: 1.4rem;
  margin-left: 0.8rem;

  & span {
    font-weight: 600;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  background-color: ${(props) =>
    props.active ? " var(--color-brand-600)" : "var(--color-grey-50)"};
  color: ${(props) => (props.active ? " var(--color-brand-50)" : "inherit")};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

interface PaginationProps {
  numOfResults: number;
}

export default function Pagination({ numOfResults }: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));
  const numOfPages = Math.ceil(numOfResults / PAGE_SIZE);

  function prevPage() {
    const prev = currPage === 1 ? currPage : currPage - 1;
    searchParams.set("page", String(prev));
    setSearchParams(searchParams);
  }

  function nextPage() {
    const next = currPage === numOfPages ? currPage : currPage + 1;
    searchParams.set("page", String(next));
    setSearchParams(searchParams);
  }

  if (numOfPages <= 1) return;

  return (
    <StyledPagination>
      <P>
        Showing <span>{(currPage - 1) * (PAGE_SIZE + 1)}</span> to{" "}
        <span>
          {currPage * PAGE_SIZE <= numOfResults
            ? currPage * PAGE_SIZE
            : numOfResults}
        </span>{" "}
        of <span>{numOfResults}</span> results
      </P>
      <Buttons>
        <PaginationButton onClick={prevPage} disabled={currPage === 1}>
          <HiChevronLeft /> <span>Previous</span>
        </PaginationButton>
        <PaginationButton onClick={nextPage} disabled={currPage === numOfPages}>
          <span>Next</span> <HiChevronRight />
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
}
