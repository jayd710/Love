import { chromium } from "playwright";

const URL = "https://jayd710.github.io/Love/";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });

const failed = [];
const imgReqs = [];
p.on("requestfailed", (r) => failed.push(`${r.failure()?.errorText}  ${r.url()}`));
p.on("response", (r) => {
  const u = r.url();
  if (/\.(png|jpg|jpeg|webp|svg|ico)/i.test(u) || u.includes("/_next/image"))
    imgReqs.push(`${r.status()}  ${u}`);
});

await p.goto(URL, { waitUntil: "networkidle" });
await p.getByText("TAP TO BEGIN").click();
await p.waitForTimeout(2500);

// Inspect the actual <img> the browser rendered for the panda
const imgs = await p.locator("img").evaluateAll((els) =>
  els.map((e) => ({
    src: e.getAttribute("src"),
    currentSrc: e.currentSrc,
    natW: e.naturalWidth,
    complete: e.complete,
    cls: e.className,
  }))
);

console.log("=== <img> elements after entering scene 1 ===");
console.log(JSON.stringify(imgs, null, 2));
console.log("\n=== image responses ===");
console.log(imgReqs.join("\n") || "(none)");
console.log("\n=== failed requests ===");
console.log(failed.join("\n") || "(none)");

await b.close();
