import { StreamLanguage } from "libs/StreamLanguage";
import { useState } from "react";

function ChannelFilter() {
  const [languageInput, setLanguageInput] = useState<string | undefined>();
  const [noResultsCheck, setNoResultsCheck] = useState(false);

  const languageResultsCheck = (input: string) => {
    setLanguageInput(input);

    if (
      StreamLanguage.filter((lang) =>
        lang.language.toLocaleLowerCase().includes(input)
      ).length === 0
    ) {
      setNoResultsCheck(true);
    } else {
      setNoResultsCheck(false);
    }
  };

  return (
    <div className="channel-language-container">
      <div>Filter by Language: </div>
      <input
        className="channel-language-input"
        onChange={(input) => {
          languageResultsCheck(input.target.value.toLocaleLowerCase());
        }}
      />
      <div className="channel-language-option-container">
        {StreamLanguage.map((language, index) => {
          return (
            <div key={index}>
              {languageInput &&
                language.language
                  .toLocaleLowerCase()
                  .includes(languageInput) && (
                  <div className="channel-language-option">
                    <div>{language.language}</div>
                  </div>
                )}
              {!languageInput && (
                <div className="channel-language-option">
                  <div>{language.language}</div>
                </div>
              )}
            </div>
          );
        })}
        {noResultsCheck && (
          <div className="channel-language-option">
            <div>No results found</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChannelFilter;
