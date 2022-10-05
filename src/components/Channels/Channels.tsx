import { useState, useEffect } from "react";
import {
  fullChannelData,
  individualChannelData,
  userData,
  blockListItem,
} from "libs/types";
import Pagination from "components/Pagination/Pagination";
import ChannelDisplay from "./ChannelDisplay";
import { StreamTags } from "libs/StreamTags";

const header = {
  Authorization: "Bearer hjn4lfvaa9vd04rv4ttw3nlnifndi7",
  "Client-Id": "hra765tyzo51u6ju9i7ihfmckwzuss",
};

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
  const [languageFilter, setLanguageFilter] = useState<
    { language: string; code: string }[]
  >([]);

  useEffect(() => {
    const getBlockListData = async () => {
      const res = await fetch("http://localhost:3001/get/all/guest", {
        method: "GET",
      });

      const data: userData = await res.json();

      if (!data.blocklist) {
        return setBlockListData(undefined);
      }

      setLanguageFilter([...languageFilter, ...data.language]);

      setBlockListData({
        blocklist: {
          category: data.blocklist.category,
          channel: data.blocklist.channel,
        },
      });
    };
    getBlockListData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let updatedChannelData: fullChannelData = {
      data: [],
      pagination: { cursor: "" },
    };

    let channelDataTags: fullChannelData = {
      data: [],
      pagination: { cursor: "" },
    };

    let url: string = "https://api.twitch.tv/helix/streams?first=100";

    const getChannelData = async () => {
      if (languageFilter.length > 0) {
        languageFilter.forEach((filter) => {
          console.log(filter.code);
          url = url + `&language=${filter.code}`;
        });
      }

      const res = await fetch(url, {
        method: "GET",
        headers: header,
      });

      const data: fullChannelData = await res.json();

      updatedChannelData = {
        data: [...updatedChannelData.data, ...data.data],
        pagination: data.pagination,
      };

      while (updatedChannelData.data.length < 250) {
        const res = await fetch(
          `${url}&after=${updatedChannelData.pagination.cursor}`,
          {
            method: "GET",
            headers: header,
          }
        );

        const data: fullChannelData = await res.json();

        if (data.data.length === 0 || data.pagination.cursor.length === 0) {
          break;
        } else {
          updatedChannelData = {
            data: [...updatedChannelData.data, ...data.data],
            pagination: data.pagination,
          };
        }
      }

      updatedChannelData.data.forEach((channel) => {
        channelDataTags = {
          data: [...channelDataTags.data, { ...channel, tags: [] }],
          pagination: data.pagination,
        };
      });

      setChannelData({
        data: channelDataTags.data,
        pagination: channelDataTags.pagination,
      });
    };

    getChannelData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageFilter, blockListData]);

  console.log(channelData);

  useEffect(() => {
    if (channelData) {
      let updatedChannelData: individualChannelData[] = channelData.data;
      let channelDataTags: any = channelData;

      console.log(updatedChannelData);

      if (blockListData && blockListData?.blocklist.channel.length > 0) {
        blockListData?.blocklist.channel.forEach((blockedChannels) => {
          channelDataTags.data = channelDataTags.data.filter((channel: any) => {
            return blockedChannels.id !== channel.user_id;
          });
        });

        blockListData?.blocklist.category.forEach((blockedCategories) => {
          channelDataTags.data = channelDataTags.data.filter((game: any) => {
            return blockedCategories.id !== game.game_id;
          });
        });
      }

      StreamTags.forEach((streamTag) => {
        channelDataTags.data.forEach((channel: any, index: number) => {
          channel?.tag_ids?.forEach((tag: string) => {
            if (streamTag.tag_id === tag) {
              channelDataTags.data[index] = {
                ...channelDataTags.data[index],
                tags: [...channelDataTags.data[index].tags, streamTag.tag],
              };
            }
          });
        });
      });

      if (!blockListData) {
        return setBlockedChannelData({
          data: channelDataTags.data,
          pagination: channelData.pagination,
        });
      }

      setBlockedChannelData({
        data: channelDataTags.data,
        pagination: channelData.pagination,
      });
    }
  }, [blockListData, channelData]);

  const nextChannelPage = async () => {
    let url: string = "https://api.twitch.tv/helix/streams?first=100";

    if (languageFilter.length > 0) {
      languageFilter.forEach((filter) => {
        url = url + `&language=${filter}`;
      });
    }

    if (blockedChannelData && channelData) {
      const res = await fetch(`${url}&after=${channelData.pagination.cursor}`, {
        method: "GET",
        headers: header,
      });

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

  const addLanguageFilter = (language: { language: string; code: string }) => {
    setLanguageFilter([...languageFilter, { ...language }]);
  };

  const removeLanguageFilter = (language: string) => {
    console.log(language);
    console.log(languageFilter.filter((lang) => lang.code !== language));
    setLanguageFilter(languageFilter.filter((lang) => lang.code !== language));
  };

  return (
    <div>
      <ChannelDisplay
        channelData={blockedChannelData}
        pageNumber={pageNumber}
        blockChannel={blockChannel}
        addLanguageFilter={addLanguageFilter}
        removeLanguageFilter={removeLanguageFilter}
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
