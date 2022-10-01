import { useState, useEffect } from "react";
import {
  gameData,
  fullGameData,
  fullIndividualGameData,
  fullChannelData,
} from "libs/types";

function Categories() {
  const [gameDataRaw, setGameDataRaw] = useState<fullGameData>();
  const [categoriesData, setCategoriesData] = useState<fullGameData>();
  const [sortedGameData, setSortedGameData] = useState<fullGameData>();
  const [pageNumber, setPageNumber] = useState({ start: 0, end: 20 });

  useEffect(() => {
    const getTopGames = async () => {
      let gameData: fullIndividualGameData[] = [];
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
        gameData.push({ ...game, viewers: 0 });
      });

      setGameDataRaw({ data: gameData, pagination: data.pagination });
    };

    getTopGames();
  }, []);

  // useEffect(() => {
  //   let updatedGameData: fullGameData | undefined = gameDataRaw;

  //   gameDataRaw?.data.forEach(async (game) => {
  //     let viewerCount = { game: "", viewers: 0 };
  //     const individualGameRes = await fetch(
  //       `https://api.twitch.tv/helix/streams?game_id=${game.id}&first=30`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
  //           "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
  //         },
  //       }
  //     );

  //     const data: fullChannelData = await individualGameRes.json();

  //     data?.data.forEach((channel) => {
  //       viewerCount = {
  //         game: game.name,
  //         viewers: viewerCount.viewers + channel.viewer_count,
  //       };
  //     });

  //     let index = gameDataRaw.data.indexOf(game);

  //     if (updatedGameData) {
  //       updatedGameData.data[index].viewers = viewerCount.viewers;
  //     }

  //     setCategoriesData(updatedGameData);
  //   });
  // }, [gameDataRaw]);

  // useEffect(() => {
  //   if (categoriesData) {
  //     const sortedViewCount = categoriesData.data.sort((a, b) => {
  //       return b.viewers - a.viewers;
  //     });

  //     setSortedGameData({
  //       data: sortedViewCount,
  //       pagination: categoriesData.pagination,
  //     });
  //   }
  // }, [categoriesData]);

  const nextGamePage = async () => {
    if (
      gameDataRaw &&
      pageNumber.start + 20 === gameDataRaw?.data?.length - 20
    ) {
      const res = await fetch(
        `https://api.twitch.tv/helix/games/top?first=100&after=${gameDataRaw?.pagination.cursor}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
            "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
          },
        }
      );

      const data: fullGameData = await res.json();

      setGameDataRaw({
        data: [...gameDataRaw.data, ...data.data],
        pagination: data.pagination,
      });
    }
    setPageNumber({ start: pageNumber.start + 20, end: pageNumber.end + 20 });
  };

  const prevGamePage = async () => {
    setPageNumber({ start: pageNumber.start - 20, end: pageNumber.end - 20 });
  };

  return (
    <div>
      {gameDataRaw?.data
        ?.slice(pageNumber.start, pageNumber.end)
        .map((game, index) => {
          return (
            <div key={index}>
              <img
                src={game.box_art_url
                  .replace("{width}", "285")
                  .replace("{height}", "380")}
                alt={game.name}
                style={{ width: 187, height: 250 }}
              />
              <div>{game.name}</div>
            </div>
          );
        })}
      {sortedGameData && (
        <button onClick={() => nextGamePage()}>Next page</button>
      )}
      {pageNumber.start > 0 && (
        <button onClick={() => prevGamePage()}>Prev page</button>
      )}
    </div>
  );
}

export default Categories;
