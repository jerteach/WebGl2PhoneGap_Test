//*****************
// DECLARATION DES VARIABLES GLOBALES
//*****************
//-----Zoom sur canvas
var Zoomer = 45;
//-----Dimensions des éléments de la page, 
var	Bandeau_Top_H 		= 10,
	Bandeau_Bottom_H 	= 10,
	Bandeau_Left_W		= 10,
	Bandeau_Right_W		= 10,
	Bandeau_Margin		= 2,
	Canvas_horizontal_margin	= Bandeau_Right_W + Bandeau_Left_W + Bandeau_Margin*2,
	Canvas_vertical_margin 		= Bandeau_Top_H  + Bandeau_Bottom_H + Bandeau_Margin*2;
//*****************	
var data_CURSOR =[["butt"],["m",0,0],["l",1,0],["l",1,1],["l",0,1],["l",0,0]];
var fps_timer;
var animation_timer;
var PaintCount = 0;
var MouseDown = false;
var MouseX;
var MouseY;
var action_mode = null;
var clicked_object = null;
var Over_Tile = null;
var Tile_drawer = null;
var keyDOWN = false;
var keyLEFT = false;
var keyRIGHT = false;
var keyUP = false;
var keySHIFT = false;
var TileW = 64; //TileSize
var TileH = TileW/2;
var dTileW=TileW/0.707;
var dTileH = TileH/0.707;
var caseW = TileW/2;
var caseH = TileH/2;
var mlt=1.;
var str =1;
var rad =1;
var spriteSheetW = 10;
var spriteSheetH = 8;
var wr = 600./1024.;
var hr = 635./1024.;
var nb_sprite = 400;
var spriteS= [];
var SL = 0;
var s_baseW = 60.;
var s_baseH = 80.;
var s_ratio = 0.5;
var s_displayW = s_baseW* s_ratio;
var s_displayH = s_baseH* s_ratio;
window.onload = function(){
	//document.getElementById("rad_r").setAttribute("onchange","rad = this.value;startup();");
	//document.getElementById("der_r").setAttribute("onchange","str = this.value; startup();");
	//on initialise les timers pour le calcul des fps et la fréquence des animations
	fps_timer = animation_timer = Date.now();
	//on redimensionne le canvas à la taille de la fenêtre
	var Cnv = document.getElementById("canvas");
	resize_window(Cnv);
	//on crée une image à partir d'un canvas pour le curseur
	var cursor_url = create_canvas_button(128,128,null,"red",8,data_CURSOR).toDataURL("image/png");
	//on regroupe les url des textures qui serviront dans l'animation
	Images_list = ["spritesheet.png"];
	//on crée l'objet Webgl2d
	Gl2d = create_WebGl2d(Cnv,Images_list,startup);
	// on crée l'objet map layout où seront stockés les données de la map
	//layout = new Map_layout();
	//on crée la barre d'outils du haut
	var top_toolbar = new Toolbar("bandeau_top",50,50,"#808080","black");
	//on crée des objets ACTIONS pour les différents outils/modes disponibles
//	var add_btn = new_ACTION_mode(Mode_ADD_surface,top_toolbar);
//	var diag_btn = new_ACTION_mode(Mode_ADDLINE_surface,top_toolbar);
//	var grass_btn = new_ACTION_mode(Mode_ADDGRASS_surface,top_toolbar);
	//var edit_btn = new_ACTION_mode(Mode_EDIT_surface,top_toolbar);
	//var sig_btn = new_ACTION_mode(Mode_SIG_surface,top_toolbar);
	//on vide les variables contenant les coordonnées de dessin
//	Mode_ADD_surface =Mode_EDIT_surface= Mode_SIG_surface=data_CURSOR =null;
	//on déclare des écouteurs sur la fenêtre et le canvas
	Gl2d.canvas.onclick=function(){window_clic();}
	Gl2d.canvas.addEventListener('mousemove', function(evt){
		var mousePos = getMousePos(Gl2d.canvas, evt);
		MouseX = mousePos.x;
		MouseY = mousePos.y;
	});
	var sprite_surf = s_baseW*s_baseH;
	var screen_surf = Cnv.width * Cnv.height;
	var display_surf = screen_surf/nb_sprite;
	var ratio_display = display_surf/sprite_surf;
	var display_w = s_baseW*ratio_display;
	var display_h =s_baseH*ratio_display;
	var nb_per_row = Math.round(Cnv.width/display_w);
	var nb_row = Math.round(Cnv.height/display_h);
	for(i=0;i< 4;i++){
		for(j=0;j<4;j++){
			var sp =  new sprite( );
			sp.X =j * (s_displayW);
			sp.Y =i * (s_displayH );
			sp.fx =0;
			sp.fy =Math.floor(Math.random()*8);
			sp.ct_frame = Math.floor(Math.random()*8);
			spriteS.push(sp);
		}
	}
SL = spriteS.length;
}
function sprite(){
	this.X ;
	this.Y;
	this.fx;
	this.fy ;
}
function startup(){
//
	var Time = Date.now();
	var anim_delay = Time-animation_timer;
	if(anim_delay >= 1000/40){
		var sprites_render_coords = new Float32Array(SL*12);
		var sprites_src_coords = new Float32Array(SL*12);
		for(i=0;i<SL;i++){
			var sprt = spriteS[SL-1-i];
			var sW = (1*wr)/spriteSheetW*1;
			var sH = (1*hr)/spriteSheetH*1;
			var startX = sprt.fx * sW;
			var startY = sprt.fy *sH;
			var ii = i*12;
			sprites_src_coords[ii]   = sprites_src_coords[ii+6] = startX*1.0;
			sprites_src_coords[ii+1] = sprites_src_coords[ii+7] = startY*1.0;
			
			sprites_src_coords[ii+2] = sprites_src_coords[ii+8] = startX+sW*1.0;
			sprites_src_coords[ii+3] = sprites_src_coords[ii+9] = startY+sH*1.0;
			
			sprites_src_coords[ii+4] = startX+sW*1.0;
			sprites_src_coords[ii+5] = startY*1.0;
			
			sprites_src_coords[ii+10] = startX*1.0;
			sprites_src_coords[ii+11] = startY+sH*1.0;
			//
			var	PtX = sprt.X;
			var PtY = sprt.Y;
			
			sprites_render_coords[ii]   = sprites_render_coords[ii+6] = PtX*1.0;
			sprites_render_coords[ii+1] = sprites_render_coords[ii+7] = PtY*1.0;
			
			sprites_render_coords[ii+2] = sprites_render_coords[ii+8] = PtX+s_displayW*1.0;
			sprites_render_coords[ii+3] = sprites_render_coords[ii+9] = PtY+s_displayH*1.0;
			
			sprites_render_coords[ii+4] = PtX+s_displayW*1.0;
			sprites_render_coords[ii+5] = PtY*1.0;
			
			sprites_render_coords[ii+10] = PtX*1.0;
			sprites_render_coords[ii+11] = PtY+s_displayH*1.0;
			
			sprt.ct_frame+=1;
			if(sprt.ct_frame>1){
				sprt.fx+=1;
				sprt.ct_frame=0;
				if(sprt.fx > 9){
					sprt.fx=0;
				}
				if(Math.floor(Math.random()*10) == 1){
					sprt.fy+=1;
					
					if(sprt.fy>7){
						sprt.fy=0;
					}
				}
				
			}
			
		}
		Gl2d.gl.bindFramebuffer(Gl2d.gl.FRAMEBUFFER, null);
		Gl2d.gl.clearColor(.0,.0,.5,1.);
		Gl2d.gl.clear(Gl2d.gl.COLOR_BUFFER_BIT);
	//rendu normal
		Gl2d.active_texture(0);
		Gl2d.TexDraw();
		Gl2d.gl.viewport(0, 0, Gl2d.canvas.width,Gl2d.canvas.height);
		Gl2d.gl.uniform1f(Gl2d.tex_depth,0.2);
		Gl2d.gl.uniform1f(Gl2d.Alpha,1.);
		Gl2d.gl.uniform2f(Gl2d.gl.getUniformLocation( Gl2d.tex_program, 'uPosition' ), 0.0, 0.0);
		Gl2d.gl.uniform1f(Gl2d.gl.getUniformLocation( Gl2d.tex_program, 'uRotation' ), 0.0, 0.0);

		Gl2d.gl.uniform2f(Gl2d.gl.getUniformLocation( Gl2d.tex_program, 'resolution' ),  Gl2d.canvas.width,Gl2d.canvas.height);
		Gl2d.gl.uniform2f(Gl2d.gl.getUniformLocation( Gl2d.tex_program, 'aspect' ), Gl2d.canvas.width/Gl2d.canvas.height, 1.0);
		Gl2d.gl.bindBuffer(Gl2d.gl.ARRAY_BUFFER, Gl2d.texBuffer);	
		Gl2d.gl.vertexAttribPointer(Gl2d.tex_texCoordLocation, 2, Gl2d.gl.FLOAT, false, 0, 0);
		Gl2d.gl.bufferData(Gl2d.gl.ARRAY_BUFFER, new Float32Array(sprites_src_coords), Gl2d.gl.STATIC_DRAW);
		Gl2d.gl.bindBuffer(Gl2d.gl.ARRAY_BUFFER, Gl2d.buffer);	
		Gl2d.gl.bufferData(Gl2d.gl.ARRAY_BUFFER, new Float32Array(sprites_render_coords), Gl2d.gl.STATIC_DRAW);
		Gl2d.gl.drawArrays(Gl2d.gl.TRIANGLES, 0, SL*6);
		
		PaintCount++;
		animation_timer = Time;
	}
	
	
	
	requestAnimationFrame(startup);
}
function startup2(){

	//Gl2d.fx_TexDraw();
	
	Gl2d.gl.clearColor(0.75,0.2,.5,1);
	Gl2d.gl.clear(Gl2d.gl.COLOR_BUFFER_BIT)
	//Gl2d.gl.bindBuffer(Gl2d.gl.ARRAY_BUFFER, Gl2d.buffer);
//	step();
//	Gl2d.fx_TexDraw();
//	Gl2d.draw_tex_blur(0,20,20,128,128,0.5,1);
	var base_texture = Gl2d.Tex[0];
	var fx_textures =[];
	var fx_frameBuffers = [];
	for(i=0;i<2;i++){
		var tex = createAndSetupEmptyTexture(Gl2d.gl);
		fx_textures.push(tex);
		Gl2d.gl.texImage2D( Gl2d.gl.TEXTURE_2D, 0, Gl2d.gl.RGBA, base_texture.W, base_texture.H, 0, Gl2d.gl.RGBA, Gl2d.gl.UNSIGNED_BYTE, null);
		var fbo = Gl2d.gl.createFramebuffer();
		fx_frameBuffers.push(fbo);
		Gl2d.gl.bindFramebuffer(Gl2d.gl.FRAMEBUFFER, fbo);
		Gl2d.gl.framebufferTexture2D(Gl2d.gl.FRAMEBUFFER, Gl2d.gl.COLOR_ATTACHMENT0, Gl2d.gl.TEXTURE_2D, tex, 0);
	}
	// start with the original image
	Gl2d.gl.bindTexture(Gl2d.gl.TEXTURE_2D, base_texture);
	Gl2d.set_tex_src_coordinates([0,0,		1,1,	1,0,	0,0,		1,1,	0,1]);
	
	for (var ii = 0; ii < effectsToApply.length; ++ii) {
		// Setup to draw into one of the framebuffers.
		setFramebuffer(Gl2d.gl,fx_frameBuffers[ii % 2], base_texture.W, base_texture.H);
		Gl2d.gl.bufferData(Gl2d.gl.ARRAY_BUFFER, new Float32Array([0,0,		1,1,	1,0,	0,0,		1,1,	0,1]), Gl2d.gl.STATIC_DRAW);
		drawWithKernel(Gl2d.gl,effectsToApply[ii],base_texture.W, base_texture.H);

		// for the next draw, use the texture we just rendered to.
		Gl2d.gl.bindTexture(Gl2d.gl.TEXTURE_2D, fx_textures[ii % 2]);
	}
	
	setFramebuffer(Gl2d.gl,null, Gl2d.canvas.width, Gl2d.canvas.height);
	Gl2d.gl.bufferData(Gl2d.gl.ARRAY_BUFFER, new Float32Array([0,0,		100,100,	100,0,	0,0,		100,100,	0,100]), Gl2d.gl.STATIC_DRAW);
	drawWithKernel(Gl2d.gl,"normal",Gl2d.canvas.width,Gl2d.canvas.height);
	
	
/*
 * 
 * 
 * 
 * 
 * 
 * 
 * ////////////////////
	for(u=0;u<2;u++){
		var tex = Gl2d.fx_textures[u];
		Gl2d.gl.bindTexture(Gl2d.gl.TEXTURE_2D,tex);
		set_empty_texture_size(Gl2d.gl,texture.W,texture.H)
	}
	Gl2d.gl.bindTexture(Gl2d.gl.TEXTURE_2D, texture);
	Gl2d.set_tex_src_coordinates([0,0,		1,1,	1,0,	0,0,		1,1,	0,1]);
	// loop through each effect we want to apply.
	for (var ii = 0; ii < effectsToApply.length; ++ii) {
		// Setup to draw into one of the framebuffers.
		Gl2d.setFramebuffer(Gl2d.fx_framebuffers[ii%2], texture.W, texture.H);

		Gl2d.drawWithKernel(effectsToApply[ii%2], texture.W, texture.H);

		// for the next draw, use the texture we just rendered to.
		Gl2d.gl.bindTexture(Gl2d.gl.TEXTURE_2D, Gl2d.fx_textures[ii%2]);
	}
	// finally draw the result to the canvas.
	//Gl2d.gl.uniform1f(flipYLocation, -1);  // need to y flip for canvas
	Gl2d.setFramebuffer(null, Gl2d.canvas.width, Gl2d.canvas.height);
	Gl2d.gl.bindBuffer(Gl2d.gl.ARRAY_BUFFER, Gl2d.buffer);
	Gl2d.gl.bufferData(Gl2d.gl.ARRAY_BUFFER, new Float32Array([0,0,		100,100,	100,0,	0,0,		100,100,	0,100]), Gl2d.gl.STATIC_DRAW);
	Gl2d.drawWithKernel("normal", Gl2d.canvas.width, Gl2d.canvas.height,true);


*/
	

}
function setFramebuffer(_gl,fbo, width, height) {
  // make this the framebuffer we are rendering to.
  _gl.bindFramebuffer(_gl.FRAMEBUFFER, fbo);

  // Tell the shader the resolution of the framebuffer.
//  _gl.uniform2f(resolutionLocation, width, height);

  // Tell webgl the viewport setting needed for framebuffer.
  _gl.viewport(0, 0, width, height);
}
function gaussian_matrix(radius,derivation,blur_strength){
	var Indices_weights = new Float32Array(radius+1);
	var Indices_sum = 0;
	for(i=0;i<radius;i++){
		var weight = (1/(Math.sqrt(2*Math.PI*derivation)))*Math.pow(2.71828,-1*(Math.pow(i,2)/(2*Math.pow(derivation,2))));
		Indices_weights[i]=weight;
		if(i==0){
			Indices_sum += weight;
		}else{
			Indices_sum += weight * 2;
		}
	}
	var weight_multiplier = 1 / Indices_sum;
	var Gaussian_weights = new Float32Array(500);
	var weights_sum=0;

	for(j=0;j<radius;j++){
		var weight2 = Indices_weights[j] * weight_multiplier;
		Gaussian_weights[j]=weight2;
		if(j==0){
			weights_sum += weight2;
		}else{
			weights_sum += weight2 * 2;
		}
	}
 return  Gaussian_weights;
}
function drawWithKernel(_gl,name,w,h) {
	// set the kernel
	_gl.uniform1fv(Gl2d.fx_tex_KernelLocation, kernels[name]);
	

	
	
	// Draw the rectangle.
	_gl.drawArrays(_gl.TRIANGLES, 0, 6);
}
function step() {
	var Time = Date.now();
	var anim_delay = Time-animation_timer;
	if(anim_delay >= 1000/24){
		//on passe en mode texture, on initialise la variable de profondeur Z, on dessine la map
		Gl2d.active_texture(0);
		var Z=-0.5;
		Z = layout.draw_map(Gl2d,Z);
		//si un mode est activé, on execute la fonction correspondante
		if(animation_mode != null){
			animation_mode(Gl2d,Z);
		}
		//on dessine le curseur
		//Z= draw_cursor(Gl2d,Z);
		//Gl2d.draw_tex_blur(0,5,5,128,128,Z,1);
		PaintCount++;
		animation_timer = Time;
	}
	var fps_delay = Time-fps_timer;
	if(fps_delay >= 1000){
		document.getElementById("direction").textContent =  PaintCount +", delta: "+Zoomer;
		PaintCount = 0;
		fps_timer = Time;
	}
	requestAnimationFrame(step);
}
function set_animation_mode(func){
	animation_mode = func[0];
	window_clic = func[1];
}
var animation_mode=function(){};
var window_clic=function(){};	
var empty_func=[function(){},function(){}];
var Mode_EDIT_surface={
	"anim_func":	function(webgl2d,Z){
						Z = layout.draw_overTile(webgl2d,Z);
						webgl2d.ColorDraw();
						//webgl2d.arrow_color(MouseX,MouseY,50,25,[1,0,1,0.8],0.2,135);
						if(layout.selected_Tiles[0] != null){
							Z = draw_tile_arrows(layout.selected_Tiles,Z);
						}
						webgl2d.TexDraw();
						return Z;
					},
	"clic_func":	function(){
						var tile_selection = layout.selected_Tiles,
							overTile = layout.overTile;
						if(keySHIFT == false ){
							layout.selected_Tiles = [overTile];
						}else if(overTile != null){
							if(tile_selection[0] == null){
								layout.selected_Tiles = [overTile];
							}else{
								var sel_L = tile_selection.length;
								var deselect = false;
								for(i=0;i<sel_L;i++){
									var cell = tile_selection[i];
									if(overTile[0] == cell[0] &&  overTile[1] == cell[1]){
										var del = layout.selected_Tiles.splice(i,1);
										deselect = true;
										break;
									}
								}
								if(deselect == false){
									layout.selected_Tiles.push(layout.overTile);
								}
							}
						}
					},
	"button_shape":[["round"],["m",0.15,0.15],["l",0.85,0.85]]
};	
var Mode_ADD_surface={
	"anim_func":	function (webgl2d,Z){
						var dTw = dTileW, dTh = dTileH,Cw = caseW/0.707, Ch = caseH/0.707;
						var losangeX = Math.floor((MouseX-dTw/2)/Cw)*Cw, losangeY= Math.floor((MouseY-dTh/2)/Ch)*Ch; 
						webgl2d.losange_tex(losangeX,losangeY,dTw,dTh,Z,0.5);
						Z+=0.000001;
						webgl2d.ColorDraw();
						webgl2d.losange_color(losangeX,losangeY,dTw,dTh,[0,0,1,0.4],Z);
						Z+=0.000001;
						webgl2d.TexDraw();
						return Z;
					},
	"clic_func":	function(){
						var dTw = dTileW, dTh = dTileH,Cw = caseW/0.707, Ch = caseH/0.707;
						layout.add_surface(Math.floor((MouseX-dTw/2)/Cw)*Cw,Math.floor((MouseY-dTh/2)/Ch)*Ch,"d");
						//action_mode = null;
						//set_animation_mode(empty_func);
						//document.getElementsByClassName("clicked")[0].setAttribute("class","unclicked");
					},
	"button_shape": [["round"],["m",0.5,0.15],["l",0.5,0.85],["m",0.15,0.5],["l",0.85,0.5]]
};
var Mode_ADDLINE_surface={
	"anim_func":	function (webgl2d,Z){
						var dTw = TileW, dTh = TileH,Cw = caseW/0.707, Ch = caseH/0.707;
						var losangeX_diag = Math.floor((MouseX-dTw/2)/Cw)*Cw, losangeY_diag= Math.floor((MouseY-dTh/2)/Ch)*Ch; 
						Cw = caseW;
						Ch = caseH;
						var losangeX_n= Math.floor((MouseX-dTw/2)/Cw)*Cw, 
							losangeY_n= Math.floor((MouseY-dTh/2)/Ch)*Ch, 
							losangeX = losangeX_n,
							losangeY = losangeY_n;
						if(distance_between(MouseX,MouseY,losangeX_diag,losangeY_diag)<distance_between(MouseX,MouseY,losangeX_n,losangeY_n)){
							losangeX = losangeX_diag;
							losangeY = losangeY_diag;
						}
						
						webgl2d.draw_tex(losangeX,losangeY,dTw,dTh,Z,0.5);
						Z+=0.000001;
						webgl2d.ColorDraw();
						webgl2d.draw_color(triangle_coords(losangeX,losangeY,dTw,dTh),[0,0,1,0.4],Z);
						Z+=0.000001;
						webgl2d.TexDraw();
						return Z;
					},
	"clic_func":	function(){
						var dTw = TileW, dTh = TileH,Cw = caseW/0.707, Ch = caseH/0.707;
						var losangeX_diag = Math.floor((MouseX-dTw/2)/Cw)*Cw, losangeY_diag= Math.floor((MouseY-dTh/2)/Ch)*Ch; 
						Cw = caseW;
						Ch = caseH;
						var losangeX_n= Math.floor((MouseX-dTw/2)/Cw)*Cw, 
							losangeY_n= Math.floor((MouseY-dTh/2)/Ch)*Ch, 
							losangeX = losangeX_n,
							losangeY = losangeY_n;
						if(distance_between(MouseX,MouseY,losangeX_diag,losangeY_diag)<distance_between(MouseX,MouseY,losangeX_n,losangeY_n)){
							losangeX = losangeX_diag;
							losangeY = losangeY_diag;
						}
						layout.add_surface(losangeX,losangeY,"h");
						//action_mode = null;
						//set_animation_mode(empty_func);
						//document.getElementsByClassName("clicked")[0].setAttribute("class","unclicked");
					},
	"init_func":	function (webgl2d,Z){
		
					},
	"button_shape": [["round"],["m",0.25,0.5],["l",0.85,0.5],["l",0.85,0.15],["l",0.5,0.15],["l",0.5,0.85]]
};
var Mode_ADDGRASS_surface={
	"anim_func":	function (webgl2d,Z){
						webgl2d.active_texture(3);	
						webgl2d.set_tex_src_coordinates(triangle_coords(0,Zoomer*(1/4),1/4,1/4));
						var dTw = 64, dTh = 64,Cw = 64, Ch = 64;
						var losangeX_diag = Math.floor((MouseX-dTw/2)/Cw)*Cw, losangeY_diag= Math.floor((MouseY-dTh/2)/Ch)*Ch; 
						Cw = caseW;
						Ch = caseH;
						var losangeX_n= Math.floor((MouseX-dTw/2)/Cw)*Cw, 
							losangeY_n= Math.floor((MouseY-dTh/2)/Ch)*Ch, 
							losangeX = losangeX_n,
							losangeY = losangeY_n;
						if(distance_between(MouseX,MouseY,losangeX_diag,losangeY_diag)<distance_between(MouseX,MouseY,losangeX_n,losangeY_n)){
							losangeX = losangeX_diag;
							losangeY = losangeY_diag;
						}
						webgl2d.draw_tex(losangeX,losangeY,dTw,dTh,Z,1);
						//webgl2d.draw_tex(losangeX,losangeY,dTw,dTh,Z,0.5);
						Z+=0.000001;
						webgl2d.ColorDraw();
						webgl2d.draw_color(triangle_coords(losangeX,losangeY,dTw,dTh),[0,0,1,0.4],Z);
						Z+=0.000001;
						webgl2d.TexDraw();
						webgl2d.active_texture(0);	
						return Z;
					},
	"clic_func":	function(){
						var dTw = 64, dTh = 64,Cw = 64, Ch = 64;
						var losangeX_diag = Math.floor((MouseX-dTw/2)/Cw)*Cw, losangeY_diag= Math.floor((MouseY-dTh/2)/Ch)*Ch; 
						Cw = caseW;
						Ch = caseH;
						var losangeX_n= Math.floor((MouseX-dTw/2)/Cw)*Cw, 
							losangeY_n= Math.floor((MouseY-dTh/2)/Ch)*Ch, 
							losangeX = losangeX_n,
							losangeY = losangeY_n;
						if(distance_between(MouseX,MouseY,losangeX_diag,losangeY_diag)<distance_between(MouseX,MouseY,losangeX_n,losangeY_n)){
							losangeX = losangeX_diag;
							losangeY = losangeY_diag;
						}
						layout.add_surface(losangeX,losangeY,"t");
						//action_mode = null;
						//set_animation_mode(empty_func);
						//document.getElementsByClassName("clicked")[0].setAttribute("class","unclicked");
					},
	"init_func":	function (webgl2d,Z){
		
					},
	"button_shape": [["round"],["m",0.25,0.25],["l",0.25,0.85],["l",0.85,0.25],["l",0.85,0.85]]
};
var Mode_SIG_surface={
	"anim_func":	function(webgl2d,Z){
						return Z;
					},
	"clic_func":	function(){
					},
	"button_shape":[["round"],["m",0.25,0.5],["l",0.85,0.5],["l",0.85,0.15],["l",0.5,0.15],["l",0.5,0.85]]
};
function draw_tile_arrows(Tile_sel,Z){//paramètre array: [[surface,nb],[surface,nb],...]
	var sel_L = Tile_sel.length;
	for (i=0;i<sel_L;i++){
		var O_Tile = Tile_sel[i];
			surf = O_Tile[0],
			n = O_Tile[1],
			tmp= get_surf_key(surf),
			keyX = tmp[0],
			keyY = tmp[1],
			sX = surf.X*32,
			sY = surf.Y*16,
			max_dist = 17,
			x = sX+n*keyX+64	,	y = sY+n*keyY	, w =128 	, h = 64;
		Gl2d.ColorDraw();
		Gl2d.losange_color(sX,sY,w,h,[0.5,0.0,0.5,0.4],Z);
		Z+=0.0000001;
		Gl2d.arrow_color(x,y,15,30,check_over_arrow(x,y,max_dist),Z,90);//top
		y+=h;
		Z+=0.0000001;
		Gl2d.arrow_color(x,y,15,30,check_over_arrow(x,y,max_dist),Z,-90);//down
		y+=-h/2;
		x+=-h;
		Z+=0.0000001;
		Gl2d.arrow_color(x,y,30,15,check_over_arrow(x,y,max_dist),Z,180);//left
		x+=w;
		Z+=0.0000001;
		Gl2d.arrow_color(x,y,30,15,check_over_arrow(x,y,max_dist),Z,0);//right
		x+=-w*0.75;
		y+=-16;
		Z+=0.0000001;
		var skewdWH = 30*0.67;
		Gl2d.arrow_color_skew(x,y,skewdWH,skewdWH,check_over_arrow(x,y,max_dist),Z,153.43);//top left
		x+=w/2;
		Z+=0.0000001;
		Gl2d.arrow_color_skew(x,y,skewdWH,skewdWH,check_over_arrow(x,y,max_dist),Z,26.57);//top right
		y+=h/2;
		Z+=0.0000001;
		Gl2d.arrow_color_skew(x,y,skewdWH,skewdWH,check_over_arrow(x,y,max_dist),Z,-26.57);// down right
		x+=-(w/2);
		Z+=0.0000001;
		Gl2d.arrow_color_skew(x,y,skewdWH,skewdWH,check_over_arrow(x,y,max_dist),Z,-153.43);//down left
	}
	return Z;
}
function draw_tilemove_arrow(){
	
}
function draw_cursor(webgl2d,Z){
	var Cw = caseW, Ch = caseH;
	webgl2d.active_texture(2);
	webgl2d.draw_tex(Math.floor(MouseX/Cw)*Cw,Math.floor(MouseY/Ch)*Ch,Cw,Ch,Z,1);
	return Z;
}
function toggle_action_mode(element){
	var func = element.mode_functions;
	if(animation_mode == func[0]){
		element.setAttribute("class","unclicked");
		clicked_object = null;
		set_animation_mode(empty_func);
	}else{
		if(clicked_object != null){
			clicked_object.setAttribute("class","unclicked");
		}
		element.setAttribute("class","clicked");
		set_animation_mode(func);
		clicked_object = element;
	}
}
//-----Redimensionnements de la fenêtre
window.onresize = function() {
	var g2 = Gl2d;
	var resizer = resize_window(g2.canvas);
	g2.update_size(resizer["w"],resizer["h"]);
	startup();
}
function resize_window(Canvas){
	var viewportWidth	= window.innerWidth,
		viewportHeight	= window.innerHeight,
		wdth = viewportWidth - Canvas_horizontal_margin,
		hgth = viewportHeight - Canvas_vertical_margin;
	Canvas.width	= wdth;
	Canvas.height	= hgth;
	Canvas.style.left	= Bandeau_Left_W+Bandeau_Margin+"px";
	Canvas.style.right	= Bandeau_Right_W+Bandeau_Margin+"px";
	Canvas.style.top	= Bandeau_Top_H+Bandeau_Margin+"px";
	Canvas.style.bottom	= Bandeau_Bottom_H+Bandeau_Margin+"px";
	return {"w":wdth,"h":hgth}
}
window.onmousedown=function(){MouseDown = true;};
window.onmouseup=function(){MouseDown = false;};
function new_ACTION_mode(mode_functions,Toolbar){
	var btw = Toolbar.btW
	var btn = create_canvas_button(btw,Toolbar.btH,Toolbar.b_color,Toolbar.s_color,btw/8,mode_functions["button_shape"]);
	btn.setAttribute("onclick","toggle_action_mode(this);");
	Toolbar.element.appendChild(btn);
	var mode = new ACTION_mode(mode_functions,btn);
	return mode;
}
function ACTION_mode(mode_functions,btn){
	this.btn = btn;
	this.btn.mode_functions = [mode_functions["anim_func"],mode_functions["clic_func"]];
}
function Map_layout(){
	this.surfaces = [];
	this.overTile;
	this.selected_Tiles = [];
}
Map_layout.prototype.draw_Tile_selection=function(webgl2d,Z){
	var surfaces_selection = this.selected_Tiles;
	if(action_mode == 'edit_surface' && surfaces_selection[0]!=null){
		var	sel_L = surfaces_selection.length;
		webgl2d.ColorDraw();
		for(i=0;i<sel_L;i++){
			var surf = surfaces_selection[i][0],
					sL = surf.Length,
					sX = surf.X*caseW,
					sY = surf.Y*caseH,
					so = get_surf_key(surf),
					keyX = so[0],
					keyY = so[1];
				for(n=0;n<sL;n++){
					var x = sX+n*keyX	,	y = sY+n*keyY	, w =dTileW 	, h = dTileH;
					webgl2d.losange_color(x,y,w,h,[0.5,0.5,0.5,0.4],Z);
					Z+=0.000001;
				}
		}
		webgl2d.TexDraw();
	}
	return Z;
}
Map_layout.prototype.draw_map=function(webgl2d,Z){
	webgl2d.set_tex_src_coordinates(triangle_coords(0,0,1,1));
	var S = this.surfaces,
		L = S.length,
		Tile_drawr = Tile_drawer;
	this.overTile = null;
	for(i=0;i<L;i++){
		var surf = S[i],
			sT = surf.type,
			dTw = TileW,
			dTh = TileH;
		if(sT=="d"){
			dTw =dTw/0.707;
			dTh = dTh/0.707;
			var	sX = surf.X,
				sY = surf.Y;
			webgl2d.losange_tex(sX,sY,dTw,dTh,Z,1);
		}else if(sT=="h"){
			var	sX = surf.X,
				sY = surf.Y;
			webgl2d.draw_tex(sX,sY,dTw,dTh,Z,1);
			
		}else if(sT=="t"){
			var	sX = surf.X,
				sY = surf.Y;
			webgl2d.active_texture(3);	
			webgl2d.set_tex_src_coordinates(triangle_coords(0,Zoomer*(1/4),1/4,1/4));
			webgl2d.draw_tex(sX,sY,64,64,Z,1);
			webgl2d.active_texture(0);
		}
		Z+=-0.000001;
/*

			//sL = surf.Length,
		var	sX = surf.X-dTw/2,
			sY = surf.Y-dTw/2,
			//so = get_surf_key(surf),
			//keyX = so[0],
			//keyY = so[1];
						
		for(n=0;n<sL;n++){
			var x = sX+n*keyX	,	y = sY+n*keyY	, w =dTileW 	, h = dTileH;
			webgl2d.losange_tex(x,y,w,h,Z,1);
			//webgl2d.draw_tex(sX+n*keyX,sY+n*keyY,128,64,Z,1);
			var cx=x+w/2,cy=y+h/2,x1=x+w/2,y1=y,x2=x+w/2,y2=y+h,x3=x+w,y3=y+h/2,x4=x,y4=y+h/2;
			
			if( point_is_over(MouseX,MouseY,cx,cy,x1,y1,x4,y4,x2,y2,x3,y3)){
				
				this.overTile = [surf,n,x,y,w,h];
			}
			Z+=-0.000001;
		}


*/
		
	}
	return Z;
}
Map_layout.prototype.draw_overTile=function(webgl2d,Z){
	var O_T = this.overTile;
	if(O_T != null){
		webgl2d.ColorDraw();
		webgl2d.losange_color(O_T[2],O_T[3],O_T[4],O_T[5],[0,0,1,0.4],Z);
		Z+=0.000001;
	}
	return Z;
}
Map_layout.prototype.add_surface=function(x,y,type_string){
	
	var surf = new surface();
	surf.X = x;
	surf.Y = y;
	surf.type = type_string;
	surf.Length = 1;
	this.surfaces.push(surf);
}
function surface(){
	this.orientation;
	this.Length;
	this.X;
	this.Y;
	this.type;
}
function get_surf_key(surf){
	var	so = surf.orientation,
		keyX = null,
		keyY = null;
	if(so == "e"){
		keyX = 128;
		keyY = 0;
	}else if(so == "ne"){
		keyX = 64;
		keyY = -32;
	}else if(so == "s"){
		keyX = 0;
		keyY = 64;
	}else if(so == "se"){
		keyX = 64;
		keyY = 32;
	}
	return[keyX,keyY];
}
function check_over_arrow(x,y,dist){
	if(distance_between(MouseX,MouseY,x,y) <= dist){
		return [1,1,0,0.8];
	}else{
		return [1,0,1,0.8];
	}
}
function distance_between(x1,y1,x2,y2){
	var sideX = x2-x1,
		sideY = y2-y1,
		dist = Math.sqrt(sideX*sideX+sideY*sideY);
	return dist; 
}
function point_is_over(ptX,ptY,CenterX,CenterY,x1,y1,x2,y2,x3,y3,x4,y4){//haut,gauche,bas,droite
	if(ptX < x2 || ptX > x4 || ptY < y1 || ptY > y3){
		return false;
	}else{
		var check1 = find_intersection(CenterX,CenterY,ptX,ptY,x1,y1,x2,y2),
			check2 = find_intersection(CenterX,CenterY,ptX,ptY,x2,y2,x3,y3),
			check3 = find_intersection(CenterX,CenterY,ptX,ptY,x3,y3,x4,y4),
			check4 = find_intersection(CenterX,CenterY,ptX,ptY,x4,y4,x1,y1);
		if(check1+check2+check3+check4 == 0){
			return true;
		}else{
			return false;
		}
	}
}
function find_intersection(x1,y1,x2,y2,x3,y3,x4,y4){
	var	a1 = (y2 - y1) / (x2 - x1),
		a2 = (y4 - y3) / (x4 - x3),
		b1 = y1 - (a1 * x1),
		b2 = y3 - (a2 * x3),
		xcommun=(b2-b1)/(a1-a2),
		check_mouse_line = false,
		check_obj_line = false;
	if((xcommun > x1 && xcommun < x2)||(xcommun < x1 && xcommun > x2)){
		check_mouse_line = true;
	}
	if((xcommun > x3 && xcommun < x4)||(xcommun < x3 && xcommun > x4)){
		check_obj_line = true;
	}
	if(check_mouse_line == true && check_obj_line == true){
		return 1;
	}else{
		return 0;
	}
}
function getMousePos(canvas, evt){
	// get canvas position
	var obj = canvas;
	var top = 0;
	var left = 0;
	while (obj && obj.tagName != 'mon_canvas') {
			top += obj.offsetTop;
			left += obj.offsetLeft;
			obj = obj.offsetParent;
	}
	// return relative mouse position
	var mouseX = evt.clientX - left + window.pageXOffset;
	var mouseY = evt.clientY - top + window.pageYOffset;
	return {
			x: mouseX,
			y: mouseY
	};
}
function Toolbar(elementId,bt_W,bt_H,background_color,stroke_color){
	this.element = document.getElementById(elementId);
	this.btW = bt_W;
	this.btH = bt_H;
	this.b_color = background_color;
	this.s_color = stroke_color;
}
function create_canvas_button(w,h,fillC,strokeC,StrokeW,path_data){
	var cv = document.createElement('canvas'),
		gl = cv.getContext('2d'),
		dat_L = path_data.length;
	cv.width=w;
	cv.height=h;
	if(fillC != null){
		gl.fillStyle=fillC;
		gl.rect(0,0,w,h);
		gl.fill();
	}
	gl.strokeStyle =strokeC;	
	gl.lineCap = path_data[0][0];
	gl.lineWidth = StrokeW;
	gl.beginPath();
	for(i=1;i<dat_L;i++){
		var point_data = path_data[i],
			point_type = point_data[0],
			pointX = point_data[1],
			pointY = point_data[2];
		if(point_type == "m"){
			gl.moveTo(w*pointX,h*pointY);
		}else if(point_type == "l"){
			gl.lineTo(w*pointX,h*pointY);
		}
	}	
	gl.stroke();
	return cv;
}
window.onkeydown = function(e) {
	var returner = true;
	if(e.keyCode==16  ){
		keySHIFT = true;
		returner = false;
	}
	if(e.keyCode==40 ||e.keyCode==115 ||e.keyCode==83 ){
		keyDOWN = true;
		returner = false;
	}
	if(e.keyCode==37 ||e.keyCode==113 ||e.keyCode==97 ||e.keyCode==81||e.keyCode==65){
		keyLEFT = true;
		returner = false;
	}
	if(e.keyCode==39 ||e.keyCode==100 ||e.keyCode==68 ){
		keyRIGHT = true;
		returner = false;
	}	
	if(e.keyCode==38 ||e.keyCode==122 ||e.keyCode==119 ||e.keyCode==90||e.keyCode==87){
		keyUP = true;
		returner = false;
	}
	return returner;
}
window.onkeyup= function(e) {
	if(e.keyCode==16  ){
		keySHIFT = false;
	}
	if(e.keyCode==40 ||e.keyCode==115 ||e.keyCode==83 ){
		keyDOWN = false;
	}
	if(e.keyCode==37 ||e.keyCode==113 ||e.keyCode==97 ||e.keyCode==81||e.keyCode==65){
		keyLEFT = false;
	}
	if(e.keyCode==39 ||e.keyCode==100 ||e.keyCode==68 ){
		keyRIGHT = false;
	}	
	if(e.keyCode==38 ||e.keyCode==122 ||e.keyCode==119 ||e.keyCode==90||e.keyCode==87){
		keyUP = false;
	}
	return true;
}
if (window.addEventListener) {  
// IE9, Chrome, Safari, Opera  
	window.addEventListener("mousewheel", MouseWheelHandler, false);  
// Firefox  
	window.addEventListener("DOMMouseScroll", MouseWheelHandler, false);  
}else{ 	// IE 6/7/8 
	window.attachEvent("onmousewheel", MouseWheelHandler); 
}
function MouseWheelHandler(e) {  
	// cross-browser wheel delta  
	var e = window.event || e; // old IE support  
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));  
	//str+=delta;
	//startup();
	//document.getElementById("bandeau_left").textContent = str;
	//startup();
	if (e.preventDefault) //disable default wheel action of scrolling page
		e.preventDefault()
	else
		return false;
}
