export type UserParams = {
  image: File | null;
  name: string;
  introduction?: string;
};

export type User = {
  id: string;
  image: string;
  name: string;
  introduction?: string;
  created_at?: string;
  updated_at?: string;
};
