import { useState, useEffect } from "react";
import { fullChannelData } from "libs/types";
import CalculateUptime from "custom/CalculateUptime";

function ChannelDisplay({
  channelData,
  pageNumber,
  blockChannel,
}: {
  channelData: fullChannelData | undefined;
  pageNumber: { start: number; end: number };
  blockChannel: (channelName: string, channelId: string) => void;
}) {
  const [liveDuration, setLiveDuration] = useState<string[]>([]);

  useEffect(() => {
    setLiveDuration([]);

    channelData?.data.forEach((channel) => {
      liveDuration.push(CalculateUptime(channel));
      console.log(CalculateUptime(channel));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
