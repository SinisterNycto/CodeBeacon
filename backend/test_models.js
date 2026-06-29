const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  try {
    await model.generateContent("hello");
    console.log("gemini-1.5-flash-latest works!");
  } catch (e) {
    console.error(e.message);
  }
}
run();
