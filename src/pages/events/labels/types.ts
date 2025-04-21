export interface Label {
  name: string;
  color: string;
  description: string;
  count: number;
}

export interface Issue {
  id: string;
  title: string;
  author: string;
  time: string;
  comments: number;
  labels: string[];
}
