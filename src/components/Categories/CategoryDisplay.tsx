import { fullGameData } from "libs/types";
import { Link } from "react-router-dom";

function CategoryDisplay({
  categoryData,
  pageNumber,
  blockCategory,
}: {
  categoryData: fullGameData | undefined;
  pageNumber: { start: number; end: number };
  blockCategory: (categoryName: string, categoryId: string) => void;
}) {
  return (
    <div className="category-display-container">
      {!categoryData?.data.slice(0, pageNumber.end) &&
        Array.from(Array(100).keys()).map((item, index) => {
          return (
            <div key={index} className="category-content-container">
              <div className="category-loading-thumbnail" />
              <div className="category-loading-title" />
            </div>
          );
        })}
      {categoryData?.data?.slice(0, pageNumber.end).map((game, index) => {
        return (
          <div className="category-content-container" key={index}>
            <div className="category-thumbnail-container">
              <Link to={`/directory/categories/${game.id}`}>
                <img
                  className="category-thumbnail"
                  src={game.box_art_url
                    .replace("{width}", "285")
                    .replace("{height}", "380")}
                  alt={game.name}
                />
              </Link>
              <div
                onClick={() => blockCategory(game.name, game.id)}
                className="category-block"
              >
                x
              </div>
            </div>
            <div className="category-game-title" title={game.name}>
              {game.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CategoryDisplay;
