// Variables used by Scriptable.
// These must be at the very top of the file.
// They control the widget preview in the app.
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
  // Use Beijing wall-clock time regardless of the iPhone timezone.
  const beijing = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const actual = beijing.getUTCHours() * 60 + beijing.getUTCMinutes();
  return actual + 8 * 60 - shiftStart;
}

function serif(size) {
  try {
    const font = Font.name("New York", size);
    if (font) return font;
  } catch (error) {}
  return Font.systemFont(size);
}

const shiftStart = parseShift(args.widgetParameter);
const family = config.widgetFamily || "medium";
const small = family === "small";
const large = family === "large";
const timeSize = small ? 38 : large ? 96 : 62;

const widget = new ListWidget();
widget.backgroundColor = new Color("#F2ECE2");
widget.setPadding(14, 14, 14, 14);
widget.url = "https://bio-clock.pages.dev/";
widget.refreshAfterDate = new Date(Date.now() + 60 * 1000);

widget.addSpacer();

const label = widget.addText("生物时间");
label.font = Font.mediumSystemFont(small ? 9 : 11);
label.textColor = new Color("#6F6559");
label.centerAlignText();

widget.addSpacer(small ? 3 : 6);

const time = widget.addText(format(bioMinutes(shiftStart)));
time.font = serif(timeSize);
time.textColor = new Color("#1F1C18");
time.centerAlignText();

widget.addSpacer(small ? 3 : 6);

const dot = widget.addText("•");
dot.font = Font.systemFont(small ? 9 : 11);
dot.textColor = new Color("#B65D3D");
dot.centerAlignText();

widget.addSpacer();

Script.setWidget(widget);
if (!config.runsInWidget) {
  await widget.presentMedium();
}
Script.complete();
