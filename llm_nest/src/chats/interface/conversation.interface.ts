export interface AIResponse {
  answer: string;
  model: string;
  history: History[];
}

export interface History {
  role: string;
  content: string;
}
