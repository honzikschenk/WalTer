"use server";
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert uploaded file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Convert ArrayBuffer to base64 string
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // Send request with image + instruction text
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          text: "Identify the specific component in this image and provide a brief description.",
        },
        {
          inlineData: {
            data: base64Data,          // base64 string
            mimeType: file.type || "image/jpeg", // detect MIME type from file or default
          },
        },
      ],
    });

    return NextResponse.json({ success: true, result: response.text });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}