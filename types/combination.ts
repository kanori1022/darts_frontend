export type CombinationParams = {
  title: string;
  image: File | null;
  flight: string;
  shaft: string;
  barrel: string;
  tip: string;
  description: string;
  tags?: string[];
  full_setting_length?: string;
  full_setting_weight?: string;
  barrel_weight?: string;
  barrel_max_diameter?: string;
  barrel_min_diameter?: string;
};

export type Combination = {
  user_id: string | number;
  firebase_uid?: string; // 投稿者のFirebase UIDを追加
  id: string;
  title: string;
  image: string;
  flight: string;
  shaft: string;
  barrel: string;
  tip: string;
  description: string;
  tags?: string[];
  user_name?: string; // 投稿者名を追加
  created_at?: string; // 作成日時を追加
  updated_at?: string; // 更新日時を追加
  full_setting_length?: string;
  full_setting_weight?: string;
  barrel_weight?: string;
  barrel_max_diameter?: string;
  barrel_min_diameter?: string;
};
