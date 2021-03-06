/**
 * @author alteredq / http://alteredqualia.com/
 * @authod mrdoob / http://mrdoob.com/
 * @authod arodic / http://aleksandarrodic.com/
 * @authod fonserbc / http://fonserbc.github.io/
*/

THREE.StereoEffect = function ( renderer ) {

	var _stereo = new THREE.StereoCamera();
	_stereo.aspect = 0.5;

	this.setEyeSeparation = function ( eyeSep ) {

		_stereo.eyeSep = eyeSep;

	};

	this.setSize = function ( width, height ) {

		renderer.setSize( width, height );

	};

	this.render = function ( scene, camera, renderTarget ) {

		scene.updateMatrixWorld();

		if ( camera.parent === null ) camera.updateMatrixWorld();

		_stereo.update( camera );

		var size = renderer.getSize();
		/* EXALAND MOD PreserveDrawingBuffer) */
		if ( renderer.autoClear && renderer.preserveDrawingBuffer==false) renderer.clear();

		// renderer.setRenderTarget( renderTarget );
		renderer.setScissorTest( true );


		renderer.setScissor( 0, 0, size.width / 2, size.height );
		renderer.setViewport( 0, 0, size.width / 2, size.height );
		renderer.render( scene, _stereo.cameraL, renderTarget );

		renderer.setScissor( size.width / 2, 0, size.width / 2, size.height );
	  renderer.setViewport( size.width / 2, 0, size.width / 2, size.height );
		renderer.render( scene, _stereo.cameraR, renderTarget );

		renderer.setScissorTest( false );



	};

};
