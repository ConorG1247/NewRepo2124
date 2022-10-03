import { individualChannelData } from "libs/types";

function getTimeInSeconds(str: string) {
  let curr_time: any = [];

  curr_time = str.split(":");
  for (let i = 0; i < curr_time.length; i++) {
    curr_time[i] = parseInt(curr_time[i]);
  }

  let t = curr_time[0] * 60 * 60 + curr_time[1] * 60 + curr_time[2];

  return t;
}

// Function to convert seconds back to hh::mm:ss
// format
function convertSecToTime(t: any) {
  let hours = Math.floor(t / 3600 - 1);
  let hh = hours < 10 ? "0" + hours.toString() : hours.toString();
  let min = Math.floor((t % 3600) / 60);
  let mm = min < 10 ? "0" + min.toString() : min.toString();
  //   let sec = (t % 3600) % 60;
  //   let ss = sec < 10 ? "0" + sec.toString() : sec.toString();
  //   let ans = hh + ":" + mm + ":" + ss;
  let ans = hh + ":" + mm;
  return ans;
}

// Function to find the time gap
function CalculateUptime(channel: individualChannelData) {
  const channelStartDate = Number(
    channel.started_at.split("T")[0].replaceAll("-", "").slice(0, 6) +
      channel.started_at.split("T")[0].replaceAll("-", "").slice(7)
  );
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

  let st = channel.started_at.split("T")[1].replace("Z", "");
  let et = time;

  if (Number(date.replaceAll("-", "")) !== channelStartDate) {
    const dateDifference = Number(date.replaceAll("-", "")) - channelStartDate;

    et =
      today.getHours() +
      24 * dateDifference +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds();
  }

  let t1 = getTimeInSeconds(st);
  let t2 = getTimeInSeconds(et);

  let time_diff = t1 - t2 < 0 ? t2 - t1 : t1 - t2;

  return convertSecToTime(time_diff);
}

export default CalculateUptime;
