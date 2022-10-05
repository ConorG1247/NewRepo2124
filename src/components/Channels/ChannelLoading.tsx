import { fullChannelData } from "libs/types";

function ChannelLoading({
  updatedChannelData,
  pageNumber,
}: {
  updatedChannelData: fullChannelData | undefined;
  pageNumber: { start: number; end: number };
}) {
  return (
    <div className="channel-display-container">
      {" "}
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
    </div>
  );
}

export default ChannelLoading;
