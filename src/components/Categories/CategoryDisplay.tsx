import { fullGameData } from "libs/types";

function CategoryDisplay({
  gameData,
  pageNumber,
  blockCategory,
}: {
  gameData: fullGameData | undefined;
  pageNumber: { start: number; end: number };
  blockCategory: (categoryName: string, categoryId: string) => void;
}) {
  return (
    <div className="category-display-container">
      {gameData?.data
        ?.slice(pageNumber.start, pageNumber.end)
        .map((game, index) => {
          return (
            <div className="category-content-container" key={index}>
              <img
                className="category-thumbnail"
                src={game.box_art_url
                  .replace("{width}", "285")
                  .replace("{height}", "380")}
                alt={game.name}
              />
              <div className="category-game-title" title={game.name}>
                {game.name}
              </div>
              <div onClick={() => blockCategory(game.name, game.id)}>
                Hide Game
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default CategoryDisplay;
