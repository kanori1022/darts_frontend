export type CombinationParams = {
  title: string;
  image: File | null;
  flight: string;
  shaft: string;
  barrel: string;
  tip: string;
  description: string;
  tags?: string[];
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
};
