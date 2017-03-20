define(["require", "exports", "esri/request", "esri/Map", "esri/geometry/Extent", "esri/views/SceneView", "esri/views/3d/externalRenderers", "./support/widgets"], function (require, exports, request, Map, Extent, SceneView, externalRenderers, widgets_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var view;
    var ParticleSystem = (function () {
        function ParticleSystem(properties) {
            // Settings
            this.numParticlesInTrail = 32;
            this.numParticleStreams = 1024 * 1024 / this.numParticlesInTrail;
            this.useLines = true;
            this.timestep = 1 / 60;
            // Precomputed
            this.totalNumParticles = this.numParticleStreams * this.numParticlesInTrail;
            this.particlePotSize = 1 << Math.ceil(Math.log(Math.sqrt(this.totalNumParticles)) / Math.LN2);
            // Particle simulation
            this.time = 0;
            this.gl = properties.gl;
            this.view = properties.view;
            this.extent = properties.extent;
            this.velocityFieldTexture = properties.velocityField;
            this.reprojectionTexture = properties.reprojection;
            this.initializeResources();
        }
        /**
         * Initialize all the GPU resources for running the particle
         * simulation and rendering the particles.
         */
        ParticleSystem.prototype.initializeResources = function () {
            this.initializeSimulationFBO();
            // this.initializeRenderFBO();
            this.initializeQuadGeometryVBO();
            this.initializeParticleGeometryVBO();
            this.initializePrograms();
            this.initializeParticles();
        };
        /**
         * Creates the FBO used to run the simulation.
         */
        ParticleSystem.prototype.initializeSimulationFBO = function () {
            var gl = this.gl;
            this.simulationFBO = gl.createFramebuffer();
        };
        ParticleSystem.prototype.createRenderTexture = function () {
            var gl = this.gl;
            var renderTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, renderTexture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.view.width, this.view.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            return renderTexture;
        };
        /**
         * Initialize the VBO geometry used to run the particle simulation.
         * This is simply a quad (using a triangle strip) which covers the
         * texture that contains the particle state.
         */
        ParticleSystem.prototype.initializeQuadGeometryVBO = function () {
            var gl = this.gl;
            this.quadGeometryVBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.quadGeometryVBO);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
        };
        /**
         * Initialize attributes in a VBO buffer for a single particle.
         */
        ParticleSystem.prototype.initializeParticleAttributes = function (particleData, i, offset) {
            var x = i % this.particlePotSize;
            var y = Math.floor(i / this.particlePotSize);
            particleData[offset + 0] = (x + 0.5) / this.particlePotSize;
            particleData[offset + 1] = (y + 0.5) / this.particlePotSize;
            particleData[offset + 2] = (i % this.numParticleStreams) / this.numParticleStreams * 2 * Math.PI;
            particleData[offset + 3] = (Math.floor(i / this.numParticleStreams) + 1) / this.numParticlesInTrail;
        };
        /**
         * Create VBO containing geometry attributes for rendering particles. Particles
         * may be rendered either as points or as connected lines, depending on useLines.
         */
        ParticleSystem.prototype.initializeParticleGeometryVBO = function () {
            if (this.useLines) {
                this.initializeParticleVBOLines();
            }
            else {
                this.initializeParticleVBOPoints();
            }
        };
        /**
         * Create VBO containing geometry attributes for rendering particles
         * as lines.
         */
        ParticleSystem.prototype.initializeParticleVBOLines = function () {
            var gl = this.gl;
            var vertexPairs = (this.numParticlesInTrail - 1) * 2;
            var particleData = new Float32Array(vertexPairs * this.numParticleStreams * 4);
            var ptr = 0;
            for (var i = 0; i < this.numParticleStreams; i++) {
                for (var j = 0; j < this.numParticlesInTrail - 1; j++) {
                    var idx = j * this.numParticleStreams + i;
                    var nextIdx = idx + this.numParticleStreams;
                    this.initializeParticleAttributes(particleData, idx, ptr);
                    ptr += 4;
                    this.initializeParticleAttributes(particleData, nextIdx, ptr);
                    ptr += 4;
                }
            }
            this.particleGeometryVBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.particleGeometryVBO);
            gl.bufferData(gl.ARRAY_BUFFER, particleData, gl.STATIC_DRAW);
        };
        /**
         * Create VBO containing geometry attributes for rendering particles
         * as points.
         */
        ParticleSystem.prototype.initializeParticleVBOPoints = function () {
            var gl = this.gl;
            var particleData = new Float32Array(this.totalNumParticles * 4);
            var ptr = 0;
            for (var i = 0; i < this.totalNumParticles; i++) {
                this.initializeParticleAttributes(particleData, i, ptr);
                ptr += 4;
            }
            this.particleGeometryVBO = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.particleGeometryVBO);
            gl.bufferData(gl.ARRAY_BUFFER, particleData, gl.STATIC_DRAW);
        };
        ParticleSystem.prototype.initializePrograms = function () {
            this.programs = {
                update: {
                    program: this.createProgram("update", 
                    // Vertex shader
                    "\n            precision highp float;\n\n            attribute vec3 pos;\n            varying vec3 particlePosition;\n\n            void main() {\n              particlePosition = pos;\n              gl_Position = vec4((pos.xy * 2.0) - 1.0, 0, 1);\n            }\n          ", 
                    // Fragment shader
                    "\n            precision highp float;\n            precision highp sampler2D;\n\n            varying vec3 particlePosition;\n\n            uniform sampler2D particles;\n\n            uniform sampler2D velocityField;\n            uniform sampler2D particleOriginsTexture;\n\n            uniform float timestep;\n            uniform float time;\n\n            uniform vec2 velocityOffset;\n            uniform vec2 velocityScale;\n\n            const float trailSize = float(" + this.numParticlesInTrail + ");\n\n            float random(vec2 co) {\n              return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n            }\n\n            float rgba2float(vec4 rgba) {\n\t\t          return dot(rgba, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\n\t          }\n\n            void main() {\n              vec4 particle = texture2D(particles, particlePosition.xy);\n\n              // Check if particle is even alive\n              if (particle.z < 0.0) {\n                if (-particle.z <= time) {\n                  // Should become alive and die after some time\n                  particle.z = time;\n                }\n              }\n              // Check if particle is now dead\n              else {\n                float lifeSpan = 10.0 + random(vec2(particle.z, -particle.z)) * 10.0;\n                float elapsed = time - particle.z;\n                float remaining = lifeSpan - elapsed;\n\n                float delay = timestep * trailSize * 5.0;\n\n                if (elapsed >= lifeSpan) {\n                  // Reposition it on the grid, based on some randomization\n                  particle.xy = texture2D(particleOriginsTexture, particlePosition.xy).xy;\n\n                  // Create a random time-to-life\n                  particle.z = -(time + 1.0 + random(particle.xy + vec2(time, time)) * 2.0);\n                }\n                // Otherwise just update the particle position according to the velocity field\n                else if (elapsed > particle.w * delay && remaining > (1.0 - particle.w) * delay) {\n                  vec2 velocity = texture2D(velocityField, particle.xy).xy * velocityScale + velocityOffset;\n\n                  const float velocityTimeScale = 0.0005;\n                  vec2 vupdate = vec2(velocity.x, -velocity.y) * timestep * velocityTimeScale;\n\n                  particle.xy += vupdate;\n                }\n              }\n\n              gl_FragColor = particle;\n            }\n          "),
                    uniforms: null
                },
                render: {
                    program: this.createProgram("render", 
                    // Vertex shader
                    "\n            precision highp float;\n            precision highp sampler2D;\n\n            uniform sampler2D particles;\n\n            uniform sampler2D reprojectionX;\n            uniform sampler2D reprojectionY;\n            uniform sampler2D reprojectionZ;\n\n            uniform float reprojectionOffset;\n            uniform float reprojectionScale;\n\n            uniform mat4 viewMatrix;\n            uniform mat4 projectionMatrix;\n            uniform float time;\n\n\n            attribute vec2 position;\n            attribute float age;\n\n            varying float fAge;\n            varying vec4 particle;\n\n            float rgba2float(vec4 rgba) {\n\t\t          return dot(rgba, vec4(1.0, 1.0 / 255.0, 1.0 / 65025.0, 1.0 / 16581375.0));\n\t          }\n\n            float random(vec2 co) {\n              return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n            }\n\n            void main() {\n              particle = texture2D(particles, position);\n\n              float lifeSpan = 10.0 + random(vec2(particle.z, -particle.z)) * 5.0;\n              float elapsed = time - particle.z;\n              float remaining = lifeSpan - elapsed;\n\n              fAge = smoothstep(0.0, 2.0, remaining) * (age + 0.5) * 0.75;\n\n              gl_PointSize = 1.0 + fAge;\n\n              if (particle.z < 0.0) {\n                // Not alive, clip?\n                gl_Position = vec4(-2, -2, -2, 1);\n              }\n              else {\n                vec4 posX = texture2D(reprojectionX, particle.xy);\n                vec4 posY = texture2D(reprojectionY, particle.xy);\n                vec4 posZ = texture2D(reprojectionZ, particle.xy);\n\n                vec3 pos = vec3(rgba2float(posX), rgba2float(posY), rgba2float(posZ)) * reprojectionScale + reprojectionOffset;\n\n                vec4 ndcPos = projectionMatrix * viewMatrix * vec4(pos, 1);\n\n                // Add a constant z-bias to push the points towards the viewer, so\n                // we don't z-fight with the terrain\n                ndcPos.z -= 0.0001 * ndcPos.w;\n\n                gl_Position = ndcPos;\n              }\n            }\n          ", 
                    // Fragment shader
                    "\n            precision highp float;\n            precision highp sampler2D;\n\n            uniform sampler2D velocityField;\n            uniform float time;\n            uniform vec2 velocityScale;\n            uniform vec2 velocityOffset;\n\n            varying vec4 particle;\n            varying float fAge;\n\n            void main() {\n              vec3 velocity = texture2D(velocityField, particle.xy).xyz;\n              gl_FragColor = vec4(velocity.xyz, fAge);\n            }\n          "),
                    uniforms: null
                }
            };
            this.programs.update.uniforms = this.extractUniforms(this.programs.update.program, [
                "particles", "velocityField", "velocityScale", "velocityOffset", "time", "timestep", "particleOriginsTexture"
            ]);
            this.programs.render.uniforms = this.extractUniforms(this.programs.render.program, [
                "particles", "reprojectionX", "reprojectionY", "reprojectionZ", "reprojectionScale", "reprojectionOffset", "viewMatrix", "projectionMatrix", "velocityField", "velocityScale", "velocityOffset", "time"
            ]);
        };
        ParticleSystem.prototype.extractUniforms = function (program, names) {
            var ret = {};
            var gl = this.gl;
            for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
                var name_1 = names_1[_i];
                ret[name_1] = gl.getUniformLocation(program, name_1);
            }
            return ret;
        };
        ParticleSystem.prototype.randomPositionOnSphere = function () {
            var theta = Math.random() * Math.PI * 2;
            var phi = Math.acos(1 - 2 * Math.random());
            var x = Math.sin(phi) * Math.cos(theta);
            var y = Math.sin(phi) * Math.sin(theta);
            var z = Math.cos(phi);
            var coord = [0, 0, 0];
            externalRenderers.fromRenderCoordinates(this.view, [x * 6378137, y * 6378137, z * 6378137], 0, coord, 0, this.view.spatialReference, 1);
            return [
                (coord[0] - this.extent.xmin) / this.extent.width,
                (coord[1] - this.extent.ymin) / this.extent.height
            ];
        };
        ParticleSystem.prototype.initializeParticles = function () {
            var ptr = 0;
            var particleData = new Float32Array(this.particlePotSize * this.particlePotSize * 4);
            // Generate initial particle positions
            for (var i = 0; i < this.numParticleStreams; i++) {
                var _a = this.randomPositionOnSphere(), x = _a[0], y = _a[1];
                var timeToBirth = Math.random() * 20;
                for (var j = 0; j < this.numParticlesInTrail; j++) {
                    var offset = j * this.numParticleStreams * 4;
                    particleData[ptr + offset + 0] = x;
                    particleData[ptr + offset + 1] = y;
                    // TTB (time to birth), in seconds
                    particleData[ptr + offset + 2] = -timeToBirth;
                    // Normalized trail delay
                    particleData[ptr + offset + 3] = 1 - (j + 1) / this.numParticlesInTrail;
                }
                ptr += 4;
            }
            this.particleOriginsTexture = this.createFloatTexture(particleData, this.particlePotSize);
            this.particleStateTextures = [
                this.createFloatTexture(particleData, this.particlePotSize),
                this.createFloatTexture(null, this.particlePotSize)
            ];
        };
        ParticleSystem.prototype.programLog = function (name, info) {
            if (info) {
                console.error("Failed to compile or link", name, info);
            }
        };
        ParticleSystem.prototype.renderQuadGeometryVBO = function (context) {
            var gl = context.gl;
            // Setup draw geometrysimulationGeometryVBO
            gl.enableVertexAttribArray(0);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.quadGeometryVBO);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);
            // Finally, draw
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };
        ParticleSystem.prototype.createProgram = function (name, vertex, fragment) {
            var gl = this.gl;
            var program = gl.createProgram();
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(vertexShader, vertex);
            gl.compileShader(vertexShader);
            this.programLog(name + " - vertex", gl.getShaderInfoLog(vertexShader));
            gl.shaderSource(fragmentShader, fragment);
            gl.compileShader(fragmentShader);
            this.programLog(name + " - fragment", gl.getShaderInfoLog(fragmentShader));
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            this.programLog(name + " - link program", gl.getProgramInfoLog(program));
            return program;
        };
        ParticleSystem.prototype.createFloatTexture = function (data, size) {
            var gl = this.gl;
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.FLOAT, data);
            return texture;
        };
        ParticleSystem.prototype.update = function (context) {
            this.time += this.timestep;
            var gl = this.gl;
            // Bind input textures
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.particleStateTextures[0]);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.velocityFieldTexture.texture);
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, this.particleOriginsTexture);
            // Setup FBO
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.simulationFBO);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.particleStateTextures[1], 0);
            gl.viewport(0, 0, this.particlePotSize, this.particlePotSize);
            gl.disable(gl.BLEND);
            gl.disable(gl.DEPTH_TEST);
            gl.depthMask(false);
            // Setup program and uniforms
            var program = this.programs.update;
            gl.useProgram(program.program);
            gl.uniform1i(program.uniforms["particles"], 0);
            gl.uniform1i(program.uniforms["velocityField"], 1);
            gl.uniform1i(program.uniforms["particleOriginsTexture"], 2);
            gl.uniform2f(program.uniforms["velocityScale"], this.velocityFieldTexture.scaleU, this.velocityFieldTexture.scaleV);
            gl.uniform2f(program.uniforms["velocityOffset"], this.velocityFieldTexture.offsetU, this.velocityFieldTexture.offsetV);
            gl.uniform1f(program.uniforms["time"], this.time);
            gl.uniform1f(program.uniforms["timestep"], this.timestep);
            this.renderQuadGeometryVBO(context);
            // When update is done, swap the I/O textures
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);
            _a = [this.particleStateTextures[1], this.particleStateTextures[0]], this.particleStateTextures[0] = _a[0], this.particleStateTextures[1] = _a[1];
            gl.viewport(0, 0, context.camera.fullWidth, context.camera.fullHeight);
            var _a;
        };
        ParticleSystem.prototype.renderParticles = function (context) {
            var gl = context.gl;
            // Bind input texture
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.particleStateTextures[0]);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, this.reprojectionTexture.textures[0]);
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, this.reprojectionTexture.textures[1]);
            gl.activeTexture(gl.TEXTURE3);
            gl.bindTexture(gl.TEXTURE_2D, this.reprojectionTexture.textures[2]);
            gl.activeTexture(gl.TEXTURE4);
            gl.bindTexture(gl.TEXTURE_2D, this.velocityFieldTexture.texture);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.DEPTH_TEST);
            gl.depthMask(false);
            // Setup program and uniforms
            var program = this.programs.render;
            gl.useProgram(program.program);
            gl.uniform1i(program.uniforms["particles"], 0);
            gl.uniform1i(program.uniforms["reprojectionX"], 1);
            gl.uniform1i(program.uniforms["reprojectionY"], 2);
            gl.uniform1i(program.uniforms["reprojectionZ"], 3);
            gl.uniform1i(program.uniforms["velocityField"], 4);
            gl.uniform2f(program.uniforms["velocityScale"], this.velocityFieldTexture.scaleU, this.velocityFieldTexture.scaleV);
            gl.uniform2f(program.uniforms["velocityOffset"], this.velocityFieldTexture.offsetU, this.velocityFieldTexture.offsetV);
            gl.uniform1f(program.uniforms["reprojectionScale"], this.reprojectionTexture.scale);
            gl.uniform1f(program.uniforms["reprojectionOffset"], this.reprojectionTexture.offset);
            gl.uniformMatrix4fv(program.uniforms["viewMatrix"], false, context.camera.viewMatrix);
            gl.uniformMatrix4fv(program.uniforms["projectionMatrix"], false, context.camera.projectionMatrix);
            gl.uniform1f(program.uniforms["time"], this.time);
            gl.uniform1f(program.uniforms["timestep"], this.timestep);
            // Setup draw geometry
            gl.enableVertexAttribArray(0);
            gl.enableVertexAttribArray(1);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.particleGeometryVBO);
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 16, 0);
            gl.vertexAttribPointer(1, 1, gl.FLOAT, false, 16, 12);
            // Finally, draw
            if (this.useLines) {
                gl.drawArrays(gl.LINES, 0, (this.numParticlesInTrail - 1) * 2 * this.numParticleStreams);
            }
            else {
                gl.drawArrays(gl.POINTS, 0, this.totalNumParticles);
            }
            gl.disableVertexAttribArray(0);
            gl.disableVertexAttribArray(1);
        };
        ParticleSystem.prototype.render = function (context) {
            context.bindRenderTarget();
            this.renderParticles(context);
            context.resetWebGLState();
        };
        return ParticleSystem;
    }());
    var ExternalRenderer = (function () {
        function ExternalRenderer(view) {
            var _this = this;
            this.view = view;
            this.readyToRender = false;
            this.paused = false;
            this.singleStep = false;
            view.on("hold", function () {
                _this.paused = !_this.paused;
                console.log("paused", _this.paused);
                if (!_this.paused) {
                    externalRenderers.requestRender(view);
                }
            });
            view.on("pointer-up", ["Primary"], function () {
                if (_this.paused) {
                    _this.paused = false;
                    _this.singleStep = true;
                    externalRenderers.requestRender(view);
                }
            });
        }
        ExternalRenderer.prototype.setup = function (context) {
            var _this = this;
            var gl = context.gl;
            gl.getExtension("OES_texture_float");
            this.prepareResources(context)
                .then(function () {
                _this.readyToRender = true;
                externalRenderers.requestRender(_this.view);
                console.log("going to render");
            });
        };
        ExternalRenderer.prototype.renderTransparent = function (context) {
            if (!this.readyToRender) {
                return;
            }
            if (this.particleSystem) {
                if (!this.paused) {
                    this.particleSystem.update(context);
                }
                this.particleSystem.render(context);
                if (this.singleStep) {
                    console.log("stepped");
                    this.paused = true;
                    this.singleStep = false;
                }
            }
            context.resetWebGLState();
            if (!this.paused) {
                externalRenderers.requestRender(this.view);
            }
        };
        ExternalRenderer.prototype.prepareResources = function (context) {
            var _this = this;
            var rasterInfo;
            return this.fetchRaster()
                .then(function (fetchedRaster) {
                rasterInfo = fetchedRaster;
                _this.createTextures(context, fetchedRaster);
            })
                .then(function () {
                _this.createParticleSystem(context, rasterInfo.extent);
            });
        };
        ExternalRenderer.prototype.createParticleSystem = function (context, extent) {
            this.particleSystem = new ParticleSystem({
                gl: context.gl,
                view: this.view,
                extent: extent,
                velocityField: this.velocityField,
                reprojection: this.reprojection
            });
        };
        ExternalRenderer.prototype.encodeFloatRGBA = function (value, rgba, offset) {
            var r = value % 1;
            var g = (value * 255) % 1;
            var b = (value * 65025) % 1;
            var a = (value * 16581375) % 1;
            rgba[offset] = r * 255 - g;
            rgba[offset + 1] = g * 255 - b;
            rgba[offset + 2] = b * 255 - a;
            rgba[offset + 3] = a * 255;
        };
        ExternalRenderer.prototype.decodeFloatRGBA = function (rgba, offset) {
            var r = rgba[offset + 0];
            var g = rgba[offset + 1];
            var b = rgba[offset + 2];
            var a = rgba[offset + 3];
            return r / 255 + g / 65025 + b / 16581375 + a / 4228250625;
        };
        ExternalRenderer.prototype.createReprojectionData = function (extent, resolution) {
            if (resolution === void 0) { resolution = 512; }
            var size = resolution * resolution * 4;
            var normalize = function (value, bounds) {
                return (value - bounds[0]) / (bounds[1] - bounds[0]);
            };
            var reprojectionDatas = [
                new Uint8Array(size),
                new Uint8Array(size),
                new Uint8Array(size)
            ];
            var reprojectionBounds = [-6378137, 6378137];
            var reprojectedPoint = [0, 0, 0];
            var byteOffset = 0;
            for (var y = 0; y < resolution; y++) {
                for (var x = 0; x < resolution; x++) {
                    var pt = [
                        extent.xmin + (x + 0.5) / resolution * extent.width,
                        extent.ymax - (y + 0.5) / resolution * extent.height,
                        0
                    ];
                    externalRenderers.toRenderCoordinates(this.view, pt, 0, extent.spatialReference, reprojectedPoint, 0, 1);
                    this.encodeFloatRGBA(normalize(reprojectedPoint[0], reprojectionBounds), reprojectionDatas[0], byteOffset);
                    this.encodeFloatRGBA(normalize(reprojectedPoint[1], reprojectionBounds), reprojectionDatas[1], byteOffset);
                    this.encodeFloatRGBA(normalize(reprojectedPoint[2], reprojectionBounds), reprojectionDatas[2], byteOffset);
                    byteOffset += 4;
                }
            }
            return {
                data: reprojectionDatas,
                bounds: reprojectionBounds,
                resolution: resolution
            };
        };
        ExternalRenderer.prototype.createTextures = function (context, fetchedRaster) {
            var _this = this;
            // Create:
            //   - velocity field texture, X/Y, velocity in m/s
            //   - 3D re-projection texture
            var rasterData = fetchedRaster.rasterData;
            var resolution = rasterData.width;
            var textureDataSize = resolution * resolution * 4 * 2;
            var reprojectionDatas = this.createReprojectionData(fetchedRaster.extent);
            var gl = context.gl;
            this.velocityField = {
                texture: this.createTexture(context.gl, resolution, rasterData, gl.LINEAR),
                offsetU: fetchedRaster.serviceInfo.minValues[0],
                scaleU: fetchedRaster.serviceInfo.maxValues[0] - fetchedRaster.serviceInfo.minValues[0],
                offsetV: fetchedRaster.serviceInfo.minValues[1],
                scaleV: fetchedRaster.serviceInfo.maxValues[1] - fetchedRaster.serviceInfo.minValues[1]
            };
            this.reprojection = {
                textures: reprojectionDatas.data.map(function (data) { return _this.createTexture(context.gl, reprojectionDatas.resolution, data, gl.LINEAR); }),
                offset: reprojectionDatas.bounds[0],
                scale: reprojectionDatas.bounds[1] - reprojectionDatas.bounds[0]
            };
        };
        /**
         * Create a new webgl texture. Wrapping mode is set to repeat on S and clamp on T.
         *
         * @param gl the webgl context
         * @param size the size of the texture
         * @param data the data for the texture
         * @param interpolation the type of interpolation to use
         */
        ExternalRenderer.prototype.createTexture = function (gl, size, data, interpolation) {
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, interpolation);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, interpolation);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
            if (data instanceof Uint8Array) {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
            }
            else {
                // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
            }
            return texture;
        };
        /**
         * Fetches the raster data used for the velocity field. This can come from
         * a ImageServer raster service, but for this demo the resulting image encoding
         * the velocity field is included (no server required). Certain values that
         * usually come from the service are hardcoded here (min and max values, and extent).
         */
        ExternalRenderer.prototype.fetchRaster = function () {
            var requestOptions = {
                responseType: "image",
                allowImageDataAccess: true
            };
            var serviceInfo = {
                minValues: [-27.309999465942383, -22.420000076293945],
                maxValues: [27.65999984741211, 20.969999313354492]
            };
            var extent = new Extent({
                xmin: -20037508.342788905,
                xmax: 20037508.342788905,
                ymin: -20037508.342788905,
                ymax: 20037508.342788905,
                spatialReference: 102100
            });
            return request("./data/wind-global.png", requestOptions)
                .then(function (response) {
                return {
                    serviceInfo: serviceInfo,
                    extent: extent,
                    rasterData: response.data
                };
            });
        };
        return ExternalRenderer;
    }());
    function initialize() {
        view = new SceneView({
            container: "viewDiv",
            map: new Map({
                basemap: "streets-night-vector"
            }),
            constraints: {
                altitude: {
                    min: 7374827,
                    max: 51025096
                }
            },
            camera: {
                position: [-168.491, 23.648, 19175402.86],
                heading: 360.00,
                tilt: 1.37
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
                components: ["compass", "attribution"]
            }
        });
        widgets_1.createFullscreen(view);
        view.then(function () {
            var renderer = new ExternalRenderer(view);
            externalRenderers.add(view, renderer);
        });
        window["view"] = view;
    }
    exports.initialize = initialize;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMDctdmVsb2NpdHktZmxvdy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIjA3LXZlbG9jaXR5LWZsb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7SUF1QkEsSUFBSSxJQUFlLENBQUM7SUFpQnBCO1FBbUNFLHdCQUFZLFVBQW9DO1lBeEJoRCxXQUFXO1lBQ00sd0JBQW1CLEdBQUcsRUFBRSxDQUFDO1lBQ3pCLHVCQUFrQixHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO1lBQzVELGFBQVEsR0FBRyxJQUFJLENBQUM7WUFDaEIsYUFBUSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFbkMsY0FBYztZQUNHLHNCQUFpQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7WUFDdkUsb0JBQWUsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFMUcsc0JBQXNCO1lBQ2QsU0FBSSxHQUFHLENBQUMsQ0FBQztZQWNmLElBQUksQ0FBQyxFQUFFLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1lBRWhDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDO1lBQ3JELElBQUksQ0FBQyxtQkFBbUIsR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDO1lBRW5ELElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1FBQzdCLENBQUM7UUFFRDs7O1dBR0c7UUFDSyw0Q0FBbUIsR0FBM0I7WUFDRSxJQUFJLENBQUMs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