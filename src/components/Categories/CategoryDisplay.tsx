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
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        width: 700,
      }}
    >
      {gameData?.data
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
              <div onClick={() => blockCategory(game.id)}>Hide Game</div>
            </div>
          );
        })}
    </div>
  );
}

export default CategoryDisplay;
