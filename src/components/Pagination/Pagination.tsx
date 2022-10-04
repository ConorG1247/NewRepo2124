function Pagination({
  paginationData,
  nextPage,
  prevPage,
  pageSelect,
}: {
  paginationData: {
    page: number;
    start: number;
    end: number;
  }[];
  nextPage: () => void;
  prevPage: () => void;
  pageSelect: (page: { page: number; start: number; end: number }) => void;
}) {
  return (
    <div>
      {/* {paginationData.length > 0 && (
        <button
          onClick={() => {
            prevPage();
            window.scrollTo(0, 0);
          }}
        >
          Prev page
        </button>
      )}
      {paginationData.length > 0 &&
        paginationData.map((page, index) => {
          return (
            <div key={index}>
              <div
                onClick={() => {
                  pageSelect(page);
                  window.scrollTo(0, 0);
                }}
              >
                {page.page}
              </div>
            </div>
          );
        })} */}
      <button
        onClick={() => {
          nextPage();
        }}
      >
        Load more
      </button>
    </div>
  );
}

export default Pagination;
