define(["require", "exports", "esri/Map", "esri/views/SceneView", "esri/views/3d/externalRenderers", "./support/webglUtils", "./support/log", "./support/widgets", "https://cdnjs.cloudflare.com/ajax/libs/gl-matrix/2.3.2/gl-matrix-min.js"], function (require, exports, Map, SceneView, externalRenderers, webglUtils_1, log, widgets_1, gl_matrix_min_js_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var view;
    var CustomRenderer = (function () {
        function CustomRenderer() {
            this._enableLighting = false;
            this.objects = [];
        }
        CustomRenderer.prototype.setup = function (context) {
            var gl = context.gl;
            this.renderAt = null;
            this.initializeVertexBufferObject(context);
            this.initializeProgram(context);
        };
        CustomRenderer.prototype.render = function (context) {
            var gl = context.gl;
            var _a = this.program, program = _a.program, uniformLocations = _a.uniformLocations;
            var camera = context.camera, sunLight = context.sunLight;
            // Setup program and uniforms
            gl.useProgram(program);
            // Set camera view and projection matrices
            gl.uniformMatrix4fv(uniformLocations.uViewMatrix, false, camera.viewMatrix);
            gl.uniformMatrix4fv(uniformLocations.uProjectionMatrix, false, camera.projectionMatrix);
            // Set lighting parameters
            gl.uniform3fv(uniformLocations.uDirectionalColor, this.intensityMultipliedColor(sunLight.diffuse));
            gl.uniform3fv(uniformLocations.uAmbientColor, this.intensityMultipliedColor(sunLight.ambient));
            gl.uniform3fv(uniformLocations.uLightingDirection, sunLight.direction);
            gl.uniform1f(uniformLocations.uEnableLighting, this.enableLighting ? 1 : 0);
            // Bind vertex buffer object and setup attribute pointers
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
            gl.enableVertexAttribArray(this.vertexPositionAttributeLocation);
            gl.enableVertexAttribArray(this.vertexNormalAttributeLocation);
            // Vertex position
            gl.vertexAttribPointer(this.vertexPositionAttributeLocation, 3, gl.FLOAT, false, 24, 0);
            // Vertex normal
            gl.vertexAttribPointer(this.vertexNormalAttributeLocation, 3, gl.FLOAT, false, 24, 12);
            gl.disable(gl.BLEND);
            gl.enable(gl.DEPTH_TEST);
            for (var _i = 0, _b = this.objects; _i < _b.length; _i++) {
                var object = _b[_i];
                gl.uniformMatrix4fv(uniformLocations.uModelMatrix, false, object.modelMatrix);
                gl.uniformMatrix3fv(uniformLocations.uNormalMatrix, false, object.normalMatrix);
                gl.drawArrays(gl.TRIANGLES, 0, 36);
            }
            // Make sure to reset the WebGL state when finishing the render
            context.resetWebGLState();
        };
        CustomRenderer.prototype.add = function (point) {
            if (!point) {
                return;
            }
            var modelMatrix = externalRenderers.renderCoordinateTransformAt(view, [point.x, point.y, point.z], point.spatialReference, null);
            this.objects.push({
                modelMatrix: modelMatrix,
                normalMatrix: gl_matrix_min_js_1.mat3.normalFromMat4(new Array(9), modelMatrix)
            });
            externalRenderers.requestRender(view);
            log.timeout("Added new cube");
        };
        Object.defineProperty(CustomRenderer.prototype, "enableLighting", {
            get: function () {
                return this._enableLighting;
            },
            set: function (value) {
                this._enableLighting = value;
                externalRenderers.requestRender(view);
            },
            enumerable: true,
            configurable: true
        });
        CustomRenderer.prototype.intensityMultipliedColor = function (colorDef) {
            var color = colorDef.color, intensity = colorDef.intensity;
            return [
                color[0] * intensity,
                color[1] * intensity,
                color[2] * intensity
            ];
        };
        CustomRenderer.prototype.initializeVertexBufferObject = function (context) {
            var gl = context.gl;
            this.vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
            gl.bufferData(gl.ARRAY_BUFFER, webglUtils_1.createCubeGeometry(100000), gl.STATIC_DRAW);
        };
        CustomRenderer.prototype.initializeProgram = function (context) {
            var gl = context.gl;
            this.program = webglUtils_1.createProgram(gl, "render", 
            // Vertex shader
            "\n        precision highp float;\n\n        attribute vec3 aVertexPosition;\n        attribute vec3 aVertexNormal;\n\n        uniform mat4 uModelMatrix;\n        uniform mat4 uViewMatrix;\n        uniform mat4 uProjectionMatrix;\n        uniform mat3 uNormalMatrix;\n\n        uniform vec3 uAmbientColor;\n        uniform vec3 uLightingDirection;\n        uniform vec3 uDirectionalColor;\n\n        varying vec3 vLightColor;\n\n        void main(void) {\n          gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);\n          vec3 transformedNormal = normalize(uNormalMatrix * aVertexNormal);\n\n          float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);\n          vLightColor = uAmbientColor + uDirectionalColor * directionalLightWeighting;\n        }\n      ", 
            // Fragment shader
            "\n        precision highp float;\n\n        uniform float uEnableLighting;\n\n        varying vec3 vLightColor;\n\n        void main() {\n          gl_FragColor = vec4(mix(vLightColor, vec3(1, 1, 1), 1.0 - uEnableLighting), 1);\n        }\n      ", 
            // Uniform names
            ["uModelMatrix", "uViewMatrix", "uProjectionMatrix", "uNormalMatrix", "uDirectionalColor", "uAmbientColor", "uLightingDirection", "uEnableLighting"]);
            this.vertexPositionAttributeLocation = gl.getAttribLocation(this.program.program, "aVertexPosition");
            this.vertexNormalAttributeLocation = gl.getAttribLocation(this.program.program, "aVertexNormal");
        };
        return CustomRenderer;
    }());
    var renderer;
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
                components: ["compass"]
            }
        });
        widgets_1.createOverviewMap(view);
        widgets_1.createFullscreen(view);
        view.then(function () {
            // Create the custom renderer and add it to the view
            renderer = new CustomRenderer();
            externalRenderers.add(view, renderer);
            widgets_1.add(view, "<div><input type=\"checkbox\"> Enable lighting</div>", {
                click: function (event) {
                    renderer.enableLighting = event.target.checked;
                }
            });
            widgets_1.add(view, "<div><input type=\"range\" min=\"6\" max=\"22\" step=\"0.1\" style=\"width: 200px\" value=\"" + (view.environment.lighting.date.getHours() + view.environment.lighting.date.getMinutes() / 60) + "\"></div>", {
                input: function (event) {
                    var minutes = (event.target.value % 1) * 60;
                    var hours = Math.floor(event.target.value);
                    var date = new Date(view.environment.lighting.date.getTime());
                    date.setMinutes(minutes);
                    date.setHours(hours);
                    view.environment.lighting.date = date;
                }
            });
            view.on("hold", function (event) {
                renderer.add(event.mapPoint);
            });
        });
        window["view"] = view;
    }
    exports.initialize = initialize;
    function play() {
    }
    exports.play = play;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDItYmFzaWMtY2FtZXJhLWFuZC1saWdodGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIjAyLWJhc2ljLWNhbWVyYS1hbmQtbGlnaHRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7SUFxQkEsSUFBSSxJQUFlLENBQUM7SUFFcEI7UUFBQTtZQVFVLG9CQUFlLEdBQVksS0FBSyxDQUFDO1lBRWpDLFlBQU8sR0FHVCxFQUFFLENBQUM7UUF5SlgsQ0FBQztRQXZKQyw4QkFBSyxHQUFMLFVBQU0sT0FBMkI7WUFDL0IsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUV0QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUVyQixJQUFJLENBQUMsNEJBQTRCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLENBQUM7UUFFRCwrQkFBTSxHQUFOLFVBQU8sT0FBMkI7WUFDaEMsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUVoQixJQUFBLGlCQUE0QyxFQUExQyxvQkFBTyxFQUFFLHNDQUFnQixDQUFrQjtZQUMzQyxJQUFBLHVCQUFNLEVBQUUsMkJBQVEsQ0FBYTtZQUVyQyw2QkFBNkI7WUFDN0IsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV2QiwwQ0FBMEM7WUFDMUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFFeEYsMEJBQTBCO1lBQzFCLEVBQUUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFD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