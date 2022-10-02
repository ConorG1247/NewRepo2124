import { individualChannelData } from "libs/types";

const ConvertUptime = (channel: individualChannelData): string => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

  let time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

  if (time.split(":")[1].length === 1 && time.split(":")[2].length === 1) {
    time =
      today.getHours() + ":0" + today.getMinutes() + ":0" + today.getSeconds();
  } else if (time.split(":")[1].length === 1) {
    time =
      today.getHours() + ":0" + today.getMinutes() + ":" + today.getSeconds();
  } else if (time.split(":")[2].length === 1) {
    time =
      today.getHours() + ":" + today.getMinutes() + ":0" + today.getSeconds();
  }

  const channelStartDate = Number(
    channel.started_at.split("T")[0].replaceAll("-", "").slice(0, 6) +
      channel.started_at.split("T")[0].replaceAll("-", "").slice(7)
  );

  const channelStartTime = channel.started_at.replace("Z", "").split("T")[1];

  if (Number(date.replaceAll("-", "")) === channelStartDate) {
    // console.log(Number(time.replace(":", "")));

    const uptime =
      (Number(time.replaceAll(":", "")) -
        Number(channelStartTime.replaceAll(":", ""))) /
        1000 /
        60 +
      "";

    let updatedUptime;
    let finalTime;

    if ((Number(uptime.split(".")[1].slice(0, 2)) + "").length === 1) {
      updatedUptime = "0" + (Number(uptime.split(".")[1].slice(0, 2)) + "");
    } else {
      updatedUptime = Number(uptime.split(".")[1].slice(0, 2)) + "";
    }

    if (((Number(updatedUptime) / 100) * 60 + "").split(".")[0].length === 1) {
      finalTime = "0" + (Number(updatedUptime) / 100) * 60 + "";
    } else {
      finalTime = (Number(updatedUptime) / 100) * 60 + "";
    }

    return uptime.split(".")[0] + ":" + finalTime.split(".")[0];
  }
  return "24:00+";
};

export default ConvertUptime;
