import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PDF Lab – Free Online PDF Merger & Editor";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#0f172a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          padding: "72px",
          position: "relative",
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow behind icon group */}
        <div
          style={{
            position: "absolute",
            top: "120px",
            width: "480px",
            height: "240px",
            background: "radial-gradient(ellipse, rgba(230,57,70,0.18) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* PDF pages icon group */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          {/* Three stacked pages */}
          {["-8px", "0px", "8px"].map((offset, i) => (
            <div
              key={i}
              style={{
                width: "56px",
                height: "72px",
                background: i === 1 ? "#1e293b" : "#162032",
                border: `1.5px solid ${i === 1 ? "#334155" : "#1e293b"}`,
                borderRadius: "6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                transform: `translateY(${offset})`,
                boxShadow: i === 1 ? "0 4px 24px rgba(0,0,0,0.5)" : "none",
              }}
            >
              {[0, 1, 2].map((line) => (
                <div
                  key={line}
                  style={{
                    width: "32px",
                    height: "4px",
                    background: line === 0 ? "#e63946" : "#334155",
                    borderRadius: "2px",
                  }}
                />
              ))}
            </div>
          ))}

          {/* Arrow */}
          <div
            style={{
              fontSize: "32px",
              color: "#e63946",
              margin: "0 8px",
              fontWeight: 700,
            }}
          >
             &gt;
          </div>

          {/* Single merged page */}
          <div
            style={{
              width: "64px",
              height: "80px",
              background: "#1e293b",
              border: "1.5px solid #e63946",
              borderRadius: "6px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              boxShadow: "0 0 32px rgba(230,57,70,0.3)",
            }}
          >
            {[0, 1, 2, 3].map((line) => (
              <div
                key={line}
                style={{
                  width: "38px",
                  height: "4px",
                  background: line === 0 ? "#e63946" : "#334155",
                  borderRadius: "2px",
                }}
              />
            ))}
          </div>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#f1f5f9",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            PDF
          </span>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 800,
              color: "#e63946",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            Lab
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "26px",
            color: "#94a3b8",
            margin: 0,
            letterSpacing: "-0.3px",
            textAlign: "center",
          }}
        >
          Merge &amp; edit PDF files free — no account, no upload, no install
        </p>

        {/* Pills */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "36px",
          }}
        >
          {["Free", "Private", "Browser-based"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 20px",
                background: "rgba(230,57,70,0.1)",
                border: "1px solid rgba(230,57,70,0.25)",
                borderRadius: "999px",
                color: "#f87171",
                fontSize: "18px",
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
