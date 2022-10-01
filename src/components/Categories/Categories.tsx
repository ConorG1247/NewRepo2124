import { useState, useEffect } from "react";
import { gameData, fullGameData, fullIndividualGameData } from "libs/types";
import CategoryDisplay from "./CategoryDisplay";

function Categories() {
  const [gameData, setGameData] = useState<fullGameData>();
  const [pageNumber, setPageNumber] = useState({ start: 0, end: 20 });
  const [paginationData, setPaginationData] = useState<
    {
      page: number;
      start: number;
      end: number;
    }[]
  >([]);

  useEffect(() => {
    const getCategoryData = async () => {
      let initialGameData: fullIndividualGameData[] = [];
      const res = await fetch(
        "https://api.twitch.tv/helix/games/top?first=100",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
            "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
          },
        }
      );

      const data: gameData = await res.json();

      data.data.forEach((game) => {
        initialGameData.push({ ...game, viewers: 0 });
      });

      setGameData({ data: initialGameData, pagination: data.pagination });
    };

    getCategoryData();
  }, []);

  const nextGamePage = async () => {
    if (gameData && pageNumber.start + 20 === gameData?.data?.length - 20) {
      const res = await fetch(
        `https://api.twitch.tv/helix/games/top?first=100&after=${gameData?.pagination.cursor}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
            "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
          },
        }
      );

      const data: fullGameData = await res.json();

      setGameData({
        data: [...gameData.data, ...data.data],
        pagination: data.pagination,
      });
    }
    setPageNumber({ start: pageNumber.start + 20, end: pageNumber.end + 20 });
    if (paginationData.length === 0) {
      return setPaginationData([{ page: 1, start: 0, end: 20 }]);
    }
    setPaginationData([
      ...paginationData,
      {
        page: paginationData.length + 1,
        start: pageNumber.start,
        end: pageNumber.end,
      },
    ]);
  };

  const prevGamePage = () => {
    setPageNumber({ start: pageNumber.start - 20, end: pageNumber.end - 20 });
    setPaginationData([...paginationData.slice(0, paginationData.length - 1)]);
  };

  const paginationPageSelect = (page: {
    page: number;
    start: number;
    end: number;
  }) => {
    setPageNumber({ start: page.start, end: page.end });
    setPaginationData([...paginationData.slice(0, page.page - 1)]);
    if (paginationData.length === 0) {
      setPaginationData([{ page: 1, start: 0, end: 20 }]);
    }
  };

  console.log(paginationData);

  return (
    <div>
      <CategoryDisplay gameData={gameData} pageNumber={pageNumber} />
      {gameData && (
        <button
          onClick={() => {
            nextGamePage();
            // window.scrollTo(0, 0);
          }}
        >
          Next page
        </button>
      )}
      {paginationData.length > 0 &&
        paginationData.map((page, index) => {
          return (
            <div key={index}>
              <div onClick={() => paginationPageSelect(page)}>{page.page}</div>
            </div>
          );
        })}
      {pageNumber.start > 0 && (
        <button
          onClick={() => {
            prevGamePage();
            // window.scrollTo(0, 0);
          }}
        >
          Prev page
        </button>
      )}
    </div>
  );
}

export default Categories;
