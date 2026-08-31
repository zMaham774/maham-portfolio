"use client";

export default function EntranceOverlay() {
  return (
    <div
      id="entrance-title"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        opacity: 0,
        pointerEvents: "none",
        textShadow: "0 0 24px rgba(255, 196, 96, 0.8)",
        filter: "drop-shadow(0 0 18px rgba(255, 180, 72, 0.7))",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-space-grotesk, sans-serif)",
          fontSize: "clamp(2rem, 6vw, 4rem)",
          letterSpacing: "0.15em",
          color: "#f5f5f0",
          margin: 0,
          fontWeight: 500,
          textShadow: "0 0 32px rgba(255, 196, 96, 0.7)",
        }}
      >
        MAHAM ZAFAR
      </h1>
    </div>
  );
}