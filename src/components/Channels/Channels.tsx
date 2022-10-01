import { useState, useEffect } from "react";
import { fullChannelData } from "libs/types";
import Pagination from "components/Pagination/Pagination";
import ChannelDisplay from "./ChannelDisplay";

function Channels() {
  const [channelData, setChannelData] = useState<fullChannelData>();
  const [pageNumber, setPageNumber] = useState({ start: 0, end: 20 });
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

  const nextChannelPage = async () => {
    if (
      channelData &&
      pageNumber.start + 20 >= channelData?.data?.length - 20
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
    setPageNumber({ start: pageNumber.start + 20, end: pageNumber.end + 20 });
    if (paginationData.length === 0) {
      return setPaginationData([{ page: 1, start: 0, end: 20 }]);
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
    setPageNumber({ start: pageNumber.start - 20, end: pageNumber.end - 20 });
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
      setPaginationData([{ page: 1, start: 0, end: 20 }]);
    }
  };

  return (
    <div>
      <ChannelDisplay channelData={channelData} pageNumber={pageNumber} />
      <Pagination
        paginationData={paginationData}
        nextPage={nextChannelPage}
        prevPage={prevChannelPage}
        pageSelect={paginationPageSelect}
      />
    </div>
  );
}

export default Channels;
