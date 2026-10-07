// serp ai calling
//return raw json
// ai_overview.text_blocks
// organic_results[].snippet
import { getJson } from "serpapi";

export const serpApiSearch = async (query) => {
  const searchParams = {
    engine: "google",
    q: query,
    api_key: process.env.SERP_API_KEY,
    timeout: 8000,
    // no_cache: true,
  };

  const response = await getJson(searchParams);

  if (response?.error) {
    throw new Error(`SerpAPI error: ${response.error}`);
  }
  return response;
};
