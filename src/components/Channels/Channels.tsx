import { useState, useEffect } from "react";
import {
  fullChannelData,
  individualChannelData,
  fullBlockList,
  blockListItem,
} from "libs/types";
import Pagination from "components/Pagination/Pagination";
import ChannelDisplay from "./ChannelDisplay";

function Channels() {
  const [channelData, setChannelData] = useState<fullChannelData>();
  const [blockedChannelData, setBlockedChannelData] =
    useState<fullChannelData>();
  const [pageNumber, setPageNumber] = useState({ start: 0, end: 60 });
  const [paginationData, setPaginationData] = useState<
    {
      page: number;
      start: number;
      end: number;
    }[]
  >([]);
  const [blockListData, setBlockListData] = useState<{
    blocklist: {
      category: blockListItem[];
      channel: blockListItem[];
    };
  }>();

  useEffect(() => {
    const getBlockListData = async () => {
      const res = await fetch("http://localhost:3001/get/all/guest", {
        method: "GET",
      });

      const data: fullBlockList = await res.json();

      if (!data.blocklist) {
        return setBlockListData(undefined);
      }

      setBlockListData({
        blocklist: {
          category: data.blocklist.category,
          channel: data.blocklist.channel,
        },
      });
    };
    getBlockListData();
  }, []);

  useEffect(() => {
    let updatedChannelData: fullChannelData = {
      data: [],
      pagination: { cursor: "" },
    };
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

      updatedChannelData = {
        data: [...updatedChannelData.data, ...data.data],
        pagination: data.pagination,
      };

      while (updatedChannelData.data.length < 300) {
        const res = await fetch(
          `https://api.twitch.tv/helix/streams?first=100&language=en&after=${updatedChannelData.pagination.cursor}`,
          {
            method: "GET",
            headers: {
              Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
              "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
            },
          }
        );

        const data: fullChannelData = await res.json();

        updatedChannelData = {
          data: [...updatedChannelData.data, ...data.data],
          pagination: data.pagination,
        };
      }

      setChannelData({
        data: updatedChannelData.data,
        pagination: updatedChannelData.pagination,
      });
    };

    getChannelData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockListData]);

  useEffect(() => {
    if (channelData) {
      let updatedChannelData: individualChannelData[] = channelData.data;

      if (blockListData && blockListData?.blocklist.channel.length > 0) {
        blockListData?.blocklist.channel.forEach((blockedChannels) => {
          updatedChannelData = updatedChannelData?.filter((channel: any) => {
            return blockedChannels.id !== channel.user_id;
          });
        });
      }

      if (blockListData && blockListData?.blocklist.category.length > 0) {
        blockListData?.blocklist.category.forEach((blockedCategories) => {
          updatedChannelData = updatedChannelData?.filter((game: any) => {
            return blockedCategories.id !== game.game_id;
          });
        });
      }

      if (!blockListData) {
        return setBlockedChannelData(channelData);
      }

      setBlockedChannelData({
        data: updatedChannelData,
        pagination: channelData.pagination,
      });
    }
  }, [blockListData, channelData]);

  const nextChannelPage = async () => {
    if (blockedChannelData && channelData) {
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
        data: [...blockedChannelData.data, ...data.data],
        pagination: data.pagination,
      });
    }

    setPageNumber({
      start: pageNumber.start + 60,
      end: pageNumber.end + 60,
    });

    if (paginationData.length === 0) {
      return setPaginationData([{ page: 1, start: 0, end: 60 }]);
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
    setPageNumber({ start: pageNumber.start - 60, end: pageNumber.end - 60 });
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
      setPaginationData([{ page: 1, start: 0, end: 60 }]);
    }
  };

  const blockChannel = async (channelName: string, channelId: string) => {
    if (blockedChannelData) {
      let filteredChannels: individualChannelData[] = [];

      filteredChannels = blockedChannelData?.data.filter((channel) => {
        console.log(channelId, channel.id);
        return channelId !== channel.user_id;
      });

      setBlockedChannelData({
        data: filteredChannels,
        pagination: blockedChannelData.pagination,
      });
    }

    await fetch("http://localhost:3001/add/channel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: "guest",
        name: channelName,
        id: channelId,
      }),
    });
  };

  console.log(blockedChannelData?.data.length);

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
