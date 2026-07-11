export type SunTimes = {
  sunrise: number;
  sunset: number;
};

// Classic sunrise/sunset approximation (Almanac for Computers, 1990).
// Illustrative precision is enough here — this powers a calm visual, not navigation.
const sunEventUTC = (
  dayOfYear: number,
  lat: number,
  lon: number,
  isRising: boolean,
) => {
  const rad = Math.PI / 180;
  const zenith = 90.833;
  const lngHour = lon / 15;
  const t = isRising
    ? dayOfYear + (6 - lngHour) / 24
    : dayOfYear + (18 - lngHour) / 24;

  const M = 0.9856 * t - 3.289;
  let L =
    M + 1.916 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 282.634;
  L = ((L % 360) + 360) % 360;

  let RA = (1 / rad) * Math.atan(0.91764 * Math.tan(L * rad));
  RA = ((RA % 360) + 360) % 360;
  const Lq = Math.floor(L / 90) * 90;
  const RAq = Math.floor(RA / 90) * 90;
  RA = (RA + (Lq - RAq)) / 15;

  const sinDec = 0.39782 * Math.sin(L * rad);
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH =
    (Math.cos(zenith * rad) - sinDec * Math.sin(lat * rad)) /
    (cosDec * Math.cos(lat * rad));
  const cosHc = Math.max(-1, Math.min(1, cosH));

  let H = isRising
    ? 360 - (1 / rad) * Math.acos(cosHc)
    : (1 / rad) * Math.acos(cosHc);
  H = H / 15;

  const Tt = H + RA - 0.06571 * t - 6.622;
  let UT = ((Tt % 24) + 24) % 24;
  UT = UT - lngHour;
  return ((UT % 24) + 24) % 24;
};

export const computeSunTimes = (
  date: Date,
  lat: number,
  lon: number,
): SunTimes => {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  const riseUT = sunEventUTC(dayOfYear, lat, lon, true);
  const setUT = sunEventUTC(dayOfYear, lat, lon, false);
  const offsetHours = date.getTimezoneOffset() / 60;
  const sunrise = (((riseUT - offsetHours) % 24) + 24) % 24;
  const sunset = (((setUT - offsetHours) % 24) + 24) % 24;
  return { sunrise, sunset };
};
