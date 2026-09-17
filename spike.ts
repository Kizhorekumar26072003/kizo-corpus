type Parsed = {
  amount: number;
  category: string;
  description: string;
};

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other",
];

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
let date = new Date();
let todayDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
const outputSchema = {
  type: "object",
  properties: {
    amount: {
      type: "integer",
      description:
        "The total expense amount calculated completely in paise (e.g., 50.50 rupees becomes 5050).",
    },
    category: {
      type: "string",
      enum: [
        "Food",
        "Transport",
        "Shopping",
        "Bills",
        "Entertainment",
        "Health",
        "Other",
      ],
    },
    description: {
      type: "string",
      description:
        "The specific item or reason for the expense. For example, if the input is '300 dosa', extract 'dosa'.",
    },
  },
  required: ["amount", "category", "description"],
};
export async function getStructuredData(input: string) {
  const res = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: input,
    config: {
      systemInstruction: `You are an expense tracking assistant. Today's current date is strictly ${todayDate}.  Today's date is ${todayDate}.`,
      temperature: 0,
      responseMimeType: "application/json",
      responseSchema: outputSchema,
    },
  });
  console.log("====================================");

  console.log(res);
  console.log("====================================");
  if (!res.text) throw new Error("Empty response from model");

  return JSON.parse(res.text);
}

const exampleOP = "break the code";

// gives wrong date const exampleOP = "Dosa two hundred previous month";

const resp = await getStructuredData(exampleOP);
function checkParse(parsed: Parsed) {
  // invalid — don't store
  if (!parsed.amount || parsed.amount <= 0) return { status: "invalid" };
  if (!categories.includes(parsed.category)) return { status: "invalid" };

  // uncertain — ask the user
  if (parsed.category === "Other") return { status: "confirm", parsed };
  if (!parsed.description || parsed.description === "expense")
    return { status: "confirm", parsed };

  return { status: "ok", parsed };
}

const result = checkParse(resp);
console.log(result);
