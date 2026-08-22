// app/api/generate-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPromptLabel } from "../../lib/languages";
import { getAuthedUser } from "../../lib/verifyAuth";

const TONE_LEVELS = ["Warm & Courteous", "Neutral & Professional", "Direct & Concise"];

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const { content, outLang, sttLang, recipientNames, signatureText } = await req.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Missing dictated content" }, { status: 400 });
    }
    if (!outLang) {
      return NextResponse.json({ error: "Missing output language" }, { status: 400 });
    }

    const outLangName = getPromptLabel(outLang);
    const spokenLangName = sttLang ? getPromptLabel(sttLang) : null;
    const needsTranslation = spokenLangName && spokenLangName !== outLangName;

    const hasRecipients = Array.isArray(recipientNames) && recipientNames.length > 0;
    const hasSignature = typeof signatureText === "string" && signatureText.trim().length > 0;

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

IMPORTANT: Both the "subject" and "body" fields must be written ENTIRELY in ${outLangName} — do not leave any word, phrase, or the whole subject line in ${spokenLangName || "the original dictated language"}.${
  needsTranslation ? ` The ONLY field that should be in ${spokenLangName} is "translation".` : ""
}

${
  hasRecipients
    ? `Address the email to the following recipient(s), in this exact order: ${recipientNames.join(", ")}. Use these name(s) exactly as given in the greeting (e.g. "Hi ${recipientNames[0]}," or, for multiple recipients, list them naturally, e.g. "Hi ${recipientNames.join(" and ")},"). Do NOT translate, transliterate, or alter these names, even though the rest of the email is in ${outLangName} — keep them exactly as provided, in their original script/language.`
    : `The user did not specify a recipient name. Use a natural, generic placeholder appropriate for ${outLangName} business correspondence (e.g. something like "[Recipient Name]"), unless a real recipient name is already evident from the dictated content itself.`
}

${
  hasSignature
    ? `End the email with EXACTLY this sign-off, used as-is for the closing/signature block of every version (do not translate it, do not alter its wording, even though the rest of the email is in ${outLangName} — keep it verbatim, in its original language):
"""
${signatureText}
"""`
    : `The user did not provide a saved signature. End the email with a natural, generic closing appropriate for ${outLangName} business correspondence (e.g. something like "Best regards, [Your Name]").`
}

Return ONLY valid JSON, no preamble, no markdown code fences, in this exact shape:
{
  "versions": [
    {"tone": "${TONE_LEVELS[0]}", "subject": "email subject line, in ${outLangName}", "body": "full email body, in ${outLangName}"${needsTranslation ? `, "translation": "${spokenLangName} translation of the body"` : ""}},
    {"tone": "${TONE_LEVELS[1]}", "subject": "email subject line, in ${outLangName}", "body": "full email body, in ${outLangName}"${needsTranslation ? `, "translation": "${spokenLangName} translation of the body"` : ""}},
    {"tone": "${TONE_LEVELS[2]}", "subject": "email subject line, in ${outLangName}", "body": "full email body, in ${outLangName}"${needsTranslation ? `, "translation": "${spokenLangName} translation of the body"` : ""}}
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
