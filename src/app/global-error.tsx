"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "system-ui, sans-serif",
          background: "#FFF4E6",
          color: "#3d2c29",
        }}
      >
        <div
          style={{
            maxWidth: 420,
            width: "100%",
            padding: 32,
            borderRadius: 24,
            background: "#FBE7A8",
            boxShadow: "8px 8px 20px rgba(61,44,41,0.12)",
            textAlign: "center",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: 12, lineHeight: 1.5, opacity: 0.75 }}>
            A critical error occurred. Please try reloading the page.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "12px 20px",
              borderRadius: 999,
              border: "none",
              background: "#5c8f7a",
              color: "#fffaf3",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
