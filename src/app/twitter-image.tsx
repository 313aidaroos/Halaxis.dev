import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Halaxis — Halal & Sharia-compliant investing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b1424",
          color: "#f4efe4",
          padding: "72px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#c9a227",
          }}
        >
          Halaxis
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, lineHeight: 1.05, maxWidth: 900 }}>
            Halal capital, stewarded with discipline.
          </div>
          <div style={{ marginTop: 24, fontSize: 28, color: "#b7c0cc" }}>
            Sharia-compliant platform in formation · not an offering
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
