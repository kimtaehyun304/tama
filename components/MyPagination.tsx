import { useRouter, useSearchParams } from "next/navigation";
import ReactPaginate from "react-paginate";
import { styled } from "styled-components";

const StyledReactPaginate = styled(ReactPaginate).attrs({
  // You can redefine classes here, if you want.
  activeClassName: "active", // default to "selected"
})`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: row;
  //justify-content: space-between;
  list-style-type: none;
  padding: 0 5rem;
  justify-content: center;
  li a {
    border-radius: 7px;
    padding: 0.1rem 1rem;
    //border: gray 1px solid;
    cursor: pointer;
    color: gray;
  }
  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
  }
  li.active a {
    //background-color: #0366d6;
    border-color: transparent;
    color: black;
    min-width: 32px;
    text-decoration: underline;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`;

type PaginationProps = {
  pageCount: number;
  pageRangeDisplayed: number;
};

export default ({ pageCount, pageRangeDisplayed }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pagePrams = Number(searchParams.get("page")) || 1;

  //initalPage는 페이지 바뀌면서 초기화하는거라 onPageChange 작동해서 어려움
  if (pageCount > 0) {
    return (
      <StyledReactPaginate
        pageCount={pageCount}
        pageRangeDisplayed={pageRangeDisplayed}
        marginPagesDisplayed={0}
        previousLabel="<"
        nextLabel=">"
        onPageChange={(selectedItem) => {
          router.push(`?page=${selectedItem.selected + 1}`);
        }}
        forcePage={pagePrams - 1}
      />
    );
  }
};
