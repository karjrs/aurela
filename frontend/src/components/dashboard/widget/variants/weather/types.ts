export type WeatherCondition = {
  time: string;
  temperature: number;
  weatherCode: number;
};

export type HourlyWeatherCondition = WeatherCondition & {
  precipitationProbability: number;
  precipitation: number;
};

export type WeatherData = {
  current: WeatherCondition;
  hourly: HourlyWeatherCondition[];
};

export type UserLocationState =
  | { status: "loading" }
  | { status: "success"; label: string }
  | { status: "error" };
