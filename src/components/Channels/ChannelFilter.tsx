import { useState, useEffect } from "react";
import { StreamLanguage } from "libs/StreamLanguage";
import { userData } from "libs/types";

function ChannelFilter({
  addLanguageFilter,
  removeLanguageFilter,
}: {
  addLanguageFilter: (language: { language: string; code: string }) => void;
  removeLanguageFilter: (language: string) => void;
}) {
  const [languageInput, setLanguageInput] = useState<string>("");
  const [noResultsCheck, setNoResultsCheck] = useState(false);
  const [languageSelected, setLanguageSelected] = useState<
    { language: string; code: string }[]
  >([]);

  useEffect(() => {
    const getLanguageData = async () => {
      const res = await fetch("http://localhost:3001/get/all/guest", {
        method: "GET",
      });

      const data: userData = await res.json();

      if (!data.blocklist) {
        return;
      }

      setLanguageSelected([...languageSelected, ...data.language]);
    };

    getLanguageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const selectLanguage = async (language: {
    language: string;
    code: string;
  }) => {
    if (
      languageSelected.filter((lang) => lang.language === language.language)
        .length > 0
    ) {
      return;
    }
    addLanguageFilter(language);
    setLanguageSelected([...languageSelected, language]);
    setLanguageInput("");

    await fetch("http://localhost:3001/add/language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "guest",
        language: { language: language.language, code: language.code },
      }),
    });
  };

  const removeSelectedLanguage = async (language: {
    language: string;
    code: string;
  }) => {
    removeLanguageFilter(language.code);
    setLanguageSelected(
      languageSelected.filter((lang) => {
        return language.language !== lang.language;
      })
    );

    await fetch("http://localhost:3001/remove/language", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "guest",
        language: { language: language.language, code: language.code },
      }),
    });
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
