import { Character } from "./character";

export interface ApiResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

export const EMPTY_API_RESPONSE: ApiResponse = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: []
};
