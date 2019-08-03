if ( WEBGL.isWebGLAvailable() === false ) {

    document.body.appendChild( WEBGL.getWebGLErrorMessage() );

}

var container, stats, clock, controls;
var camera, scene, renderer, elf;

init();
animate();

function init() {

    container = document.getElementById( 'container' );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 200000 );

    camera.zoom = 1.8
    camera.position.set( 18.37, 19.82, 103.54 );
    camera.lookAt( 0, 3, 1 );
    camera.updateProjectionMatrix()

    renderer = new THREE.WebGLRenderer({antialias : true});

    scene = new THREE.Scene();
    scene.background = new THREE.Color( '#ffffff'  )

    var loader = new THREE.PLYLoader();
    loader.load( './data/tests/top_plane.ply', function ( geometry ) {

        var sprite = new THREE.TextureLoader().load( './data/tests/ball.png' );
        var materials = new THREE.PointsMaterial({   // vertexColors: THREE.VertexColors,
                                                     size: 10,
                                                     sizeAttenuation: false,
                                                     map: sprite,
                                                     alphaTest: 0.5, transparent: false });

        particles = new THREE.Points(geometry, materials);
        particles.name = "topPoints"
        particles.material.color.set('#2f22ff')

        scene.add( particles );
    } );

    loader.load( './data/tests/down_plane.ply', function ( geometry ) {

        var sprite = new THREE.TextureLoader().load( './data/tests/ball.png' );
        var materials = new THREE.PointsMaterial({   size: 10,
                                                     sizeAttenuation: false,
                                                     map: sprite,
                                                     alphaTest: 0.5, transparent: false });

        materials.color.set('#cd2121')
        particles = new THREE.Points(geometry, materials);
        particles.name = "downPoints"
        scene.add( particles );
    } );

    loader.load( './data/tests/mid_plane.ply', function ( geometry ) {

        var sprite = new THREE.TextureLoader().load( './data/tests/ball.png' );
        var materials = new THREE.PointsMaterial({	 size: 10,
                                                     sizeAttenuation: false,
                                                     map: sprite,
                                                     alphaTest: 0.5, transparent: false });

        materials.color.set("#ffffff")
        particles = new THREE.Points(geometry, materials);
        particles.name = "midPoints"
        scene.add( particles );
    } );



    loader.load( './data/tests/prots.ply', function ( g ) {

        var geometry = new THREE.BufferGeometry();

        var positions = [];
        var lut = new THREE.Lut( "blackbody", parseInt((g.attributes.position.count/4)+50) );
        var colors = [];
        var color = new THREE.Color();

        arr = 0
        col = 50
        for ( i = 0; i < g.attributes.position.count; i ++ ) {

            // populate positions
            x = g.attributes.position.array[arr+0]
            y = g.attributes.position.array[arr+1]
            z = g.attributes.position.array[arr+2]
            positions.push( x, y, z );

            // populate colors
            color.setRGB( lut.lut[col].r, lut.lut[col].b, lut.lut[col].g );
            colors.push( color.r, color.g, color.b );

            // increments
            arr = arr + 3
            if (col >= (273+49)) {
                col = 50
            }
            col = col + 1

        }


        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        var sprite = new THREE.TextureLoader().load( './data/tests/ball.png' );
        var material = new THREE.PointsMaterial( { size: 2,
                                                   vertexColors: THREE.VertexColors,
                                                   map: sprite,
                                                   alphaTest: 0.5, transparent: false } );

        geometry.computeBoundingSphere();

        points = new THREE.Points( geometry, material );
        points.name = "pPoints"
        scene.add( points );

    } );


    loader.load( './data/tests/centers.ply', function ( g ) {

        var geometry = new THREE.BufferGeometry();

        var positions = [];
        var lut = new THREE.Lut( "blackbody", parseInt(g.attributes.position.count/4) );
        var colors = [];
        var color = new THREE.Color();


        arr = 0
        col = 500
        for ( i = 0; i < g.attributes.position.count; i ++ ) {

            // populate positions
            x = g.attributes.position.array[arr+0]
            y = g.attributes.position.array[arr+1]
            z = g.attributes.position.array[arr+2]
            positions.push( x, y, z );

            // populate colors
            color.setRGB( lut.lut[col].r, lut.lut[col].b, lut.lut[col].g );
            colors.push( color.r, color.g, color.b );

            // increments
            arr = arr + 3
        }


        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

        var sprite = new THREE.TextureLoader().load( './data/tests/ball.png' );
        var material = new THREE.PointsMaterial( { size: 1,
                                                   clipShadows : true,
                                                   map: sprite,
                                                   alphaTest: 0.5, transparent: false } );
        // material.envMap = envMap;
        geometry.computeBoundingSphere();

        points2 = new THREE.Points( geometry, material );
        points2.name = "cPoints";
        scene.add( points2 );

    } );


    // var loader = new THREE.PLYLoader();
    loader.load( './data/tests/top_plane_curv.ply', function ( geometry ) {

        // var r = "textures/cube/Bridge2/";
        // var urls = [ r + "posx.jpg", r + "negx.jpg",
        // 			r + "posy.jpg", r + "negy.jpg",
        // 			r + "posz.jpg", r + "negz.jpg" ];

        // textureCube = new THREE.CubeTextureLoader().load( urls );
        // textureCube.format = THREE.RGBFormat;
        // textureCube.mapping = THREE.CubeReflectionMapping;
        // textureCube.encoding = THREE.sRGBEncoding;


        var material = new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors,
                                                        roughness: 0,
                                                        // envMap: textureCube,
                                                        // envMapIntensity: 2
                                                        });
        var mesh = new THREE.Mesh( geometry, material );
        mesh.material.side = THREE.DoubleSide;
        mesh.name = "topCurve";

        scene.add( mesh );

    } );

    loader.load( './data/tests/top_plane_curv_g.ply', function ( geometry ) {

        var material = new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors,
                                                        roughness: 0 });
        var mesh = new THREE.Mesh( geometry, material );
        mesh.material.side = THREE.DoubleSide;
        mesh.name = "topCurveg";
        mesh.visible = false;

        scene.add( mesh );

    } );

    loader.load( './data/tests/down_plane_curv.ply', function ( geometry ) {

        var material = new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors,
                                                        roughness: 0  });
        var mesh = new THREE.Mesh( geometry, material );
        mesh.material.side = THREE.DoubleSide;
        mesh.name = "downCurve";

        scene.add( mesh );

    } );

    loader.load( './data/tests/down_plane_curv_g.ply', function ( geometry ) {

        var material = new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors,
                                                        roughness: 0  });
        var mesh = new THREE.Mesh( geometry, material );
        mesh.material.side = THREE.DoubleSide;
        mesh.name = "downCurveg";
        mesh.visible = false;

        scene.add( mesh );

    } );

    loader.load( './data/tests/mid_plane_curv.ply', function ( geometry ) {

        var material = new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors,
                                                        roughness: 0  });
        var mesh = new THREE.Mesh( geometry, material );
        mesh.material.side = THREE.DoubleSide;
        mesh.name = "midCurve";

        scene.add( mesh );

    } );

    loader.load( './data/tests/mid_plane_curv_g.ply', function ( geometry ) {

        var material = new THREE.MeshStandardMaterial({ vertexColors: THREE.VertexColors,
                                                        roughness: 0  });
        var mesh = new THREE.Mesh( geometry, material );
        mesh.material.side = THREE.DoubleSide;
        mesh.name = "midCurveg";
        mesh.visible = false;

        scene.add( mesh );

    } );


    var ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
    scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 10 );
    directionalLight.position.set( 0, 1, 0 ) //.normalize();
    scene.add( directionalLight );

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // controls
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 10;
    controls.panSpeed = 1;
    controls.staticMoving = true;
    controls.zoomSpeed = 5;
    controls.target.set( 20, 18, 0 );


    setTimeout(function() {
        var gui = new dat.GUI( { width: 300 } );
        gui.open();

        var topPoints = scene.getObjectByName('topPoints');
        var midPoints = scene.getObjectByName('midPoints');
        var downPoints = scene.getObjectByName('downPoints');

        var topCurve = scene.getObjectByName('topCurve');
        var midCurve = scene.getObjectByName('midCurve');
        var downCurve = scene.getObjectByName('downCurve');

        var topCurveg = scene.getObjectByName('topCurveg');
        var midCurveg = scene.getObjectByName('midCurveg');
        var downCurveg = scene.getObjectByName('downCurveg');

        var pPoints = scene.getObjectByName('pPoints');
        var cPoints = scene.getObjectByName('cPoints');

        curve_visible = {
            "top_m" : true,
            "top_g" : false,
            "mid_m" : true,
            "mid_g" : false,
            "down_m" : true,
            "down_g" : false,
            "curve_state" : 0
        }

        var size_dict = {
            topPoints: 10,
            midPoints : 10,
            downPoints : 10,
        }

        var point_obj_dict = {
            0 : topPoints,
            1 : midPoints,
            2 : downPoints,
        }

        var mesh_obj_dict = {
            0 : topCurve,
            1 : midCurve,
            2 : downCurve
        }

        var point_dict = {
            0 : true,
            1 : false,
            2 : false,
        }

        var mesh_dict = {
            0 : true,
            1 : false,
            2 : false
        }


    param = {
        motion: true,
        'intensity': ambientLight.intensity,
        "curvature method" : 0,
        'wireframe' :  false,
    };

        mesh_param = {
            "mesh type" : 0,
            "roughness" : 0,
            "metalness" : 0.1,
            "wireframe" : false,
        }

        point_param = {
            "object type" : 0,
            "point size" : 10,
        }

        visi_param = {
            "top points" : true,
            "top plane" : true,
            "mid points" : true,
            "mid plane" : true,
            "down points" : true,
            "down plane" : true,
            "protein points" : true,
            "lipid center points" : true
        }

    var globalParams = gui.addFolder( 'Global Parameters' );

    globalParams.add(param, 'intensity', 0, 5).step(0.01).onChange( function ( val ) {
        ambientLight.intensity = val;
    })

    globalParams.add(param, 'curvature method', {
        "mean" : 0,
        "gaussian" : 1
    }).onChange( function ( val ) {
        topCurve.visible = !topCurve.visible
        topCurveg.visible = !topCurveg.visible

        midCurve.visible = !midCurve.visible
        midCurveg.visible = !midCurveg.visible

        downCurve.visible = !downCurve.visible
        downCurveg.visible = !downCurveg.visible

        if (val == 0) {
            curve_visible["curve_state"] = 0;
        } else if (val == 1) {
            curve_visible["curve_state"] = 1;
        }
    })

    globalParams.add(param, 'wireframe').onChange( function ( val ) {
        topCurve.material.wireframe = val;
        topCurveg.material.wireframe = val;
        midCurve.material.wireframe = val;
        midCurveg.material.wireframe = val;
        downCurve.material.wireframe = val;
        downCurveg.material.wireframe = val;
    })

    var meshParams = gui.addFolder( 'Mesh Properties' );
    meshParams.add(mesh_param, "mesh type", {
        "top plane" : 0,
        "mid plane" : 1,
        "down plane" : 2
    } ).onChange( function ( val ) {
        for (m in mesh_dict) {
            mesh_dict[m] = false;
        }
        mesh_dict[val] = true;
    })

    meshParams.add(mesh_param, "metalness", 0, 1.0).step(0.01).onChange( function ( val ) {
        for (m in mesh_dict) {
            if (mesh_dict[m]) {
                mesh_obj_dict[m].material.metalness = val;
            }
        }
    })

    meshParams.add(mesh_param, "roughness", 0, 1.0).step(0.01).onChange( function ( val ) {
        for (m in mesh_dict) {
            if (mesh_dict[m]) {
                mesh_obj_dict[m].material.roughness = val;
            }
        }
    })
    meshParams.open();

    var pointParams = gui.addFolder( 'Point Properties' );
    pointParams.add(point_param, 'object type', {
        "top points" : 0,
        "mid points" : 1,
        "down points" : 2,
    } ).onChange( function ( val ) {

        for (p in point_dict) {
            point_dict[p] = false;
        }
        point_dict[val] = true;

    })

    pointParams.add(point_param, 'point size', 1, 25).onChange( function ( val ) {
        for (p in point_dict) {
            if (point_dict[p]) {
                point_obj_dict[p].material.size = val
                size_dict[point_obj_dict[p]] = val
            }
        }
    });

    var conf = { color : '#2f22ff' };
    pointParams.addColor(conf, 'color').onChange( function ( val ) {
        for (p in point_dict) {
            if (point_dict[p]) {
                point_obj_dict[p].material.color.set(val);
            }
        }
    });
    pointParams.open()


    // toggle the visibility of components
    var toggleVisibility = gui.addFolder('Component Visibility');
    toggleVisibility.add(visi_param, 'top points').onChange( function ( val ) {
        topPoints.visible = val
    });

    toggleVisibility.add(visi_param, 'top plane').onChange( function ( val ) {
        if (curve_visible["curve_state"] == 0) {
            topCurve.visible = val
        } else if (curve_visible["curve_state"] == 1) {
            topCurveg.visible = val
        }
    });

    toggleVisibility.add(visi_param, 'mid points').onChange( function ( val ) {
        midPoints.visible = val
    });

    toggleVisibility.add(visi_param, 'mid plane').onChange( function ( val ) {
        if (curve_visible["curve_state"] == 0) {
            midCurve.visible = val
        } else if (curve_visible["curve_state"] == 1) {
            midCurveg.visible = val
        }
    });

    toggleVisibility.add(visi_param, 'down points').onChange( function ( val ) {
        downPoints.visible = val
    });

    toggleVisibility.add(visi_param, 'down plane').onChange( function ( val ) {
        if (curve_visible["curve_state"] == 0) {
            downCurve.visible = val
        } else if (curve_visible["curve_state"] == 1) {
            downCurveg.visible = val
        }
    });

    toggleVisibility.add(visi_param, 'protein points').onChange( function ( val ) {
        pPoints.visible = val
    });

    toggleVisibility.add(visi_param, 'lipid center points').onChange( function ( val ) {
        cPoints.visible = val
    });

    }, 1000)


    // listener
    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
}

function render() {
    renderer.render( scene, camera );
}
