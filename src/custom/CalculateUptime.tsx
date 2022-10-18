import { individualChannelData } from "libs/types";

function getTimeInSeconds(str: string) {
  let currentTime: any = [];

  currentTime = str.split(":");
  for (let i = 0; i < currentTime.length; i++) {
    currentTime[i] = parseInt(currentTime[i]);
  }

  let time = currentTime[0] * 60 * 60 + currentTime[1] * 60 + currentTime[2];

  return time;
}

// Function to convert seconds back to hh::mm:ss
// format
function convertSecToTime(time: any) {
  let hours = Math.floor(time / 3600 - 1);
  let hh = hours < 10 ? "0" + hours.toString() : hours.toString();
  let min = Math.floor((time % 3600) / 60);
  let mm = min < 10 ? "0" + min.toString() : min.toString();
  //   let sec = (t % 3600) % 60;
  //   let ss = sec < 10 ? "0" + sec.toString() : sec.toString();
  //   let ans = hh + ":" + mm + ":" + ss;
  let finalTime = hh + ":" + mm;
  return finalTime;
}

// Function to find the time gap
function CalculateUptime(channel: individualChannelData) {
  const channelStartDate = Number(
    channel.started_at.split("T")[0].replaceAll("-", "").slice(0, 6) +
      channel.started_at.split("T")[0].replaceAll("-", "").slice(7)
  );
  const today = new Date();
  console.log(today);
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

  let startTime = channel.started_at.split("T")[1].replace("Z", "");
  let endTime = time;

  if (Number(date.replaceAll("-", "")) !== channelStartDate) {
    const dateDifference = Number(date.replaceAll("-", "")) - channelStartDate;

    endTime =
      today.getHours() +
      24 * dateDifference +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds();
  }

  let finalStartTime = getTimeInSeconds(startTime);
  let finalEndTime = getTimeInSeconds(endTime);

  let timeDifference =
    finalStartTime - finalEndTime < 0
      ? finalEndTime - finalStartTime
      : finalStartTime - finalEndTime;

  return convertSecToTime(timeDifference);
}

export default CalculateUptime;
