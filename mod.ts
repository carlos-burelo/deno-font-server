import { App } from "https://deno.land/x/tinyhttp@0.1.24/app.ts";

const app = new App();

app.get("/", (req, res) => {
  const { f: family, v } = req.query;
  const variants = typeof v === "string" ? v.split(",") : [];
  const fontCss = generateCss(family.toString(), variants);
  res.set({
    "Cache-Control": "max-age=1200, public",
    "Content-Type": "text/css",
  });
  res.send(fontCss);
});

interface Font {
  path: string;
  weight: string;
  style: string;
}

export const generateCss = (fontName: string, variants: string[]): string => {
  const fonts = [] as Font[];
  for (const variant of variants) {
    const variantNum = variant.split(".")[0];
    const variantStyle = variant.split(".")[1] || "normal";
    const fontFile = `./static/${fontName}/${variant}.woff2`;
    if (Deno.statSync(fontFile).isFile) {
      fonts.push({ path: fontFile, weight: variantNum, style: variantStyle });
    }
  }
  return `${fonts
    .map(
      ({ path, weight, style }) =>
        `@font-face {\n` +
        ` font-family: '${fontName}';\n` +
        ` font-style: ${style};\n` +
        ` font-weight: ${weight};\n` +
        ` font-display: swap;\n` +
        ` src: url('${path}') format('woff2');\n` +
        `}`
    )
    .join("\n")}`;
};

export default app;

app.listen(8000, () => console.log(`Started on port:8000`));
