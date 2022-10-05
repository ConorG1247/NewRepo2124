import { StreamLanguage } from "libs/StreamLanguage";
import { useState } from "react";

function ChannelFilter() {
  const [languageInput, setLanguageInput] = useState<string | undefined>();
  const [noResultsCheck, setNoResultsCheck] = useState(false);
  const [languageSelected, setLanguageSelected] = useState<string[]>([]);

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

  const selectLanguage = (language: { language: string; code: string }) => {
    if (
      languageSelected.filter((lang) => lang === language.language).length > 0
    ) {
      return;
    }
    setLanguageSelected([...languageSelected, language.language]);
  };

  const removeSelectedLanguage = (language: string) => {
    setLanguageSelected(
      languageSelected.filter((lang) => {
        return language !== lang;
      })
    );
  };

  return (
    <div className="channel-language">
      <div className="channel-language-container">
        <div>Filter by </div>
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
                    <div
                      className="channel-language-option"
                      onClick={() => selectLanguage(language)}
                    >
                      {language.language}
                    </div>
                  )}
                {!languageInput && (
                  <div
                    className="channel-language-option"
                    onClick={() => selectLanguage(language)}
                  >
                    {language.language}
                  </div>
                )}
              </div>
            );
          })}
          {noResultsCheck && (
            <div style={{ borderRadius: "5px", padding: "10px" }}>
              No results found
            </div>
          )}
        </div>
      </div>
      <div className="channel-language-selected-container">
        {languageSelected &&
          languageSelected.map((lang, index) => {
            return (
              <div key={index} className="channel-language-selected">
                <div>{lang}</div>
                <div
                  className="channel-language-x"
                  onClick={() => removeSelectedLanguage(lang)}
                >
                  x
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ChannelFilter;
