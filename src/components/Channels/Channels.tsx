import { useState, useEffect } from "react";
import {
  fullChannelData,
  liveChannelData,
  channelDataAvatar,
  userData,
} from "libs/types";

function Channels() {
  const [channelData, setChannelData] = useState<liveChannelData>();
  const [finalChannelData, setFinalChannelData] = useState<liveChannelData>();
  const [userData, setUserData] = useState<{ data: userData[] }>();
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
        channelDataFinal.push({
          ...channel,
          profile: "",
        });
      });

      setChannelData({
        data: [...channelDataFinal],
        pagination: data.pagination,
      });
    };

    getChannelData();
  }, []);

  useEffect(() => {
    const getChannelImage = async () => {
      let profileData = channelData;
      let user: { data: userData[] } = { data: [] };

      profileData?.data.forEach(async (channel) => {
        const res = await fetch(
          `https://api.twitch.tv/helix/users?id=${channel.user_id}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
              "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
            },
          }
        );
        const data: { data: userData[] } = await res.json();

        user.data.push(data.data[0]);

        setUserData(user);
      });

      if (profileData && channelData) {
        setFinalChannelData({
          data: [...profileData.data],
          pagination: channelData.pagination,
        });
      }
    };

    getChannelImage();
  }, [channelData]);

  useEffect(() => {
    let chanData = channelData;
    channelData?.data.forEach((channel, index) => {
      userData?.data.forEach((user) => {
        if (channel.user_id === Object.values(user)[0] && chanData) {
          chanData.data[index].profile = user.profile_image_url
            .replace("300x", "50x")
            .replace("300", "50");
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <div>
      {finalChannelData?.data
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
              <img src={channel.profile} alt={channel.user_name} />
              <div>{channel.user_name}</div>
              <div>{channel.viewer_count.toLocaleString("en-US")}</div>
            </div>
          );
        })}
    </div>
  );
}

export default Channels;
