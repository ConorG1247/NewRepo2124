import { useState, useEffect } from "react";

type individualGameData = {
  id: string;
  name: string;
  box_art_url: string;
};

type gameData = {
  data: individualGameData[];
  pagination: { cursor: string };
};

function TopGames() {
  const [topGamesData, setTopGamesData] = useState<gameData>();

  useEffect(() => {
    const getTopGames = async () => {
      const res = await fetch(
        "https://api.twitch.tv/helix/games/top?first=20",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
            "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
          },
        }
      );

      const data: gameData = await res.json();

      setTopGamesData(data);
    };

    getTopGames();
  }, []);

  const nextGamePage = async (page: string) => {
    const res = await fetch(
      `https://api.twitch.tv/helix/games/top?after=${topGamesData?.pagination.cursor}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
          "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
        },
      }
    );

    const data = await res.json();
  };

  console.log(topGamesData);

  return (
    <div>
      <div>Top Games</div>
      {topGamesData?.data?.map((game, index) => {
        return <div key={index}></div>;
      })}
    </div>
  );
}

export default TopGames;
