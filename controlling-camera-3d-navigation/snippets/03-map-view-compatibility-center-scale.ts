import esri = __esri;

// esri
import Map = require("esri/Map");
import Graphic = require("esri/Graphic");

// esri.geometry
import Point = require("esri/geometry/Point");

// esri.layers
import FeatureLayer = require("esri/layers/FeatureLayer");

// esri.symbols
import PointSymbol3D = require("esri/symbols/PointSymbol3D");
import IconSymbol3DLayer = require("esri/symbols/IconSymbol3DLayer");
import FillSymbol3DLayer = require("esri/symbols/FillSymbol3DLayer");

// esri.views
import SceneView = require("esri/views/SceneView");

import * as log from "./support/log";
import { createOverviewMap, createFullscreen } from "./support/widgets";

let view: SceneView;

export function initialize() {
  view = new SceneView({
    container: "viewDiv",

    map: new Map({
      basemap: "hybrid",
      ground: "world-elevation"
    }),

    qualityProfile: "high",

    environment: {
      atmosphere: {
        quality: "high"
      },

      lighting: {
        directShadowsEnabled: true,
        ambientOcclusionEnabled: true,
        date: new Date("Wed Mar 15 2017 12:00:00 GMT+0100 (CET)")
      }
    },

    camera: {
      position: [7.755, 46.388, 4609.08],
      heading: 11.06,
      tilt: 79.11
    },

    ui: {
      components: ["compass", "attribution"]
    } as any
  });

  const overview = createOverviewMap(view);

  createFullscreen(view);

  function padLeft(s: string, n: number) {
    if (s.length < n) {
      return new Array(n - s.length + 1).join(" ") + s;
    }
    else {
      return s;
    }
  }

  const centerSymbol = new PointSymbol3D({
    symbolLayers: [
      new IconSymbol3DLayer({
        resource: {
          primitive: "circle"
        },

        material: {
          color: "red"
        },

        outline: {
          color: "white",
          size: 2
        },

        size: 22
      } as any),

      new IconSymbol3DLayer({
        resource: {
          primitive: "x"
        },

        outline: {
          color: "white",
          size: 3
        },

        size: 6
      } as any)
    ] as any
  });

  const featureCollection = new FeatureLayer({
    source: [] as any,
    geometryType: "points",
    fields: [],
    objectIdField: "OBJECTID",
    elevationInfo: {
      mode: "on-the-ground"
    }
  });

  view.map.add(featureCollection);

  let centerGraphic: Graphic;

  view.watch("camera", (camera: esri.Camera) => {
    const center = view.center.clone() as Point;

    if (centerGraphic) {
      featureCollection.source.remove(centerGraphic);
    }

    centerGraphic = new Graphic({
      geometry: center,
      symbol: centerSymbol
    });

    featureCollection.source.add(centerGraphic);

    const scale = view.scale.toFixed(0).toString();
    log.message(`Scale: ${padLeft(scale, 8)}`);

    overview.view.rotation = 360 - camera.heading;
  });

  window["view"] = view;
}
