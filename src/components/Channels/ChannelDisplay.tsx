import { useState, useEffect } from "react";
import { fullChannelData } from "libs/types";
import CalculateUptime from "custom/CalculateUptime";
import { AbbreviateNumbers } from "custom/AbbreviateNumbers";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChannelLoading from "./ChannelLoading";
import ChannelFilter from "./ChannelFilter";

function ChannelDisplay({
  channelData,
  pageNumber,
  blockChannel,
  addLanguageFilter,
  removeLanguageFilter,
}: {
  channelData: fullChannelData | undefined;
  pageNumber: { start: number; end: number };
  blockChannel: (channelName: string, channelId: string) => void;
  addLanguageFilter: (language: string) => void;
  removeLanguageFilter: (language: string) => void;
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
    <div>
      <ChannelFilter
        addLanguageFilter={addLanguageFilter}
        removeLanguageFilter={removeLanguageFilter}
      />
      <ChannelLoading
        updatedChannelData={updatedChannelData}
        pageNumber={pageNumber}
      />
      <div className="channel-display-container">
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

                  <div className="channel-viewers">
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
                  <div
                    className="channel-uptime"
                    title={
                      "Started at: " + channel.started_at.replace(/[TZ]/g, " ")
                    }
                  >
                    <FontAwesomeIcon icon={faClock} className="channel-clock" />{" "}
                    {channel.uptime}
                  </div>
                </div>
                <a href={`https://twitch.tv/${channel.user_login}`}>
                  <div className="channel-content-title" title={channel.title}>
                    {channel.title}
                  </div>
                </a>
                <div className="channel-content-subtitle">
                  {channel.user_name}
                </div>
                <div
                  className="channel-content-subtitle"
                  title={channel.game_name}
                >
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
    </div>
  );
}

export default ChannelDisplay;
