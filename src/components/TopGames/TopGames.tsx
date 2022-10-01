import { useState, useEffect } from "react";
import {
  gameData,
  fullGameData,
  fullChannelData,
  fullIndividualGameData,
} from "libs/types";

function TopGames() {
  const [gameDataRaw, setGameDataRaw] = useState<fullGameData>();
  const [topGamesData, setTopGamesData] = useState<fullGameData>();
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

  useEffect(() => {
    let updatedGameData: fullGameData | undefined = gameDataRaw;

    gameDataRaw?.data.forEach(async (game) => {
      let viewerCount = { game: "", viewers: 0 };
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

      data?.data.forEach((channel) => {
        viewerCount = {
          game: game.name,
          viewers: viewerCount.viewers + channel.viewer_count,
        };
      });

      let index = gameDataRaw.data.indexOf(game);

      if (updatedGameData) {
        updatedGameData.data[index].viewers = viewerCount.viewers;
      }

      setTopGamesData(updatedGameData);
    });
  }, [gameDataRaw]);

  useEffect(() => {
    if (topGamesData) {
      const sortedViewCount = topGamesData.data.sort((a, b) => {
        return b.viewers - a.viewers;
      });

      setSortedGameData({
        data: sortedViewCount,
        pagination: topGamesData.pagination,
      });
    }

    console.log(topGamesData);
  }, [topGamesData]);
  console.log(sortedGameData);

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
      <div>Top Games</div>
      {sortedGameData?.data
        ?.slice(pageNumber.start, pageNumber.end)
        .map((game, index) => {
          return (
            <div key={index}>
              <div>{game.name}</div>
              <div>{game.viewers}</div>
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

export default TopGames;
