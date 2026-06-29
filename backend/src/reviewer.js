const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ensure API key is present
if (!process.env.GEMINI_API_KEY) {
  console.warn("WARNING: GEMINI_API_KEY is missing.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a senior software engineer doing a code review. 
Analyze the provided git diff and return your response EXCLUSIVELY as a JSON object matching the schema below. Do not include any markdown formatting like \`\`\`json.

{
  "summary": "A one-paragraph overall summary of what this PR does",
  "verdict": "APPROVE" | "REQUEST_CHANGES" | "COMMENT",
  "issues": [
    {
      "file": "path/to/file.js",
      "line": 12,
      "severity": "critical" | "warning" | "suggestion",
      "message": "A clear explanation of the issue (bug, security risk, bad practice, performance problem)"
    }
  ]
}

Be constructive, specific, and concise. Do not praise trivially. Only report actual line numbers that are modified or added in the diff.`;

async function reviewPRDiff(diffText) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    const result = await model.generateContent(diffText);
    const responseText = result.response.text();
    
    // Attempt to parse JSON. Handle possible markdown fences if the model disobeys
    const cleanText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating or parsing Gemini review:", error);
    return {
      summary: "AI Review failed due to an internal error or parsing issue.",
      verdict: "COMMENT",
      issues: []
    };
  }
}

module.exports = { reviewPRDiff };
