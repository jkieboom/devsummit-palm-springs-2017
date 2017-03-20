<h2>Working with the SceneView</h2>

<div class="code-snippet">
<pre><code class="lang-ts">class SceneView {
  // Camera specifies the view
  camera: Camera;

  goTo(...);

  // Settings that affect constraints (e.g. navigation constraints)
  constraints: SceneViewConstraints;

  // Padding on the view
  padding: { top: number, right: number, bottom: number, left: number };

  // Converting coordinate systems
  toScreen(mapPoint: Point): ScreenPoint;
  toMap(screenPoint: ScreenPoint): Point;
}</code></pre>
</div>
