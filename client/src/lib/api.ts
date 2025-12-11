import { useQuery } from "@tanstack/react-query";
import { MOCK_STOCKS, type Stock, type ApiStockData, mapApiDataToStock } from "./mock-data";

// This function simulates an API call with the structure you provided
export const fetchStocks = async (): Promise<Stock[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simulating the API response with the data you provided + adding a few more for demo
  const mockApiResponse: ApiStockData[] = [
    {
      instrumentSymbol: "ICICIPRULI",
      pValue: 92.5, // Mocked PValue > 0 to show ranking
      currentPercentage: 1.2,
      tradeType: "LONG",
      tradeTypeLongCount: 5,
      tradeTypeShortCount: 0,
      candleExpansionValue: 45.2,
      avgLookbackCandlesCandleExp: 1.28,
      avgLookbackCandlesBullStrength: 0.63,
      avgLookbackCandlesBearStrength: 0.64,
      intradayBullStrength: 69.8,
      intradayBearStrength: 34.5,
      volumeExpansionValue: 213.0,
      avgLookbackCandlesVolumeExp: 15509.0,
      previousClose: 643.45,
      timestamp: null
    },
     {
      instrumentSymbol: "SBIN",
      pValue: 88.0,
      currentPercentage: 0.8,
      tradeType: "LONG",
      tradeTypeLongCount: 3,
      tradeTypeShortCount: 1,
      candleExpansionValue: 32.1,
      avgLookbackCandlesCandleExp: 1.1,
      avgLookbackCandlesBullStrength: 0.5,
      avgLookbackCandlesBearStrength: 0.4,
      intradayBullStrength: 75.2,
      intradayBearStrength: 20.1,
      volumeExpansionValue: 180.0,
      avgLookbackCandlesVolumeExp: 12000.0,
      previousClose: 820.00,
      timestamp: null
    },
    {
      instrumentSymbol: "INFY",
      pValue: 45.0,
      currentPercentage: -0.5,
      tradeType: "SHORT",
      tradeTypeLongCount: 1,
      tradeTypeShortCount: 4,
      candleExpansionValue: 10.5,
      avgLookbackCandlesCandleExp: 0.9,
      avgLookbackCandlesBullStrength: 0.3,
      avgLookbackCandlesBearStrength: 0.7,
      intradayBullStrength: 30.5,
      intradayBearStrength: 65.2,
      volumeExpansionValue: 90.0,
      avgLookbackCandlesVolumeExp: 8000.0,
      previousClose: 1850.00,
      timestamp: null
    }
  ];

  // Logic to sort by PFactor score (pValue)
  const sortedData = mockApiResponse.sort((a, b) => b.pValue - a.pValue);

  // Map to UI model
  return sortedData.map((item, index) => mapApiDataToStock(item, index));
};

export function useStocks() {
  return useQuery({
    queryKey: ["stocks"],
    queryFn: fetchStocks,
  });
}
