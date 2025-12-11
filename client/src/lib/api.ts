import { useQuery } from "@tanstack/react-query";
import { MOCK_STOCKS, type Stock } from "./mock-data";

// This function simulates an API call
// Once you provide the real endpoint, we will replace this with a real fetch()
export const fetchStocks = async (): Promise<Stock[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // In the future, this will be:
  // const res = await fetch('YOUR_API_ENDPOINT');
  // return res.json();
  
  return MOCK_STOCKS;
};

export function useStocks() {
  return useQuery({
    queryKey: ["stocks"],
    queryFn: fetchStocks,
  });
}
