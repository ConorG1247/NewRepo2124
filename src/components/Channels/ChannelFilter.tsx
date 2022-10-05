import { useState } from "react";
import { StreamLanguage } from "libs/StreamLanguage";

function ChannelFilter() {
  const [languageInput, setLanguageInput] = useState<string>("");
  const [noResultsCheck, setNoResultsCheck] = useState(false);
  const [languageSelected, setLanguageSelected] = useState<
    { language: string; code: string }[]
  >([]);

  const languageResultsCheck = (input: string) => {
    setLanguageInput(input);

    if (
      StreamLanguage.filter((lang) =>
        lang.language.toLocaleLowerCase().includes(input.toLocaleLowerCase())
      ).length === 0
    ) {
      setNoResultsCheck(true);
    } else {
      setNoResultsCheck(false);
    }
  };

  const selectLanguage = (language: { language: string; code: string }) => {
    if (
      languageSelected.filter((lang) => lang.language === language.language)
        .length > 0
    ) {
      return;
    }
    // addLanguageFilter(language.code)
    setLanguageSelected([...languageSelected, language]);
    setLanguageInput("");
  };

  const removeSelectedLanguage = (language: {
    language: string;
    code: string;
  }) => {
    // removeLanguageFilter(language);
    setLanguageSelected(
      languageSelected.filter((lang) => {
        return language.language !== lang.language;
      })
    );
  };

  const clearInput = () => {
    setNoResultsCheck(false);
    setLanguageInput("");
  };

  return (
    <div className="channel-language">
      <div className="channel-language-container">
        <div>Filter by </div>
        <input
          value={languageInput}
          placeholder="Language"
          className="channel-language-input"
          onChange={(input) => {
            languageResultsCheck(input.target.value);
          }}
        />
        {languageInput && (
          <div className="channel-language-input-x" onClick={clearInput}>
            X
          </div>
        )}
        <div className="channel-language-option-container">
          {StreamLanguage.map((language, index) => {
            return (
              <div key={index}>
                {languageInput &&
                  language.language
                    .toLocaleLowerCase()
                    .includes(languageInput.toLocaleLowerCase()) && (
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
                <div>{lang.language}</div>
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
