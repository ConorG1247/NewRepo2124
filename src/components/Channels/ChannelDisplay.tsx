import { fullChannelData } from "libs/types";

function ChannelDisplay({
  channelData,
  pageNumber,
}: {
  channelData: fullChannelData | undefined;
  pageNumber: { start: number; end: number };
}) {
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

export default ChannelDisplay;
