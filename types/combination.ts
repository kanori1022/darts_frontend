export type CombinationParams = {
  title: string;
  image: File | null;
  flight: string;
  shaft: string;
  barrel: string;
  tip: string;
  description: string;
};

export type Combination = {
  user_id: string | number;
  id: string;
  title: string;
  image: string;
  flight: string;
  shaft: string;
  barrel: string;
  tip: string;
  description: string;
};
