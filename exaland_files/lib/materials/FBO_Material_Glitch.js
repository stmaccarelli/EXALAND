var FBO_Material_Glitch = function(){
  var t = this;
  this.mat = new THREE.MeshBasicMaterial({color: 0xffffff, map: HL.glitchFBO.texture });

  this.mat.onBeforeCompile = function( shader ){

    shader.uniforms.amount = { value: 0 };
    shader.uniforms.iTime = { value: 0 };

    shader.uniforms._blackout = { value: false  };
    shader.uniforms._posterize = { value: false };
    shader.uniforms._glitchUV = { value: false };
    // shader.uniforms._texelMix = { value: false };
    shader.uniforms._BW = { value: false };
    shader.uniforms._shitmage_on = { value: false };
    shader.uniforms._shitmage = { value: new THREE.Texture() };

    shader.fragmentShader =`
    uniform float amount;\n
    uniform float iTime;\n

    uniform bool _blackout;\n
    uniform bool _posterize;\n
    uniform bool _glitchUV;\n
    // uniform bool _texelMix;\n
    uniform bool _BW;\n
    uniform bool _shitmage_on;\n
    uniform sampler2D _shitmage;\n
    ` + shader.fragmentShader;


      shader.fragmentShader =  `
        vec4 posterize(vec4 color, float numColors)
        {
            return floor(color * numColors - 0.5) / numColors;
        }

        vec2 quantize(vec2 v, float steps)
        {
            return floor(v * steps) / steps;
        }

        float dist(vec2 a, vec2 b)
        {
            return sqrt(pow(b.x - a.x, 2.0) + pow(b.y - a.y, 2.0));
        }
        ` + shader.fragmentShader;


        // `#ifdef USE_MAP
        //   float amount = pow( glitch, 2.0 );
        //   vec2 pixel = glitch / vec2( 20.0, 20.0);
        //   vec4 color = texture2D( map, vUv );
        //   float t = mod(mod(iTime, amount * 100.0 * (amount - 0.5)) * 109.0, 1.0);
        //   vec4 postColor = posterize(color, 16.0);
        //   vec4 a = posterize( texture2D(map, quantize(vUv, 64.0 * t) +  (postColor.rb - vec2(.5)) * 100.0), 5.0).rbga;
        //   vec4 b = posterize( texture2D(map, quantize(vUv, 32.0 - t) +  (postColor.rg - vec2(.5)) * 1000.0), 4.0).gbra;
        //   vec4 c = posterize( texture2D(map, quantize(vUv, 16.0 + t) +  (postColor.rg - vec2(.5)) * 20.0), 16.0).bgra;
        //
        // 	vec4 texelColor = mix(
        //             texture2D(map,
        //                             vUv + amount * (quantize((a * t - b + c - (t + t / 2.0) / 10.0).rg, 16.0) - vec2(.5)) * pixel * 100.0),
        //                   (a + b + c) / 3.0,
        //                   (0.5 - (dot(color, postColor) - 1.5)) * amount);
        //
        // 	diffuseColor *= texelColor;
        //
        // #endif `

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `#ifdef USE_MAP


          float nAmount = pow( amount, 2.0 ) / 2.0;

          vec4 color = texture2D( map , vUv );;

          if( _glitchUV == true ){
            vec2 pixel = amount / vec2( 500.0, 500.0);
            float t = mod(mod(iTime, nAmount * 100.0 * ( nAmount - 0.5)) * 100.0, 1.0);
            vec4 b; vec4 c;
             b = posterize( texture2D( map , quantize(vUv, 32.0 - t) + pixel * (color.gb - vec2(.5)) * 1000.0), 4.0).gbra;
             c = posterize( texture2D( map , quantize(vUv, 16.0 + t) + pixel * (color.br - vec2(.5)) * 20.0), 3.0).bgra;
             color = mix(
                        texture2D( map , vUv + nAmount * ( quantize( (color * t - b + c - (t + t / 2.0) / 10.0).rg, 8.0) - vec2(.5)) * 100.0),
                              (color) ,
                              (0.5 - (dot(color, color) - 1.5)) * nAmount);
          }


          if( _posterize == true ){
            color = posterize( color, max( 100.0 - amount * 5000.0, 3.0 ) ) * ( 1.0 + nAmount * 1000.0);
          }



          diffuseColor *= color;

          if( _shitmage_on == true ){
            vec4 shit = texture2D( _shitmage , vUv + rand( vec2( -0.125 * iTime, 0.125 * iTime) ) - rand( vec2( -0.05124 * iTime, 0.051251 * iTime)  )  );
            if( length(diffuseColor.rgb) > .5 ){
              diffuseColor = shit;
            }

          }


          if ( _blackout == true ){
            diffuseColor *= min( amount * 80.0, 1.0 );
          }

         if ( _BW == true ){
           diffuseColor = diffuseColor.rrra;
         }

        #endif `
      );

    t.mat['materialShader'] = shader;
  }




  return this.mat;

}
