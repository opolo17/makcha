/** ODsay searchPubTransPathT — trafficType: 1 지하철, 2 버스, 3 도보 */
export type OdsaySubPath = {
  trafficType: number;
  distance?: number;
  sectionTime?: number;
  stationCount?: number;
  startName?: string;
  startID?: number;
  endName?: string;
  endID?: number;
  way?: string;
  wayCode?: number;
  lane?: {
    name?: string;
    busNo?: string;
    busID?: number;
    subwayCode?: number;
    subwayCityCode?: number;
  };
  passStopList?: {
    stations?: Array<{
      stationID?: number;
      stationName?: string;
      x?: number | string;
      y?: number | string;
    }>;
  };
};

export type OdsayPathInfo = {
  totalTime?: number;
  totalWalk?: number;
  payment?: number;
  firstStartStation?: string;
  lastEndStation?: string;
  mapObj?: string;
};

export type OdsayPath = {
  pathType?: number;
  info?: OdsayPathInfo;
  subPath?: OdsaySubPath[];
};

export type OdsayPathSearchResult = {
  result?: {
    path?: OdsayPath[];
    searchType?: number;
    error?: { code?: number | string; message?: string };
  };
  error?: Array<{ code?: number | string; message?: string }>;
};

export type OdsayRealtimeBusResult = {
  result?: {
    real?: Array<Record<string, unknown>>;
    base?: {
      stationName?: string;
      arsID?: string;
    };
  };
  error?: Array<{ code?: number | string; message?: string }>;
};

export type OdsayRealtimeSubwayResult = {
  result?: {
    real?: Array<Record<string, unknown>>;
    base?: {
      stationName?: string;
    };
  };
  error?: Array<{ code?: number | string; message?: string }>;
};

export type OdsayBusStationInfoResult = {
  result?: {
    stationName?: string;
    stationID?: number;
    arsID?: string;
    localStationID?: string;
  };
  error?: Array<{ code?: number | string; message?: string }>;
};
