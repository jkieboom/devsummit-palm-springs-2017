
<h2>Working with the SceneView</h2>

Start with a 2D map/view, replace **[`MapView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-MapView.html)** with [`SceneView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html)

<div class="two-columns">
  <div class="left-column">

<div class="code-snippet">
<pre><code class="lang-js">view = new MapView({
  container: "viewDiv",

  map: new Map({
    basemap: "streets",

    layers: [new FeatureLayer(
      "...USA_Census_Free_and_Clear_Housing/MapServer"
    )]
  })
});
</code></pre>
</div>

<div class="code-snippet">
<button class="play" id="scene-view-map-view-button01"></button>
<pre><code class="lang-js">view = new SceneView({
  container: "viewDiv",

  map: new Map({
    basemap: "streets",

    layers: [new FeatureLayer(
      "...USA_Census_Free_and_Clear_Housing/MapServer"
    )]
  })
});
</code></pre>
</div>


  </div>
  <div class="right-column">
    <iframe id="demo-time-date" data-src="../examples/scene-view-map-view.html" ></iframe>
  </div>
</div>


