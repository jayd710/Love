import Image from "next/image";
import panda from "@/assets/panda.png";

export default function Panda() {
  // Static import → emitted under _next/static/media with the correct
  // asset prefix, so it resolves correctly on GitHub Pages subpaths.
  return <Image className="panda" src={panda} alt="Cute panda teddy" priority />;
}
