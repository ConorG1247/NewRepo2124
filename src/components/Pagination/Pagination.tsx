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
      <button
        onClick={() => {
          nextPage();
          window.scrollTo(0, 0);
        }}
      >
        Next page
      </button>
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
        })}
      {paginationData.length > 0 && (
        <button
          onClick={() => {
            prevPage();
            window.scrollTo(0, 0);
          }}
        >
          Prev page
        </button>
      )}
    </div>
  );
}

export default Pagination;
