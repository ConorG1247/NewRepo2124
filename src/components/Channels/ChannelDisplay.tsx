import { useState, useEffect } from "react";
import { fullChannelData } from "libs/types";
import CalculateUptime from "custom/CalculateUptime";
import { AbbreviateNumbers } from "custom/AbbreviateNumbers";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ChannelDisplay({
  channelData,
  pageNumber,
  blockChannel,
}: {
  channelData: fullChannelData | undefined;
  pageNumber: { start: number; end: number };
  blockChannel: (channelName: string, channelId: string) => void;
}) {
  const [updatedChannelData, setUpdatedChannelData] =
    useState<fullChannelData>();

  useEffect(() => {
    let channelDataUptime: fullChannelData | undefined = channelData;

    const getUptime = () => {
      channelData?.data.forEach((channel, index) => {
        const uptime = CalculateUptime(channel);
        if (channelDataUptime) {
          channelDataUptime.data[index] = { ...channel, uptime: uptime };
        }
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
              <div className="channel-thumbnail-container">
                <a href={`https://www.twitch.tv/${channel.user_login}`}>
                  <img
                    className="channel-thumbnail"
                    src={channel.thumbnail_url
                      .replace("{width}", "530")
                      .replace("{height}", "316")}
                    alt={channel.user_name}
                  />
                </a>

                <div className=" channel-viewers">
                  {channel.viewer_count > 1000
                    ? channel.viewer_count > 100000
                      ? AbbreviateNumbers(channel.viewer_count, 0)
                      : AbbreviateNumbers(channel.viewer_count, 1)
                    : channel.viewer_count}{" "}
                  viewers
                </div>
                <div
                  className="channel-block"
                  onClick={() =>
                    blockChannel(channel.user_login, channel.user_id)
                  }
                >
                  x
                </div>
                <div className="channel-uptime">
                  <FontAwesomeIcon icon={faClock} className="channel-clock" />{" "}
                  {channel.uptime}
                </div>
              </div>
              <div className="channel-channel-title" title={channel.title}>
                {channel.title}
              </div>
              <div>{channel.user_name}</div>
              <div className="channel-channel-title" title={channel.game_name}>
                {channel.game_name}
              </div>
              <div className="channel-tags-container">
                {channel?.tags?.map((tag, index) => {
                  return (
                    <div key={index} className="channel-tags-content">
                      {tag}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default ChannelDisplay;
