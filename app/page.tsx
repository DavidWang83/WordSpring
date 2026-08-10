// app/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES, getWhisperCode } from "./lib/languages";
import { supabase } from "./lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

type LetterVersion = { tone: string; subject: string; body: string; translation?: string };
type Signature = { id: string; name: string; text: string };


export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [sttLang, setSttLang] = useState("en");
  const [outLang, setOutLang] = useState("ja");
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [versions, setVersions] = useState<LetterVersion[] | null>(null);
  const [chosenIdx, setChosenIdx] = useState<number | null>(null);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);

  // Composer state
  const [composerSubject, setComposerSubject] = useState("");
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif");
  const [fontSizePt, setFontSizePt] = useState(10); // whole-email default size, remembered as a user preference
  const bodyRef = useRef<HTMLDivElement>(null);
  const composerAnchorRef = useRef<HTMLDivElement>(null);

  // Signatures
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [selectedSigId, setSelectedSigId] = useState<string>("");
  const [showSigForm, setShowSigForm] = useState(false);
  const [newSigName, setNewSigName] = useState("");
  const [newSigText, setNewSigText] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
        return;
      }
      setUser(session.user);
      setAuthLoading(false);
      loadUserData(session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadUserData(userId: string) {
    const { data, error } = await supabase
      .from("user_data")
      .select("signatures, font_family, font_size_pt")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Failed to load user data:", error);
      return;
    }
    if (data) {
      if (data.signatures) setSignatures(data.signatures);
      if (data.font_family) setFontFamily(data.font_family);
      if (data.font_size_pt) setFontSizePt(data.font_size_pt);
    }
  }

  async function saveUserData(fields: Partial<{ signatures: Signature[]; font_family: string; font_size_pt: number }>) {
    if (!user) return;
    const { error } = await supabase
      .from("user_data")
      .upsert({ user_id: user.id, ...fields }, { onConflict: "user_id" });
    if (error) console.error("Failed to save user data:", error);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function updateFontFamily(value: string) {
    setFontFamily(value);
    saveUserData({ font_family: value });
  }

  function updateFontSizePt(value: number) {
    setFontSizePt(value);
    saveUserData({ font_size_pt: value });
  }

  function persistSignatures(sigs: Signature[]) {
    setSignatures(sigs);
    saveUserData({ signatures: sigs });
  }

  async function startRecording() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendForTranscription(audioBlob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch (err) {
      setError("Could not access the microphone. Please check your browser's microphone permission.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }

  async function sendForTranscription(audioBlob: Blob) {
    setTranscribing(true);
    setError("");
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError("Your session has expired. Please sign in again.");
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("language", getWhisperCode(sttLang));
      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Speech recognition failed");
      setTranscript((prev) => (prev ? prev + " " + data.text : data.text));
    } catch (err: any) {
      setError("Speech recognition failed: " + err.message);
    } finally {
      setTranscribing(false);
    }
  }

  async function handleGenerate() {
    if (!transcript.trim()) {
      setError("Please dictate or type the content you'd like to say first.");
      return;
    }
    setError("");
    setGenerating(true);
    setVersions(null);
    setChosenIdx(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setError("Your session has expired. Please sign in again.");
        router.push("/login");
        return;
      }

      const res = await fetch("/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ content: transcript, outLang, sttLang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setVersions(data.versions);
    } catch (err: any) {
      setError("Generation failed: " + err.message + " (you can try again)");
    } finally {
      setGenerating(false);
    }
  }

  function copyPlain(label: string, text: string, tag: string) {
    navigator.clipboard.writeText(text);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  }

  function quickCopyCard(v: LetterVersion, idx: number, part: "subject" | "body") {
    const text = part === "subject" ? v.subject : v.body;
    copyPlain(part, text, `card-${idx}-${part}`);
  }

  // Opens the composer, pre-filling it with the chosen version
  function useVersion(idx: number) {
    setChosenIdx(idx);
    const v = versions![idx];
    setComposerSubject(v.subject);
    // Wait for the composer <div> to actually mount (it only renders once
    // chosenIdx !== null) before writing into it or scrolling to it —
    // bodyRef.current is still null in this same synchronous call.
    setTimeout(() => {
      if (bodyRef.current) {
        bodyRef.current.innerText = v.body;
      }
      composerAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function applyFormat(command: string, value?: string) {
    bodyRef.current?.focus();
    document.execCommand(command, false, value);
  }

  function applyColor(hex: string) {
    applyFormat("foreColor", hex);
  }

  // Applies a specific pt size to only the currently selected text, independent
  // of the whole-email font size above. The browser's execCommand("fontSize", ...)
  // only supports the old HTML size scale (1-7), not arbitrary pt values, so we
  // use it to tag the selection, then swap that tag for a <span> with the exact
  // pt size we actually want.
  function applySelectionFontSize(pt: number) {
    bodyRef.current?.focus();
    document.execCommand("fontSize", false, "7");
    if (bodyRef.current) {
      const tagged = bodyRef.current.querySelectorAll('font[size="7"]');
      tagged.forEach((el) => {
        const span = document.createElement("span");
        span.style.fontSize = `${pt}pt`;
        span.innerHTML = el.innerHTML;
        el.replaceWith(span);
      });
    }
  }

  function insertSignature() {
    const sig = signatures.find((s) => s.id === selectedSigId);
    if (!sig || !bodyRef.current) return;
    bodyRef.current.innerHTML += `<br><br>${sig.text.replace(/\n/g, "<br>")}`;
  }

  function saveNewSignature() {
    if (!newSigName.trim() || !newSigText.trim()) return;
    const sig: Signature = { id: Date.now().toString(), name: newSigName.trim(), text: newSigText.trim() };
    persistSignatures([...signatures, sig]);
    setNewSigName("");
    setNewSigText("");
    setShowSigForm(false);
    setSelectedSigId(sig.id);
  }

  function deleteSignature(id: string) {
    persistSignatures(signatures.filter((s) => s.id !== id));
    if (selectedSigId === id) setSelectedSigId("");
  }

  async function copyComposerBody() {
    const el = bodyRef.current;
    if (!el) return;
    const html = el.innerHTML;
    const plain = el.innerText;
    try {
      if (navigator.clipboard && (window as any).ClipboardItem) {
        const item = new (window as any).ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(plain);
      }
      setCopiedTag("composer-body");
      setTimeout(() => setCopiedTag(null), 1500);
    } catch (err) {
      // Fallback: plain text copy if rich clipboard write is blocked by the browser
      navigator.clipboard.writeText(plain);
      setCopiedTag("composer-body");
      setTimeout(() => setCopiedTag(null), 1500);
    }
  }

  function copyComposerSubject() {
    copyPlain("subject", composerSubject, "composer-subject");
  }

  if (authLoading) {
    return (
      <main style={styles.body}>
        <div style={styles.wrap}>
          <p style={{ color: "#9AA6BE" }}>Loading…</p>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.body}>
      <div style={styles.wrap}>
        <header style={{ marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={styles.eyebrow}>WordSpring</div>
            <h1 style={styles.h1}>WordSpring</h1>
            <p style={styles.headerP}>
              Press record and simply say what you want to communicate. AI will turn it into a
              formal email, with several tones for you to choose from and edit.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#9AA6BE", fontSize: 13, marginBottom: 6 }}>{user?.email}</div>
            <button style={styles.copyBtnSmall} onClick={handleSignOut}>Sign out</button>
          </div>
        </header>

        <div style={styles.panel}>
          <h2 style={styles.panelH2}>
            <span style={styles.num}>1</span>Say what you want to write
          </h2>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>What language will you dictate in?</label>
              <select style={styles.select} value={sttLang} onChange={(e) => setSttLang(e.target.value)}>
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>What language should the email be written in?</label>
              <select style={styles.select} value={outLang} onChange={(e) => setOutLang(e.target.value)}>
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.recordArea}>
            <button
              style={{ ...styles.micBtn, background: recording ? "#8E2C2C" : "#B33A3A" }}
              onClick={recording ? stopRecording : startRecording}
              aria-label={recording ? "Stop recording" : "Start recording"}
            >
              🎙
            </button>
            <div>
              <div style={styles.recordStatus}>
                {recording ? "Recording… tap again to stop" : transcribing ? "Transcribing…" : "Tap to start dictating"}
              </div>
              <div style={styles.notice}>Your recording is sent to your own server for transcription, not a third party.</div>
            </div>
          </div>

          <textarea
            style={styles.textarea}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your dictated content will appear here. You can also type directly, or paste in a related email thread for context."
          />

          <button style={styles.generateBtn} onClick={handleGenerate} disabled={generating}>
            {generating ? "Generating…" : "Generate three tone options"}
          </button>

          {error && <div style={styles.errorBox}>{error}</div>}
        </div>

        {versions && (
          <div style={styles.panel}>
            <h2 style={styles.panelH2}>
              <span style={styles.num}>2</span>Choose the version you want to use
            </h2>
            <div style={styles.results}>
              {versions.map((v, idx) => (
                <div
                  key={idx}
                  style={{ ...styles.letterCard, boxShadow: chosenIdx === idx ? "0 0 0 2px #B33A3A" : "none" }}
                >
                  {chosenIdx === idx && <div style={styles.chosenLabel}>In editor below</div>}
                  <div style={styles.toneTag}>{v.tone}</div>
                  <div style={styles.letterSubject}>{v.subject}</div>
                  <div style={styles.letterBody}>{v.body}</div>
                  {v.translation && (
                    <div style={styles.translationBox}>
                      <div style={styles.translationLabel}>Translation (for reference)</div>
                      <div style={styles.translationText}>{v.translation}</div>
                    </div>
                  )}
                  <div style={styles.cardActions}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={styles.copyBtnSmall} onClick={() => quickCopyCard(v, idx, "subject")}>
                        {copiedTag === `card-${idx}-subject` ? "Copied" : "Copy subject"}
                      </button>
                      <button style={styles.copyBtnSmall} onClick={() => quickCopyCard(v, idx, "body")}>
                        {copiedTag === `card-${idx}-body` ? "Copied" : "Copy body"}
                      </button>
                    </div>
                    <button
                      style={{
                        ...styles.sealStamp,
                        background: chosenIdx === idx ? "#B33A3A" : "transparent",
                        color: chosenIdx === idx ? "#F5F1E6" : "#B33A3A",
                      }}
                      onClick={() => useVersion(idx)}
                      aria-label="Edit this version"
                      title="Edit this version"
                    >
                      ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {chosenIdx !== null && (
          <div style={styles.panel} ref={composerAnchorRef}>
            <h2 style={styles.panelH2}>
              <span style={styles.num}>3</span>Edit &amp; finish your email
            </h2>

            <div style={styles.field}>
              <label style={styles.label}>Subject</label>
              <input
                style={styles.select}
                value={composerSubject}
                onChange={(e) => setComposerSubject(e.target.value)}
              />
            </div>

            <div style={styles.toolbarGroup}>
              <div style={styles.toolbarGroupLabel}>✉ Whole email (applies to everything, remembered as default)</div>
              <div style={styles.toolbar}>
                <select style={styles.toolbarSelect} value={fontFamily} onChange={(e) => updateFontFamily(e.target.value)} title="Font (applies to the whole email, remembered as your default)">
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                </select>
                <select
                  style={styles.toolbarSelect}
                  value={fontSizePt}
                  onChange={(e) => updateFontSizePt(Number(e.target.value))}
                  title="Font size in pt (applies to the whole email, remembered as your default)"
                >
                  {[8, 10, 11, 12, 14, 16, 18, 20, 24].map((pt) => (
                    <option key={pt} value={pt}>{pt}pt</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.toolbarGroupAlt}>
              <div style={styles.toolbarGroupLabel}>🖊 Selected text only</div>
              <div style={styles.toolbar}>
                <select
                  style={styles.toolbarSelect}
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) applySelectionFontSize(Number(e.target.value));
                    e.target.value = "";
                  }}
                  title="Font size for the highlighted text only (does not change the rest of the email)"
                >
                  <option value="" disabled>Size…</option>
                  {[8, 10, 11, 12, 14, 16, 18, 20, 24].map((pt) => (
                    <option key={pt} value={pt}>{pt}pt</option>
                  ))}
                </select>
                <button style={styles.toolbarBtn} onClick={() => applyFormat("bold")} title="Bold selected text"><b>B</b></button>
                <button style={styles.toolbarBtn} onClick={() => applyFormat("italic")} title="Italicize selected text"><i>I</i></button>
                <button style={styles.toolbarBtn} onClick={() => applyFormat("underline")} title="Underline selected text"><u>U</u></button>
                <label style={styles.colorSwatch} title="Text color for selected text">
                  <span style={{ fontSize: 12 }}>A</span>
                  <input
                    type="color"
                    defaultValue="#2A2620"
                    onChange={(e) => applyColor(e.target.value)}
                    style={styles.colorInput}
                  />
                </label>
              </div>
            </div>
            <div style={styles.notice}>
              ✉ Font and size on the left apply to the whole email and are remembered as your default next time.
              🖊 Everything on the right — size, bold, italic, underline, color — only affects text you've highlighted.
            </div>

            <div
              ref={bodyRef}
              contentEditable
              suppressContentEditableWarning
              style={{ ...styles.composerBody, fontFamily, fontSize: `${fontSizePt}pt` }}
            />

            <div style={styles.signatureRow}>
              <select style={styles.select} value={selectedSigId} onChange={(e) => setSelectedSigId(e.target.value)}>
                <option value="">— Select a saved signature —</option>
                {signatures.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button style={styles.copyBtnSmall} onClick={insertSignature} disabled={!selectedSigId}>
                Insert
              </button>
              <button style={styles.copyBtnSmall} onClick={() => setShowSigForm(!showSigForm)}>
                Manage signatures
              </button>
            </div>

            {showSigForm && (
              <div style={styles.sigForm}>
                <input
                  style={styles.select}
                  placeholder="Signature name (e.g. Work)"
                  value={newSigName}
                  onChange={(e) => setNewSigName(e.target.value)}
                />
                <textarea
                  style={{ ...styles.textarea, minHeight: 70, marginTop: 8 }}
                  placeholder="Signature text"
                  value={newSigText}
                  onChange={(e) => setNewSigText(e.target.value)}
                />
                <button style={{ ...styles.generateBtn, marginTop: 8 }} onClick={saveNewSignature}>
                  Save signature
                </button>
                {signatures.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    {signatures.map((s) => (
                      <div key={s.id} style={styles.sigListItem}>
                        <span>{s.name}</span>
                        <button style={styles.deleteBtn} onClick={() => deleteSignature(s.id)}>Delete</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button style={{ ...styles.generateBtn, flex: 1 }} onClick={copyComposerSubject}>
                {copiedTag === "composer-subject" ? "Copied" : "Copy subject"}
              </button>
              <button style={{ ...styles.generateBtn, flex: 1 }} onClick={copyComposerBody}>
                {copiedTag === "composer-body" ? "Copied" : "Copy body"}
              </button>
            </div>
            <div style={styles.notice}>
              Paste the subject and body separately into your email tool (Outlook, Mail, Gmail, etc.) — this
              works well on mobile where copying happens in two steps.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: { background: "#1C2333", minHeight: "100vh", padding: "32px 20px 80px", fontFamily: "sans-serif" },
  wrap: { maxWidth: 960, margin: "0 auto" },
  eyebrow: { fontSize: 12, letterSpacing: "0.28em", color: "#7C8BA3", textTransform: "uppercase", marginBottom: 10 },
  h1: { fontWeight: 700, fontSize: 36, margin: "0 0 10px", color: "#E9E5D8" },
  headerP: { color: "#9AA6BE", fontSize: 15, lineHeight: 1.7, maxWidth: "56ch", margin: 0 },
  panel: { background: "#262E44", border: "1px solid rgba(154,166,190,0.18)", borderRadius: 14, padding: 28, marginBottom: 24 },
  panelH2: { fontSize: 17, fontWeight: 600, margin: "0 0 18px", color: "#E9E5D8", display: "flex", alignItems: "center", gap: 10 },
  num: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "#B33A3A", color: "#E9E5D8", fontSize: 12, fontWeight: 600 },
  row: { display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 },
  field: { flex: 1, minWidth: 200, marginBottom: 16 },
  label: { display: "block", fontSize: 12, color: "#9AA6BE", marginBottom: 6 },
  select: { width: "100%", background: "#1C2333", color: "#E9E5D8", border: "1px solid rgba(154,166,190,0.3)", borderRadius: 8, padding: "10px 12px", fontSize: 14 },
  recordArea: { display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" },
  micBtn: { width: 88, height: 88, borderRadius: "50%", border: "none", cursor: "pointer", fontSize: 42, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  recordStatus: { fontSize: 14, color: "#E9E5D8", fontWeight: 500 },
  notice: { fontSize: 13, color: "#9AA6BE", marginTop: 8, lineHeight: 1.6 },
  textarea: { width: "100%", minHeight: 120, background: "#F5F1E6", color: "#2A2620", border: "1px solid #DED6C1", borderRadius: 10, padding: 16, fontSize: 15, lineHeight: 1.8, marginTop: 18 },
  generateBtn: { marginTop: 18, width: "100%", background: "#B33A3A", color: "#E9E5D8", border: "none", borderRadius: 10, padding: 15, fontSize: 15, fontWeight: 600, cursor: "pointer" },
  errorBox: { background: "rgba(179,58,58,.15)", border: "1px solid rgba(179,58,58,.4)", color: "#F1C9C9", padding: "12px 14px", borderRadius: 8, fontSize: 13, marginTop: 14 },
  results: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 },
  letterCard: { background: "#F5F1E6", color: "#2A2620", borderRadius: 10, padding: "26px 24px 22px", position: "relative", border: "1px solid #DED6C1", display: "flex", flexDirection: "column", minHeight: 280 },
  chosenLabel: { position: "absolute", top: 16, right: 16, fontSize: 11, color: "#8E2C2C", fontWeight: 600 },
  toneTag: { fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8E2C2C", fontWeight: 700, marginBottom: 6 },
  letterSubject: { fontWeight: 600, fontSize: 16, margin: "0 0 14px", paddingBottom: 12, borderBottom: "1px solid #DED6C1" },
  letterBody: { fontSize: 14, lineHeight: 1.9, whiteSpace: "pre-wrap", flex: 1 },
  translationBox: { marginTop: 16, paddingTop: 14, borderTop: "1px dashed #DED6C1" },
  translationLabel: { fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7C8BA3", fontWeight: 700, marginBottom: 6 },
  translationText: { fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "#5A5647", fontStyle: "italic" },
  cardActions: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18, paddingTop: 14, borderTop: "1px solid #DED6C1", flexWrap: "wrap", gap: 10 },
  copyBtn: { background: "none", border: "1px solid #2A2620", color: "#2A2620", borderRadius: 6, padding: "7px 14px", fontSize: 12, cursor: "pointer" },
  copyBtnSmall: { background: "none", border: "1px solid #2A2620", color: "#2A2620", borderRadius: 6, padding: "6px 10px", fontSize: 11, cursor: "pointer" },
  sealStamp: { width: 40, height: 40, borderRadius: "50%", border: "2px solid #B33A3A", cursor: "pointer", fontWeight: 700, fontSize: 15, flexShrink: 0 },
  toolbar: { display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" },
  toolbarGroup: { background: "rgba(154,166,190,0.08)", border: "1px solid rgba(154,166,190,0.25)", borderRadius: 8, padding: "10px 12px", marginBottom: 8 },
  toolbarGroupAlt: { background: "rgba(179,58,58,0.08)", border: "1px solid rgba(179,58,58,0.3)", borderRadius: 8, padding: "10px 12px", marginBottom: 8 },
  toolbarGroupLabel: { fontSize: 11, letterSpacing: "0.04em", color: "#9AA6BE", marginBottom: 8, fontWeight: 600 },
  toolbarSelect: { background: "#1C2333", color: "#E9E5D8", border: "1px solid rgba(154,166,190,0.3)", borderRadius: 8, padding: "6px 10px", fontSize: 13 },
  toolbarBtn: { background: "#1C2333", color: "#E9E5D8", border: "1px solid rgba(154,166,190,0.3)", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer" },
  colorSwatch: { display: "flex", alignItems: "center", gap: 6, background: "#1C2333", color: "#E9E5D8", border: "1px solid rgba(154,166,190,0.3)", borderRadius: 8, padding: "6px 10px", fontSize: 13, cursor: "pointer" },
  colorInput: { width: 22, height: 22, border: "none", padding: 0, background: "none", cursor: "pointer" },
  composerBody: { width: "100%", minHeight: 180, background: "#F5F1E6", color: "#2A2620", border: "1px solid #DED6C1", borderRadius: 10, padding: 16, fontSize: 15, lineHeight: 1.8, outline: "none" },
  signatureRow: { display: "flex", gap: 10, alignItems: "center", marginTop: 16, flexWrap: "wrap" },
  sigForm: { marginTop: 14, padding: 16, background: "#1C2333", borderRadius: 10 },
  sigListItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", color: "#E9E5D8", fontSize: 13, borderBottom: "1px solid rgba(154,166,190,0.15)" },
  deleteBtn: { background: "none", border: "1px solid #B33A3A", color: "#B33A3A", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer" },
};
