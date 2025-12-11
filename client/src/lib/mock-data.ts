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
    futuresStrength: 95
  },
  {
    id: "2",
    rank: 2,
    ticker: "TCS",
    name: "Tata Consultancy Services",
    price: 4120.50,
    change: 0.85,
    changeAmount: 34.70,
    marketCap: "₹15.2T",
    volume: "1.2M",
    sector: "Technology",
    sentiment: "Bullish",
    score: 92,
    history: generateHistory(4050, 0.02),
    candleStrength: 85,
    volumeStrength: 78,
    futuresStrength: 88
  },
  {
    id: "3",
    rank: 3,
    ticker: "HDFCBANK",
    name: "HDFC Bank Ltd",
    price: 1645.20,
    change: -0.45,
    changeAmount: -7.40,
    marketCap: "₹12.5T",
    volume: "12.5M",
    sector: "Financial Services",
    sentiment: "Neutral",
    score: 78,
    history: generateHistory(1650, 0.04),
    candleStrength: 65,
    volumeStrength: 72,
    futuresStrength: 60
  },
  {
    id: "4",
    rank: 4,
    ticker: "INFY",
    name: "Infosys Limited",
    price: 1850.75,
    change: 2.10,
    changeAmount: 38.05,
    marketCap: "₹7.8T",
    volume: "3.8M",
    sector: "Technology",
    sentiment: "Bullish",
    score: 89,
    history: generateHistory(1800, 0.05),
    candleStrength: 90,
    volumeStrength: 85,
    futuresStrength: 82
  },
  {
    id: "5",
    rank: 5,
    ticker: "ICICIBANK",
    name: "ICICI Bank Ltd",
    price: 1240.30,
    change: 1.50,
    changeAmount: 18.30,
    marketCap: "₹8.7T",
    volume: "8.1M",
    sector: "Financial Services",
    sentiment: "Bullish",
    score: 91,
    history: generateHistory(1210, 0.03),
    candleStrength: 88,
    volumeStrength: 92,
    futuresStrength: 85
  },
  {
    id: "6",
    rank: 6,
    ticker: "TATAMOTORS",
    name: "Tata Motors Ltd",
    price: 980.15,
    change: 3.20,
    changeAmount: 30.40,
    marketCap: "₹3.2T",
    volume: "15.4M",
    sector: "Consumer Cyclical",
    sentiment: "Bullish",
    score: 94,
    history: generateHistory(940, 0.06),
    candleStrength: 95,
    volumeStrength: 96,
    futuresStrength: 90
  },
  {
    id: "7",
    rank: 7,
    ticker: "ADANIENT",
    name: "Adani Enterprises Ltd",
    price: 3150.60,
    change: -1.80,
    changeAmount: -57.70,
    marketCap: "₹3.6T",
    volume: "2.1M",
    sector: "Conglomerate",
    sentiment: "Bearish",
    score: 45,
    history: generateHistory(3250, 0.08),
    candleStrength: 40,
    volumeStrength: 55,
    futuresStrength: 35
  },
  {
    id: "8",
    rank: 8,
    ticker: "SBIN",
    name: "State Bank of India",
    price: 825.40,
    change: 0.60,
    changeAmount: 4.90,
    marketCap: "₹7.4T",
    volume: "10.2M",
    sector: "Financial Services",
    sentiment: "Neutral",
    score: 72,
    history: generateHistory(815, 0.04),
    candleStrength: 68,
    volumeStrength: 75,
    futuresStrength: 70
  },
  {
    id: "9",
    rank: 9,
    ticker: "BAJFINANCE",
    name: "Bajaj Finance Ltd",
    price: 6850.90,
    change: 1.10,
    changeAmount: 74.50,
    marketCap: "₹4.2T",
    volume: "850K",
    sector: "Financial Services",
    sentiment: "Bullish",
    score: 85,
    history: generateHistory(6750, 0.03),
    candleStrength: 82,
    volumeStrength: 80,
    futuresStrength: 85
  },
  {
    id: "10",
    rank: 10,
    ticker: "ITC",
    name: "ITC Limited",
    price: 435.20,
    change: -0.20,
    changeAmount: -0.85,
    marketCap: "₹5.4T",
    volume: "9.5M",
    sector: "Consumer Defensive",
    sentiment: "Neutral",
    score: 60,
    history: generateHistory(436, 0.01),
    candleStrength: 55,
    volumeStrength: 45,
    futuresStrength: 62
  }
];
