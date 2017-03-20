define(["require", "exports", "esri/Map", "esri/geometry/ScreenPoint", "esri/views/SceneView", "esri/views/3d/externalRenderers", "./support/webglUtils", "./support/log", "./support/widgets"], function (require, exports, Map, ScreenPoint, SceneView, externalRenderers, webglUtils_1, log, widgets_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var view;
    var CustomRenderer = (function () {
        function CustomRenderer() {
        }
        CustomRenderer.prototype.setup = function (context) {
            var gl = context.gl;
            this.renderAt = null;
            this.initializeVertexBufferObject(context);
            this.initializeProgram(context);
        };
        CustomRenderer.prototype.render = function (context) {
            if (!this.renderAt) {
                return;
            }
            var gl = context.gl;
            var point = view.toMap(this.renderAt);
            if (!point) {
                return;
            }
            var transform = externalRenderers.renderCoordinateTransformAt(view, [point.x, point.y, point.z + 1000], point.spatialReference, null);
            var _a = this.program, program = _a.program, uniformLocations = _a.uniformLocations;
            var camera = context.camera;
            // Setup program and uniforms
            gl.useProgram(program);
            gl.uniformMatrix4fv(uniformLocations.uViewMatrix, false, camera.viewMatrix);
            gl.uniformMatrix4fv(uniformLocations.uProjectionMatrix, false, camera.projectionMatrix);
            gl.uniformMatrix4fv(uniformLocations.uModelMatrix, false, transform);
            // Bind vertex buffer object and setup attribute pointers
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
            gl.enableVertexAttribArray(0);
            gl.enableVertexAttribArray(1);
            // Vertex position
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 24, 0);
            // Vertex color
            gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 24, 12);
            gl.disable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);
            gl.drawArrays(gl.TRIANGLES, 0, 36);
            // Make sure to reset the WebGL state when finishing the render
            context.resetWebGLState();
        };
        CustomRenderer.prototype.update = function (renderAt) {
            this.renderAt = renderAt;
            externalRenderers.requestRender(view);
        };
        CustomRenderer.prototype.initializeVertexBufferObject = function (context) {
            var gl = context.gl;
            this.vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
            gl.bufferData(gl.ARRAY_BUFFER, this.createBufferData(), gl.STATIC_DRAW);
        };
        CustomRenderer.prototype.initializeProgram = function (context) {
            this.program = webglUtils_1.createProgram(context.gl, "render", 
            // Vertex shader
            "\n        precision highp float;\n\n        attribute vec3 aVertexPosition;\n        attribute vec3 aVertexColor;\n\n        uniform mat4 uModelMatrix;\n        uniform mat4 uViewMatrix;\n        uniform mat4 uProjectionMatrix;\n\n        varying vec3 vColor;\n\n        void main() {\n          vColor = aVertexColor;\n\n          gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1);\n        }\n      ", 
            // Fragment shader
            "\n        precision highp float;\n\n        varying vec3 vColor;\n\n        void main() {\n          gl_FragColor = vec4(vColor, 1);\n        }\n      ", 
            // Uniform names
            ["uModelMatrix", "uViewMatrix", "uProjectionMatrix"]);
        };
        CustomRenderer.prototype.createBufferData = function () {
            var size = 500000;
            var halfWidth = 10000;
            // Create data for a simple render coordinate, X, Y, Z using triangles
            return new Float32Array([
                // X flat
                0, -halfWidth, 0,
                1, 0, 0,
                size, halfWidth, 0,
                1, 0, 0,
                size, -halfWidth, 0,
                1, 0, 0,
                0, -halfWidth, 0,
                1, 0, 0,
                0, halfWidth, 0,
                1, 0, 0,
                size, halfWidth, 0,
                1, 0, 0,
                // X up
                0, 0, 0,
                0.6, 0, 0,
                size, 0, 0,
                0.6, 0, 0,
                size, 0, halfWidth,
                0.6, 0, 0,
                0, 0, 0,
                0.6, 0, 0,
                size, 0, halfWidth,
                0.6, 0, 0,
                0, 0, halfWidth,
                0.6, 0, 0,
                // Y flat
                -halfWidth, 0, 0,
                0, 1, 0,
                halfWidth, size, 0,
                0, 1, 0,
                -halfWidth, size, 0,
                0, 1, 0,
                -halfWidth, 0, 0,
                0, 1, 0,
                halfWidth, 0, 0,
                0, 1, 0,
                halfWidth, size, 0,
                0, 1, 0,
                // Y up
                0, 0, 0,
                0, 0.6, 0,
                0, size, 0,
                0, 0.6, 0,
                0, size, halfWidth,
                0, 0.6, 0,
                0, 0, 0,
                0, 0.6, 0,
                0, size, halfWidth,
                0, 0.6, 0,
                0, 0, halfWidth,
                0, 0.6, 0,
                // Z on X
                -halfWidth, 0, 0,
                0, 0, 1,
                halfWidth, 0, 0,
                0, 0, 1,
                halfWidth, 0, size,
                0, 0, 1,
                -halfWidth, 0, 0,
                0, 0, 1,
                halfWidth, 0, size,
                0, 0, 1,
                -halfWidth, 0, size,
                0, 0, 1,
                // Z on Y
                0, -halfWidth, 0,
                0, 0, 0.6,
                0, halfWidth, 0,
                0, 0, 0.6,
                0, halfWidth, size,
                0, 0, 0.6,
                0, -halfWidth, 0,
                0, 0, 0.6,
                0, halfWidth, size,
                0, 0, 0.6,
                0, -halfWidth, size,
                0, 0, 0.6 // color
            ]);
        };
        return CustomRenderer;
    }());
    function initialize() {
        view = new SceneView({
            container: "viewDiv",
            map: new Map({
                basemap: "gray",
                ground: "world-elevation"
            }),
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
            camera: {
                position: [2.035, 31.805, 2907227.41],
                heading: 16.86,
                tilt: 31.46
            },
            ui: {
                components: ["compass", "attribution"]
            }
        });
        widgets_1.createOverviewMap(view);
        widgets_1.createFullscreen(view);
        view.then(function () {
            var isFixed = false;
            // Create the custom renderer and add it to the view
            var renderer = new CustomRenderer();
            externalRenderers.add(view, renderer);
            view.on("hold", function (event) {
                if (!isFixed && !event.mapPoint) {
                    return;
                }
                isFixed = !isFixed;
                renderer.update(new ScreenPoint({ x: event.x, y: event.y }));
                log.message(isFixed ? "Placed coordinate system" : "");
            });
            view.on("pointer-move", function (event) {
                if (!isFixed) {
                    renderer.update(new ScreenPoint({ x: event.x, y: event.y }));
                }
            });
        });
        window["view"] = view;
    }
    exports.initialize = initialize;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDEtYmFzaWMtcmVuZGVyLWNvb3JkaW5hdGUtc3lzdGVtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiMDEtYmFzaWMtcmVuZGVyLWNvb3JkaW5hdGUtc3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0lBbUJBLElBQUksSUFBZSxDQUFDO0lBRXBCO1FBQUE7UUEwT0EsQ0FBQztRQXJPQyw4QkFBSyxHQUFMLFVBQU0sT0FBMkI7WUFDL0IsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUV0QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUVyQixJQUFJLENBQUMsNEJBQTRCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRCwrQkFBTSxHQUFOLFVBQU8sT0FBMkI7WUFDaEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsTUFBTSxDQUFDO1lBQ1QsQ0FBQztZQUVELElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDdEIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFeEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQztZQUNULENBQUM7WUFFRCxJQUFNLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbEksSUFBQSxpQkFBNEMsRUFBMUMsb0JBQU8sRUFBRSxzQ0FBZ0IsQ0FB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