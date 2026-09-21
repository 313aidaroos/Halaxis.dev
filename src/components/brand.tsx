import Image from "next/image";

export function Brand({ large = false }: { large?: boolean }) {
  return (
    <span className={`brand ${large ? "brand-large" : ""}`}>
      <span className="brand-mark" aria-hidden="true">
        <Image src="/images/halaxis-monogram.png" alt="" width={68} height={60} className="brand-logo" priority={!large} />
      </span>
      <span className="brand-type">
        HALAXIS<small>BUILD TOGETHER. A BRIGHTER TOMORROW.</small>
      </span>
    </span>
  );
}
