import "dotenv/config"; // so SERP_API_KEY is loaded
import { getGroundingResearchContext } from "../services/grounding.service.js";

const topic = "How does rain fall?";

console.time("grounding");
const result = await getGroundingResearchContext(topic);
console.timeEnd("grounding");

console.log(result);
