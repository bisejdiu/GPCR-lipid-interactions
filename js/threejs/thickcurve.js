function thickcurve(e){var a,r,s,M,d;function u(){s.aspect=window.innerWidth/window.innerHeight,s.updateProjectionMatrix()}return dir="./data/data/"+e+"/",!1===WEBGL.isWebGLAvailable()&&document.body.appendChild(WEBGL.getWebGLErrorMessage()),function(){var e=[],t=document.getElementById("thickcurve").clientHeight,n=document.getElementById("thickcurve").clientWidth;a=document.getElementById("thickcurve"),(s=new THREE.PerspectiveCamera(45,window.innerWidth/window.innerHeight,.1,2e5)).zoom=1.8,s.position.set(18.37,19.82,103.54),s.lookAt(0,3,1),s.updateProjectionMatrix(),(d=new THREE.WebGLRenderer({antialias:!0})).setSize(500,500),(M=new THREE.Scene).background=new THREE.Color("#ffffff");var l=(new THREE.TextureLoader).load("./data/data/texture/ball.png"),o=new THREE.PLYLoader;e.push(new Promise(function(t,n){o.load(dir+"top_plane_curv.ply",function(e){var i=new THREE.PointsMaterial({size:10,sizeAttenuation:!1,map:l,alphaTest:.5,transparent:!1});particles=new THREE.Points(e,i),particles.name="topPoints",particles.material.color.set("#2f22ff"),M.add(particles),t(particles),n("Could not load file")})})),e.push(new Promise(function(t,n){o.load(dir+"down_plane_curv.ply",function(e){var i=new THREE.PointsMaterial({size:10,sizeAttenuation:!1,map:l,alphaTest:.5,transparent:!1});i.color.set("#cd2121"),particles=new THREE.Points(e,i),particles.name="downPoints",M.add(particles),t(particles),n("Could not load file")})})),e.push(new Promise(function(t,n){o.load(dir+"mid_plane_curv.ply",function(e){var i=new THREE.PointsMaterial({size:10,sizeAttenuation:!1,map:l,alphaTest:.5,transparent:!1});i.color.set("#ffffff"),particles=new THREE.Points(e,i),particles.name="midPoints",M.add(particles),t(particles),n("Could not load file")})})),o.load(dir+"prots.ply",function(e){var t=new THREE.BufferGeometry,n=[],a=new THREE.Lut("blackbody",parseInt(e.attributes.position.count/4)),o=[],r=new THREE.Color;for(arr=0,col=0,i=0;i<e.attributes.position.count;i++)col>=e.attributes.position.count/4&&(col=0),x=e.attributes.position.array[arr+0],y=e.attributes.position.array[arr+1],z=e.attributes.position.array[arr+2],n.push(x,y,z),r.setRGB(a.lut[col].r,a.lut[col].b,a.lut[col].g),o.push(r.r,r.g,r.b),arr+=3,col+=1;t.addAttribute("position",new THREE.Float32BufferAttribute(n,3)),t.addAttribute("color",new THREE.Float32BufferAttribute(o,3));var s=new THREE.PointsMaterial({size:2,vertexColors:THREE.VertexColors,map:l,alphaTest:.5,transparent:!1});t.computeBoundingSphere(),points=new THREE.Points(t,s),points.name="pPoints",M.add(points)}),o.load(dir+"centers.ply",function(e){var t=new THREE.BufferGeometry,n=[],a=[],o=new THREE.Color;for(arr=0,i=0;i<e.attributes.position.count;i++)x=e.attributes.position.array[arr+0],y=e.attributes.position.array[arr+1],z=e.attributes.position.array[arr+2],n.push(x,y,z),o.setRGB(255,255,255),a.push(o.r,o.g,o.b),arr+=3;t.addAttribute("position",new THREE.Float32BufferAttribute(n,3)),t.addAttribute("color",new THREE.Float32BufferAttribute(a,3));var r=new THREE.PointsMaterial({size:1.5,clipShadows:!0,map:l,alphaTest:.5,transparent:!1});t.computeBoundingSphere(),points2=new THREE.Points(t,r),points2.name="cPoints",M.add(points2)}),e.push(new Promise(function(n,a){o.load(dir+"top_plane_curv.ply",function(e){var i=new THREE.MeshStandardMaterial({vertexColors:THREE.VertexColors,roughness:0}),t=new THREE.Mesh(e,i);t.material.side=THREE.DoubleSide,t.name="topCurve",M.add(t),n(t),a("Could not load file")})})),e.push(new Promise(function(n,a){o.load(dir+"top_plane_curv_g.ply",function(e){var i=new THREE.MeshStandardMaterial({vertexColors:THREE.VertexColors,roughness:0}),t=new THREE.Mesh(e,i);t.material.side=THREE.DoubleSide,t.name="topCurveg",t.visible=!1,M.add(t),n(t),a("Could not load file")})})),e.push(new Promise(function(n,a){o.load(dir+"down_plane_curv.ply",function(e){var i=new THREE.MeshStandardMaterial({vertexColors:THREE.VertexColors,roughness:0}),t=new THREE.Mesh(e,i);t.material.side=THREE.DoubleSide,t.name="downCurve",M.add(t),n(t),a("Could not load file")})})),e.push(new Promise(function(n,a){o.load(dir+"down_plane_curv_g.ply",function(e){var i=new THREE.MeshStandardMaterial({vertexColors:THREE.VertexColors,roughness:0}),t=new THREE.Mesh(e,i);t.material.side=THREE.DoubleSide,t.name="downCurveg",t.visible=!1,M.add(t),n(t),a("Could not load file")})})),e.push(new Promise(function(n,a){o.load(dir+"mid_plane_curv.ply",function(e){var i=new THREE.MeshStandardMaterial({vertexColors:THREE.VertexColors,roughness:0}),t=new THREE.Mesh(e,i);t.material.side=THREE.DoubleSide,t.name="midCurve",M.add(t),n(t),a("Could not load file")})})),e.push(new Promise(function(n,a){o.load(dir+"mid_plane_curv_g.ply",function(e){var i=new THREE.MeshStandardMaterial({vertexColors:THREE.VertexColors,roughness:0}),t=new THREE.Mesh(e,i);t.material.side=THREE.DoubleSide,t.name="midCurveg",t.visible=!1,M.add(t),n(t),a("Could not load file")})}));var R=new THREE.AmbientLight(3355443,5);M.add(R);var H=new THREE.DirectionalLight(16777215,1);function P(e){var i=e.toString(16);return 1==i.length?"0"+i:i}H.position.set(0,1,0),M.add(H),(d=new THREE.WebGLRenderer).setSize(500,500),d.gammaInput=!0,d.gammaOutput=!0,d.setPixelRatio(window.devicePixelRatio),d.setSize(n,t),a.appendChild(d.domElement),(r=new THREE.TrackballControls(s,d.domElement)).rotateSpeed=10,r.panSpeed=1,r.staticMoving=!0,r.zoomSpeed=5,r.target.set(20,18,0),Promise.all(e).then(function(e){var i=new dat.GUI({width:240,autoPlace:!1});i.domElement.id="gui",i.open();var t=M.getObjectByName("topPoints"),n=M.getObjectByName("midPoints"),a=M.getObjectByName("downPoints"),o=M.getObjectByName("topCurve"),r=M.getObjectByName("midCurve"),s=M.getObjectByName("downCurve"),l=M.getObjectByName("topCurveg"),d=M.getObjectByName("midCurveg"),u=M.getObjectByName("downCurveg"),c=M.getObjectByName("pPoints"),v=M.getObjectByName("cPoints");curve_visible={top_m:!0,top_g:!1,mid_m:!0,mid_g:!1,down_m:!0,down_g:!1,curve_state:0};var E={topPoints:10,midPoints:10,downPoints:10},f={0:t,1:n,2:a},b={0:o,1:r,2:s},h={0:!0,1:!1,2:!1},w={0:!0,1:!1,2:!1};param={"ambient intensity":R.intensity,saturation:.01,lightness:1,"directional light":1,"protein size":2,"curvature method":0,wireframe:!1},mesh_param={"mesh type":0,roughness:0,metalness:.1,wireframe:!1},point_param={"object type":0,"point size":10},visi_param={"top points":!0,"top plane":!0,"mid points":!0,"mid plane":!0,"down points":!0,"down plane":!0,"protein points":!0,"lipid center points":!0};var g=i.addFolder("Global Parameters");g.add(param,"ambient intensity",0,10).step(.01).onChange(function(e){R.intensity=e}),g.add(param,"directional light",0,10).step(.01).onChange(function(e){H.intensity=e}),g.add(param,"protein size",0,5).step(.01).onChange(function(e){c.material.size=e});var _=i.addFolder("Mesh Properties");_.add(param,"curvature method",{mean:0,gaussian:1}).onChange(function(e){0==e?(o.visible=l.visible,l.visible=!1,r.visible=d.visible,d.visible=!1,s.visible=u.visible,u.visible=!1):(l.visible=o.visible,o.visible=!1,d.visible=r.visible,r.visible=!1,u.visible=s.visible,s.visible=!1),0==e?curve_visible.curve_state=0:1==e&&(curve_visible.curve_state=1)}),_.add(mesh_param,"mesh type",{"top plane":0,"mid plane":1,"down plane":2}).onChange(function(e){for(m in w)w[m]=!1;w[e]=!0}),_.add(mesh_param,"metalness",0,1).step(.01).onChange(function(e){for(m in w)w[m]&&(b[m].material.metalness=e)}),_.add(mesh_param,"roughness",0,1).step(.01).onChange(function(e){for(m in w)w[m]&&(b[m].material.roughness=e)}),_.add(param,"wireframe").onChange(function(e){o.material.wireframe=e,l.material.wireframe=e,r.material.wireframe=e,d.material.wireframe=e,s.material.wireframe=e,u.material.wireframe=e}),_.open();var C=i.addFolder("Point Properties");C.add(point_param,"object type",{"top points":0,"mid points":1,"down points":2}).onChange(function(e){for(p in h)h[p]=!1;h[e]=!0;for(var i=0;i<C.__controllers.length;i++){if("color"==C.__controllers[i].property)for(p in h)h[p]&&(color=f[p].material.color,hex=(t=255*color.r,n=255*color.g,a=255*color.b,"#"+P(t)+P(n)+P(a)),C.__controllers[i].setValue(hex));if("point size"==C.__controllers[i].property)for(p in h)h[p]&&(size=f[p].material.size,C.__controllers[i].setValue(size))}var t,n,a}),C.add(point_param,"point size",1,25).onChange(function(e){for(p in h)h[p]&&(f[p].material.size=e,E[f[p]]=e)});C.addColor({color:"#2f22ff"},"color").onChange(function(e){for(p in h)h[p]&&f[p].material.color.set(e)}),C.open();var T=i.addFolder("Component Visibility");T.add(visi_param,"top points").onChange(function(e){t.visible=e}),T.add(visi_param,"top plane").onChange(function(e){0==curve_visible.curve_state?o.visible=e:1==curve_visible.curve_state&&(l.visible=e)}),T.add(visi_param,"mid points").onChange(function(e){n.visible=e}),T.add(visi_param,"mid plane").onChange(function(e){0==curve_visible.curve_state?r.visible=e:1==curve_visible.curve_state&&(d.visible=e)}),T.add(visi_param,"down points").onChange(function(e){a.visible=e}),T.add(visi_param,"down plane").onChange(function(e){0==curve_visible.curve_state?s.visible=e:1==curve_visible.curve_state&&(u.visible=e)}),T.add(visi_param,"protein points").onChange(function(e){c.visible=e}),T.add(visi_param,"lipid center points").onChange(function(e){v.visible=e}),guis.g=i,document.getElementById("thickcurve").appendChild(i.domElement)},function(){console.log("id didnt work budd")}),window.addEventListener("resize",u,!1)}(),function e(){requestAnimationFrame(e);r.update();d.render(M,s)}(),M}