// Variables used by Scriptable.
// These must be at the very top of the file.
const DEFAULT_SHIFT = "16:20";

function parseShift(value) {
  const text = String(value || DEFAULT_SHIFT).trim();
  const match = text.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return 16 * 60 + 20;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return 16 * 60 + 20;
  return hour * 60 + minute;
}

function format(minutes) {
  const value = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
}

function bioMinutes(shiftStart) {
  // Beijing wall-clock time, independent of the iPhone timezone.
  const beijing = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const actual = beijing.getUTCHours() * 60 + beijing.getUTCMinutes();
  return actual + 8 * 60 - shiftStart;
}

function clockFont(size) {
  try {
    const font = Font.name("HelveticaNeue-CondensedBold", size);
    if (font) return font;
  } catch (error) {}
  return Font.boldSystemFont(size * 0.88);
}

function drawClock(size, time) {
  const ctx = new DrawContext();
  ctx.size = new Size(size.width, size.height);
  ctx.opaque = true;
  ctx.respectScreenScale = true;

  const paper = new Color("#F2ECE2");
  const ink = new Color("#1F1C18");

  ctx.setFillColor(paper);
  ctx.fillRect(new Rect(0, 0, size.width, size.height));

  const fontSize = size.width < 200 ? 62 : size.width > 300 && size.height > 300 ? 132 : 88;
  ctx.setFont(clockFont(fontSize));
  ctx.setTextColor(ink);
  ctx.setTextAlignedCenter();
  const textHeight = fontSize * 1.25;
  ctx.drawTextInRect(time, new Rect(0, (size.height - textHeight) / 2, size.width, textHeight));

  return ctx.getImage();
}

const shiftStart = parseShift(args.widgetParameter);
const family = config.widgetFamily || "small";
const size = family === "small"
  ? { width: 155, height: 155 }
  : family === "large"
    ? { width: 329, height: 345 }
    : { width: 329, height: 155 };

const widget = new ListWidget();
widget.setPadding(0, 0, 0, 0);
widget.backgroundImage = drawClock(size, format(bioMinutes(shiftStart)));
widget.url = "https://bio-clock.pages.dev/";
widget.refreshAfterDate = new Date(Date.now() + 60 * 1000);

Script.setWidget(widget);
if (!config.runsInWidget) {
  widget.presentMedium();
}
Script.complete();
