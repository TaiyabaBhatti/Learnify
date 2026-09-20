import axios from "axios";
export const generateScript = async (data) => {
  return await axios.post("/api/generate-script", data);
};
