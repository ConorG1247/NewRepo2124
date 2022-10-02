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
                <div title={channel.title}>
                  {channel.title.length > 25
                    ? channel.title.slice(0, 25) + "..."
                    : channel.title}
                </div>
              </a>
              <div>{channel.user_name}</div>
              <div title={channel.game_name}>
                {channel.game_name.length > 32
                  ? channel.game_name.slice(0, 32) + "..."
                  : channel.game_name}
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
