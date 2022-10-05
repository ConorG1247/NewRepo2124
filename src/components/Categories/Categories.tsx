import { useState, useEffect } from "react";
import {
  gameData,
  fullGameData,
  fullIndividualGameData,
  userData,
  blockListItem,
} from "libs/types";
import CategoryDisplay from "./CategoryDisplay";
import Pagination from "components/Pagination/Pagination";

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
  const [blockListData, setBlockListData] = useState<blockListItem[]>();

  useEffect(() => {
    const getBlockListData = async () => {
      const res = await fetch("http://localhost:3001/get/all/guest", {
        method: "GET",
      });

      const data: userData = await res.json();

      if (!data.blocklist) {
        return setBlockListData([]);
      }

      setBlockListData(data.blocklist.category);
    };
    getBlockListData();
  }, []);

  useEffect(() => {
    const getCategoryData = async () => {
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

      setGameData({ data: data.data, pagination: data.pagination });
    };

    getCategoryData();
  }, [blockListData]);

  useEffect(() => {
    if (gameData) {
      let updatedGameList: fullIndividualGameData[] = gameData.data;

      if (blockListData && blockListData.length > 0) {
        blockListData.forEach((game) => {
          updatedGameList = updatedGameList?.filter((category: any) => {
            return game.id !== category.id;
          });
        });
      }
      setBlockedGameData({
        data: updatedGameList,
        pagination: gameData.pagination,
      });
    }
  }, [blockListData, gameData]);

  const nextGamePage = async () => {
    if (
      blockedGameData &&
      pageNumber.start + 100 >= blockedGameData?.data?.length - 100
    ) {
      const res = await fetch(
        `https://api.twitch.tv/helix/games/top?first=100&after=${blockedGameData?.pagination.cursor}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
            "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
          },
        }
      );

      const data: fullGameData = await res.json();

      if (blockedGameData) {
        setGameData({
          data: [...blockedGameData.data, ...data.data],
          pagination: data.pagination,
        });
      }
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

  const blockCategory = async (categoryName: string, categoryId: string) => {
    if (blockedGameData) {
      let filteredCategories: fullIndividualGameData[] = [];

      filteredCategories = blockedGameData?.data.filter((category) => {
        return categoryId !== category.id;
      });

      setBlockedGameData({
        data: filteredCategories,
        pagination: blockedGameData.pagination,
      });
    }

    await fetch("http://localhost:3001/add/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "guest",
        name: categoryName,
        id: categoryId,
      }),
    });
  };

  return (
    <div className="category-container">
      <CategoryDisplay
        categoryData={blockedGameData}
        pageNumber={pageNumber}
        blockCategory={blockCategory}
      />
      {blockedGameData && (
        <Pagination
          paginationData={paginationData}
          nextPage={nextGamePage}
          prevPage={prevGamePage}
          pageSelect={paginationPageSelect}
        />
      )}
    </div>
  );
}

export default Categories;
