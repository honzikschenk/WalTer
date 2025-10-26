import { NextResponse } from "next/server";
import vision from "@google-cloud/vision";
import { supabase } from "../components/supabase";

export const runtime = "nodejs";

// Keep the latest uploaded image in memory
let latest: { data: Uint8Array; contentType: string } | null = null;

// Initialize Google Vision client
const client = new vision.ImageAnnotatorClient({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || "{}"),
});

// Process image with Google Vision and store in database
async function processImage(buffer: Buffer) {
  try {
    // Run Google Vision label detection
    const [result] = await client.labelDetection({ image: { content: buffer } });
    const labels = result.labelAnnotations?.map((label) => label.description) || [];
    console.log("Detected labels:", labels);

    if (labels.length === 0) {
      console.log("No labels detected");
      return;
    }

    const mainLabel = labels[0]; // Top label

    // Convert image to base64 for storage
    const base64Image = buffer.toString("base64");

    // Check if this component already exists
    const { data: existing, error: selectError } = await supabase
      .from("images")
      .select("*")
      .eq("title", mainLabel)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    // Insert only if not found
    if (!existing) {
      const { error: insertError } = await supabase
        .from("images")
        .insert([{ title: mainLabel, src: base64Image, created_at: new Date().toISOString() }]);
      if (insertError) throw insertError;

      console.log(`New component added to database: ${mainLabel}`);
    } else {
      console.log(`Component already exists: ${mainLabel}`);
    }
  } catch (error) {
    console.error("Error analyzing or updating database:", error);
  }
}

export async function GET() {
  if (!latest) {
    return new Response("No image uploaded yet", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Process the image asynchronously (don't wait for it)
  const buffer = Buffer.from(latest.data);
  processImage(buffer).catch(console.error);

  // Copy into standard ArrayBuffer to satisfy BodyInit typing
  const ab = new ArrayBuffer(latest.data.byteLength);
  new Uint8Array(ab).set(latest.data);
  return new Response(ab, {
    status: 200,
    headers: {
      "Content-Type": latest.contentType || "image/jpeg",
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return new Response(
      JSON.stringify({ error: "Content-Type must be multipart/form-data" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Parse form data
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid multipart body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const image = form.get("image");
  if (!(image instanceof File)) {
    return new Response(JSON.stringify({ error: "Missing file field 'image'" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Convert file to buffer and store in memory
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  latest = {
    data: new Uint8Array(arrayBuffer),
    contentType: image.type || "image/jpeg",
  };

  // Process the image immediately after upload
  await processImage(buffer);

  return NextResponse.json({ success: true, message: "Image uploaded and processed" });
}