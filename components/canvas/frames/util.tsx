/** A faint diagonal glass reflection laid over a screen/print (preview-only). */
export function Sheen({ radius }: { radius?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        borderRadius: radius,
        background:
          "linear-gradient(125deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 14%, rgba(255,255,255,0) 34%)",
      }}
    />
  );
}
