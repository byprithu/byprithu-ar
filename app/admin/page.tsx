"use client";
import { useState, useEffect } from "react";
import { getAllPosters, savePoster, updatePoster } from "../../lib/firebase";
import { uploadToCloudinary } from "../../lib/cloudinary";

const PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "byprithu2024";

const s = {
  page: { minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "-apple-system, sans-serif", padding: "0 0 40px" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 32px", borderBottom: "1px solid #222" },
  h1: { fontSize: 22, fontWeight: 600, margin: 0 },
  sub: { fontSize: 13, color: "#666", margin: "4px 0 0" },
  btn: { background: "#fff", color: "#000", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  stats: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "24px 32px" },
  stat: { background: "#111", border: "1px solid #222", borderRadius: 12, padding: "16px 20px" },
  statLabel: { fontSize: 12, color: "#666", marginBottom: 6 },
  statVal: { fontSize: 28, fontWeight: 600 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, padding: "0 32px" },
  card: { background: "#111", border: "1px solid #222", borderRadius: 16, overflow: "hidden" },
  cardImg: { width: "100%", height: 140, objectFit: "cover", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#444", fontSize: 13 },
  cardBody: { padding: 16 },
  cardTitle: { fontWeight: 600, fontSize: 15, marginBottom: 4 },
  cardSub: { fontSize: 12, color: "#666", marginBottom: 12 },
  row: { display: "flex", gap: 8 },
  smallBtn: { flex: 1, background: "#1a1a1a", border: "1px solid #333", color: "#fff", borderRadius: 8, padding: "8px 0", fontSize: 12, cursor: "pointer" },
  link: { display: "block", textAlign: "center" as const, fontSize: 12, color: "#555", marginTop: 10, textDecoration: "none" },
  qr: { background: "#fff", borderRadius: 10, padding: 12, display: "flex", justifyContent: "center", marginBottom: 10 },
  overlay: { position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 },
  modal: { background: "#111", border: "1px solid #333", borderRadius: 20, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" as const },
  modalHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #222" },
  modalTitle: { fontSize: 18, fontWeight: 600 },
  close: { background: "none", border: "none", color: "#666", fontSize: 24, cursor: "pointer", lineHeight: 1 },
  modalBody: { padding: "20px 24px" },
  label: { fontSize: 12, color: "#888", display: "block", marginBottom: 6, marginTop: 16 },
  input: { width: "100%", background: "#1a1a1a", border: "1px solid #333", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" as const },
  fileLabel: { display: "block", background: "#1a1a1a", border: "1px dashed #444", borderRadius: 10, padding: "14px", cursor: "pointer", fontSize: 13, color: "#888" },
  typeRow: { display: "flex", gap: 8, marginBottom: 10 },
  typeBtn: (active: boolean) => ({ padding: "6px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", border: "1px solid", background: active ? "#fff" : "transparent", color: active ? "#000" : "#888", borderColor: active ? "#fff" : "#444" }),
  toggle: (on: boolean) => ({ width: 40, height: 22, borderRadius: 11, background: on ? "#22c55e" : "#333", position: "relative" as const, cursor: "pointer", border: "none", transition: "background .2s" }),
  toggleDot: (on: boolean) => ({ position: "absolute" as const, top: 3, left: on ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s" }),
  modalFoot: { padding: "16px 24px", borderTop: "1px solid #222", display: "flex", gap: 10 },
  saveBtn: { flex: 1, background: "#fff", color: "#000", border: "none", borderRadius: 10, padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  cancelBtn: { padding: "12px 20px", background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 14 },
  loginBox: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" },
  loginCard: { background: "#111", border: "1px solid #222", borderRadius: 20, padding: 32, width: "100%", maxWidth: 360 },
  loginTitle: { fontSize: 20, fontWeight: 600, marginBottom: 24 },
  empty: { textAlign: "center" as const, padding: "60px 0", color: "#555" },
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [posters, setPosters] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", collectionId: "", tag: "", heading: "You might love these", showProducts: true });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [arFile, setArFile] = useState<File | null>(null);
  const [arType, setArType] = useState("video");
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => { if (authed) load(); }, [authed]);

  async function load() {
    setLoading(true);
    const data = await getAllPosters();
    setPosters(data.sort((a: any, b: any) => b.createdAt - a.createdAt));
    setLoading(false);
  }

  async function handleSave() {
    if (!form.name || !posterFile || !arFile) return;
    setSaving(true);
    try {
      setStep("Uploading poster image...");
      const posterImageUrl = await uploadToCloudinary(posterFile, "byprithu/posters");
      setStep("Uploading AR media...");
      const arMediaUrl = await uploadToCloudinary(arFile, "byprithu/ar-media");
      setStep("Saving...");
      await savePoster({
        name: form.name,
        posterImageUrl,
        arMediaUrl,
        arMediaType: arType,
        shopifyCollectionId: form.collectionId || null,
        shopifyTag: form.tag || null,
        showProducts: form.showProducts,
        carouselHeading: form.heading,
      });
      setStep("Saved!");
      setShowForm(false);
      setForm({ name: "", collectionId: "", tag: "", heading: "You might love these", showProducts: true });
      setPosterFile(null); setArFile(null);
      load();
    } catch (e) {
      console.error(e);
      setStep("Failed — check console");
    }
    setSaving(false);
  }

  async function copyLink(id: string) {
    const url = `${window.location.origin}/scan/${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  }

  if (!authed) return (
    <div style={s.loginBox}>
      <div style={s.loginCard}>
        <p style={s.loginTitle}>byprithu AR — admin</p>
        <input style={s.input} type="password" placeholder="Password" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && pw === PASS && setAuthed(true)} />
        <button style={{ ...s.btn, width: "100%", marginTop: 16 }} onClick={() => pw === PASS && setAuthed(true)}>Enter</button>
        {pw && pw !== PASS && <p style={{ color: "#ef4444", fontSize: 13, marginTop: 10, textAlign: "center" }}>Wrong password</p>}
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <p style={s.h1}>byprithu AR — admin</p>
          <p style={s.sub}>{posters.length} posters · everything else is automatic</p>
        </div>
        <button style={s.btn} onClick={() => setShowForm(true)}>+ Add poster</button>
      </div>

      <div style={s.stats}>
        {[["Total posters", posters.length], ["Total scans", posters.reduce((a, p) => a + p.scanCount, 0)], ["With AR media", posters.filter(p => p.arMediaUrl).length]].map(([l, v]) => (
          <div key={l as string} style={s.stat}>
            <p style={s.statLabel}>{l}</p>
            <p style={s.statVal}>{v}</p>
          </div>
        ))}
      </div>

      {loading ? <p style={{ textAlign: "center", color: "#555", padding: 40 }}>Loading...</p>
        : posters.length === 0 ? <div style={s.empty}><p style={{ fontSize: 18, marginBottom: 8 }}>No posters yet</p><p style={{ fontSize: 14 }}>Click "+ Add poster" to get started</p></div>
        : <div style={s.grid}>
          {posters.map(p => {
            const url = `${typeof window !== "undefined" ? window.location.origin : ""}/scan/${p.id}`;
            return (
              <div key={p.id} style={s.card}>
                <div style={{ position: "relative" }}>
                  {p.posterImageUrl
                    ? <img src={p.posterImageUrl} alt={p.name} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                    : <div style={{ ...s.cardImg as any }}>No image</div>}
                  <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 11, padding: "3px 8px", borderRadius: 20 }}>{p.scanCount} scans</span>
                  <span style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", color: "#fff", fontSize: 11, padding: "3px 8px", borderRadius: 20 }}>AR {p.arMediaType}</span>
                </div>
                <div style={s.cardBody}>
                  <p style={s.cardTitle}>{p.name}</p>
                  <p style={s.cardSub}>{p.showProducts ? "Products on" : "Products off"}</p>
                  <div style={s.qr}>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(url)}`} alt="QR" width={120} height={120} />
                  </div>
                  <div style={s.row}>
                    <button style={s.smallBtn} onClick={() => copyLink(p.id)}>{copied === p.id ? "Copied!" : "Copy link"}</button>
                    <button style={{ ...s.smallBtn, color: p.showProducts ? "#22c55e" : "#888" }} onClick={() => updatePoster(p.id, { showProducts: !p.showProducts }).then(load)}>
                      {p.showProducts ? "Products on" : "Products off"}
                    </button>
                  </div>
                  <a href={`/scan/${p.id}`} target="_blank" style={s.link}>Preview customer page →</a>
                </div>
              </div>
            );
          })}
        </div>}

      {showForm && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalHead}>
              <span style={s.modalTitle}>Add new poster</span>
              <button style={s.close} onClick={() => setShowForm(false)}>×</button>
            </div>
            <div style={s.modalBody}>
              <label style={s.label}>Poster name</label>
              <input style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Birthday Vol.1" />

              <label style={s.label}>Poster image (used for AR tracking)</label>
              <label style={s.fileLabel}>
                {posterFile ? posterFile.name : "Choose image file"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => setPosterFile(e.target.files?.[0] || null)} />
              </label>

              <label style={s.label}>AR overlay media</label>
              <div style={s.typeRow}>
                {["video", "image"].map(t => <button key={t} style={s.typeBtn(arType === t)} onClick={() => setArType(t)}>{t}</button>)}
              </div>
              <label style={s.fileLabel}>
                {arFile ? arFile.name : `Choose ${arType} file`}
                <input type="file" accept={arType === "video" ? "video/*" : "image/*"} style={{ display: "none" }} onChange={e => setArFile(e.target.files?.[0] || null)} />
              </label>

              <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 12, padding: 16, marginTop: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: form.showProducts ? 16 : 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>Product carousel</span>
                  <button style={s.toggle(form.showProducts)} onClick={() => setForm({ ...form, showProducts: !form.showProducts })}>
                    <span style={s.toggleDot(form.showProducts)} />
                  </button>
                </div>
                {form.showProducts && <>
                  <label style={s.label}>Shopify collection ID (optional)</label>
                  <input style={s.input} value={form.collectionId} onChange={e => setForm({ ...form, collectionId: e.target.value })} placeholder="gid://shopify/Collection/123456" />
                  <label style={s.label}>Or filter by tag (optional)</label>
                  <input style={s.input} value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} placeholder="e.g. birthday" />
                  <label style={s.label}>Carousel heading</label>
                  <input style={s.input} value={form.heading} onChange={e => setForm({ ...form, heading: e.target.value })} />
                </>}
              </div>
            </div>
            <div style={s.modalFoot}>
              <button style={s.saveBtn} onClick={handleSave} disabled={saving || !form.name || !posterFile || !arFile}>
                {saving ? step || "Saving..." : "Save poster"}
              </button>
              <button style={s.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
