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
