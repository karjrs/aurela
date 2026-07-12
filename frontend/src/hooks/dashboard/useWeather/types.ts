export type WeatherCondition = {
  time: string;
  temperature: number;
  weatherCode: number;
};

export type WeatherData = {
  current: WeatherCondition;
  hourly: WeatherCondition[];
};
