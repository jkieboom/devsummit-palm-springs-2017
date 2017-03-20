# [`WebScene`](https://developers.arcgis.com/javascript/latest/api-reference/esri-WebScene.html) &mdash; Saving

<div class="two-columns">
  <div class="left-column">

<div class="code-snippet">
<button class="play" id="web-scene-saving-button01"></button>
<pre><code class="lang-ts">const scene = view.map;

const layer = scene.layers.find(layer => {
  return layer.title === "Sun Exposure at 10:45";
});

scene.remove(layer);
</code></pre>
</div>

<div class="code-snippet">
<button class="play" id="web-scene-saving-button02"></button>
<pre><code class="lang-ts">const scene = view.map;
const presentation = scene.presentation;

Slide.createFrom(view).then(slide => {
  slide.title = { text: "Created slide" };
  presentation.slides.insert(slide, 0);
});

</code></pre>
</div>

<div class="code-snippet">
<button class="play" id="web-scene-saving-button03"></button>
<pre><code class="lang-ts">scene.updateFrom(view)
  .then(() => {
    return scene.saveAs({
      title: scene.title + " Demo Copy",
      portal: portal
    });
  })
  .then(item => {
    const itemPageUrl = portal.url +
        "/home/item.html?id=" + item.id;

    window.open(itemPageUrl, "_blank");
  });
</code></pre>
</div>

  </div>
  <div class="right-column">
    <iframe id="demo-time-date" data-src="../examples/web-scene-save.html" ></iframe>
  </div>
</div>
