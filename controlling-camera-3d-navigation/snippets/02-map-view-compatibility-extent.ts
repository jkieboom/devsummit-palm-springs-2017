import esri = __esri;

// esri
import Map = require("esri/Map");
import Graphic = require("esri/Graphic");

// esri.geometry
import Point = require("esri/geometry/Point");

// esri.layers
import SceneLayer = require("esri/layers/SceneLayer");

// esri.symbols
import PolygonSymbol3D = require("esri/symbols/PolygonSymbol3D");
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
      ground: "world-elevation",

      layers: [
        new SceneLayer({
          portalItem: {
            id: "fad90a1b2f5243f99c2d49aa6719bfd7"
          }
        })
      ] as any
    }),

    qualityProfile: "high",

    environment: {
      lighting: {
        directShadowsEnabled: true,
        ambientOcclusionEnabled: true,
        date: new Date("Thu Mar 16 2017 00:00:00 GMT+0100 (CET)")
      }
    },

    camera: {
      position: [-117.172, 32.708, 139.53],
      heading: 68.92,
      tilt: 79.27
    },

    ui: {
      components: ["compass", "attribution"]
    } as any
  });

  const overview = createOverviewMap(view);

  createFullscreen(view);

  const layer = view.map.layers.getItemAt(0);

  layer.then(() => {
    const graphic = new Graphic({
      geometry: layer.fullExtent.clone(),
      symbol: new PolygonSymbol3D({
        symbolLayers: [
          new FillSymbol3DLayer({
            material: {
              color: "rgba(0, 255, 0, 0.3)",
            },

            outline: {
              color: "white",
              size: 3
            },

            elevationInfo: {
              mode: "on-the-ground"
            }
          } as any)
        ] as any
      })
    });

    view.graphics.add(graphic);
  });

  window["view"] = view;
}

export function play(argument?: string) {
  view.extent = view.map.layers.getItemAt(0).fullExtent;
}
