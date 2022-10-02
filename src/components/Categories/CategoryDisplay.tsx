import { fullGameData } from "libs/types";

function CategoryDisplay({
  gameData,
  pageNumber,
  blockCategory,
}: {
  gameData: fullGameData | undefined;
  pageNumber: { start: number; end: number };
  blockCategory: (categoryId: string) => void;
}) {
  return (
    <div className="category-display-container">
      {gameData?.data
        ?.slice(pageNumber.start, pageNumber.end)
        .map((game, index) => {
          return (
            <div className="category-content-container" key={index}>
              <img
                src={game.box_art_url
                  .replace("{width}", "285")
                  .replace("{height}", "380")}
                alt={game.name}
                style={{ width: 187, height: 250 }}
              />
              <div title={game.name}>
                {game.name.length > 17
                  ? game.name.slice(0, 17) + "..."
                  : game.name}
              </div>
              <div onClick={() => blockCategory(game.id)}>Hide Game</div>
            </div>
          );
        })}
    </div>
  );
}

export default CategoryDisplay;
