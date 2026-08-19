"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
    date: {
      type: "string",
      description:
        "The parsed transaction date formatted strictly as DD/MM/YYYY. If no year is provided, assume the current year (2026). If the input is '100 chai', provide today's date. If '100 chai yesterday', provide yesterday's date. If 'dinner three days ago', calculate the date exactly three days ago from today. If 'lunch on 18', provide the 18th of this current month. If the calculated date is in the future, or if the text is completely ambiguous or gibberish (like 'akdbwcjw'), set this field to 'ERROR'.",
    },
  },
  required: ["amount", "category", "description", "date"],
};
export async function getStructuredData(input: string) {
  const date = new Date();
  const todayStr = `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getFullYear())}`;

  const res = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: input,
    config: {
      systemInstruction: `You are an expense tracking assistant. Today's current date is strictly ${todayStr}. Use this to calculate all relative dates like yesterday, days ago, or specific day numbers.`,
      temperature: 0,
      responseMimeType: "application/json",
      responseSchema: outputSchema,
    },
  });
  console.log("====================================");
  console.log(res?.text);
  console.log("====================================");
  if (!res.text) throw new Error("Empty response from model");

  return JSON.parse(res.text);
}

const exampleOP = "Dosa two hundred yesterday";

const r = await getStructuredData(exampleOP);
if (r.amount === 0) throw new Error("Invalid amount");
if (r.description === "") throw new Error("Invalid description");
if (r.date === "ERROR") throw new Error("Invalid Date");
console.log(r);
