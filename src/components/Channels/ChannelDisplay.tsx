import { useState, useEffect } from "react";
import { fullChannelData } from "libs/types";

function ChannelDisplay({
  channelData,
  pageNumber,
  blockChannel,
}: {
  channelData: fullChannelData | undefined;
  pageNumber: { start: number; end: number };
  blockChannel: (channelName: string, channelId: string) => void;
}) {
  const [liveDuration, setLiveDuration] = useState([]);

  useEffect(() => {
    setLiveDuration([]);

    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();

    let time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    if (time.split(":")[1].length === 1 && time.split(":")[2].length === 1) {
      time =
        today.getHours() +
        ":0" +
        today.getMinutes() +
        ":0" +
        today.getSeconds();
    } else if (time.split(":")[1].length === 1) {
      time =
        today.getHours() + ":0" + today.getMinutes() + ":" + today.getSeconds();
    } else if (time.split(":")[2].length === 1) {
      time =
        today.getHours() + ":" + today.getMinutes() + ":0" + today.getSeconds();
    }

    channelData?.data.forEach((channel) => {
      const channelStartDate = Number(
        channel.started_at.split("T")[0].replaceAll("-", "").slice(0, 6) +
          channel.started_at.split("T")[0].replaceAll("-", "").slice(7)
      );

      const channelStartTime = channel.started_at
        .replace("Z", "")
        .split("T")[1];

      if (Number(date.replaceAll("-", "")) === channelStartDate) {
        // console.log(Number(time.replace(":", "")));

        const uptime =
          (Number(time.replaceAll(":", "")) -
            Number(channelStartTime.replaceAll(":", ""))) /
            1000 /
            60 +
          "";

        let updatedUptime;
        let finalTime;

        if ((Number(uptime.split(".")[1].slice(0, 2)) + "").length === 1) {
          updatedUptime = "0" + (Number(uptime.split(".")[1].slice(0, 2)) + "");
        } else {
          updatedUptime = Number(uptime.split(".")[1].slice(0, 2)) + "";
        }

        if (
          ((Number(updatedUptime) / 100) * 60 + "").split(".")[0].length === 1
        ) {
          finalTime = "0" + (Number(updatedUptime) / 100) * 60 + "";
        } else {
          finalTime = (Number(updatedUptime) / 100) * 60 + "";
        }

        console.log(uptime.split(".")[0] + ":" + finalTime.split(".")[0]);
      }
    });
  }, [channelData]);

  return (
    <div className="channel-display-container">
      {channelData?.data
        .slice(pageNumber.start, pageNumber.end)
        .map((channel, index) => {
          return (
            <div className="channel-content-container" key={index}>
              <a href={`https://www.twitch.tv/${channel.user_login}`}>
                <img
                  className="channel-thumbnail"
                  src={channel.thumbnail_url
                    .replace("{width}", "346")
                    .replace("{height}", "195")}
                  alt={channel.user_name}
                />
                <div>{channel.viewer_count.toLocaleString("en-US")}</div>
                <div className="channel-channel-title" title={channel.title}>
                  {channel.title}
                </div>
              </a>
              <div>{channel.user_name}</div>
              <div className="channel-channel-title" title={channel.game_name}>
                {channel.game_name}
              </div>
              <div
                onClick={() =>
                  blockChannel(channel.user_login, channel.user_id)
                }
              >
                Hide Channel
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default ChannelDisplay;
