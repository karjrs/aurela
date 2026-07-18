import type { UserLocationState } from "../types";

export type WeatherHeaderProps = {
  location: UserLocationState;
  isFetching: boolean;
  onRefresh: () => void;
};
