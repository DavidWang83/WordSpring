// app/lib/languages.ts
// 共用的語言清單，前端下拉選單跟後端 API 都從這裡讀取。
// label 使用該語言自己的母語名稱顯示，方便使用者直接認出自己的語言，
// promptLabel 是給後端提示詞用的英文語言名稱（AI 模型用英文名稱理解語言時最穩定）。

export type LanguageOption = {
  code: string;
  label: string; // 顯示給使用者看的名稱（母語顯示）
  promptLabel: string; // 給 AI 提示詞使用的英文名稱
  whisperCode: string; // Whisper 語音辨識用的語言代碼（ISO-639-1）
};

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", promptLabel: "English", whisperCode: "en" },
  { code: "zh-TW", label: "繁體中文", promptLabel: "Traditional Chinese", whisperCode: "zh" },
  { code: "zh-CN", label: "简体中文", promptLabel: "Simplified Chinese", whisperCode: "zh" },
  { code: "ja", label: "日本語", promptLabel: "Japanese", whisperCode: "ja" },
  { code: "ko", label: "한국어", promptLabel: "Korean", whisperCode: "ko" },
  { code: "es", label: "Español", promptLabel: "Spanish", whisperCode: "es" },
  { code: "fr", label: "Français", promptLabel: "French", whisperCode: "fr" },
  { code: "de", label: "Deutsch", promptLabel: "German", whisperCode: "de" },
  { code: "pt", label: "Português", promptLabel: "Portuguese", whisperCode: "pt" },
  { code: "it", label: "Italiano", promptLabel: "Italian", whisperCode: "it" },
  { code: "nl", label: "Nederlands", promptLabel: "Dutch", whisperCode: "nl" },
  { code: "ru", label: "Русский", promptLabel: "Russian", whisperCode: "ru" },
  { code: "ar", label: "العربية", promptLabel: "Arabic", whisperCode: "ar" },
  { code: "hi", label: "हिन्दी", promptLabel: "Hindi", whisperCode: "hi" },
  { code: "vi", label: "Tiếng Việt", promptLabel: "Vietnamese", whisperCode: "vi" },
  { code: "th", label: "ภาษาไทย", promptLabel: "Thai", whisperCode: "th" },
  { code: "id", label: "Bahasa Indonesia", promptLabel: "Indonesian", whisperCode: "id" },
  { code: "tr", label: "Türkçe", promptLabel: "Turkish", whisperCode: "tr" },
  { code: "pl", label: "Polski", promptLabel: "Polish", whisperCode: "pl" },
  { code: "sv", label: "Svenska", promptLabel: "Swedish", whisperCode: "sv" },
];

export function getLanguageLabel(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.label || code;
}

export function getPromptLabel(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.promptLabel || code;
}

export function getWhisperCode(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.whisperCode || "en";
}
