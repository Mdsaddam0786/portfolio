import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background:
          "radial-gradient(circle at 80% 20%, rgba(139,92,246,0.45), transparent 50%), radial-gradient(circle at 10% 90%, rgba(34,211,238,0.3), transparent 45%), #05060f",
        color: "#e5e7eb",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 28, color: "#22d3ee", letterSpacing: 6 }}>PORTFOLIO</div>
      <div
        style={{
          fontSize: 96,
          fontWeight: 800,
          marginTop: 16,
          backgroundImage: "linear-gradient(90deg, #a78bfa, #22d3ee)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {profile.name}
      </div>
      <div style={{ fontSize: 44, marginTop: 8 }}>{profile.role}</div>
      <div style={{ fontSize: 28, marginTop: 32, color: "#94a3b8", maxWidth: 900 }}>
        React · Next.js · Node.js · Express · MongoDB
      </div>
    </div>,
    size,
  );
}
