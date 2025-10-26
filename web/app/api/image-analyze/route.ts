"use server";
import { NextResponse } from "next/server";
import vision from "@google-cloud/vision";

// Initialize the client
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// This handles POST requests sent to /image-analyze
export async function POST(req: Request) {
  try {
    // Get form data from the request
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert the uploaded image to a buffer for Vision API
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Analyze the image using Google Cloud Vision
    const [result] = await client.labelDetection({ image: { content: buffer } });

    // Extract labels and confidence scores
    const labels = result.labelAnnotations?.map(label => ({
      description: label.description,
      score: label.score,
    }));

    // Return the labels as a JSON response
    return NextResponse.json({ success: true, labels });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}