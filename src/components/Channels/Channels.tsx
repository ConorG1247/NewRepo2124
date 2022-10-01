import { useState, useEffect } from "react";
import { fullChannelData } from "libs/types";

function Channels() {
  const [channelData, setChannelData] = useState<fullChannelData>();
  const [pageNumber, setPageNumber] = useState({ start: 0, end: 20 });

  useEffect(() => {
    const getChannelData = async () => {
      const res = await fetch(
        "https://api.twitch.tv/helix/streams?first=100&language=en",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
            "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
          },
        }
      );

      const data: fullChannelData = await res.json();

      setChannelData({
        data: [...data.data],
        pagination: data.pagination,
      });
    };

    getChannelData();
  }, []);

  const nextGamePage = async () => {
    if (
      channelData &&
      pageNumber.start + 20 >= channelData?.data?.length - 20
    ) {
      const res = await fetch(
        `https://api.twitch.tv/helix/streams?first=100&language=en&after=${channelData.pagination.cursor}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
            "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
          },
        }
      );

      const data: fullChannelData = await res.json();

      setChannelData({
        data: [...channelData.data, ...data.data],
        pagination: data.pagination,
      });
    }
    setPageNumber({ start: pageNumber.start + 20, end: pageNumber.end + 20 });
  };

  const prevGamePage = async () => {
    setPageNumber({ start: pageNumber.start - 20, end: pageNumber.end - 20 });
  };

  return (
    <div>
      {channelData?.data
        .slice(pageNumber.start, pageNumber.end)
        .map((channel, index) => {
          return (
            <div key={index}>
              <img
                src={channel.thumbnail_url
                  .replace("{width}", "440")
                  .replace("{height}", "248")}
                alt={channel.user_name}
              />
              <div>{channel.user_name}</div>
              <div>{channel.viewer_count.toLocaleString("en-US")}</div>
            </div>
          );
        })}
      {channelData && (
        <button
          onClick={() => {
            nextGamePage();
            window.scrollTo(0, 0);
          }}
        >
          Next page
        </button>
      )}
      {pageNumber.start > 0 && (
        <button
          onClick={() => {
            prevGamePage();
            window.scrollTo(0, 0);
          }}
        >
          Prev page
        </button>
      )}
    </div>
  );
}

export default Channels;
