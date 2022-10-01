import { useState, useEffect } from "react";
import {
  fullChannelData,
  liveChannelData,
  channelDataAvatar,
} from "libs/types";

function Channels() {
  const [channelData, setChannelData] = useState<liveChannelData>();
  const [pageNumber, setPageNumber] = useState({ start: 0, end: 20 });

  useEffect(() => {
    const getChannelData = async () => {
      let channelDataFinal: channelDataAvatar[] = [];
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

      data.data.forEach((channel) => {
        channelDataFinal.push({ ...channel, profile: "" });
      });

      setChannelData({
        data: [...channelDataFinal],
        pagination: data.pagination,
      });

      data.data.forEach(async (channel) => {
        const res = await fetch(
          `https://api.twitch.tv/helix/search/channels?query=${channel.user_login}&live_only=true`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
              "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
            },
          }
        );
        const data: fullChannelData = await res.json();

        channelDataFinal.forEach((updatedChannel, index) => {
          if (updatedChannel.user_id === Object.values(channel)[1]) {
            channelDataFinal[index].profile = data.data[0].thumbnail_url;
          }
        });
      });

      if (channelData) {
        setChannelData({
          data: [...channelDataFinal],
          pagination: channelData.pagination,
        });
      }
    };

    getChannelData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(channelData);

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
    </div>
  );
}

export default Channels;
