import { useQuery } from "@tanstack/react-query";
import { Stock, ApiStockData, mapApiDataToStock, MOCK_STOCKS } from "./mock-data";

export const fetchStocks = async (): Promise<Stock[]> => {
  try {
    const res = await fetch("http://localhost:8181/filterStocks/getLiveData");
    if (!res.ok) throw new Error("Failed to fetch");
    const apiData: ApiStockData[] = await res.json();
    return apiData.sort((a, b) => b.intradayBullStrength - a.intradayBullStrength).map((s, i) => mapApiDataToStock(s, i));
  } catch {
    return MOCK_STOCKS; // fallback if API fails
  }
};

export const useStocks = () => {
  return useQuery({
    queryKey: ["stocks"],
    queryFn: fetchStocks,
    refetchInterval: 1000*60*3.5,
  });
};
