window.onload = function(){
	Append_Shaders_Script();
	Images_list = ["tileG.png","spritesheet_OPTIMIZED.png"];
	Tex_images_list = [];
	Tex_list=[];
	Tex_list.length = Images_list.length;
	nb_images_loaded=0;
	load_images_list(Images_list);
	var Cnv = document.getElementById("canvas");
	resize_window(Cnv);
	Gl2d = create_WebGl2d(Cnv);
	TileG = new Image();
	TileG2 = new Image();
	Back = new Image();
	Back.onload = function(){
		tex_back = Gl2d.add_texture(Back);
		draw();
	}
	TileG.onload = function(){
		tex1 = Gl2d.add_texture(TileG);
		Back.src = create_background_layer();
		
	}
	TileG2.onload = function(){
		tex2 = Gl2d.add_texture(TileG2);
		TileG.src = "tileG.png";
		
	}
	TileG2.src = "spritesheet_OPTIMIZED.png";
}
function load_images_list(Image_list){
	var list_length = Image_list.length;
	var returned_array =[];
	for(i=0;i<list_length;i++){
		var new_img = new Image();
		new_img.onload=function(){on_image_load(this);};
		new_img.src=Image_list[i];
	}
}
function on_image_load(image){
	nb_images_loaded++;
	set_image_to_texture_size(image);
}
function on_sized_image_load(image){
	nb_images_loaded++;
	var expected_list_length = Images_list.length ;
	var actual_images_list_length = Tex_list.length;
	
	if(actual_images_list_length == expected_list_length == nb_images_loaded/2){
		alert(actual_images_list_length +"=="+ expected_list_length);
	}
}
function set_image_to_texture_size(image){
	var baseW = image.width,
		baseH = image.height,
		longest_side;
	if(baseW >= baseH){
		longest_side = baseW;
	}else{
		longest_side = baseH;
	}
	var poWofTwo = 2;
	var base_Image;
	for(i=0;i<20;i++){
		if(longest_side==poWofTwo && baseW==baseH){
			find_imageSrc_in_list(image,image)
			on_sized_image_load(image);
			break;
		}else if(longest_side<=poWofTwo){
			var base_Image = new Image();
			find_imageSrc_in_list(image,base_Image)
			base_Image.onload =function(){ on_sized_image_load(this);};
			base_Image.src=build_canvas_texture(image,poWofTwo,baseW,baseH);
			break;
		}else{
			poWofTwo = poWofTwo * 2; 
		}
	}
}
function find_imageSrc_in_list(image1,image2){
	var listL = Images_list.length,
	Src = image1.src;
	for(j=0;j<listL;j++){
		if(Images_list[i] == Src){
			Tex_list[j] = image2;
		}
	}
}
function build_canvas_texture(ImAge,poWofTwo,baseW,baseH){
	var tex_canvas = document.createElement("canvas");
	tex_canvas.width = poWofTwo;
	tex_canvas.height = poWofTwo;
	var tex_context = tex_canvas.getContext('2d');
	tex_context.drawImage(ImAge, 0,0,baseW,baseH);
	return tex_canvas.toDataURL("image/png");
}
function draw(){
	Gl2d.TexDraw();
	Gl2d.active_texture(tex_back);
	Gl2d.set_tex_src_coordinates(triangle_coords(0,0,1,1));
	Gl2d.draw_tex(triangle_coords(0,0,400,400),0.8);
	Gl2d.active_texture(tex1);
	Gl2d.set_tex_src_coordinates(triangle_coords(0.5,0.5,0.5,0.5));
	Gl2d.draw_tex(triangle_coords(0,0,100,100),0.3);
	Gl2d.ColorDraw();
	Gl2d.draw_color(triangle_coords(75,75,75,75),[0,0,1,1],0.5);
	Gl2d.TexDraw();
	Gl2d.active_texture(tex2);
	Gl2d.set_tex_src_coordinates(triangle_coords(0,0,1,1));
	Gl2d.draw_tex(triangle_coords(30,30,90,90),0.1);
}
function create_background_layer(){
	var new_canvas = document.createElement('canvas');
	new_canvas.width = 2048;
	new_canvas.height = 2048;
	var back_canvas = create_WebGl2d(new_canvas);
	var tex_b = back_canvas.add_texture(TileG);
	back_canvas.TexDraw();
	back_canvas.set_tex_src_coordinates(triangle_coords(0,0,0.5,0.5));
	var Tile_size = 2048/10;
	for(y=0;y<10;y++){
		for(x=0;x<10;x++){
			back_canvas.draw_tex(triangle_coords(x*Tile_size,y*Tile_size,Tile_size,Tile_size),0.1);
		}
	}
	return back_canvas.canvas.toDataURL("image/png");
}
//*****************
// DECARATION DES VARIABLES GLOBALES
//*****************
//-----Zoom sur canvas
var Zoomer = 1;
//-----Dimensions des éléments de la page, 
var	Bandeau_Top_H 		= 60,
	Bandeau_Bottom_H 	= 30,
	Bandeau_Left_W		= 120,
	Bandeau_Right_W		= 120,
	Bandeau_Margin		= 3,
	Canvas_horizontal_margin	= Bandeau_Right_W + Bandeau_Left_W + Bandeau_Margin*2,
	Canvas_vertical_margin 		= Bandeau_Top_H  + Bandeau_Bottom_H + Bandeau_Margin*2;
//*****************	
// WINDOW EVENTS
//*****************
//-----Redimensionnements de la fenêtre
window.onresize = function() {
	resize_window(Gl2d.canvas);
	Gl2d.gl.viewport(0, 0, Gl2d.canvas.width, Gl2d.canvas.height);
	draw();
}
//-----Détection du clavier
window.onkeydown = function(e) {
	var returner = true;
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
//-----Détection de la molette souris, appel de la fonction MouseWheelHandler
if (window.addEventListener) {  
// IE9, Chrome, Safari, Opera  
	window.addEventListener("mousewheel", MouseWheelHandler, false);  
// Firefox  
	window.addEventListener("DOMMouseScroll", MouseWheelHandler, false);  
}else{ 	// IE 6/7/8 
	window.attachEvent("onmousewheel", MouseWheelHandler); 
}
//*****************
// FONCTIONS
//*****************
//-----redimensionne le canvas aux dimensions de la fenêtre
function resize_window(Canvas){
	var viewportWidth	= window.innerWidth,
		viewportHeight	= window.innerHeight;
	Canvas.width	= viewportWidth - Canvas_horizontal_margin;
	Canvas.height	= viewportHeight - Canvas_vertical_margin;
	Canvas.style.left	= Bandeau_Left_W+Bandeau_Margin+"px";
	Canvas.style.right	= Bandeau_Right_W+Bandeau_Margin+"px";
	Canvas.style.top	= Bandeau_Top_H+Bandeau_Margin+"px";
	Canvas.style.bottom	= Bandeau_Bottom_H+Bandeau_Margin+"px";
}
//-----Molette souris : modifie la variable Zoomer de +/-0.1
function MouseWheelHandler(e) {  
	// cross-browser wheel delta  
	var e = window.event || e; // old IE support  
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));  
	Zoomer+=delta*0.1;
	if (e.preventDefault) //disable default wheel action of scrolling page
		e.preventDefault()
	else
		return false;
}
