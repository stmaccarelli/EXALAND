var GUI=function(){var c,a={tiles:HLE.WORLD_TILES,repeatUV:1,bFactor:.5,cFactor:.5,landSeed:10,natural:.5,rainbow:.5,squareness:.25,map:"land1",landRGB:0,horizonRGB:0};return{guiInit:function(){c=new dat.GUI;var d={randomizeMap:function(){HL.land.material.uniforms.map.value=HL.textures[(.5<Math.random()?"land":"pattern")+(1+Math.round(4*Math.random()))]},randomizeTerra:function(){a.tiles=Math.round(Math.random()*HLE.WORLD_TILES);a.repeatUV=a.tiles*Math.random();HL.land.geometry=new THREE.PlaneBufferGeometry(HLE.WORLD_WIDTH,
HLE.WORLD_WIDTH,a.tiles,a.tiles);HL.land.geometry.rotateX(-Math.PI/2);HL.land.material.uniforms.worldTiles.value=a.tiles;HL.land.material.uniforms.repeatUV.value=new THREE.Vector2(a.repeatUV,a.repeatUV)},randomizeColors:function(){HLC.land.setRGB(.5+.5*Math.random(),.5+.5*Math.random(),.5+.5*Math.random());HLC.horizon.setRGB(Math.random()/2,Math.random()/2,Math.random()/2);HLC.tempHorizon.set(HLC.horizon);a.landRGB=HLC.land.getHex();a.horizonRGB=HLC.horizon.getHex()},randomizeLand:function(){d.randomizeTerra();
d.randomizeColors();HL.land.material.uniforms.bFactor.value=a.bFactor=Math.random();HL.land.material.uniforms.cFactor.value=a.cFactor=.3*Math.random();a.map=(.5<Math.random()?"land":"pattern")+(1+Math.round(4*Math.random()));HL.land.material.uniforms.map.value=HL.textures[a.map];HL.land.material.uniforms.natural.value=a.natural=Math.random();HL.land.material.uniforms.rainbow.value=a.rainbow=Math.random();HL.land.material.uniforms.squareness.value=a.squareness=.125*Math.random();HL.skybox.rotateY(Math.random())},
showParams:function(){alert(JSON.stringify(a,null,4))}};c.add(d,"randomizeMap");c.add(d,"randomizeTerra");c.add(d,"randomizeColors");c.add(d,"randomizeLand");c.add(d,"showParams");c.add(HL.land.material.uniforms.worldTiles,"value",1,HLE.WORLD_TILES).step(1).name("tiles").listen().onChange(function(b){HL.land.geometry=new THREE.PlaneBufferGeometry(HLE.WORLD_WIDTH,HLE.WORLD_WIDTH,b,b);HL.land.geometry.rotateX(-Math.PI/2);HL.land.material.uniforms.worldTiles.value=b;a.tiles=b});c.add(a,"repeatUV",1,
a.tiles).step(1).listen().onChange(function(b){HL.land.material.uniforms.repeatUV.value=new THREE.Vector2(b,b);a.repeatUV=b});c.add(HL.land.material.uniforms.bFactor,"value",0,1.001).name("bFactor").listen().onChange(function(b){a.bFactor=b});c.add(HL.land.material.uniforms.cFactor,"value",0,1.001).name("cFactor").listen().onChange(function(b){a.cFactor=b});c.add(HL.land.material.uniforms.landSeed,"value",0,100.1).name("landSeed").listen().onChange(function(b){a.landSeed=b});c.add(HL.land.material.uniforms.natural,
"value",0,1.001).name("natural").listen().onChange(function(b){a.natural=b});c.add(HL.land.material.uniforms.rainbow,"value",0,1.001).name("rainbow").listen().onChange(function(b){a.rainbow=b});c.add(HL.land.material.uniforms.squareness,"value",1E-5,.2501).name("squareness").listen().onChange(function(b){a.squareness=b});c.add(a,"map").listen().onChange(function(b){HL.land.material.uniforms.map.value=HL.textures[b];a.map=b});c.addColor(a,"horizonRGB").listen().onChange(function(b){HLC.horizon.set(b);
HLC.tempHorizon.set(b);a.horizonRGB=HLC.horizon.getHex()});c.addColor(a,"landRGB").listen().onChange(function(b){HLC.land.set(b);a.landRGB=HLC.land.getHex()})},params:a,gui:c}};
