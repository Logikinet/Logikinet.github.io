/**
 * Minimal Preline loader for AquaLeap.
 * Only initializes HSStaticMethods — no jQuery, charts, datepicker, or Dropzone.
 */
async function initPreline() {
  try {
    await import("preline");
    window.HSStaticMethods?.autoInit();
  } catch (e) {
    console.warn("[preline] initialization skipped:", e);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPreline);
} else {
  initPreline();
}

document.addEventListener("astro:page-load", initPreline);
