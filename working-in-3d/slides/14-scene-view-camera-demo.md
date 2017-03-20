
<h2>Working with the SceneView</h2>


<div class="two-columns">
  <div class="left-column">

<div class="code-snippet">
<button class="play" id="scene-view-map-view-button01"></button>
<pre><code class="lang-ts">const camera = view.camera.clone();

// Increment the heading of the camera by 5 degrees
camera.heading += 5;

// Set the modified camera on the view
view.camera = camera;</code></pre>
</div>


  </div>
  <div class="right-column">
    <iframe id="demo-time-date" data-src="../examples/camera-demo.html" ></iframe>
  </div>
</div>


