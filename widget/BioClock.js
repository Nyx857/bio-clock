// Variables used by Scriptable.
// These must be at the very top of the file.
const DEFAULT_SHIFT = "16:20";
const PAPER = "#F2ECE2";
const INK = "#1F1C18";
const SITE = "https://bio-clock.pages.dev/";

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
  return Font.boldSystemFont(size * 0.92);
}

const shiftStart = parseShift(args.widgetParameter);
const family = config.widgetFamily || "medium";
const fontSize = family === "small" ? 64 : family === "large" ? 128 : 88;

const widget = new ListWidget();
widget.backgroundColor = new Color(PAPER);
widget.setPadding(0, 0, 0, 0);
widget.url = SITE;

// Equal flexible spacers above and below centre the run vertically.
widget.addSpacer();

const row = widget.addStack();
row.layoutHorizontally();
row.addSpacer();

// The time is a native text run, so WidgetKit does the layout: it stays
// optically centred on every device and family, and the snapshot is cheap
// enough to redraw on each refresh (the old DrawContext raster was the slow
// part, and it carried its own baseline offset).
const label = row.addText(format(bioMinutes(shiftStart)));
label.font = clockFont(fontSize);
label.textColor = new Color(INK);
label.lineLimit = 1;
label.minimumScaleFactor = 0.5;
label.centerAlignText();

row.addSpacer();
widget.addSpacer();

// Ask for a reload just after the next minute ticks, so a granted update shows
// the current minute. iOS still applies its own refresh budget.
const nextMinute = (Math.floor(Date.now() / 60000) + 1) * 60000;
widget.refreshAfterDate = new Date(nextMinute + 500);

Script.setWidget(widget);
if (!config.runsInWidget) {
  if (family === "large") widget.presentLarge();
  else if (family === "small") widget.presentSmall();
  else widget.presentMedium();
}
Script.complete();
