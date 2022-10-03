import { useState, useEffect } from "react";
import { fullChannelData, individualChannelData } from "libs/types";
import Pagination from "components/Pagination/Pagination";
import ChannelDisplay from "./ChannelDisplay";

const blockList: { [key: string]: { name: string; id: string }[] }[] = [
  {
    games: [
      { name: "Grand Theft Auto V", id: "32982" },
      { name: "FIFA 23", id: "1745202732" },
      { name: "Slots", id: "498566" },
      { name: "PUBG: BATTLEGROUNDS", id: "493057" },
    ],
  },
  {
    channels: [
      { name: "castro_1021", id: "52091823" },
      { name: "npmlol", id: "21841789" },
      { name: "latinxingames", id: "412979783" },
      { name: "hasanabi", id: "207813352" },
    ],
  },
];

function Channels() {
  const [channelData, setChannelData] = useState<fullChannelData>();
  const [blockedChannelData, setBlockedChannelData] =
    useState<fullChannelData>();
  const [pageNumber, setPageNumber] = useState({ start: 0, end: 100 });
  const [paginationData, setPaginationData] = useState<
    {
      page: number;
      start: number;
      end: number;
    }[]
  >([]);

  useEffect(() => {
    const getChannelData = async () => {
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

      setChannelData({
        data: [...data.data],
        pagination: data.pagination,
      });
    };

    getChannelData();
  }, []);

  useEffect(() => {
    if (channelData) {
      let updatedChannelData: individualChannelData[] = channelData.data;

      if (blockList[1]?.channels.length > 0) {
        blockList[1].channels.forEach((blockedChannels) => {
          updatedChannelData = updatedChannelData?.filter((channel: any) => {
            return blockedChannels.id !== channel.user_id;
          });
        });
      }

      if (blockList[0].games.length > 0) {
        blockList[0].games.forEach((blockedGames) => {
          updatedChannelData = updatedChannelData?.filter((game: any) => {
            return blockedGames.id !== game.game_id;
          });
        });
      }

      setBlockedChannelData({
        data: updatedChannelData,
        pagination: channelData.pagination,
      });
    }
  }, [channelData]);

  const nextChannelPage = async () => {
    if (
      channelData &&
      pageNumber.start + 100 >= channelData?.data?.length - 100
    ) {
      const res = await fetch(
        `https://api.twitch.tv/helix/streams?first=100&language=en&after=${channelData.pagination.cursor}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
            "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
          },
        }
      );

      const data: fullChannelData = await res.json();

      setChannelData({
        data: [...channelData.data, ...data.data],
        pagination: data.pagination,
      });
    }
    setPageNumber({ start: pageNumber.start + 100, end: pageNumber.end + 100 });
    if (paginationData.length === 0) {
      return setPaginationData([{ page: 1, start: 0, end: 100 }]);
    }
    setPaginationData([
      ...paginationData,
      {
        page: paginationData.length + 1,
        start: pageNumber.start,
        end: pageNumber.end,
      },
    ]);
  };

  const prevChannelPage = () => {
    setPageNumber({ start: pageNumber.start - 100, end: pageNumber.end - 100 });
    setPaginationData([...paginationData.slice(0, paginationData.length - 1)]);
  };

  const paginationPageSelect = (page: {
    page: number;
    start: number;
    end: number;
  }) => {
    setPageNumber({ start: page.start, end: page.end });
    setPaginationData([...paginationData.slice(0, page.page - 1)]);
    if (paginationData.length === 0) {
      setPaginationData([{ page: 1, start: 0, end: 100 }]);
    }
  };

  const blockChannel = (channelName: string, channelId: string) => {
    if (channelData) {
      const updatedChannelList = channelData?.data.filter((channel) => {
        if (channel.id === channelId) {
          console.log(channel);
        }
        return channel.user_id !== channelId;
      });

      setChannelData({
        data: updatedChannelList,
        pagination: channelData.pagination,
      });
    }

    console.log(channelName, channelId);
  };

  return (
    <div>
      <ChannelDisplay
        channelData={blockedChannelData}
        pageNumber={pageNumber}
        blockChannel={blockChannel}
      />
      {blockedChannelData && (
        <Pagination
          paginationData={paginationData}
          nextPage={nextChannelPage}
          prevPage={prevChannelPage}
          pageSelect={paginationPageSelect}
        />
      )}
    </div>
  );
}

export default Channels;
