// @ts-expect-error — Mermaid is loaded as an ESM URL import; no local types.
import mermaid from "https://unpkg.com/mermaid@11.6.0/dist/mermaid.esm.min.mjs";

type PanZoomOptions = {
  minZoom?: number;
  maxZoom?: number;
  controlIconsEnabled?: boolean;
};

function getThemeVariables(container: HTMLElement) {
  const style = getComputedStyle(container);
  const v = (name: string) => style.getPropertyValue(name).trim();

  const brand = v("--color-brand");
  const text = v("--color-text");
  const textMuted = v("--color-text-muted");
  const textStrong = v("--color-text-strong");
  const textOnBrand = v("--color-text-on-brand");
  const bg = v("--color-bg");
  const bgSurface = v("--color-bg-surface");
  const bgMuted = v("--color-bg-muted");
  const border = v("--color-border");
  const borderStrong = v("--color-border-strong");

  return {
    primaryColor: bgSurface,
    primaryTextColor: textStrong,
    primaryBorderColor: borderStrong,
    secondaryColor: bgMuted,
    tertiaryColor: bg,
    background: bg,
    mainBkg: bgSurface,
    textColor: text,
    lineColor: textMuted,
    nodeBorder: border,
    clusterBkg: bg,
    clusterBorder: border,
    actorBkg: bgSurface,
    actorBorder: border,
    actorTextColor: text,
    actorLineColor: textMuted,
    signalColor: text,
    signalTextColor: text,
    noteBkgColor: bgSurface,
    noteBorderColor: border,
    noteTextColor: text,
    activationBkgColor: bgMuted,
    activationBorderColor: border,
    labelBoxBkgColor: bgSurface,
    labelBoxBorderColor: border,
    labelTextColor: text,
    edgeLabelBackground: bg,
    titleColor: textStrong,
    classText: text,
    fillType0: brand,
    fillType1: textOnBrand,
  };
}

function preserveSources(root: ParentNode) {
  root.querySelectorAll<HTMLElement>("pre.mermaid").forEach((el) => {
    if (!el.getAttribute("data-mermaid-source")) {
      el.setAttribute("data-mermaid-source", el.textContent ?? "");
    }
  });
}

function restoreSources(root: ParentNode) {
  root.querySelectorAll<HTMLElement>("pre.mermaid").forEach((el) => {
    const source = el.getAttribute("data-mermaid-source");

    if (source) {
      el.textContent = source;
      el.removeAttribute("data-processed");
    }
  });
}

const isMac =
  typeof navigator !== "undefined" && /mac/i.test(navigator.userAgent);
const SCROLL_MSG = isMac ? "Use ⌘ + scroll to zoom" : "Use Ctrl + scroll to zoom";
const TOUCH_MSG = "Use two fingers to move the diagram";
const OVERLAY_TIMEOUT = 1000;

interface GestureContainer extends HTMLElement {
  _gestureTimer?: ReturnType<typeof setTimeout>;
}

function showOverlay(container: GestureContainer, type: "scroll" | "touch") {
  let overlay = container.querySelector<HTMLDivElement>(".mermaid-gesture-overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "mermaid-gesture-overlay";
    container.appendChild(overlay);
  }
  overlay.textContent = type === "scroll" ? SCROLL_MSG : TOUCH_MSG;
  overlay.classList.add("active");

  clearTimeout(container._gestureTimer);
  container._gestureTimer = setTimeout(() => {
    overlay?.classList.remove("active");
  }, OVERLAY_TIMEOUT);
}

function hideOverlay(container: GestureContainer) {
  const overlay = container.querySelector<HTMLDivElement>(".mermaid-gesture-overlay");

  if (overlay) overlay.classList.remove("active");
  clearTimeout(container._gestureTimer);
}

function getTouchDistance(touches: TouchList) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;

  return Math.sqrt(dx * dx + dy * dy);
}

function getTouchCenter(touches: TouchList) {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
}

class SvgPanZoom {
  private _svg: SVGSVGElement;
  private _container: GestureContainer;
  private _minZoom: number;
  private _maxZoom: number;
  private _abortController: AbortController;
  private _vbX: number;
  private _vbY: number;
  private _vbWidth: number;
  private _vbHeight: number;
  private _wrapper: SVGGElement;
  private _scale = 1;
  private _tx = 0;
  private _ty = 0;
  private _controlsEl?: HTMLDivElement;

  constructor(
    svg: SVGSVGElement,
    { minZoom = 0.5, maxZoom = 10, controlIconsEnabled = true }: PanZoomOptions = {}
  ) {
    this._svg = svg;
    this._container = svg.closest("pre.mermaid") as GestureContainer;
    this._minZoom = minZoom;
    this._maxZoom = maxZoom;
    this._abortController = new AbortController();

    const vb = svg.getAttribute("viewBox") || "0 0 100 100";
    const parts = vb.split(/[\s,]+/).map(Number);

    [this._vbX, this._vbY, this._vbWidth, this._vbHeight] = parts as [
      number,
      number,
      number,
      number,
    ];

    this._wrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this._wrapper.setAttribute("data-pan-zoom-wrapper", "");
    const children = Array.from(svg.childNodes);

    for (const child of children) {
      const tag = child.nodeName?.toLowerCase();

      if (tag === "defs" || tag === "style") continue;
      this._wrapper.appendChild(child);
    }
    svg.appendChild(this._wrapper);

    this._fitAndCenter();
    if (controlIconsEnabled) this._createControls();
    this._setupGestures();
  }

  private _fitAndCenter() {
    const svgRect = this._svg.getBoundingClientRect();
    const containerW = svgRect.width || this._container.clientWidth;
    const containerH = svgRect.height || this._container.clientHeight;

    this._svg.setAttribute("viewBox", `0 0 ${containerW} ${containerH}`);

    const scaleX = containerW / this._vbWidth;
    const scaleY = containerH / this._vbHeight;

    this._scale = Math.min(scaleX, scaleY);

    this._tx = (containerW - this._vbWidth * this._scale) / 2 - this._vbX * this._scale;
    this._ty = (containerH - this._vbHeight * this._scale) / 2 - this._vbY * this._scale;

    this._applyTransform();
  }

  private _applyTransform() {
    const s = this._scale;

    this._wrapper.setAttribute(
      "transform",
      `matrix(${s},0,0,${s},${this._tx},${this._ty})`
    );
  }

  private _clampZoom(scale: number) {
    return Math.min(this._maxZoom, Math.max(this._minZoom, scale));
  }

  panBy({ x, y }: { x: number; y: number }) {
    this._tx += x;
    this._ty += y;
    this._applyTransform();
  }

  zoomBy(factor: number) {
    const svgRect = this._svg.getBoundingClientRect();

    this.zoomAtPoint(factor, { x: svgRect.width / 2, y: svgRect.height / 2 });
  }

  zoomAtPoint(factor: number, { x, y }: { x: number; y: number }) {
    const oldScale = this._scale;
    const newScale = this._clampZoom(oldScale * factor);

    if (newScale === oldScale) return;

    const ratio = newScale / oldScale;

    this._tx = x * (1 - ratio) + this._tx * ratio;
    this._ty = y * (1 - ratio) + this._ty * ratio;
    this._scale = newScale;
    this._applyTransform();
  }

  fit() {
    this._fitAndCenter();
  }

  private _createControls() {
    const controls = document.createElement("div");

    controls.className = "mermaid-pan-zoom-controls";
    this._controlsEl = controls;

    const makeBtn = (label: string, title: string, onClick: () => void) => {
      const btn = document.createElement("button");

      btn.type = "button";
      btn.textContent = label;
      btn.title = title;
      btn.setAttribute("aria-label", title);
      btn.addEventListener("click", onClick);
      return btn;
    };

    controls.appendChild(makeBtn("+", "Zoom in", () => this.zoomBy(1.2)));
    controls.appendChild(makeBtn("−", "Zoom out", () => this.zoomBy(0.8)));
    controls.appendChild(makeBtn("↺", "Fit to view", () => this.fit()));
    this._container.appendChild(controls);
  }

  private _setupGestures() {
    const sig = { signal: this._abortController.signal };
    const container = this._container;

    container.addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const factor = e.deltaY > 0 ? 0.9 : 1.1;
          const rect = this._svg.getBoundingClientRect();

          this.zoomAtPoint(factor, { x: e.clientX - rect.left, y: e.clientY - rect.top });
          hideOverlay(container);
        } else {
          showOverlay(container, "scroll");
        }
      },
      { ...sig, passive: false }
    );

    let dragging = false;
    let lastMouse: { x: number; y: number } | null = null;

    container.addEventListener(
      "mousedown",
      (e) => {
        if (e.button !== 0) return;
        dragging = true;
        lastMouse = { x: e.clientX, y: e.clientY };
        container.style.cursor = "grabbing";
        e.preventDefault();
      },
      sig
    );

    window.addEventListener(
      "mousemove",
      (e) => {
        if (!dragging || !lastMouse) return;
        this.panBy({ x: e.clientX - lastMouse.x, y: e.clientY - lastMouse.y });
        lastMouse = { x: e.clientX, y: e.clientY };
      },
      sig
    );

    window.addEventListener(
      "mouseup",
      () => {
        if (dragging) {
          dragging = false;
          lastMouse = null;
          container.style.cursor = "grab";
        }
      },
      sig
    );

    container.style.cursor = "grab";

    let pinchDistance: number | null = null;
    let lastTouchCenter: { x: number; y: number } | null = null;

    container.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length >= 2) {
          pinchDistance = getTouchDistance(e.touches);
          lastTouchCenter = getTouchCenter(e.touches);
          hideOverlay(container);
        } else {
          pinchDistance = null;
          lastTouchCenter = null;
        }
      },
      { ...sig, passive: true }
    );

    container.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length >= 2) {
          e.preventDefault();
          hideOverlay(container);

          const currentDistance = getTouchDistance(e.touches);
          const center = getTouchCenter(e.touches);

          if (pinchDistance !== null) {
            const factor = currentDistance / pinchDistance;
            const rect = this._svg.getBoundingClientRect();

            this.zoomAtPoint(factor, {
              x: center.x - rect.left,
              y: center.y - rect.top,
            });
          }
          pinchDistance = currentDistance;

          if (lastTouchCenter !== null) {
            this.panBy({
              x: center.x - lastTouchCenter.x,
              y: center.y - lastTouchCenter.y,
            });
          }
          lastTouchCenter = center;
        } else {
          showOverlay(container, "touch");
          pinchDistance = null;
          lastTouchCenter = null;
        }
      },
      { ...sig, passive: false }
    );

    container.addEventListener(
      "touchend",
      (e) => {
        if (e.touches.length < 2) {
          pinchDistance = null;
          lastTouchCenter = null;
        }
        hideOverlay(container);
      },
      { ...sig, passive: true }
    );
  }

  destroy() {
    this._abortController.abort();
    this._controlsEl?.remove();
    this._svg.setAttribute(
      "viewBox",
      `${this._vbX} ${this._vbY} ${this._vbWidth} ${this._vbHeight}`
    );
    while (this._wrapper.firstChild) {
      this._svg.appendChild(this._wrapper.firstChild);
    }
    this._wrapper.remove();
  }
}

const panZoomInstances = new WeakMap<HTMLElement, SvgPanZoom>();

function initPanZoom(root: ParentNode) {
  root.querySelectorAll<SVGSVGElement>("pre.mermaid svg").forEach((svg) => {
    if (svg.classList.contains("pan-zoom-enabled")) return;

    const container = svg.closest("pre.mermaid") as HTMLElement | null;

    if (!container) return;

    const viewBox = svg.getAttribute("viewBox");

    if (!viewBox) return;

    const parts = viewBox.split(/[\s,]+/).map(Number);
    const vbWidth = parts[2];
    const vbHeight = parts[3];

    const containerWidth = container.clientWidth;
    const naturalHeight = (containerWidth / vbWidth) * vbHeight;
    const height = Math.max(Math.min(naturalHeight, 800), 400);

    container.style.height = `${height}px`;

    svg.removeAttribute("style");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.classList.add("pan-zoom-enabled");

    const previous = panZoomInstances.get(container);

    if (previous) previous.destroy();

    const instance = new SvgPanZoom(svg, {
      minZoom: 0.5,
      maxZoom: 10,
      controlIconsEnabled: true,
    });

    panZoomInstances.set(container, instance);
  });
}

async function renderMermaid(root: ParentNode) {
  const diagrams = root.querySelectorAll<HTMLElement>("pre.mermaid");

  if (!diagrams.length) return;

  // Pick theme variables from the first diagram's container so color-group ancestors apply.
  const themeVariables = getThemeVariables(diagrams[0]);

  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables,
  });

  await mermaid.run({ querySelector: "pre.mermaid" });
  initPanZoom(root);
}

let themeObserver: MutationObserver | null = null;

export async function setupMermaid(root: ParentNode = document) {
  preserveSources(root);
  await renderMermaid(root);

  if (themeObserver || typeof document === "undefined") return;

  themeObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.attributeName === "class") {
        restoreSources(document);
        renderMermaid(document);
        break;
      }
    }
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}
