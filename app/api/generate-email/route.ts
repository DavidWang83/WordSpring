// app/api/generate-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPromptLabel } from "../../lib/languages";

const TONE_LEVELS = ["Warm & Courteous", "Neutral & Professional", "Direct & Concise"];

export async function POST(req: NextRequest) {
  try {
    const { content, outLang, sttLang } = await req.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Missing dictated content" }, { status: 400 });
    }
    if (!outLang) {
      return NextResponse.json({ error: "Missing output language" }, { status: 400 });
    }

    const outLangName = getPromptLabel(outLang);
    const spokenLangName = sttLang ? getPromptLabel(sttLang) : null;
    const needsTranslation = spokenLangName && spokenLangName !== outLangName;

    const prompt = `You are a professional business correspondence writing assistant.

The user dictated or wrote the following content (it may be informal, unstructured, or include a past email thread for context):
"""
${content}
"""

Write a formal business email in ${outLangName}, following the formality and etiquette conventions appropriate for professional correspondence in that language. Generate three versions with the following tones:
1. ${TONE_LEVELS[0]}
2. ${TONE_LEVELS[1]}
3. ${TONE_LEVELS[2]}

${
  needsTranslation
    ? `The user dictated this in ${spokenLangName}, which is different from the output language. For each version, also provide a "translation" field: a ${spokenLangName} translation of the email body, so the user can verify the AI understood their intent correctly.`
    : `Do not include a "translation" field, since the output language matches the language the user dictated in.`
}

Return ONLY valid JSON, no preamble, no markdown code fences, in this exact shape:
{
  "versions": [
    {"tone": "${TONE_LEVELS[0]}", "subject": "email subject line", "body": "full email body"${needsTranslation ? `, "translation": "translation of the body"` : ""}},
    {"tone": "${TONE_LEVELS[1]}", "subject": "email subject line", "body": "full email body"${needsTranslation ? `, "translation": "translation of the body"` : ""}},
    {"tone": "${TONE_LEVELS[2]}", "subject": "email subject line", "body": "full email body"${needsTranslation ? `, "translation": "translation of the body"` : ""}}
  ]
}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna", // 結構化文字生成任務，選最低成本等級即可
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return NextResponse.json({ error: "AI service is temporarily unavailable, please try again" }, { status: 502 });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: "No content returned from AI" }, { status: 502 });
    }

    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("generate-email error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
