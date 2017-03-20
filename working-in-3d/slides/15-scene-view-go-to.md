
<h2>Working with the SceneView</h2>

<div class="two-columns">
  <div class="left-column">

<div class="code-snippet">
<button class="play" id="scene-view-go-to-button01"></button>
<pre><code class="lang-ts">const h = view.camera.heading;

// Set the heading of the view to
// the closest multiple of 30 degrees
const heading = Math.floor(h / 30) * 30 + 30;

// go to heading preserves view.center
view.goTo({
  heading: heading
});</code></pre>
</div>

<div class="code-snippet">
**Animation options:**

<button class="play" id="scene-view-go-to-button02"></button>
<pre><code class="lang-ts">const h = view.camera.heading;

// Set the heading of the view to
// the closest multiple of 120 degrees
const heading = Math.floor(h / 120) * 120 + 120;

const target = {
  heading: heading
};

const options = {
  easing: "out-cubic",
  speedFactor: 0.2
};

view.goTo(target, options);</code></pre>
</div>

  </div>
  <div class="right-column">
    <iframe id="demo-time-date" data-src="../examples/go-to-demo.html" ></iframe>
  </div>
</div>


