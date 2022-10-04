import { useState, useEffect } from "react";
import { fullChannelData, uptimeChannelData } from "libs/types";
import CalculateUptime from "custom/CalculateUptime";
import { AbbreviateNumbers } from "custom/AbbreviateNumbers";

function ChannelDisplay({
  channelData,
  pageNumber,
  blockChannel,
}: {
  channelData: fullChannelData | undefined;
  pageNumber: { start: number; end: number };
  blockChannel: (channelName: string, channelId: string) => void;
}) {
  const [updatedChannelData, setUpdatedChannelData] = useState<{
    data: uptimeChannelData[];
    pagation: { cursor: string };
  }>();

  useEffect(() => {
    let channelDataUptime: any = channelData;

    const getUptime = () => {
      channelData?.data.forEach((channel, index) => {
        const uptime = CalculateUptime(channel);
        channelDataUptime.data[index] = { ...channel, uptime: uptime };
      });

      setUpdatedChannelData(channelDataUptime);
    };

    getUptime();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelData]);

  return (
    <div className="channel-display-container">
      {!updatedChannelData?.data.slice(0, pageNumber.end) &&
        Array.from(Array(100).keys()).map((item, index) => {
          return (
            <div key={index} className="channel-content-container">
              <div className="channel-loading-thumbnail" />
              <div className="channel-loading-title" />
              <div className="channel-loading-user" />
              <div className="channel-loading-user" />
            </div>
          );
        })}
      {updatedChannelData?.data
        .slice(0, pageNumber.end)
        .map((channel, index) => {
          return (
            <div className="channel-content-container" key={index}>
              <a href={`https://www.twitch.tv/${channel.user_login}`}>
                <div className="channel-thumbnail-container">
                  <img
                    className="channel-thumbnail"
                    src={channel.thumbnail_url
                      .replace("{width}", "530")
                      .replace("{height}", "316")}
                    alt={channel.user_name}
                  />
                </div>
                <div>
                  {channel.viewer_count > 1000
                    ? channel.viewer_count > 100000
                      ? AbbreviateNumbers(channel.viewer_count, 0)
                      : AbbreviateNumbers(channel.viewer_count, 1)
                    : channel.viewer_count}{" "}
                  viewers
                </div>
                <div className="channel-channel-title" title={channel.title}>
                  {channel.title}
                </div>
              </a>
              <div>{channel.user_name}</div>
              <div className="channel-channel-title" title={channel.game_name}>
                {channel.game_name}
              </div>
              {channel.tags.map((tag, index) => {
                return (
                  <div key={index}>
                    <div>{tag}</div>
                  </div>
                );
              })}
              <div>{channel.uptime}</div>
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
