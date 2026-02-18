/**
 * Home page – a simple landing / dashboard placeholder for PDF Lab.
 * Uses CSS custom properties from globals.css so it automatically adapts
 * to light and dark mode without any extra JS.
 */
export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <h1 className="text-4xl font-bold" style={{ color: "var(--foreground)" }}>
        Welcome to{" "}
        <span style={{ color: "var(--accent)" }}>PDF Lab</span>
      </h1>
      <p className="text-lg max-w-md" style={{ color: "var(--foreground-muted)" }}>
        Upload, manage, and work with your PDF files — all in one place.
      </p>
      <button
        className="mt-4 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 cursor-pointer"
        style={{
          backgroundColor: "var(--accent)",
          color: "#ffffff",
        }}
      >
        Get Started
      </button>
    </section>
  );
}

