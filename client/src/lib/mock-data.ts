export interface Stock {
  id: string;
  rank: number;
  ticker: string;
  name: string;
  price: number;
  change: number; // Percentage
  changeAmount: number;
  marketCap: string;
  volume: string;
  sector: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  score: number; // algorithmic Score 0-100
  history: { value: number }[]; // For sparkline
  // Strength Factors
  candleStrength: number; // 0-100
  volumeStrength: number; // 0-100
  futuresStrength: number; // 0-100
  
  // Avg Expansion Metrics
  avgCandleExp: number;
  avgVolumeExp: number;
  avgFuturesExp: number; // Added this field
  avgBullStrength: number;
  avgBearStrength: number;
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
  volumeExpansionValue: number;
  avgLookbackCandlesVolumeExp: number;
  previousClose: number;
  timestamp: string | null;
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

  // Normalize strength values to 0-100 for UI bars if they aren't already
  // Assuming volumeExpansionValue might be raw, so we might need logic to scale it.
  // For now, let's use the provided strength values directly if they seem like 0-100, or mock if 0.
  // Based on "intradayBullStrength": 69.8, it seems 0-100 is used for strength.

  // Use pValue as the main Score if available, otherwise fallback logic
  const score = apiData.pValue > 0 ? Math.min(100, Math.max(0, apiData.pValue)) : Math.round(Math.random() * 40 + 60); // Mock fallback if 0

  return {
    id: apiData.instrumentSymbol,
    rank: index + 1,
    ticker: apiData.instrumentSymbol,
    name: apiData.instrumentSymbol, // Using symbol as name since name isn't in API
    price: currentPrice,
    change: apiData.currentPercentage,
    changeAmount: changeAmt,
    marketCap: "₹--", // Not in API
    volume: (apiData.volumeExpansionValue / 1000).toFixed(1) + "K", // Mock formatting
    sector: "Unknown", // Not in API
    sentiment: sentiment,
    score: score,
    history: generateHistory(currentPrice, 0.02), // Mock history for sparkline
    candleStrength: apiData.candleExpansionValue > 0 ? apiData.candleExpansionValue : apiData.intradayBullStrength, // Fallback to bull strength if candle exp is 0
    volumeStrength: Math.min(100, (apiData.volumeExpansionValue / apiData.avgLookbackCandlesVolumeExp) * 50), // Rough relative strength
    futuresStrength: Math.round(Math.random() * 100), // Not in API, keeping mock
    
    // Map avg values directly
    avgCandleExp: apiData.avgLookbackCandlesCandleExp,
    avgVolumeExp: apiData.avgLookbackCandlesVolumeExp,
    avgFuturesExp: Math.round(Math.random() * 80 + 10), // Mocked Avg Futures Exp as requested
    avgBullStrength: apiData.avgLookbackCandlesBullStrength,
    avgBearStrength: apiData.avgLookbackCandlesBearStrength,
  };
};

// Keep MOCK_STOCKS as a fallback or initial state
export const MOCK_STOCKS: Stock[] = [
  {
    id: "1",
    rank: 1,
    ticker: "RELIANCE",
    name: "Reliance Industries Ltd",
    price: 2985.40,
    change: 1.25,
    changeAmount: 36.85,
    marketCap: "₹20.1T",
    volume: "4.5M",
    sector: "Energy",
    sentiment: "Bullish",
    score: 96,
    history: generateHistory(2900, 0.03),
    candleStrength: 92,
    volumeStrength: 88,
    futuresStrength: 95,
    avgCandleExp: 1.5,
    avgVolumeExp: 15000,
    avgFuturesExp: 85,
    avgBullStrength: 0.7,
    avgBearStrength: 0.3
  },
  // ... (rest of the mock data can stay or be removed if strictly using API)
];
