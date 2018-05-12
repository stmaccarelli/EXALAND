// HELPERS
// GEOMETRY, ANIMATION

var HLH = function() {

	var i,x,y,dynModelsCounter=0;

	// PARTICLE SYSTEMS

	// used to populate a BufferGeometry for a particle system
	function initBufParticleSystem(geometry, worldWidth, worldHeight, amount, randomize, dynamic) {
		var vertexPositions = [];
		for (i = 0; i < amount; i++) {
			if (randomize) {
				vertexPositions.push(
					[Math.random() * worldWidth - worldWidth / 2,
						THREE.Math.randInt( worldHeight*0.5, worldHeight*1.5 ), // TBD find a standard solution
						Math.random() * worldWidth - worldWidth / 2
					]
				);
			} else {
				vertexPositions.push([Math.random() * worldWidth, worldWidth * 10, Math.random() * worldWidth]);
			}
		}
		var vertices = new Float32Array(vertexPositions.length * 3); // three components per vertex

		// components of the position vector for each vertex are stored
		// contiguously in the buffer.
		for (var i = 0; i < vertexPositions.length; i++) {
			vertices[i * 3 + 0] = vertexPositions[i][0];
			vertices[i * 3 + 1] = vertexPositions[i][1];
			vertices[i * 3 + 2] = vertexPositions[i][2];
		}

		// itemSize = 3 because there are 3 values (components) per vertex
		geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
		if (dynamic) geometry.attributes.position.dynamic = true;
	}



  function loopParticles(geometry, worldSize, moveSpeed) {
		for (i = 0; i < geometry.attributes.position.array.length; i += 3) {
			if ( geometry.attributes.position.array[i + 2] > -worldSize * 1.5 ){
				geometry.attributes.position.array[i + 2] += Math.abs( moveSpeed * 1.1 );
			}
			if ( geometry.attributes.position.array[i + 2] >= worldSize * 1.5 ){
				geometry.attributes.position.array[i] = (Math.random()*2-1) * worldSize / 2;
				// geometry.attributes.position.array[i + 2] = (Math.random()*2-1) * worldSize/2;
				geometry.attributes.position.array[i + 2] = - worldSize * 1.5 + .1;
      }
		}
		geometry.attributes.position.needsUpdate = true;
	}

	// function startParticle(geometry, worldSize) {
	// 	for (i = 0; i < geometry.attributes.position.array.length; i+=3) {
	// 		if (geometry.attributes.position.array[i + 2] <= -worldSize) {
	// 			geometry.attributes.position.array[i + 2] = -worldSize + .1;
	// 			break;
	// 		}
	// 	}
	// 	geometry.attributes.position.needsUpdate = true;
	// }


	// function shotFloraCluster(geometry, stepsCount, amountToBurst) {
	//   var skipped = 0;
	// 	var sC = stepsCount / HLE.WORLD_TILES;
	// 	for (i = 0; i < Math.min(geometry.attributes.position.array.length, amountToBurst*3+skipped*3); i+=3) {
	// 		// if particle is inactive at "standby" distance
	// 		if (geometry.attributes.position.array[i + 2] <= -HLE.WORLD_WIDTH) {
	// 			var nX = Math.random();
	// 			geometry.attributes.position.array[i] = (nX * 2 - 1) * (HLE.WORLD_WIDTH / 2);
	// 			geometry.attributes.position.array[i + 2] = -HLE.WORLD_WIDTH * 0.5;
	// 			var nY = (geometry.attributes.position.array[i + 2] / HLE.WORLD_WIDTH + 0.5) * -1; // in range 0 , 0.5
	// 			geometry.attributes.position.array[i + 1] = landHeightNoise(nX, (sC)) ;
	// 			//         HL.geometries.land.vertices[i].y = HLH.landHeightNoise(i / (HL.geometries.land.parameters.widthSegments), (HLE.landStepsCount / HLE.WORLD_TILES) * 0.75 );
	// 			if (geometry.attributes.position.array[i + 1]>0) i-=6;
	// 		} else skipped++;
	// 	}
	// 	geometry.attributes.position.needsUpdate = true;
	// 	console.log("HLH.shotFlora");
	// }
  // HLH.landHeightNoise(
  //  i / (HL.geometries.land.parameters.widthSegments),
  //  (HLE.landStepsCount / HLE.WORLD_TILES) );

	/*
	MODELS MANAGEMENT
	*/

	function resetModel(model){
			model.position.set(0,0,-HLE.WORLD_WIDTH*10);
			model['moving']=false;
	}

	function resetAllModels(){
		for(var key in HL.models)
			if(HL.models[key]!==null)
				HL.models[key].position.set(0,0,-HLE.WORLD_WIDTH*10);
	}


	// starting rotation vector
	var srv = new THREE.Euler( 0, 0, 0, 'YXZ' );

	function startModel(model,xPosition,y,speed,rotations, scale, isParticle, towardsCamera){

		scale = scale || 1;
		isParticle = isParticle!==undefined?isParticle:false;
		model = HL.models[model] || model;
		towardsCamera = towardsCamera === undefined ? true : towardsCamera;

		if(isParticle) HLE.PARTICLE_MODELS_OUT++;
		if(HL.dynamicModelsClones.length >= HLE.MAX_MODELS_OUT + HLE.PARTICLE_MODELS_OUT) return
		dynModelsCounter++;

		speed = speed || 0;
		var x = xPosition || 0;
		y = y || 0;
		rotations = rotations || 'n';

		HL.dynamicModelsClones['m'+dynModelsCounter] = model.clone();
		// assign random color
		// HL.dynamicModelsClones['m'+dynModelsCounter].material = HL.dynamicModelsClones['m'+dynModelsCounter].material.clone();
		// HL.dynamicModelsClones['m'+dynModelsCounter].material.color.setHex( Math.random() * 0xffffff);

		// set starting rotation vector
		srv.setFromQuaternion(HL.cameraGroup.quaternion,'YXZ');
		// assign srv to model
		HL.dynamicModelsClones['m'+dynModelsCounter]['srv'] = srv;

		// set X and Z position of model
		var z = -HLE.WORLD_WIDTH/2;
	  if(towardsCamera){
			x = Math.sin( srv.y + (xPosition/(HLE.WORLD_WIDTH)) ) * z;
			z = Math.cos( srv.y + (xPosition/(HLE.WORLD_WIDTH)) ) * z;
			// set model rotation so it faces camera at start
			HL.dynamicModelsClones['m'+dynModelsCounter].rotateY( srv.y );
		}
		// y === true means we want models attached to landscape
		if(y === true){

			// This works if terrain is generated by CPU
			// y=landHeightNoise((x/HLE.WORLD_WIDTH)+0.5,HLE.landStepsCount/HLE.WORLD_TILES)
			// 	+HL.land.position.y;
			// y=Math.max(y,0);//TODO if y is 0, gotta move according to seawaves, if any ---
			// z=-HLE.WORLD_WIDTH*0.5-HL.land.position.y;

			y=0;
			speed = 0;

			if(y!=0){
				HL.dynamicModelsClones['m'+dynModelsCounter].rotateX((Math.random()-0.5)*3);
				HL.dynamicModelsClones['m'+dynModelsCounter].rotateY((Math.random()-0.5)*3);
				HL.dynamicModelsClones['m'+dynModelsCounter].rotateZ((Math.random()-0.5)*3);
			}
		}

		if(rotations.indexOf('x')!=-1)
			HL.dynamicModelsClones['m'+dynModelsCounter].rotateX((Math.random()-0.5)*3);
		if(rotations.indexOf('y')!=-1)
			HL.dynamicModelsClones['m'+dynModelsCounter].rotateY((Math.random()-0.5)*3);
		if(rotations.indexOf('z')!=-1)
			HL.dynamicModelsClones['m'+dynModelsCounter].rotateZ((Math.random()-0.5)*3);

		HL.dynamicModelsClones['m'+dynModelsCounter].size = model.size;
		HL.dynamicModelsClones['m'+dynModelsCounter].size.multiplyScalar(scale);
		HL.dynamicModelsClones['m'+dynModelsCounter].scale.set(.7+Math.random()*.3+scale, .7+Math.random()*.3+scale, .7+Math.random()*.3+scale);
		HL.dynamicModelsClones['m'+dynModelsCounter]['key']='m'+dynModelsCounter;
		HL.scene.add(HL.dynamicModelsClones['m'+dynModelsCounter]);

		if(isParticle)
			HL.dynamicModelsClones['m'+dynModelsCounter]['isparticle']=true;

		HL.dynamicModelsClones.length++;

		HL.dynamicModelsClones['m'+dynModelsCounter].position.set(x,y,z);
		HL.dynamicModelsClones['m'+dynModelsCounter]["speed"] = speed;
		HL.dynamicModelsClones['m'+dynModelsCounter]["targetY"] = y;
		HL.dynamicModelsClones['m'+dynModelsCounter]['moving'] = true;
		HL.dynamicModelsClones['m'+dynModelsCounter]['rotations'] = rotations;
		HL.dynamicModelsClones['m'+dynModelsCounter]['towardsCamera'] = towardsCamera;
	}



	var rv = new THREE.Euler( 0, 0, 0, 'YXZ' );

	function moveModel(model){


		rv.setFromQuaternion(HL.cameraGroup.quaternion,'YXZ');

		rv.x = Math.sin(rv.y);
		rv.z = Math.cos(rv.y);

		// transform starting camera rotation vector to model angle vector
		model.srv.x = Math.sin(model.srv.y);
		model.srv.z = Math.cos(model.srv.y);

// TODO: testare logica movimento bidirezionale
		if(
		  (model.position.x >= -HLE.WORLD_WIDTH/2) &&
			(model.position.z >= -HLE.WORLD_WIDTH/2)
		){
			// spostamento sul mondo condizionato dalla camera move
			model.position.x += rv.x * HLE.moveSpeed;
			model.position.z += rv.z * HLE.moveSpeed;

			if(model.towardsCamera){
				model.position.x += model.srv.x * model.speed;
				model.position.z += model.srv.z * model.speed;
			}
			else {
				model.position.z += model.speed;// + HLE.moveSpeed;
			}

			if(model.rotations.indexOf('x')!=-1) model.rotateX( Math.max( model.speed, 1 ) * 0.00075 );
			if(model.rotations.indexOf('y')!=-1) model.rotateY( Math.max( model.speed, 1 ) * 0.00075 );
			if(model.rotations.indexOf('z')!=-1) model.rotateZ( Math.max( model.speed, 1 ) * 0.00075 );

			if(model.position.y==HL.sea.position.y){
				model.rotation.x = Math.cos(frameCount*0.003)*0.3 * Math.sin(frameCount*0.003);
				model.rotation.y = Math.sin(frameCount*0.003)*0.3 * Math.cos(frameCount*0.003);;
				model.rotation.z = Math.cos(frameCount*0.003)*0.3;
			}

			// shake cameraGroup when objects approach
			model['dist'] = model.position.distanceTo(HL.camera.position);
			//normalized
			model.dist = Math.min(model.dist/(HLE.WORLD_WIDTH),1);
			model.dist =  Math.pow(1-model.dist,10);
			// TODO: shake camera according to world moving / camera moving vs model moving.
			model.dist = model.speed * model.dist * 0.05 * Math.min( model.size.length()*0.0003,0.001);

			HL.camera.rotation.x += (THREE.Math.randFloat(-1,1) * model.dist );
			HL.camera.rotation.y += (THREE.Math.randFloat(-1,1) * model.dist );
			HL.camera.rotation.z += (THREE.Math.randFloat(-1,1) * model.dist );
		}

		HL.camera.rotation.x*=0.98;
		HL.camera.rotation.y*=0.98;
		HL.camera.rotation.z*=0.98;

		if(
			(model.position.x > HLE.WORLD_WIDTH/2) ||
			(model.position.x < -HLE.WORLD_WIDTH/2) ||
			(model.position.z > HLE.WORLD_WIDTH/2) ||
			(model.position.z < -HLE.WORLD_WIDTH/2)
		){			//resetModel(model);
			HL.scene.remove(model);
			model.material.dispose();
			model.geometry.dispose();
			delete HL.dynamicModelsClones[model.key];

			// if( !HL.dynamicModelsClones['m'+dynModelsCounter].isparticle)
 				HL.dynamicModelsClones.length--;
			// HL.dynamicModelsClones['m'+dynModelsCounter]['key']='m'+dynModelsCounter;
			HL.camera.rotation.x=0;
			HL.camera.rotation.y=0;
			HL.camera.rotation.z=0;
		}
	}

	function destroyAllModels(){
		for(var k in HL.dynamicModelsClones){
			if(k.indexOf('length')===-1){
				HL.scene.remove(HL.dynamicModelsClones[k]);
				HL.dynamicModelsClones[k].material.dispose();
				HL.dynamicModelsClones[k].geometry.dispose();
				delete HL.dynamicModelsClones[k];
			}
		}
		HL.dynamicModelsClones.length = 0;
	}

	// function startModel(model,xPosition,y,speed,rotations, scale, isParticle, towardsCamera){

	startAll = function(){
		HLH.startModel(HL.models[HL.modelsKeys[Math.floor(Math.random()*HL.modelsKeys.length)]],
		 THREE.Math.randInt(-HLE.WORLD_WIDTH/4,HLE.WORLD_WIDTH/4),
		 THREE.Math.randInt(HLE.WORLD_HEIGHT*0.4,HLE.WORLD_HEIGHT*3),
		 .1, 'xyz');    // shoot all models from a group
	}

	function optionalParameter (value, defaultValue) {
    return value !== undefined ? value : defaultValue;
  };

	// startModel( model, xPosition, y, speed, rotations, scale, isParticle, towardsCamera)

	// TODO cambiare parametri funzioni di avvio modelli con struct
	// startGroup = function( params ){
	// 	params = params || {};

	startGroup = function(group, scale, speed, rotations, floating, midpoint, towardsCamera){

		if(group.length){
			// var scale=(typeof group[1] === "function")?group[1]():group[1],
			var scale = group[1],
			 speed=group[2], rotations=group[3], floating=group[4], midpoint = group[5] || 0,
			 towardsCamera = group[6], group = group[0];
		 }

		// if(midpoint===undefined) midpoint=0;
		group = (typeof group==="object")?group:HL.mGroups[group];

		// startModel( model, xPosition, y, speed, rotations, scale, isParticle, towardsCamera)
		HLH.startModel(
			HL.models[ group[Math.floor(Math.random()*group.length)]],
		 THREE.Math.randInt(-HLE.WORLD_WIDTH/4,HLE.WORLD_WIDTH/4),
		 floating?midpoint:THREE.Math.randInt(-HLE.WORLD_HEIGHT*0.01,HLE.WORLD_HEIGHT*1.1)+midpoint,
		 speed,
		 // (rotations?'xyz':null),
		 rotations,
		 scale,
		 false,
		 towardsCamera
			);    // shoot all models from a group
	}



	return {
		// initParticleSystem: function(a, b, c, d, e) {
		// 	return initParticleSystem(a, b, c, d, e)
		// },
		initBufParticleSystem: function(a, b, c, d, e) {
			return initBufParticleSystem(a, b, c, d, e)
		},
		// //  initShootableParticles:function(a,b){       return initShootableParticles(a,b)             },
		// startParticle: function(a, b) {
		// 	return startParticle(a, b)
		// },
		// moveParticles: function(a, b, c) {
		// 	return moveParticles(a, b, c)
		// },
		loopParticles: function(a, b, c) {
			return loopParticles(a, b, c)
		},
		// shuffleUVs:           function(a){          return shuffleUVs(a)                },
		// scaleUVs:             function(a,b){        return scaleUVs(a,b)                },
		// offsetUV:             function(a,b){        return offsetUV(a,b)                },
		// shiftHeights: function(a) {
		// 	return shiftHeights(a)
		// },
		// shiftHeightsBuf: function(a) {
		// 	return shiftHeightsBuf(a)
		// },
		// seaMotion: function(a, b, c, d) {
		// 	return seaMotion(a, b, c, d)
		// },
		// bufSinMotion: function(a, b, c) {
		// 	return bufSinMotion(a, b, c)
		// },
		// shotFloraCluster: function(a, b, c) {
		// 	return shotFloraCluster(a, b, c)
		// },
		// landHeightNoise: function(a, b,c) {
		// 	return landHeightNoise(a, b, c)
		// },
		resetModel: function(a) {resetModel(a)},
		resetAllModels: resetAllModels,
		startModel: function(a,b,c,d,e,f,g,h) {startModel(a,b,c,d,e,f,g,h)},
		startGroup:function(a,b,c,d,e,f,g,h){startGroup(a,b,c,d,e,f,g,h)},
		moveModel: function(a,b) {moveModel(a,b)},
		destroyAllModels:destroyAllModels,
		startAll:startAll,
	}
}();
