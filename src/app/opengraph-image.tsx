import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const bytes = await readFile(join(process.cwd(), "public/brand-mark.jpg"));
  const markSrc = `data:image/jpeg;base64,${Buffer.from(bytes).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background:
            "linear-gradient(135deg, #F8C9B5 0%, #BFE0D0 55%, #BFD7EA 100%)",
          color: "#3d2c29",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 28,
          }}
        >
          <img
            src={markSrc}
            width={72}
            height={72}
            alt=""
            style={{
              borderRadius: 22,
              objectFit: "cover",
              boxShadow: "0 10px 24px rgba(61,44,41,0.14)",
            }}
          />
          <div style={{ fontSize: 26, fontWeight: 800, opacity: 0.72 }}>
            القرآن مع عروة
          </div>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          {siteConfig.name}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            fontWeight: 600,
            opacity: 0.75,
            maxWidth: 820,
          }}
        >
          {siteConfig.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
