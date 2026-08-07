// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const language = (formData.get("language") as string) || undefined; // Whisper ISO-639-1 code, e.g. "en", "ja"

    if (!audioFile) {
      return NextResponse.json({ error: "No audio received" }, { status: 400 });
    }

    const whisperForm = new FormData();
    whisperForm.append("file", audioFile);
    whisperForm.append("model", "whisper-1");
    if (language) whisperForm.append("language", language);

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: whisperForm,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Whisper API error:", errText);
      return NextResponse.json({ error: "Speech recognition is temporarily unavailable, please try again" }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json({ text: data.text });
  } catch (err) {
    console.error("transcribe error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
