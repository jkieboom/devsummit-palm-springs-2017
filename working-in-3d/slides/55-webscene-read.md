# [`WebScene`](https://developers.arcgis.com/javascript/latest/api-reference/esri-WebScene.html) &mdash; Reading

<div class="two-columns">
  <div class="left-column">

<div class="code-snippet">
<!--<button class="play" id="web-scene-reading-button01"></button>-->
<pre><code class="lang-ts">view = new SceneView({
  container: "viewDiv",

  map: new WebScene({
    portalItem: {
      id: "3a9976baef9240ab8645ee25c7e9c096"
    }
  })
});

var layerList = new LayerList({
  view: view,
  container: document.createElement("div")
});

var layerListExpand = new Expand({
  view: view,
  content: layerList.domNode,
  expandIconClass: "esri-icon-visible",
  expanded: true
});

view.ui.add(layerListExpand, "top-right");</code></pre>
</div>
<div class="code-snippet">
<!--<button class="play" id="web-scene-reading-button01"></button>-->
<pre><code class="lang-ts">view = new SceneView({
slideDiv.addEventListener("click", () => {
  slide.applyTo(view);
});</code></pre>
</div>


  </div>
  <div class="right-column">
    <iframe id="demo-time-date" data-src="../examples/web-scene-reading.html" ></iframe>
  </div>
</div>
