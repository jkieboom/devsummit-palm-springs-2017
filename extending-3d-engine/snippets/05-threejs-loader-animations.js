define(["require", "exports", "esri/Map", "esri/layers/Layer", "esri/views/SceneView", "esri/views/3d/externalRenderers", "./support/log", "./support/widgets"], function (require, exports, Map, Layer, SceneView, externalRenderers, log, widgets_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var view;
    var CustomRenderer = (function () {
        function CustomRenderer() {
            this.animations = [];
        }
        CustomRenderer.prototype.setup = function (context) {
            this.initializeRenderer(context);
            this.initializeCamera(context);
            this.initializeScene(context);
        };
        CustomRenderer.prototype.render = function (context) {
            this.updateCamera(context);
            this.updateLights(context);
            this.updateAnimation();
            this.renderer.resetGLState();
            this.renderer.render(this.scene, this.camera);
            context.resetWebGLState();
            if (this.animations.length) {
                externalRenderers.requestRender(view);
            }
        };
        CustomRenderer.prototype.add = function (point) {
            this.addColladaModel(point);
            log.timeout("Added object");
        };
        CustomRenderer.prototype.addColladaModel = function (location) {
            var _this = this;
            var loader = new THREE.ColladaLoader();
            loader.load("./data/animated-object.dae", function (collada) {
                var object = collada.scene;
                _this.applyTransformAt(object, location);
                object.scale.multiplyScalar(view.scale / 200);
                object.updateMatrix();
                _this.scene.add(object);
                for (var _i = 0, _a = collada.animations; _i < _a.length; _i++) {
                    var animation = _a[_i];
                    var keyFrameAnimation = new THREE.KeyFrameAnimation(animation);
                    keyFrameAnimation.timeScale = 1;
                    keyFrameAnimation.loop = false;
                    keyFrameAnimation.play(0);
                    _this.animations.push(keyFrameAnimation);
                }
                externalRenderers.requestRender(view);
            });
        };
        CustomRenderer.prototype.updateAnimation = function () {
            for (var _i = 0, _a = this.animations; _i < _a.length; _i++) {
                var animation = _a[_i];
                if (animation.currentTime >= animation.data.length) {
                    animation.stop();
                    animation.play(0);
                }
                animation.update(1 / 60);
            }
        };
        CustomRenderer.prototype.initializeRenderer = function (context) {
            this.renderer = new THREE.WebGLRenderer({
                context: context.gl,
                premultipliedAlpha: false
            });
            // prevent three.js from clearing the buffers provided by the ArcGIS JS API.
            this.renderer.autoClearDepth = false;
            this.renderer.autoClearStencil = false;
            this.renderer.autoClearColor = false;
            // The ArcGIS JS API renders to custom offscreen buffers, and not to the default framebuffers.
            // We have to inject this bit of code into the three.js runtime in order for it to bind those
            // buffers instead of the default ones.
            var originalSetRenderTarget = this.renderer.setRenderTarget.bind(this.renderer);
            this.renderer.setRenderTarget = function (target) {
                originalSetRenderTarget(target);
                if (target == null) {
                    context.bindRenderTarget();
                }
            };
        };
        CustomRenderer.prototype.initializeCamera = function (context) {
            var camera = context.camera;
            this.camera = new THREE.PerspectiveCamera(camera.fovY, camera.aspect, camera.near, camera.far);
        };
        CustomRenderer.prototype.initializeScene = function (context) {
            this.scene = new THREE.Scene();
            this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            this.scene.add(this.ambientLight);
            this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            this.scene.add(this.directionalLight);
        };
        CustomRenderer.prototype.applyTransformAt = function (object, location) {
            var transform = new THREE.Matrix4();
            externalRenderers.renderCoordinateTransformAt(view, [location.x, location.y, location.z + 0.5], location.spatialReference, transform.elements);
            transform.decompose(object.position, object.quaternion, object.scale);
        };
        CustomRenderer.prototype.updateCamera = function (context) {
            var camera = context.camera;
            this.renderer.setViewport(0, 0, view.width, view.height);
            this.camera.position.set(camera.eye[0], camera.eye[1], camera.eye[2]);
            this.camera.up.set(camera.up[0], camera.up[1], camera.up[2]);
            this.camera.lookAt(new THREE.Vector3(camera.center[0], camera.center[1], camera.center[2]));
            this.camera.projectionMatrix.fromArray(camera.projectionMatrix);
        };
        CustomRenderer.prototype.updateLights = function (context) {
            var _a = context.sunLight, direction = _a.direction, diffuse = _a.diffuse, ambient = _a.ambient;
            this.directionalLight.position.set(direction[0], direction[1], direction[2]);
            this.directionalLight.intensity = diffuse.intensity;
            this.directionalLight.color = new THREE.Color(diffuse.color[0], diffuse.color[1], diffuse.color[2]);
            this.ambientLight.intensity = ambient.intensity;
            this.ambientLight.color = new THREE.Color(ambient.color[0], ambient.color[1], ambient.color[2]);
        };
        return CustomRenderer;
    }());
    var renderer;
    function initialize() {
        view = new SceneView({
            container: "viewDiv",
            map: new Map({
                basemap: "streets",
                ground: "world-elevation"
            }),
            camera: {
                position: [4.498, 51.908, 383.19],
                heading: 269.52,
                tilt: 64.54
            },
            qualityProfile: "high",
            environment: {
                atmosphere: {
                    quality: "high"
                },
                lighting: {
                    directShadowsEnabled: true,
                    ambientOcclusionEnabled: true
                }
            },
            ui: {
                components: ["compass"]
            }
        });
        widgets_1.createOverviewMap(view);
        widgets_1.createFullscreen(view);
        Layer.fromArcGISServerUrl({ url: "https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/Building_Rotterdam/SceneServer" })
            .then(function (layer) {
            view.map.add(layer);
        });
        view.then(function () {
            // Create the custom renderer and add it to the view
            renderer = new CustomRenderer();
            externalRenderers.add(view, renderer);
            view.on("hold", function (event) {
                if (event.mapPoint) {
                    renderer.add(event.mapPoint);
                }
            });
        });
        window["view"] = view;
    }
    exports.initialize = initialize;
    function play() {
        renderer.add(view.center);
    }
    exports.play = play;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDUtdGhyZWVqcy1sb2FkZXItYW5pbWF0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIjA1LXRocmVlanMtbG9hZGVyLWFuaW1hdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7SUFxQkEsSUFBSSxJQUFlLENBQUM7SUFFcEI7UUFBQTtZQUdVLGVBQVUsR0FBVSxFQUFFLENBQUM7UUEySWpDLENBQUM7UUFySUMsOEJBQUssR0FBTCxVQUFNLE9BQTJCO1lBQy9CLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoQyxDQUFDO1FBRUQsK0JBQU0sR0FBTixVQUFPLE9BQTJCO1lBQ2hDLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU5QyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUM7WUFFMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixpQkFBaUIsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEMsQ0FBQztRQUNILENBQUM7UUFFRCw0QkFBRyxHQUFILFVBQUksS0FBaUI7WUFDbkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU1QixHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxD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