## Working with the [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html) &mdash; [`toMap`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#toMap)/[`toScreen`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#toScreen)/[`hitTest`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#hitTest)

<div class="two-columns">
  <div class="left-column">

<div class="code-snippet">
<button class="play" id="scene-view-to-map-to-screen-button01"></button>
<pre><code class="lang-js">view = new SceneView({
  map: new Map({
    basemap: "satellite"
  })
});

for (var x = 1; x <= 2; x++) {
  for (var y = 1; y <= 2; y++) {
    var px = x &lowast; (view.width / 3);
    var py = y &lowast; (view.height / 3);

    view.graphics.add(new Graphic({
      geometry: view.toMap(px, py),
      symbol: symbol,
      attributes: { x: x, y: y }
    }));
  }
}</code></pre>
</div>

<div class="code-snippet">
<pre><code class="lang-js">view.on("pointer-move", event => {
  view.hitTest({ x: event.x, y: event.y })
    .then(result => {
      var graphic = result.results[0] &&
          result.results[0].graphic;

      var attrs = graphic && graphic.attributes;

      if (attrs) {
        logDiv.textContent = \`${attrs.x}/${attrs.y}\`;
      }
    });
});</code></pre>
</div>

  </div>
  <div class="right-column">
    <iframe id="demo-time-date" data-src="../examples/to-map-to-screen-demo.html" ></iframe>
  </div>
</div>


