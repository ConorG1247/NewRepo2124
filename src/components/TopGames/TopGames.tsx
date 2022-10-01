import { useState, useEffect } from "react";
import { gameData, fullGameData, fullChannelData } from "libs/types";

function TopGames() {
  const [topGamesData, setTopGamesData] = useState<gameData>();
  const [pageNumber, setPageNumber] = useState({ start: 0, end: 20 });

  useEffect(() => {
    const getTopGames = async () => {
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

      data?.data.forEach(async (game) => {
        const individualGameRes = await fetch(
          `https://api.twitch.tv/helix/streams?game_id=${game.id}&first=30`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
              "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
            },
          }
        );

        const data: fullChannelData = await individualGameRes.json();

        data?.data?.forEach(async (channel) => {});
      });

      setTopGamesData(data);
    };

    getTopGames();
  }, []);

  const nextGamePage = async () => {
    if (topGamesData && pageNumber.start + 20 === topGamesData?.data?.length) {
      const res = await fetch(
        `https://api.twitch.tv/helix/games/top?first=100&after=${topGamesData?.pagination.cursor}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
            "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
          },
        }
      );

      const data: gameData = await res.json();

      setTopGamesData({
        data: [...topGamesData.data, ...data.data],
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
      <div>Top Games</div>
      {topGamesData?.data
        ?.slice(pageNumber.start, pageNumber.end)
        .map((game, index) => {
          return <div key={index}>{game.name}</div>;
        })}
      {topGamesData && (
        <button onClick={() => nextGamePage()}>Next page</button>
      )}
      {pageNumber.start > 0 && (
        <button onClick={() => prevGamePage()}>Prev page</button>
      )}
    </div>
  );
}

export default TopGames;
