function create(tag, attr) {
  var elem = document.createElement(tag);

  for (var k in attr) {
    elem[k] = attr[k];
  }

  return elem;
}

document.head.appendChild(create("link", {
  rel: "stylesheet",
  //href: "https://js.arcgis.com/4.3/esri/css/main.css"
  href: "../../../../arcgis-js-api-4/esri/css/main.css"
}));

document.head.appendChild(create("link", {
  rel: "stylesheet",
  href: "./support/style.css"
}));

document.head.appendChild(create("script", {
  // src: "https://js.arcgis.com/4.3/"
  src: "../../../../arcgis-js-api-4/dojo/dojo.js"
}));

window.log = function() {
  var message = Array.prototype.join.call(arguments, " ");
  var viewLog = document.getElementById("viewLog");
  viewLog.textContent = message;
};

(function(modules) {
  modules.push("esri/Map", "esri/views/SceneView", "esri/views/MapView", "esri/views/3d/externalRenderers", "dojo/_base/lang", "dojo/domReady!");

  var settings = window.settings || {};

  window.addEventListener("load", function() {
    require(modules, function(Map, SceneView, MapView, externalRenderers, lang) {
      if (!settings.disableViewDiv) {
        var viewDiv = create("div", {
          id: "viewDiv"
        });

        if (!settings.disableLog)
        viewDiv.appendChild(create("div", {
          id: "viewLog"
        }));

        if (!settings.disableOverviewMap) {
          viewDiv.appendChild(create("div", {
            id: "overviewDiv"
          }));
        }

        document.body.appendChild(viewDiv);
      }

      for (var i = 0; i < modules.length; i++) {
        var names = modules[i].split("/");
        var name = names[names.length - 1];

        lang.setObject(names.join("."), arguments[i], window);

        if (window[name] === undefined) {
          window[name] = arguments[i];
        }
      }

      window.snippet(Array.prototype.slice.apply(arguments));

      var fullscreen = document.createElement("div");
      fullscreen.classList.add("esri-button", "esri-widget-button", "esri-interactive");

      var span = document.createElement("span");
      span.classList.add("esri-icon", "esri-icon-zoom-out-fixed");

      fullscreen.appendChild(span);
      window.view.ui.add(fullscreen, "top-left");

      fullscreen.addEventListener("click", function() {
        parent.postMessage({ type: "fullscreen" }, "*");
      });

      if (!settings.disableOverviewMap) {
        var mapView = new MapView({
          map: new Map({
            basemap: "streets"
          }),

          container: "overviewDiv",

          ui: {
            components: []
          }
        });

        mapView.then(function() {
          mapView.constraints.snapToZoom = false;
        });

        window.view.watch("extent", function(extent) {
          mapView.extent = extent;
        });
      }
    });
  });
})((window.modules || []).slice());

window.addEventListener("message", function(m) {
  if (m.data && m.data.play) {
    window.play();
  }
}, false);
