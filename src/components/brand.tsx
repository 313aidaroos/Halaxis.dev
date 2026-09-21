export function Brand({ large = false }: { large?: boolean }) {
  return (
    <span className={`brand ${large ? "brand-large" : ""}`}>
      <span className="brand-mark" aria-hidden="true">
        <span>H</span>
        <i>✦</i>
      </span>
      <span className="brand-type">
        HALAXIS<small>BUILD TOGETHER. A BRIGHTER TOMORROW.</small>
      </span>
    </span>
  );
}
