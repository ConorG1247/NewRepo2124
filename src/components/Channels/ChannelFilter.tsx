import { StreamLanguage } from "libs/StreamLanguage";
import { useState } from "react";

function ChannelFilter() {
  const [languageInput, setLanguageInput] = useState<string | undefined>();

  return (
    <div className="channel-language-container">
      <div>Filter by Language: </div>
      <input
        className="channel-language-input"
        onChange={(input) =>
          setLanguageInput(input.target.value.toLocaleLowerCase())
        }
      />
      <div className="channel-language-option-container">
        {StreamLanguage.map((language, index) => {
          return (
            <div>
              {languageInput &&
                language.language
                  .toLocaleLowerCase()
                  .includes(languageInput) && (
                  <div key={index} className="channel-language-option">
                    <div>{language.language}</div>
                  </div>
                )}
              {!languageInput && (
                <div key={index} className="channel-language-option">
                  <div>{language.language}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChannelFilter;
