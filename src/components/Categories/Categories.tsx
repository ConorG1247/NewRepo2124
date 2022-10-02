import { useState, useEffect } from "react";
import { gameData, fullGameData, fullIndividualGameData } from "libs/types";
import CategoryDisplay from "./CategoryDisplay";
import Pagination from "components/Pagination/Pagination";

const blockList = [
  { name: "Grand Theft Auto V", id: "32982" },
  { name: "FIFA 23", id: "1745202732" },
  { name: "Slots", id: "498566" },
];

function Categories() {
  const [gameData, setGameData] = useState<fullGameData>();
  const [blockedGameData, setBlockedGameData] = useState<fullGameData>();
  const [pageNumber, setPageNumber] = useState({ start: 0, end: 100 });
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

  useEffect(() => {
    if (gameData) {
      let updatedGameList: fullIndividualGameData[] = gameData.data;

      if (blockList.length > 0) {
        blockList.forEach((game) => {
          updatedGameList = updatedGameList?.filter((category: any) => {
            return game.id !== category.id;
          });
        });
      }
      setBlockedGameData({
        data: [...updatedGameList],
        pagination: gameData.pagination,
      });
    }
  }, [gameData]);

  const nextGamePage = async () => {
    if (gameData && pageNumber.start + 100 >= gameData?.data?.length - 100) {
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
    setPageNumber({ start: pageNumber.start + 100, end: pageNumber.end + 100 });
    if (paginationData.length === 0) {
      return setPaginationData([{ page: 1, start: 0, end: 100 }]);
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
    setPageNumber({ start: pageNumber.start - 100, end: pageNumber.end - 100 });
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
      setPaginationData([{ page: 1, start: 0, end: 100 }]);
    }
  };

  const blockCategory = (categoryName: string, categoryId: string) => {
    if (gameData) {
      const updatedGameList = gameData?.data.filter((game) => {
        if (game.id === categoryId) {
          console.log(game);
        }
        return game.id !== categoryId;
      });

      console.log(categoryName);

      setGameData({ data: updatedGameList, pagination: gameData.pagination });
    }
  };

  return (
    <div className="category-container">
      <CategoryDisplay
        gameData={blockedGameData}
        pageNumber={pageNumber}
        blockCategory={blockCategory}
      />
      <Pagination
        paginationData={paginationData}
        nextPage={nextGamePage}
        prevPage={prevGamePage}
        pageSelect={paginationPageSelect}
      />
    </div>
  );
}

export default Categories;
