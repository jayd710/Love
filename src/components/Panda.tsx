import Image from "next/image";

export default function Panda() {
  return (
    <Image
      className="panda"
      src="/panda.png"
      alt="Cute panda teddy"
      width={280}
      height={420}
      priority
    />
  );
}
