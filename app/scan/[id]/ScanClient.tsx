"use client";
import { useState, useEffect, useRef } from "react";

function formatPrice(amount: string, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(parseFloat(amount));
}

export default function ScanClient({ poster, products }: { poster: any; products: any[] }) {
  const [arOpen, setArOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const fn = () => setActiveIdx(Math.round(el.scrollLeft / (el.offsetWidth * 0.62)));
    el.addEventListener("scroll", fn, { passive: true });
    return () => el.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "-apple-system, sans-serif" }}>
      {/* Hero */}
      <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", textAlign: "center" }}>
        <div style={{ position: "absolute", top: 20, left: 20, width: 24, height: 24, borderTop: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "4px 0 0 0" }} />
        <div style={{ position: "absolute", top: 20, right: 20, width: 24, height: 24, borderTop: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 4px 0 0" }} />
        <div style={{ position: "absolute", bottom: 60, left: 20, width: 24, height: 24, borderBottom: "2px solid rgba(255,255,255,0.25)", borderLeft: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 0 4px" }} />
        <div style={{ position: "absolute", bottom: 60, right: 20, width: 24, height: 24, borderBottom: "2px solid rgba(255,255,255,0.25)", borderRight: "2px solid rgba(255,255,255,0.25)", borderRadius: "0 0 4px 0" }} />

        <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600, marginBottom: 28 }}>BP</div>
        <h1 style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.2, margin: "0 0 12px", maxWidth: 280 }}>Bring your poster to life</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, margin: "0 0 36px", lineHeight: 1.6 }}>
          Point your camera at your<br /><span style={{ color: "rgba(255,255,255,0.6)" }}>{poster.name}</span> poster
        </p>
        <button onClick={() => setArOpen(true)} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", color: "#000", border: "none", borderRadius: 50, padding: "14px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/>
            <rect x="7" y="7" width="10" height="10" rx="2"/>
          </svg>
          Scan poster
        </button>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginTop: 16 }}>No app needed · works in your browser</p>

        {products.length > 0 && (
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.2)", fontSize: 12, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span>scroll for products</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        )}
      </section>

      {/* Products */}
      {products.length > 0 && (
        <section style={{ background: "#000", paddingBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 20px 20px", marginTop: 8 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>from our store</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px 16px" }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{poster.carouselHeading}</h2>
            <a href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`} target="_blank" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none" }}>View all →</a>
          </div>
          <div ref={trackRef} style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 20px", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
            {products.map((p: any) => {
              const img = p.images?.edges?.[0]?.node;
              const price = formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode);
              return (
                <div key={p.id} style={{ flex: "0 0 60vw", maxWidth: 220, background: "#111", border: "1px solid #222", borderRadius: 16, overflow: "hidden", scrollSnapAlign: "start" }}>
                  <div style={{ height: 160, background: "#1a1a1a", position: "relative" }}>
                    {img && <img src={img.url} alt={img.altText || p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    {!p.availableForSale && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Sold out</div>}
                  </div>
                  <div style={{ padding: "12px 14px 14px" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{p.title}</p>
                    <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>{price}</p>
                    <a href={`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/products/${p.handle}`} target="_blank"
                      style={{ display: "block", textAlign: "center", background: p.availableForSale ? "#fff" : "#222", color: p.availableForSale ? "#000" : "#555", borderRadius: 10, padding: "8px 0", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                      {p.availableForSale ? "Buy now" : "Sold out"}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
            {products.map((_: any, i: number) => (
              <div key={i} style={{ height: 4, borderRadius: 2, background: i === activeIdx ? "#fff" : "rgba(255,255,255,0.2)", width: i === activeIdx ? 20 : 5, transition: "all .3s" }} />
            ))}
          </div>
        </section>
      )}

      {/* AR Camera */}
      {arOpen && <ARCamera poster={poster} onClose={() => setArOpen(false)} />}
    </div>
  );
}

function ARCamera({ poster, onClose }: { poster: any; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      if (!document.querySelector('script[src*="aframe"]')) await addScript("https://cdn.jsdelivr.net/npm/aframe@1.4.2/dist/aframe.min.js");
      if (!document.querySelector('script[src*="mindar"]')) await addScript("https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js");
      if (!containerRef.current) return;

      const scene = document.createElement("a-scene");
      scene.setAttribute("mindar-image", `imageTargetSrc: ${poster.posterImageUrl}; autoStart: true;`);
      scene.setAttribute("vr-mode-ui", "enabled: false");
      scene.setAttribute("device-orientation-permission-ui", "enabled: false");
      scene.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:100;";

      const camera = document.createElement("a-camera");
      camera.setAttribute("position", "0 0 0");
      camera.setAttribute("look-controls", "enabled: false");
      scene.appendChild(camera);

      const target = document.createElement("a-entity");
      target.setAttribute("mindar-image-target", "targetIndex: 0");

      if (poster.arMediaType === "video") {
        const assets = document.createElement("a-assets");
        const video = document.createElement("video");
        video.id = "ar-vid"; video.src = poster.arMediaUrl;
        video.autoplay = true; video.loop = true; video.muted = true;
        video.setAttribute("playsinline", "true");
        assets.appendChild(video);
        scene.appendChild(assets);
        const plane = document.createElement("a-plane");
        plane.setAttribute("src", "#ar-vid");
        plane.setAttribute("position", "0 0 0.01");
        plane.setAttribute("width", "1");
        plane.setAttribute("height", "0.552");
        target.appendChild(plane);
      } else {
        const plane = document.createElement("a-plane");
        plane.setAttribute("src", poster.arMediaUrl);
        plane.setAttribute("position", "0 0 0.01");
        plane.setAttribute("width", "1");
        plane.setAttribute("height", "0.552");
        target.appendChild(plane);
      }

      scene.appendChild(target);
      containerRef.current.appendChild(scene);
    };
    load();
    return () => { if (containerRef.current) containerRef.current.innerHTML = ""; };
  }, [poster]);

  return (
    <div ref={containerRef} style={{ position: "fixed", inset: 0, zIndex: 100, background: "#000" }}>
      <button onClick={onClose} style={{ position: "fixed", top: 20, right: 20, zIndex: 200, background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50%", width: 44, height: 44, color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
      <div style={{ position: "fixed", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 30, padding: "8px 20px", color: "rgba(255,255,255,0.8)", fontSize: 13, whiteSpace: "nowrap" }}>
        Point at your {poster.name} poster
      </div>
    </div>
  );
}

function addScript(src: string): Promise<void> {
  return new Promise(resolve => {
    const s = document.createElement("script");
    s.src = src; s.onload = () => resolve();
    document.head.appendChild(s);
  });
}
