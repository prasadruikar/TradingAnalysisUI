export interface Stock {
  id: string;

  ticker: string;
  name: string;
  price: number;
  change: number;
  changeAmount: number;
  marketCap: string;
  volume: string;
  sector: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  score: number;
  history: { value: number }[];
  candleStrength: number;
  volumeStrength: number;
  intradayFutureOIStrength: number;
  avgCandleExp: number;
  avgVolumeExp: number;
  avgFuturesOpenInterest: number;
  avgBullStrength: number;
  avgBearStrength: number;
  timestamp: string ;
}

export interface ApiStockData {
  instrumentSymbol: string;
  pValue: number;
  currentPercentage: number;
  tradeType: "LONG" | "SHORT" | string;
  tradeTypeLongCount: number;
  tradeTypeShortCount: number;
  candleExpansionValue: number;
  avgLookbackCandlesCandleExp: number;
  avgLookbackCandlesBullStrength: number;
  avgLookbackCandlesBearStrength: number;
  intradayBullStrength: number;
  intradayBearStrength: number;
  intradayVolumeExpansion: number;
  avgLookbackCandlesVolumeExp: number;
  previousClose: number;
  timestamp: string;
  intradayFutureOIStrength:number;
  avgFuturesOpenInterest:number;
}

const generateHistory = (basePrice: number, volatility: number) => {
  let current = basePrice;
  return Array.from({ length: 20 }, () => {
    current = current * (1 + (Math.random() * volatility - volatility / 2));
    return { value: current };
  });
};

// Map API data to our UI Stock interface
// Note: Some fields like 'sector', 'name', 'marketCap' are missing from API, so we mock them or derive them
export const mapApiDataToStock = (apiData: ApiStockData, index: number): Stock => {
  // Calculate price from previousClose + percentage change
  // If currentPercentage is 0, we assume it's just the previous close for now or handle appropriately
  const currentPrice = apiData.previousClose * (1 + apiData.currentPercentage / 100);
  const changeAmt = currentPrice - apiData.previousClose;

  // Determine sentiment based on tradeType
  let sentiment: "Bullish" | "Bearish" | "Neutral" = "Neutral";
  if (apiData.tradeType === "LONG") sentiment = "Bullish";
  if (apiData.tradeType === "SHORT") sentiment = "Bearish";

  // const score = apiData.pValue > 0 ? Math.min(100, Math.max(0, apiData.pValue)) : Math.round(Math.random() * 40 + 60);
const score = apiData.pValue ;
  return {
    id: apiData.instrumentSymbol,
    ticker: apiData.instrumentSymbol,
    name: apiData.instrumentSymbol,
    price: apiData.previousClose,
    change: apiData.currentPercentage,
    changeAmount: changeAmt,
    marketCap: "₹--",
    volume: (apiData.intradayVolumeExpansion / 1000).toFixed(1) + "K",
    sector: "Unknown",
    sentiment,
    score,
    history: generateHistory(currentPrice, 0.02),
    candleStrength: apiData.intradayBullStrength,
    volumeStrength: apiData.intradayVolumeExpansion,
    intradayFutureOIStrength: apiData.intradayFutureOIStrength,
    avgCandleExp: apiData.intradayBearStrength,
    avgVolumeExp: Math.min(100, apiData.avgLookbackCandlesVolumeExp / 1000),
    avgFuturesOpenInterest: apiData.avgFuturesOpenInterest,
    avgBullStrength: apiData.avgLookbackCandlesBullStrength,
    avgBearStrength: apiData.avgLookbackCandlesBearStrength,
    timestamp: apiData.timestamp
  };
};

// Keep MOCK_STOCKS as a fallback or initial state
export const MOCK_STOCKS: Stock[] = [
  {
    id: "1",
    ticker: "SAMPLE",
    name: "Reliance Industries Ltd",
    price: 2985.4,
    change: -1.25,
    changeAmount: 36.85,
    marketCap: "₹20.1T",
    volume: "4.5M",
    sector: "Energy",
    sentiment: "Bullish",
    score: 96,
    history: generateHistory(2900, 0.03),
    candleStrength: 92,
    volumeStrength: 88,
    intradayFutureOIStrength: 95,
    avgCandleExp: 1.5,
    avgVolumeExp: 15,
    avgFuturesOpenInterest: 85,
    avgBullStrength: 0.7,
    avgBearStrength: 0.3,
    timestamp:"2:13"
  },
  // ... (rest of the mock data can stay or be removed if strictly using API)
];
