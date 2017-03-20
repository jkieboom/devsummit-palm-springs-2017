<!-- .slide: data-background="images/title.png" -->

# Controlling the Camera & 3D Navigation in your ArcGIS API for JavaScript app

<br>

Jesse van den Kieboom, ESRI R&amp;D Center Zürich

---

## Important Notice

These slides contain dynamic code snippets that can be viewed online. See 
https://jkieboom.github.io/devsummit-palm-springs-2017/controlling-camera-3d-navigation.

---

## [`esri/Camera`](https://developers.arcgis.com/javascript/beta/api-reference/esri-Camera.html)

Primary specification of the view is the [`Camera`](https://developers.arcgis.com/javascript/beta/api-reference/esri-Camera.html)

```ts
class Camera {
  // The position of the camera "eye" in 3D space (`x`, `y`, `z` and `spatialReference`)
  position: Point;

  // The heading angle (towards north in degrees, [0, 360]°)
  heading: number;

  // The tilt angle ([0, 180]°, with 0° straight down, 90° horizontal)
  tilt: number;
}
```

---

## [`esri/Camera`](https://developers.arcgis.com/javascript/beta/api-reference/esri-Camera.html)

[`SceneView.camera`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#camera) is a **value** object

<div class="twos">
  <div class="snippets">
    <div class="snippet">
      <pre><code class="lang-ts hljs typescript">const camera = view.camera.clone();

// Increment the heading of the camera
// by 10 degrees
camera.heading += 10;

// Set the modified camera on the view
view.camera = camera;</code></pre>
      <svg data-play-frame="frame-simple-camera-increment" data-play-argument="heading" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
    </div>
    <div class="snippet">
      <pre><code class="lang-ts hljs typescript">const camera = view.camera.clone();
camera.tilt -= 5;
view.camera = camera;</code></pre>
      <svg data-play-frame="frame-simple-camera-increment" data-play-argument="tilt" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
    </div>
    <div class="snippet">
      <pre><code class="lang-ts hljs typescript">const camera = view.camera.clone();
camera.position.z += 100;
view.camera = camera;</code></pre>
      <svg data-play-frame="frame-simple-camera-increment" data-play-argument="z" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
    </div>
  </div>

  <div class="snippet-preview">
    <iframe id="frame-simple-camera-increment" data-src="./snippets/snippet.html?01-simple-camera-increment"></iframe>
  </div>
</div>

---

## Compatibility with [`MapView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-MapView.html)

Best effort support for [`extent`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#extent).

<div class="twos">
  <div class="snippets">
    <div class="snippet">
      <pre><code class="lang-ts hljs typescript">const layers = view.map.layers;
const sceneLayer = layers.getItemAt(0);

view.extent = sceneLayer.fullExtent;</code></pre>
      <svg data-play-frame="frame-map-view-compatibility-extent" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
    </div>
  </div>

  <div class="snippet-preview">
    <iframe id="frame-map-view-compatibility-extent" data-src="./snippets/snippet.html?02-map-view-compatibility-extent&console=no"></iframe>
  </div>
</div>

---

## Compatibility with [`MapView`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-MapView.html)

Best effort support for [`center`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#center) and [`scale`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#scale).

<div class="snippet-preview">
  <iframe id="frame-map-view-compatibility-center-scale" data-src="./snippets/snippet.html?03-map-view-compatibility-center-scale"></iframe>
</div>

---

## [`SceneView.goTo`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#goTo)

- Camera control work horse: `goTo(target[, options]): Promise`
- A number of diffent targets are supported: `[lon, lat]`, `Camera`, `Geometry`, `Geometry[]`, `Graphic`, `Graphic[]`
- Besides target, allows specifying desired `scale`, `center`, `position` (camera), `heading` and `tilt`
- Animates! (by default)

---

## [`SceneView.goTo`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#goTo) &mdash; `heading`/`tilt`

<div class="twos">
  <div class="snippets">
    <div class="snippet">
      <pre><code class="lang-ts hljs typescript">const currentHeading = view.camera.heading;

// Set the heading of the view to
// the closest multiple of 30 degrees
const heading = Math.floor((currentHeading + 1) / 30)
    \* 30 + 30;

// go to heading preserves view.center
view.goTo({
  heading
}); </code></pre>
      <svg data-play-frame="frame-go-to-heading-tilt" class="play-code" data-play-argument="heading" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
    </div>
    <div class="snippet">
      <pre><code class="lang-ts hljs typescript">const currentTilt = view.camera.tilt;

// Cycle tilt of the view in 15 degree increments
const tilt = (Math.floor((currentTilt + 1) / 15)
    \* 15 + 15) % 90;

// go to tilt preserves view.center
view.goTo({
  tilt
});</code></pre>
      <svg data-play-frame="frame-go-to-heading-tilt" class="play-code" data-play-argument="tilt" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
    </div>
  </div>

  <div class="snippet-preview">
    <iframe id="frame-go-to-heading-tilt" data-src="./snippets/snippet.html?04-go-to-heading-tilt"></iframe>
  </div>
</div>

---

## [`SceneView.goTo`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#goTo) &mdash; Continuous updates

<div class="twos">
  <div class="snippets">
    <div class="snippet">
      <pre><code class="lang-ts hljs typescript">function animateLookAroundStep() {
  view.goTo({
    position: animationPosition,
    heading: view.camera.heading - 0.1
  }, { animate: false });
}

function animateRotateAroundStep() {
  view.goTo({
    center: animationCenter,
    scale: animationScale,
    heading: view.camera.heading + 0.1
  }, { animate: false });
}

function startAnimation() {
  // Store scale, center and position to
  // animate around
  animationScale = view.scale;
  animationCenter = view.center.clone();
  animationPosition = view.camera
      .position.clone();

  animate();
}</code></pre>
      <svg data-play-frame="frame-go-to-heading-continuous" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
    </div>
  </div>

  <div class="snippet-preview">
    <iframe id="frame-go-to-heading-continuous" data-src="./snippets/snippet.html?05-go-to-heading-continuous"></iframe>
  </div>
</div>

---

## [`SceneView.goTo`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#goTo) &mdash; Graphics, query

<div class="twos">
  <div class="snippet">
    <pre><code class="lang-ts hljs typescript">const query = new Query({
  definitionExpression: "ELEVATION > 90",
  returnGeometry: false,
  geometry: view.extent.clone(),
  outFields: [layer.objectIdField]
});

// Query features from the service
layer.queryFeatures(query)
    .then((featureSet: FeatureSet) => {
      // Get all the feature object ids
      const objectIds = featureSet.features.map(
        feature => feature.attributes[layer.objectIdField]
      );

      // Query the graphics from the layer view
      const query = new Query({ objectIds });
      return layerView.queryFeatures(query);
    })
    .then((graphics: Graphic[]) => {
      // Finally, frame the graphics using goTo
      view.goTo(graphics, { speedFactor: 0.2 });
    });</code></pre>
 <svg data-play-frame="frame-go-to-graphics" class="play-code" viewBox="0 0 24 24"><path fill="#999" d="M12,20.14C7.59,20.14 4,16.55 4,12.14C4,7.73 7.59,4.14 12,4.14C16.41,4.14 20,7.73 20,12.14C20,16.55 16.41,20.14 12,20.14M12,2.14A10,10 0 0,0 2,12.14A10,10 0 0,0 12,22.14A10,10 0 0,0 22,12.14C22,6.61 17.5,2.14 12,2.14M10,16.64L16,12.14L10,7.64V16.64Z" /></svg>
  </div>

  <div class="snippet-preview">
    <iframe id="frame-go-to-graphics" data-src="./snippets/snippet.html?06-go-to-graphics&console=no"></iframe>
  </div>
</div>

---

## [`SceneView.goTo`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#goTo) &mdash; Graphics, hitTest

<div class="twos">
  <div class="snippet">
    <pre><code class="lang-ts hljs typescript">view.on("double-click", (event: any) => {
  event.stopPropagation();

  view.hitTest({ x: event.x, y: event. y})
      .then((hitResult: any) => {
        const graphic = (
          hitResult.results[0] &&
          hitResult.results[0].graphic
        );

        if (graphic) {
          const target = {
            target: graphic,
            scale: 1200,
            heading: view.camera.heading + 50
          };

          view.goTo(target, { speedFactor: 0.5 });
        }
      });
});</code></pre>
  </div>

  <div class="snippet-preview">
    <iframe id="frame-go-to-graphics-hit-test" data-src="./snippets/snippet.html?07-go-to-graphics-hit-test"></iframe>
  </div>
</div>

---

## [`SceneView.goTo`](https://developers.arcgis.com/javascript/beta/api-reference/esri-views-SceneView.html#goTo) &mdash; Animation options (since 4.2)

<div class="twos">
  <div class="snippet">
    <pre><code class="lang-ts hljs typescript">function customEasing(t: number): number {
  return 1 - Math.abs(
    Math.sin(
      -1.7 + t \* 4.5 \* Math.PI
    )
  ) \* Math.pow(0.5, t \* 10);
}

// ...

slide.applyTo(view, {
  // Either well-known builtin name, or
  // custom function as above
  easing,

  // Speed the animation up or down
  speedFactor
});
</code></pre>
  </div>

  <div class="snippet-preview">
    <iframe id="frame-go-to-animation-options" data-src="./snippets/snippet.html?08-go-to-animation-options&console=no"></iframe>
  </div>
</div>

---

## Interactive navigation &mdash; [Keyboard and touch](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html#navigation)

<div class="snippet-preview">
  <iframe id="frame-keyboard-and-touch" data-src="./snippets/snippet.html?09-keyboard-and-touch&console=no"></iframe>
</div>

---

## Customize interactive navigation &mdash; Lock heading

<div class="twos">
  <div class="snippet">
    <pre><code class="lang-ts hljs typescript">view.on("drag", (event: any) => {
  switch (event.action) {
  case "start":
    // ... store initial view state
    // ... center, scale, heading, tilt
    break;
  case "update":
    if (isDragging) {
      const newCenter = center.clone();
      const dx = (event.x - screenPoint.x);

      newCenter.x -= dx \* scale / 2000;

      view.goTo({
        center: newCenter,
        scale, heading, tilt
      }, { animate: false });

      event.stopPropagation();
    }
    break;
  case "end":
    isDragging = false;
    break;
  }
});</code></pre>
  </div>

  <div class="snippet-preview">
    <iframe id="frame-drag-lock-heading" data-src="./snippets/snippet.html?10-drag-lock-heading&console=no"></iframe>
  </div>
</div>

---

## Customize interactive navigation &mdash; Mouse-wheel follow path

<div class="twos">
  <div class="snippet">
    <pre><code class="lang-ts hljs typescript">view.on("mouse-wheel", (event: any) => {
  event.stopPropagation();

  const dy = event.deltaY;
  time -= dy * timeScale;

  view.goTo(interpolateCameraAt(time), {
    animate: false
  });

  event.stopPropagation();
});</code></pre>
  </div>

  <div class="snippet-preview">
    <iframe id="frame-scroll-follow-path" data-src="./snippets/snippet.html?11-scroll-follow-path&console=no"></iframe>
  </div>
</div>

---

<!-- .slide: data-background="images/end.png" -->

<img class="plain" src="./images/logo.png" width="50%" height="50%"/>
