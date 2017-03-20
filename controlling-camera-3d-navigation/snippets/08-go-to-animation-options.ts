import esri = __esri;

// esri
import WebScene = require("esri/WebScene");

// esri.views
import SceneView = require("esri/views/SceneView");

import * as log from "./support/log";
import { createOverviewMap, createFullscreen, add as addWidget } from "./support/widgets";

let view: SceneView;

export function initialize() {
  createView();
  createSlides();
  createWidgets();
}

function createView() {
  view = new SceneView({
    container: "viewDiv",

    map: new WebScene({
      portalItem: {
        id: "089193cc66084c4bac18e65b899e1c03"
      }
    }),

    padding: {
      bottom: 160
    } as any,

    qualityProfile: "high",

    environment: {
      atmosphere: {
        quality: "high"
      },

      lighting: {
        directShadowsEnabled: true,
        ambientOcclusionEnabled: true
      }
    },

    ui: {
      components: ["compass", "attribution"]
    } as any
  });

  const overview = createOverviewMap(view);

  createFullscreen(view);

  window["view"] = view;
}

function customEasingBounce(t: number): number {
  return 1 - Math.abs(Math.sin(-1.7 + t * 4.5 * Math.PI)) * Math.pow(0.5, t * 10);
}

function createSlides() {
  const slidesDiv = document.createElement("div");
  slidesDiv.classList.add("slides");

  const scene = view.map as WebScene;

  scene.then(() => {
    for (const slide of scene.presentation.slides.toArray()) {
      const slideDiv = document.createElement("div");
      slideDiv.style.backgroundImage = `url("${slide.thumbnail.url}")`;

      slideDiv.textContent = slide.title.text;

      slideDiv.addEventListener("click", () => {
        let easing: any;

        const select = document.getElementById("easingSelect") as HTMLSelectElement;
        easing = (select.options[select.selectedIndex] as HTMLOptionElement).value;

        if (easing === "custom") {
          easing = customEasingBounce;
        }

        const speedFactor = parseFloat((document.getElementById("speedFactorRange") as HTMLInputElement).value);

        slide.applyTo(view, {
          easing,
          speedFactor
        });
      });

      slidesDiv.appendChild(slideDiv);
    }
  });

  (view.container as any).appendChild(slidesDiv);
}

function createWidgets() {
  view.ui.add(addWidget(view, `
    <div>Speed factor: <input id="speedFactorRange" type="range" min="0.1" max="10" step="0.1" value="1"/></div>
  `), "top-left");

  view.ui.add(addWidget(view, `
    <div>
      Easing:
      <select id="easingSelect">
        <option value="in-cubic">In (in-cubic)</option>
        <option value="out-cubic">Out (out-cubic)</option>
        <option value="in-out-cubic" selected>In/out (in-out-cubic)</option>
        <option value="out-expo">Exponential out (out-expo)</option>
        <option value="custom">Custom</option>
      </select>
    </div>
  `), "top-left");
}
