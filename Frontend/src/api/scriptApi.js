import axios from "axios";
export const generateScript = async (data) => {
  return await axios.post("/api/lesson/generate", data);
};
