export default function LPNotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Google Sans, Inter, sans-serif",
        background: "#f9f9f9",
        color: "#262626",
        gap: "1rem",
      }}
    >
      <div
        style={{
          fontSize: "0.78rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "#5B1A7C",
        }}
      >
        404
      </div>
      <h1 style={{ fontSize: "2rem", fontWeight: 500, letterSpacing: "-0.03em" }}>
        Page not found
      </h1>
      <p style={{ color: "#79716b", fontSize: "1rem" }}>
        This landing page doesn&apos;t exist (yet).
      </p>
      <a
        href="/"
        style={{
          marginTop: "1rem",
          background: "#5B1A7C",
          color: "white",
          padding: "0.6rem 1.2rem",
          borderRadius: "7px",
          textDecoration: "none",
          fontSize: "0.875rem",
          fontWeight: 600,
        }}
      >
        Back to Perea.AI →
      </a>
    </div>
  );
}
