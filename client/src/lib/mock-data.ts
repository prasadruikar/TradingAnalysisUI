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
  score: number; // AI Score 0-100
  analysis: string;
  history: { value: number }[]; // For sparkline
  // New Strength Factors
  candleStrength: number; // 0-100
  volumeStrength: number; // 0-100
  futuresStrength: number; // 0-100
}

const generateHistory = (basePrice: number, volatility: number) => {
  let current = basePrice;
  return Array.from({ length: 20 }, () => {
    current = current * (1 + (Math.random() * volatility - volatility / 2));
    return { value: current };
  });
};

export const MOCK_STOCKS: Stock[] = [
  {
    id: "1",
    rank: 1,
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    price: 148.50,
    change: 4.25,
    changeAmount: 6.05,
    marketCap: "3.6T",
    volume: "45.2M",
    sector: "Technology",
    sentiment: "Bullish",
    score: 98,
    analysis: "Dominating AI infrastructure spend. Data center revenue projected to grow 15% QoQ. Technical breakout above $145 confirmed with high volume. Strong accumulation detected.",
    history: generateHistory(140, 0.05),
    candleStrength: 95,
    volumeStrength: 92,
    futuresStrength: 88
  },
  {
    id: "2",
    rank: 2,
    ticker: "TSLA",
    name: "Tesla, Inc.",
    price: 345.12,
    change: 2.10,
    changeAmount: 7.15,
    marketCap: "1.1T",
    volume: "32.1M",
    sector: "Consumer Cyclical",
    sentiment: "Bullish",
    score: 94,
    analysis: "Robotaxi optimism fueling momentum. Key resistance at $350 is being tested. RSI indicates overbought conditions but momentum remains strong. Watch for pullback to $330 support.",
    history: generateHistory(330, 0.08),
    candleStrength: 85,
    volumeStrength: 90,
    futuresStrength: 82
  },
  {
    id: "3",
    rank: 3,
    ticker: "PLTR",
    name: "Palantir Technologies",
    price: 62.40,
    change: 8.50,
    changeAmount: 4.88,
    marketCap: "140B",
    volume: "88.5M",
    sector: "Technology",
    sentiment: "Bullish",
    score: 92,
    analysis: "Commercial revenue acceleration is outpacing estimates. AIP bootcamp conversion rates are at all-time highs. Stock is in parabolic discovery mode.",
    history: generateHistory(55, 0.1),
    candleStrength: 98,
    volumeStrength: 95,
    futuresStrength: 91
  },
  {
    id: "4",
    rank: 4,
    ticker: "AMD",
    name: "Advanced Micro Devices",
    price: 178.20,
    change: -1.20,
    changeAmount: -2.15,
    marketCap: "288B",
    volume: "12.4M",
    sector: "Technology",
    sentiment: "Neutral",
    score: 75,
    analysis: "Consolidating recent gains. MI300 sales tracking well but concerns over margin pressure persist. Support at $170 must hold for bullish thesis to remain valid.",
    history: generateHistory(180, 0.04),
    candleStrength: 45,
    volumeStrength: 60,
    futuresStrength: 55
  },
  {
    id: "5",
    rank: 5,
    ticker: "COIN",
    name: "Coinbase Global",
    price: 295.60,
    change: 5.40,
    changeAmount: 15.20,
    marketCap: "72B",
    volume: "9.1M",
    sector: "Financial Services",
    sentiment: "Bullish",
    score: 89,
    analysis: "Crypto cycle tailwinds are significant. Trading volume spikes correlating with Bitcoin ATH attempts. Regulatory clarity improving post-election.",
    history: generateHistory(270, 0.12),
    candleStrength: 88,
    volumeStrength: 85,
    futuresStrength: 92
  },
  {
    id: "6",
    rank: 6,
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 235.00,
    change: 0.50,
    changeAmount: 1.15,
    marketCap: "3.6T",
    volume: "22.5M",
    sector: "Technology",
    sentiment: "Neutral",
    score: 68,
    analysis: "iPhone 16 cycle showing mixed early signals. Services revenue remains the growth engine. Stock is range-bound between $225 and $240.",
    history: generateHistory(234, 0.01),
    candleStrength: 55,
    volumeStrength: 48,
    futuresStrength: 60
  },
  {
    id: "7",
    rank: 7,
    ticker: "MSFT",
    name: "Microsoft Corp",
    price: 430.15,
    change: -0.45,
    changeAmount: -1.90,
    marketCap: "3.2T",
    volume: "18.2M",
    sector: "Technology",
    sentiment: "Bearish",
    score: 45,
    analysis: "AI monetization concerns weighing on valuation. Azure growth decelerating slightly. Technical breakdown below 50-day moving average.",
    history: generateHistory(435, 0.02),
    candleStrength: 30,
    volumeStrength: 42,
    futuresStrength: 40
  },
  {
    id: "8",
    rank: 8,
    ticker: "MSTR",
    name: "MicroStrategy",
    price: 410.50,
    change: 12.30,
    changeAmount: 45.10,
    marketCap: "85B",
    volume: "15.6M",
    sector: "Technology",
    sentiment: "Bullish",
    score: 96,
    analysis: "Bitcoin proxy play with leverage. Premium to NAV expanding. High volatility expected but trend is strictly upward.",
    history: generateHistory(360, 0.15),
    candleStrength: 97,
    volumeStrength: 94,
    futuresStrength: 96
  },
];
