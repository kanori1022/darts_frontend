export type UserParams = {
  image: File | null;
  name: string;
  introduction?: string;
  headerGradientFrom?: string;
  headerGradientTo?: string;
};

export type User = {
  id: string;
  image: string;
  name: string;
  introduction?: string;
  description?: string; // 自己紹介用
  headerGradientFrom?: string; // ヘッダーグラデーション開始色
  headerGradientTo?: string; // ヘッダーグラデーション終了色
  created_at?: string;
  updated_at?: string;
  firebase_uid?: string; // Firebase UID
  combinations_count?: number; // 投稿数
  favorites_count?: number; // お気に入り数
  view_count?: number; // 閲覧数
  recent_combinations?: Array<{
    id: string;
    title: string;
    image: string;
    created_at: string;
  }>; // 最近の投稿
};
