export type individualGameData = {
  id: string;
  name: string;
  box_art_url: string;
};

export type gameData = {
  data: individualGameData[];
  pagination: { cursor: string };
};

export type fullIndividualGameData = {
  id: string;
  name: string;
  box_art_url: string;
  viewers: number;
};

export type fullGameData = {
  data: fullIndividualGameData[];
  pagination: { cursor: string };
};

export type individualChannelData = {
  game_id: string;
  game_name: string;
  id: string;
  is_mature: boolean;
  language: string;
  started_at: string;
  tag_ids: string[];
  thumbnail_url: string;
  title: string;
  type: string;
  user_id: string;
  user_login: string;
  user_name: string;
  viewer_count: number;
};

export type fullChannelData = {
  data: individualChannelData[];
  pagination: { cursor: string };
};

export type uptimeChannelData = {
  game_id: string;
  game_name: string;
  id: string;
  is_mature: boolean;
  language: string;
  started_at: string;
  tag_ids: string[];
  thumbnail_url: string;
  title: string;
  type: string;
  user_id: string;
  user_login: string;
  user_name: string;
  viewer_count: number;
  uptime: string;
};
