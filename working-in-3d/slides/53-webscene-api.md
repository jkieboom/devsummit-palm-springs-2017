# [`WebScene`](https://developers.arcgis.com/javascript/latest/api-reference/esri-WebScene.html) &mdash; API

<br/>

- Supported by [`SceneView`](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html)
- Loadable from [`Portal`](https://developers.arcgis.com/javascript/latest/api-reference/esri-portal-Portal.html)

<div class="code-snippet">
<pre><code class="lang-ts">class WebScene extends Map {
  presentation: {
    slides: Collection&lt;Slide&gt;;
  };

  initialViewProperties: {
    viewpoint: Viewpoint;
    environment: Environment;
    spatialReference: SpatialReference;
    viewingMode: "global" | "local";
  };

  portalItem: PortalItem;

  clippingArea: Extent;
  clippingEnabled: boolean;
}</code></pre>
</div>
