export type MovieVersions = {
  resolution: string;
  hash: string;
  nzbFile: string;
};

export type Movie = {
  backdrop_path: string;
  imdbID: string;
  tmdbID: string;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  versions: MovieVersions[];
};
