function create_WebGl2d(canvasId,images_list,callback){// Retourne un objet WebGl2d - Parametre: DOM Id d'un élément canvas
	Append_Shaders_Script();
	var WebGl_2d = new WebGl2d(set_WebGl2d_properties(canvasId));
	WebGl_2d.image_list = images_list
	WebGl_2d.startup_function = callback;
	WebGl_2d.Initial_W = WebGl_2d.canvas.width;
	WebGl_2d.Initial_H = WebGl_2d.canvas.height;
	load_images_list(images_list,WebGl_2d);
	return WebGl_2d;
}
function WebGl2d(WebGl2d_properties){
	this.canvas		= WebGl2d_properties["canvas"];
	this.gl			= WebGl2d_properties["gl"];
	this.buffer		= WebGl2d_properties["buffer"];
	
	this.VertexShader			=WebGl2d_properties["vertex_shader"];
	this.FragmentShader_color	=WebGl2d_properties["fragment_shader_color"];
	this.FragmentShader_images	=WebGl2d_properties["fragment_shader_image"];
	
	this.draw_program			=WebGl2d_properties["draw_program"];	
	this.draw_positionLocation	=WebGl2d_properties["draw_positionLocation"];
	//this.draw_resolutionLocation=WebGl2d_properties["draw_resolutionLocation"];
	this.draw_depth				=WebGl2d_properties["draw_depth"];
	this.draw_matrix			=WebGl2d_properties["draw_matrix"];
	
	this.tex_program			=WebGl2d_properties["img_program"];
	this.tex_positionLocation	=WebGl2d_properties["img_positionLocation"];
	this.tex_texCoordLocation	=WebGl2d_properties["img_texCoordLocation"];
	//this.tex_resolutionLocation	=WebGl2d_properties["img_resolutionLocation"];
	this.tex_depth				=WebGl2d_properties["img_depth"];
	this.texBuffer				=WebGl2d_properties["img_texCoordBuffer"];
	this.Alpha					=WebGl2d_properties["Alpha"];
	this.tex_matrix				=WebGl2d_properties["img_matrix"];
	
	this.fx_tex_program			=WebGl2d_properties["img_fx_program"];
	this.fx_tex_positionLocation=WebGl2d_properties["img_fx_positionLocation"];
	this.fx_tex_texCoordLocation=WebGl2d_properties["img_fx_texCoordLocation"];
	//this.tex_resolutionLocation	=WebGl2d_properties["img_resolutionLocation"];
	this.fx_tex_depth			=WebGl2d_properties["img_fx_depth"];
	this.fx_texBuffer			=WebGl2d_properties["img_fx_texCoordBuffer"];
	this.fx_Alpha				=WebGl2d_properties["Alpha_fx"];
	this.fx_tex_matrix			=WebGl2d_properties["img_fx_matrix"];
	this.fx_tex_Texture_Size	=WebGl2d_properties["img_fx_Texture_Size"];
	this.fx_tex_KernelLocation	=WebGl2d_properties["img_fx_KernelLocation"];
	this.fx_framebuffers		=WebGl2d_properties["fx_framebuffers"];
	this.fx_textures			=WebGl2d_properties["fx_textures"];
	this.fx_Position 			=WebGl2d_properties["Position"];
	this.fx_Rotation			=WebGl2d_properties["Rotation"];
	
	
	this.blur_program			=WebGl2d_properties["blur_program"];
	this.blur_positionLocation=WebGl2d_properties["blur_positionLocation"];
	this.blur_texCoordLocation=WebGl2d_properties["blur_texCoordLocation"];
	//this.tex_resolutionLocation	=WebGl2d_properties["img_resolutionLocation"];
	this.blur_depth			=WebGl2d_properties["blur_depth"];
	this.blur_texBuffer			=WebGl2d_properties["blur_texCoordBuffer"];
	this.blur_Alpha				=WebGl2d_properties["blur_Alpha"];
	//this.blur_tex_matrix			=WebGl2d_properties["img_fx_matrix"];
	this.blur_tex_Texture_Size	=WebGl2d_properties["blur_Texture_Size"];
	//this.blur_tex_KernelLocation	=WebGl2d_properties["img_fx_KernelLocation"];
	this.blur_framebuffers		=WebGl2d_properties["blur_framebuffers"];
	this.blur_textures			=WebGl2d_properties["blur_textures"];
	this.blur_Position 			=WebGl2d_properties["blur_Position"];
	this.blur_Rotation			=WebGl2d_properties["blur_Rotation"];
	
	
	
	
	
	this.Initial_Width			=WebGl2d_properties["Initial_Width"];
	this.Initial_Height			=WebGl2d_properties["Initial_Height"];
	this.actual_Width			=WebGl2d_properties["Initial_Width"];
	this.actual_Height			=WebGl2d_properties["Initial_Height"];
	
	this.image_list;
	this.Tex =[];
	this.startup_function;
	
	this.W_ratio				=1;
	this.H_ratio				=1;
	this.tmp_tex = [];
}
WebGl2d.prototype.update_size=function(w,h){
	this.actual_Width = w;
	this.actual_Height = h;
	this.gl.viewport(0, 0, w , h);
	this.W_ratio =  w/this.Initial_Width ;
	this.H_ratio =  h/this.Initial_Height ;
}
WebGl2d.prototype.active_texture=function(tex_place){//sélectionne la texture active d'un objet WebGl2d
	this.gl.bindTexture(this.gl.TEXTURE_2D, this.Tex[tex_place]);
}
WebGl2d.prototype.TexDraw = function(){//active le dessin en mode texture
	this.gl.useProgram(this.tex_program);
	this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
}
WebGl2d.prototype.fx_TexDraw = function(){//active le dessin en mode texture
	this.gl.useProgram(this.fx_tex_program	);
	this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
}
WebGl2d.prototype.fx_BlurDraw = function(){//active le dessin en mode texture
	this.gl.useProgram(this.blur_program	);
	this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
}
WebGl2d.prototype.ColorDraw = function(){//active le dessin en mode couleur
	this.gl.useProgram(this.draw_program);
}
WebGl2d.prototype.draw_color= function(triangle_data,color,depth){//dessine un carré de couleur
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangle_data), this.gl.STATIC_DRAW);
	this.gl.uniform4fv(this.draw_program.uColor, color);
	this.gl.uniform1f(this.draw_depth, depth);
	this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
}
WebGl2d.prototype.losange_color = function(x,y,w,h,color,depth){
	this.skew_color(x+w/2,y,	x+w/2,y+h,	x+w,y+h/2,	x,y+h/2,color,depth);
}
WebGl2d.prototype.arrow_color = function(x,y,w,h,color,depth,angle){
	var	angle2= angle+90,
		to_degrees = Math.PI / 180,
		h2 = h/2,
		x2 = x+w*Math.cos(-angle*to_degrees),
		y2 = y+w*Math.sin(-angle* to_degrees),
		x_vec = h2*Math.cos(-angle2* to_degrees),
		y_vec = h2*Math.sin(-angle2* to_degrees),
		x3 =x+x_vec,
		y3 =y+y_vec,
		x4 =x-x_vec,
		y4 =y-y_vec;
	this.skew_color(x,y,x2,y2,x3,y3,x4,y4,color,depth);
}
WebGl2d.prototype.arrow_color_skew = function(x,y,w,h,color,depth,angle){
	var direction_modifier = null;
	if(angle > 0 && angle <90){
		direction_modifier =-1;
	}else if(angle > 90 && angle <180){
		direction_modifier =1;
	}else if(angle > -180 && angle <-90){
		direction_modifier =-1;
	}else{
		direction_modifier =1;
	}
	var	angle2= angle+(26.57*2)*direction_modifier,
		to_degrees = Math.PI / 180,
		h2 = h/2,
		x2 = x+w*Math.cos(-angle*to_degrees),
		y2 = y+w*Math.sin(-angle* to_degrees),
		x_vec = h2*Math.cos(-angle2* to_degrees),
		y_vec = h2*Math.sin(-angle2* to_degrees),
		x3 =x+x_vec,
		y3 =y+y_vec,
		x4 =x-x_vec,
		y4 =y-y_vec;
	this.skew_color(x,y,x2,y2,x3,y3,x4,y4,color,depth);
}
WebGl2d.prototype.skew_color= function(x1,y1,x2,y2,x3,y3,x4,y4,color,depth){//dessine un trapèze de texture
	x1 = x1/this.W_ratio;
	y1 = y1/this.H_ratio;
	x2 = x2/this.W_ratio;
	y2 = y2/this.H_ratio;
	x3 = x3/this.W_ratio;
	y3 = y3/this.H_ratio;
	x4 = x4/this.W_ratio;
	y4 = y4/this.H_ratio;
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([x1,y1,	x2,y2,	x3,y3,	x1,y1,	x2,y2,	x4,y4]), this.gl.STATIC_DRAW);	
	this.gl.uniform4fv(this.draw_program.uColor, color);
	this.gl.uniform1f(this.draw_depth, depth);
	this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
}
WebGl2d.prototype.draw_tex= function(x,y,w,h,depth,alpha){//dessine un carré de texture

//	var matS = mat2d.create() ;
//	mat2d.projection2d(matS, this.canvas.width,this.canvas.height);
//	var Matrix = mat3.create() ;
//	Matrix = mat3.multiply2d(Matrix,Matrix,matS);
//	this.gl.uniformMatrix3fv(this.tex_matrix, false, Matrix);

	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangle_coords(x,y,w,h)), this.gl.STATIC_DRAW);	
	//this.gl.enable(this.gl.BLEND);
	//this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.DST_ALPHA);
	this.gl.uniform1f(this.tex_depth,depth);
	this.gl.uniform1f(this.Alpha,alpha);
	this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
}
WebGl2d.prototype.losange_tex = function(x,y,w,h,depth,alpha){
	this.skew_tex(x+w/2,y,	x+w/2,y+h,	x+w,y+h/2,	x,y+h/2,depth,alpha);
}
WebGl2d.prototype.skew_tex= function(x1,y1,x2,y2,x3,y3,x4,y4,depth,alpha){//dessine un trapèze de texture
	x1 = x1/this.W_ratio;
	y1 = y1/this.H_ratio;
	x2 = x2/this.W_ratio;
	y2 = y2/this.H_ratio;
	x3 = x3/this.W_ratio;
	y3 = y3/this.H_ratio;
	x4 = x4/this.W_ratio;
	y4 = y4/this.H_ratio;
	
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([x1,y1,	x2,y2,	x3,y3,	x1,y1,	x2,y2,	x4,y4]), this.gl.STATIC_DRAW);	
	this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.DST_ALPHA);
	this.gl.uniform1f(this.tex_depth,depth);
	this.gl.uniform1f(this.Alpha,alpha);
	this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
}
WebGl2d.prototype.draw_tex_blur= function(tex_nb,x,y,w,h,depth,alpha){//dessine un carré de texture
	this.fx_TexDraw();
	var texture = this.Tex[tex_nb];
	for(u=0;u<2;u++){
		var tex = this.fx_textures[u];
		this.gl.bindTexture(this.gl.TEXTURE_2D,tex);
		set_empty_texture_size(this.gl,texture.W,texture.H)
	}
	
	// start with the original image
	this.gl.bindTexture(this.gl.TEXTURE_2D,texture );
	// don't y flip images while drawing to the textures
	//this.gl.uniform1f(flipYLocation, 1);
	// loop through each effect we want to apply.
	//this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([0,0,		1,1,	1,0,	0,0,		1,1,	0,1]), this.gl.STATIC_DRAW);
	this.set_tex_src_coordinates([0,0,		100,100,	100,0,	0,0,		100,100,	0,100]);
	for (var ii = 0; ii < effectsToApply.length; ++ii) {
		// Setup to draw into one of the framebuffers.
		this.setFramebuffer(this.fx_framebuffers[ii % 2], texture.W, texture.H);
		this.drawWithKernel(effectsToApply[ii],texture.W,texture.H);
		// for the next draw, use the texture we just rendered to.
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.fx_textures[ii % 2]);
	}
	// finally draw the result to the canvas.
	//this.gl.uniform1f(flipYLocation, -1);  // need to y flip for canvas
	this.setFramebuffer(null, this.actual_Width, this.actual_Height);
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangle_coords(x,y,w,h)), this.gl.STATIC_DRAW);	
	this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.SRC_ALPHA, this.gl.DST_ALPHA);
	this.gl.uniform1f(this.fx_tex_depth,depth);
	this.gl.uniform1f(this.fx_Alpha,alpha);
	
	this.drawWithKernel("normal",this.actual_Width,this.actual_Height,true);
}
WebGl2d.prototype.setFramebuffer= function(fbo, width, height) {
  // make this the framebuffer we are rendering to.
  this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);

  // Tell the shader the resolution of the framebuffer.
 // this.gl.uniform2f(resolutionLocation, width, height);

  // Tell webgl the viewport setting needed for framebuffer.
  //this.gl.viewport(0, 0, width, height);
}
WebGl2d.prototype.drawWithKernel= function(name,w,h,use_matrix) {
	// set the kernel
	this.gl.uniform1fv(this.fx_tex_KernelLocation, kernels[name]);
	if(use_matrix == true){
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([0,0,		150,150,	150,0,		0,0,	150,150,	0,150]), this.gl.STATIC_DRAW);
		var matS = mat2d.create() ;
		mat2d.projection2d(matS, w,h);
		var Matrix = mat3.create() ;
		Matrix = mat3.multiply2d(Matrix,Matrix,matS);
		this.gl.uniformMatrix3fv(this.fx_tex_matrix, false, Matrix);
	}else{
		var matS = mat2d.create() ;
		mat2d.projection2d(matS, w,h);
		var Matrix = mat3.create() ;
		Matrix = mat3.multiply2d(Matrix,Matrix,matS);
		this.gl.uniformMatrix3fv(this.fx_tex_matrix, false, Matrix);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([0,0,		100,100,	100,0,		0,0,	100,100,	0,100]), this.gl.STATIC_DRAW);
	}
		

		
	
	// Draw the rectangle.
	this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
}
WebGl2d.prototype.set_tex_src_coordinates= function(triangle_data){//défini les coordonnées source d'une texture
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texBuffer);
	this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(triangle_data), this.gl.STATIC_DRAW);
	this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
}
WebGl2d.prototype.add_texture = function(image){//retourne une texture et l'ajoute au WebGl2d ciblé 
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
			base_Image=image;
			break;
		}else if(longest_side<=poWofTwo){
			base_Image=create_canvas_texture(image,poWofTwo,baseW,baseH);
			break;
		}else{
			poWofTwo = poWofTwo * 2; 
		}
	}
	return this.set_new_texture(base_Image);
}
WebGl2d.prototype.set_new_texture = function(base_Image){ // convertit une image dont les cotés sont égaux entre eux et égaux d'une puissance de 2 (nécessaire pour activer MIPMAPS)
	var texture = this.gl.createTexture();
	this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
	// Set the parameters so we can render any size image.
	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE,  base_Image);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
	
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
	this.gl.generateMipmap(this.gl.TEXTURE_2D);
	texture.W = base_Image.width;
	texture.H = base_Image.height;
	return texture;
	base_Image = null;
}	
function create_canvas_texture(image,poWofTwo,baseW,baseH){//transforme une image en canvas réajusté à des dimensions égales à une puissance de 2.
	var tex_canvas = document.createElement("canvas");
	tex_canvas.width = poWofTwo;
	tex_canvas.height = poWofTwo;
	var tex_context = tex_canvas.getContext('2d');
	tex_context.drawImage(image, 0,0,baseW,baseH);
	return convertCanvasToImage(tex_canvas);
	image = null;
}
function convertCanvasToImage(cAnvas) {//convertit un élément canvas en image
  var imAge = new Image();
  imAge.src = cAnvas.toDataURL("image/png");
  //imAge.crossOrigin='';
  
  return imAge;
}
function set_WebGl2d_properties(canvas){//retourne lespropriétés de base d'un objet WebGl2d, paramètre : objet canvas
	var returner = {};
	returner["canvas"]					=canvas;
	returner["gl"]						=returner["canvas"].getContext("experimental-webgl");
	returner["buffer"]					=returner["gl"].createBuffer();
	returner["gl"].bindBuffer(returner["gl"].ARRAY_BUFFER, returner["buffer"]);
	returner["vertex_shader"]			=create_Vertex_Shader(returner["gl"],"vertex");
	returner["fragment_shader_color"]	=create_Fragment_Shader(returner["gl"],"fragment");
	returner["fragment_shader_image"]	=create_Fragment_Shader(returner["gl"],"fragment_img");
	returner["fragment_shader_image_fx"]=create_Fragment_Shader(returner["gl"],"fragment_img_fx");
	returner["fragment_blur"]			=create_Fragment_Shader(returner["gl"],"fragment_blur");
	
	var draw_program_datas 				=set_WebGl_program("draw",returner["gl"],returner["canvas"],returner["vertex_shader"],returner["fragment_shader_color"]);	
	returner["draw_program"]			=draw_program_datas["Program"];
	returner["draw_positionLocation"]	=draw_program_datas["PositionLocation"];
	//returner["draw_resolutionLocation"]	=draw_program_datas["ResolutionLocation"];
	returner["draw_depth"]				=draw_program_datas["Depth"];
	returner["draw_matrix"]				=draw_program_datas["Matrix"];
	var image_program_datas 			=set_WebGl_program("image",returner["gl"],returner["canvas"],returner["vertex_shader"],returner["fragment_shader_image"]);	
	returner["img_program"]				=image_program_datas["Program"];
	returner["img_positionLocation"]	=image_program_datas["PositionLocation"];
	returner["img_texCoordLocation"]	=image_program_datas["TexCoordLocation"];
	//returner["img_resolutionLocation"]	=image_program_datas["ResolutionLocation"];
	returner["img_depth"]				=image_program_datas["Depth"];	
	returner["img_texCoordBuffer"]		=image_program_datas["TexCoordBuffer"];	
	returner["Initial_Width"]			=image_program_datas["Initial_Width"];
	returner["Initial_Height"]			=image_program_datas["Initial_Height"];
	returner["Alpha"]					=image_program_datas["Alpha"];
	returner["img_matrix"]				=image_program_datas["Matrix"];
	var blur_program_datas 				=set_WebGl_program("image_blur",returner["gl"],returner["canvas"],returner["vertex_shader"],returner["fragment_blur"]);	
	var fx_image_program_datas 			=set_WebGl_program("image_fx",returner["gl"],returner["canvas"],returner["vertex_shader"],returner["fragment_shader_image_fx"]);	
	returner["img_fx_program"]			=fx_image_program_datas["Program"];
	returner["img_fx_positionLocation"]	=fx_image_program_datas["PositionLocation"];
	returner["img_fx_texCoordLocation"]	=fx_image_program_datas["TexCoordLocation"];
	returner["img_fx_depth"]			=fx_image_program_datas["Depth"];	
	returner["img_fx_texCoordBuffer"]	=fx_image_program_datas["TexCoordBuffer"];	
	returner["Alpha_fx"]				=fx_image_program_datas["Alpha"];
	returner["img_fx_matrix"]			=fx_image_program_datas["Matrix"];
	returner["Position"]				=fx_image_program_datas["Position"];	
	returner["Rotation"]				=fx_image_program_datas["Rotation"];
	
	returner["img_fx_Texture_Size"]		=fx_image_program_datas["Texture_Size"];
	returner["img_fx_KernelLocation"]	=fx_image_program_datas["KernelLocation"];	
	
	returner["fx_framebuffers"]			=fx_image_program_datas["fx_framebuffers"];
	returner["fx_textures"]				=fx_image_program_datas["fx_textures"];	
	
	
	
	returner["blur_program"]			=blur_program_datas["Program"];
	returner["blur_positionLocation"]	=blur_program_datas["PositionLocation"];
	returner["blur_texCoordLocation"]	=blur_program_datas["TexCoordLocation"];
	returner["blur_depth"]				=blur_program_datas["Depth"];	
	returner["blur_texCoordBuffer"]		=blur_program_datas["TexCoordBuffer"];	
	returner["blur_fx"]					=blur_program_datas["Alpha"];
	returner["blur_matrix"]				=blur_program_datas["Matrix"];
	returner["blur_Position"]			=blur_program_datas["Position"];	
	returner["blur_Rotation"]			=blur_program_datas["Rotation"];
	
	returner["blur_Texture_Size"]		=blur_program_datas["Texture_Size"];
	//returner["blur_KernelLocation"]		=blur_program_datas["KernelLocation"];	
	
	returner["blur_framebuffers"]		=blur_program_datas["fx_framebuffers"];
	returner["blur_textures"]			=blur_program_datas["fx_textures"];	
	
	return returner;
}
function create_Vertex_Shader(target_gl,ShaderId){// crée un vertex shader et le lie au WebGl2d.context cible.
	var v = document.getElementById(ShaderId).firstChild.nodeValue;
	var vs = target_gl.createShader(target_gl.VERTEX_SHADER);
    target_gl.shaderSource(vs, v);
    target_gl.compileShader(vs);
    return vs;
}
function create_Fragment_Shader(target_gl,ShaderId){// crée un fragment shader et le lie au WebGl2d.context cible.
	var f = document.getElementById(ShaderId).firstChild.nodeValue;
	var fs = target_gl.createShader(target_gl.FRAGMENT_SHADER);
    target_gl.shaderSource(fs, f);
    target_gl.compileShader(fs);
    return fs;
}
function triangle_coords(x,y,w,h){//convertit des coordonnées x,y,width,height en en coordonnées triangulées.
	return [	x,y,	x+w,y+h,	x,y+h,
				x,y,	x+w,y+h,	x+w,y];
}
function triangle_coords_R(x,y,w,h){//convertit des coordonnées x,y,width,height en en coordonnées triangulées.
	x=x/W_ratio;
	y=y/H_ratio;
	w=w/W_ratio;
	h=h/H_ratio;
	return [	x,y,	x+w,y+h,	x+w,y,
				x,y,	x+w,y+h,	x,y+h];
}
function set_WebGl_program(type,target_gl,target_canvas,VertexShader,FragmentShader){// retourne un programme webGl2d de dessin couleur si type = "draw" et texture si type ="image"
	var returned_program = target_gl.createProgram();
    target_gl.attachShader(returned_program, VertexShader);
    target_gl.attachShader(returned_program, FragmentShader);
    target_gl.linkProgram(returned_program);
	target_gl.enable(target_gl.DEPTH_TEST);
	target_gl.depthFunc(target_gl.LESS);
	//target_gl.blendFunc(target_gl.SRC_ALPHA, target_gl.ONE);
	//target_gl.enable(target_gl.BLEND);
	target_gl.enable(target_gl.BLEND);
	target_gl.blendFuncSeparate(target_gl.SRC_ALPHA, target_gl.ONE_MINUS_SRC_ALPHA,target_gl.SRC_ALPHA,target_gl.DST_ALPHA);
	target_gl.useProgram(returned_program);
	var returned_positionLocation = target_gl.getAttribLocation(returned_program, "aVertexPosition");
	//var returned_resolutionLocation = target_gl.getUniformLocation(returned_program, "u_resolution");
    var returned_depth = target_gl.getUniformLocation(returned_program, "a_depth");
    var returned_W = target_canvas.width;
    var returned_H = target_canvas.height;
    var returned_matrix = target_gl.getUniformLocation(returned_program, "u_matrix");
    //target_gl.uniform2f(returned_resolutionLocation, returned_W, returned_H);
    if(type == "draw"){
		returned_program.uColor = target_gl.getUniformLocation(returned_program, "uColor");
		target_gl.uniform4fv(returned_program.uColor, [0, 0.0, 0.0, 1.0]);
		returned_program.aVertexPosition = target_gl.getAttribLocation(returned_program, "aVertexPosition");
		returned_program.a_depth =  target_gl.getUniformLocation(returned_program, "a_depth");
		target_gl.uniform1f(returned_program.a_depth,Math.random());
		target_gl.enableVertexAttribArray(returned_positionLocation);
		target_gl.vertexAttribPointer(returned_positionLocation, 2, target_gl.FLOAT, false, 0, 0);
		return {	"Program"			:returned_program,
					"PositionLocation"	:returned_positionLocation,
					//"ResolutionLocation":returned_resolutionLocation,
					"Depth"				:returned_depth,
					"Matrix"			:returned_matrix	
		};
	}else if(type == "image"){
		var returned_texCoordLocation = target_gl.getAttribLocation(returned_program, "a_texCoord");
		var returned_zlevel = Math.random()*1;
		target_gl.uniform1f(returned_depth,returned_zlevel );
		var returned_alpha = target_gl.getUniformLocation(returned_program, "v_alpha");
		//création tex Buffer
		var returned_texCoordBuffer = target_gl.createBuffer();
		target_gl.bindBuffer(target_gl.ARRAY_BUFFER, returned_texCoordBuffer);
		target_gl.enableVertexAttribArray(returned_texCoordLocation);
		target_gl.vertexAttribPointer(returned_texCoordLocation, 2, target_gl.FLOAT, false, 0, 0);
		var returned_vertices = new Float32Array([	0, 0, 1, 1, 0,1,
													0, 0, 1, 1, 1,0]);
		target_gl.bufferData(target_gl.ARRAY_BUFFER, returned_vertices, target_gl.STATIC_DRAW);
		return {	"Program"				:returned_program,
					"PositionLocation"		:returned_positionLocation,
					"TexCoordLocation"		:returned_texCoordLocation,
					//"ResolutionLocation"	:returned_resolutionLocation,
					"Depth"					:returned_depth,
					"TexCoordBuffer"		:returned_texCoordBuffer,
					"Initial_Width"			:returned_W,
					"Initial_Height"		:returned_H,
					"Alpha"					:returned_alpha,
					"Matrix"				:returned_matrix	
		}
	}else if(type == "image_fx"){
		var returned_texCoordLocation = target_gl.getAttribLocation(returned_program, "a_texCoord");
		var returned_zlevel = Math.random()*1;
		target_gl.uniform1f(returned_depth,returned_zlevel );
		var returned_alpha = target_gl.getUniformLocation(returned_program, "v_alpha");
		//création tex Buffer
		var returned_texCoordBuffer = target_gl.createBuffer();
		target_gl.bindBuffer(target_gl.ARRAY_BUFFER, returned_texCoordBuffer);
		target_gl.enableVertexAttribArray(returned_texCoordLocation);
		target_gl.vertexAttribPointer(returned_texCoordLocation, 2, target_gl.FLOAT, false, 0, 0);
		var returned_vertices = new Float32Array([	0, 0, 1, 1, 0,1,
													0, 0, 1, 1, 1,0]);
		target_gl.bufferData(target_gl.ARRAY_BUFFER, returned_vertices, target_gl.STATIC_DRAW);
		var returned_texture_size = target_gl.getUniformLocation(returned_program, "u_textureSize");
		var returned_kernelLocation = target_gl.getUniformLocation(returned_program, "u_kernel[0]");
		
		var fx_objects = create_fx_frame_buffers(target_gl);
		var returned_Position  = target_gl.getUniformLocation(returned_program, "uPosition");
		var returned_Rotation  = target_gl.getUniformLocation(returned_program, "uRotation");
		return {	"Program"				:returned_program,
					"PositionLocation"		:returned_positionLocation,
					"TexCoordLocation"		:returned_texCoordLocation,
					"Position"				:returned_Position,
					"Rotation"				:returned_Rotation,
					//"ResolutionLocation"	:returned_resolutionLocation,
					"Depth"					:returned_depth,
					"TexCoordBuffer"		:returned_texCoordBuffer,
					"Initial_Width"			:returned_W,
					"Initial_Height"		:returned_H,
					"Alpha"					:returned_alpha,
					"Matrix"				:returned_matrix,
					"Texture_Size"			:returned_texture_size,
					"KernelLocation"		:returned_kernelLocation,
					"fx_framebuffers"		:fx_objects["fx_framebuffers"],
					"fx_textures"			:fx_objects["fx_textures"]	
		}
		
	}else if(type == "image_blur"){
		var returned_texCoordLocation = target_gl.getAttribLocation(returned_program, "a_texCoord");
		var returned_zlevel = Math.random()*1;
		target_gl.uniform1f(returned_depth,returned_zlevel );
		var returned_alpha = target_gl.getUniformLocation(returned_program, "v_alpha");
		//création tex Buffer
		var returned_texCoordBuffer = target_gl.createBuffer();
		target_gl.bindBuffer(target_gl.ARRAY_BUFFER, returned_texCoordBuffer);
		target_gl.enableVertexAttribArray(returned_texCoordLocation);
		target_gl.vertexAttribPointer(returned_texCoordLocation, 2, target_gl.FLOAT, false, 0, 0);
		var returned_vertices = new Float32Array([	0, 0, 1, 1, 0,1,
													0, 0, 1, 1, 1,0]);
		target_gl.bufferData(target_gl.ARRAY_BUFFER, returned_vertices, target_gl.STATIC_DRAW);
		var returned_texture_size = target_gl.getUniformLocation(returned_program, "u_textureSize");
	//	var returned_kernelLocation = target_gl.getUniformLocation(returned_program, "u_kernel[0]");
		
		var fx_objects = create_fx_frame_buffers(target_gl);
		var returned_Position  = target_gl.getUniformLocation(returned_program, "uPosition");
		var returned_Rotation  = target_gl.getUniformLocation(returned_program, "uRotation");
		return {	"Program"				:returned_program,
					"PositionLocation"		:returned_positionLocation,
					"TexCoordLocation"		:returned_texCoordLocation,
					"Position"				:returned_Position,
					"Rotation"				:returned_Rotation,
					//"ResolutionLocation"	:returned_resolutionLocation,
					"Depth"					:returned_depth,
					"TexCoordBuffer"		:returned_texCoordBuffer,
					"Initial_Width"			:returned_W,
					"Initial_Height"		:returned_H,
					"Alpha"					:returned_alpha,
					"Matrix"				:returned_matrix,
					"Texture_Size"			:returned_texture_size,
					//"KernelLocation"		:returned_kernelLocation,
					"fx_framebuffers"		:fx_objects["fx_framebuffers"],
					"fx_textures"			:fx_objects["fx_textures"]	
		}
		
	}
}
function create_fx_frame_buffers(target_gl){
	// create 2 textures and attach them to framebuffers.
	var textures = [];
	var framebuffers = [];
	for (var ii = 0; ii < 2; ++ii) {
		var texture = createAndSetupEmptyTexture(target_gl);
		textures.push(texture);
		// Create a framebuffer
		var fbo = target_gl.createFramebuffer();
		framebuffers.push(fbo);
		target_gl.bindFramebuffer(target_gl.FRAMEBUFFER, fbo);
		// Attach a texture to it.
		target_gl.framebufferTexture2D(
		target_gl.FRAMEBUFFER, target_gl.COLOR_ATTACHMENT0, target_gl.TEXTURE_2D, texture, 0);
	}	
	return {
		"fx_framebuffers"	:framebuffers,
		"fx_textures"		:textures
	}
}
function set_empty_texture_size(target_gl,w,h){
	// make the texture the same size as the image
	target_gl.texImage2D(target_gl.TEXTURE_2D, 0, target_gl.RGBA, w, h, 0,target_gl.RGBA, target_gl.UNSIGNED_BYTE, null);
}
function createAndSetupEmptyTexture(target_gl) {
	var texture = target_gl.createTexture();
	target_gl.bindTexture(target_gl.TEXTURE_2D, texture);
	target_gl.texParameteri(target_gl.TEXTURE_2D, target_gl.TEXTURE_WRAP_S, target_gl.REPEAT);
	target_gl.texParameteri(target_gl.TEXTURE_2D, target_gl.TEXTURE_WRAP_T,target_gl.REPEAT);
	target_gl.texParameteri(target_gl.TEXTURE_2D, target_gl.TEXTURE_MIN_FILTER, target_gl.NEAREST);
	target_gl.texParameteri(target_gl.TEXTURE_2D, target_gl.TEXTURE_MAG_FILTER, target_gl.NEAREST);
	return texture;
}
function load_images_list(Image_list,webgl2d){
	var list_length = webgl2d.image_list.length;
	var returned_array =[];
	for(i=0;i<list_length;i++){
		var new_img = new Image();
		new_img.onload=function(){on_image_load(this,webgl2d);};
		new_img.src=Image_list[i];
		new_img.position = i;
	}
}
function on_image_load(image,webgl2d){
	set_image_to_texture_size(image,webgl2d);
}
function on_sized_image_load(image,webgl2d){
	var tex = webgl2d.add_texture(image);
	var expected_list_length = webgl2d.image_list.length ;
	var actual_images_list_length = webgl2d.Tex.length;
	webgl2d.tmp_tex.length = expected_list_length;
	webgl2d.tmp_tex[image.position] = tex;
	image = null;
	if( expected_list_length == actual_images_list_length){
		webgl2d.Tex = webgl2d.tmp_tex;
		//webgl2d.tmp_tex = null;
		//webgl2d.image_list = null;	
		webgl2d.startup_function();
	}
}
function set_image_to_texture_size(image,webgl2d){

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
			find_imageSrc_in_list(image,image,webgl2d);
			on_sized_image_load(image,webgl2d);
			break;
		}else if(longest_side<=poWofTwo){
			var base_Image = new Image();
			find_imageSrc_in_list(image,base_Image,webgl2d)
			base_Image.onload =function(){ on_sized_image_load(this,webgl2d);};
			base_Image.src=build_canvas_texture(image,poWofTwo,baseW,baseH);
			base_Image.position = image.position;
			break;
		}else{
			poWofTwo = poWofTwo * 2; 
		}
	}
}
function find_imageSrc_in_list(image1,image2,webgl2d){
	webgl2d.Tex.push(image2);
	
}
function build_canvas_texture(ImAge,poWofTwo,baseW,baseH){
	var tex_canvas = document.createElement("canvas");
	tex_canvas.width = poWofTwo;
	tex_canvas.height = poWofTwo;
	var tex_context = tex_canvas.getContext('2d');
	tex_context.drawImage(ImAge, 0,0,baseW,baseH);
	return tex_canvas.toDataURL("image/png");
}
function Append_Shaders_Script(){//attache les shaders WebGl à la page en cours.
	if(document.getElementById("vertex") == null){
		var shaders_div=document.createElement('div');
		shaders_div.innerHTML = Shaders_string;
		document.getElementsByTagName('body')[0].appendChild(shaders_div);
	}
}
var Shaders_string = 	
'<script id="vertex" type="x-shader/x-vertex">\
	attribute vec2 aVertexPosition;\
	uniform mat3 u_matrix;\
	attribute vec2 a_texCoord;\
	varying vec2 v_texCoord;\
	uniform float a_depth;\
	uniform vec2 uPosition;\
	uniform float uRotation;\
	uniform vec2 resolution;\
    uniform vec2 aspect;\
	const float PI = 3.14159265358979323846264;\
	void main() {\
	vec2 _Rotation;\
	_Rotation.x = cos((uRotation+90.) * PI /180.);\
	_Rotation.y = sin((uRotation+90.) * PI /180.);\
	vec2 Rotation;\
	Rotation.x = aVertexPosition.x * _Rotation.y + aVertexPosition.y * _Rotation.x;\
	Rotation.y = aVertexPosition.y * _Rotation.y - aVertexPosition.x * _Rotation.x;\
	vec2 to_pixels;\
	to_pixels = (((Rotation+uPosition)/resolution)*2.0)-1.0;\
	to_pixels.y = to_pixels.y*-1.0;\
	float dist = sqrt(((to_pixels.x)*(to_pixels.x))+((to_pixels.y)*(to_pixels.y)));\
	gl_Position = vec4(( vec3(to_pixels, 1)).xy, a_depth, 1);\
	  v_texCoord = a_texCoord;\
	}\
</script>   \
<script id="fragment" type="x-shader">\
	precision mediump float;\
	uniform vec4 uColor;\
	void main() {\
		gl_FragColor = uColor;\
	}\
</script> \
<script id="fragment_img" type="x-shader/x-fragment">\
	precision mediump float;\
	uniform sampler2D u_image;\
	varying vec2 v_texCoord;\
	uniform float v_alpha;\
	void main() {\
		vec4 textureColor = texture2D(u_image, v_texCoord);\
		if(textureColor.a * v_alpha <=0. ){\
			discard;\
		}\
		gl_FragColor = vec4(textureColor.rgb, textureColor.a * v_alpha);\
	}\
</script>\
<script id="fragment_img_fx" type="x-shader/x-fragment">\
	precision mediump float;\
	uniform sampler2D u_image;\
	varying vec2 v_texCoord;\
	uniform vec2 u_textureSize;\
	uniform float u_kernel[9];\
	uniform float v_alpha;\
	void main() {\
		vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\
		vec4 converted_color;\
		int empty_pixel = 0;\
		if(texture2D(u_image, v_texCoord) == vec4(1.0,0.0,0.0,1.0)||texture2D(u_image, v_texCoord).a<0.1){\
			converted_color = vec4(0.0,0.0,0.0,0.0);\
			 empty_pixel = 1;\
		}else{\
			converted_color = vec4(texture2D(u_image, v_texCoord));\
		}\
		vec2 target=vec2(-1,-1);\
		vec4 colorSum;\
		int colored_neighbour=0;\
		for(int i=0;i<9;i++){\
			vec4 target_color;\
			if(texture2D(u_image, v_texCoord + onePixel * target)!= vec4(1.0,0.0,0.0,1.0) && texture2D(u_image, v_texCoord + onePixel * target).a>0.1){\
				target_color = texture2D(u_image, v_texCoord + onePixel * target);\
				colored_neighbour+=1;\
				colorSum += vec4(target_color)*u_kernel[i];\
			}\
			target+=vec2(1.,0.);\
			if(target[0] > 1.){\
				target[0] = -1.;\
				target[1] += 1.;\
				if(target[1] > 1.){\
					target[1] = -1.;\
				}\
			}\
		}\
		if(colored_neighbour==0 ){\
			discard;\
		}\
		float kernelWeight =\
			u_kernel[0] +\
			u_kernel[1] +\
			u_kernel[2] +\
			u_kernel[3] +\
			u_kernel[4] +\
			u_kernel[5] +\
			u_kernel[6] +\
			u_kernel[7] +\
			u_kernel[8] ;\
		if (kernelWeight <= 0.0) {\
			kernelWeight = 1.0;\
		}\
		vec4 pre_color=vec4((colorSum / kernelWeight));\
		if(pre_color.a == .0){\
			discard;\
		}else{\
			pre_color.a =pre_color.a*v_alpha;\
		}\
		gl_FragColor =pre_color;\
	}\
</script> \
<script id="fragment_blur" type="x-shader/x-fragment">\
	precision mediump float;\
	uniform sampler2D u_image;\
	varying vec2 v_texCoord;\
	uniform vec2 u_textureSize;\
	uniform float v_alpha;\
	uniform float orientation;\
	uniform float kernel[500];\
	uniform int radius;\
	void main() {\
		vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\
		vec2 direction = vec2(0.,1.);\
		int l = radius;\
		if(orientation == 1.){\
			direction = vec2(1.,0.);\
		}\
		vec4 Fragment_Color = vec4(texture2D( u_image, vec2(v_texCoord) ) * kernel[0]);\
		float i2 = 1.;\
		for (int i = 1; i<500; i++) {\
			if(kernel[i] > 0.){\
				Fragment_Color += texture2D( u_image, ( vec2(v_texCoord)+vec2(onePixel.x*i2*direction.x,onePixel.y*i2*direction.y) ) ) * kernel[i];\
				Fragment_Color += texture2D( u_image, ( vec2(v_texCoord)-vec2(onePixel.x*i2*direction.x,onePixel.y*i2*direction.y) ) ) * kernel[i];\
				i2 += 1.;\
			}\
		}\
		if(Fragment_Color.a==0.){\
			discard;\
		}\
		gl_FragColor = Fragment_Color;\
	}\
</script> \
<script id="fragment_blur2" type="x-shader/x-fragment">\
	precision mediump float;\
	uniform sampler2D u_image;\
	varying vec2 v_texCoord;\
	uniform vec2 u_textureSize;\
	uniform float v_alpha;\
	uniform float orientation;\
	void main() {\
	vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\
	vec2 direction = vec2(0.,1.);\
	if(orientation == 1.){\
		direction = vec2(1.,0.);\
	}\
	float offset[3];\
	float weight[3];\
		offset[0] = 0.0;\
		offset[1] =1.3846153846;\
		offset[2] =3.2307692308;\
		weight[0] =  0.47442968;\
		weight[1] =  0.23392642;\
		weight[2] =  0.02804153;\
		vec4 Fragment_Color = vec4(texture2D( u_image, vec2(v_texCoord) ) * weight[0]);\
		float i2 = 1.;\
		for (int i = 1; i<3; i++) {\
			Fragment_Color += texture2D( u_image, ( vec2(v_texCoord)+vec2(2.*onePixel.x*i2*direction.x,2.*onePixel.y*i2*direction.y) ) ) * weight[i];\
			Fragment_Color += texture2D( u_image, ( vec2(v_texCoord)-vec2(2.*onePixel.x*i2*direction.x,2.*onePixel.y*i2*direction.y) ) ) * weight[i];\
			i2 += 1.;\
		}\
		gl_FragColor = Fragment_Color;\
	}\
</script> \
<script id="fragment_img_fx3" type="x-shader/x-fragment">\
	precision mediump float;\
	uniform sampler2D u_image;\
	varying vec2 v_texCoord;\
	uniform vec2 u_textureSize;\
	uniform float u_kernel[9];\
	uniform float v_alpha;\
	void main() {\
		vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\
		vec4 converted_color;\
		int empty_pixel = 0;\
		if(texture2D(u_image, v_texCoord) == vec4(1.0,0.0,0.0,1.0)||texture2D(u_image, v_texCoord).a<0.1){\
			converted_color = vec4(0.0,0.0,0.0,0.0);\
			 empty_pixel = 1;\
		}else{\
			converted_color = vec4(texture2D(u_image, v_texCoord));\
		}\
		vec2 target=vec2(-1,-1);\
		vec4 colorSum;\
		int colored_neighbour=0;\
		for(int i=0;i<9;i++){\
			vec4 target_color;\
			if(texture2D(u_image, v_texCoord + onePixel * target)!= vec4(1.0,0.0,0.0,1.0) && texture2D(u_image, v_texCoord + onePixel * target).a>0.1){\
				target_color = texture2D(u_image, v_texCoord + onePixel * target);\
				colored_neighbour+=1;\
				colorSum += vec4(target_color)*u_kernel[i];\
			}\
			target+=vec2(1.,0.);\
			if(target[0] > 1.){\
				target[0] = -1.;\
				target[1] += 1.;\
				if(target[1] > 1.){\
					target[1] = -1.;\
				}\
			}\
		}\
		if(colored_neighbour==0 ){\
			discard;\
		}\
		float kernelWeight =\
			u_kernel[0] +\
			u_kernel[1] +\
			u_kernel[2] +\
			u_kernel[3] +\
			u_kernel[4] +\
			u_kernel[5] +\
			u_kernel[6] +\
			u_kernel[7] +\
			u_kernel[8] ;\
		if (kernelWeight <= 0.0) {\
			kernelWeight = 1.0;\
		}\
		vec4 pre_color=vec4((colorSum / kernelWeight));\
		if(pre_color.a == .0){\
			discard;\
		}else{\
			pre_color.a =pre_color.a*v_alpha;\
		}\
		gl_FragColor =pre_color;\
	}\
</script> \
<script id="fragment_img_fx2" type="x-shader/x-fragment">\
precision mediump float;\
uniform sampler2D u_image;\
varying vec2 v_texCoord;\
uniform vec2 u_textureSize;\
uniform float u_kernel[9];\
uniform float v_alpha;\
void main() {\
	vec4 transformed_color = vec4(.0,.0,.0,.0);\
	vec4 transformed_color2 = vec4(1.0,1.0,1.0,1.0);\
	transformed_color2 = vec4(transformed_color2*vec4(0.,0.,0.,1.0));\
	vec2 target=vec2(-1,-1);\
	vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\
	if(texture2D(u_image, v_texCoord).r == 1.0){\
		int check_neighbours = 0;\
		for(int i=0;i<9;i++){\
			if(texture2D(u_image, v_texCoord + onePixel * target).r != 1.0){\
				check_neighbours +=1;\
				transformed_color+=vec4(texture2D(u_image, v_texCoord + onePixel * target));\
			}\
			target+=vec2(1.,0.);\
			if(target[0] > 1.){\
				target[0] = -1.;\
				target[1] += 1.;\
				if(target[1] > 1.){\
					target[1] = -1.;\
				}\
			}\
		}\
		if(check_neighbours == 0){\
			discard;\
		}\
	}else{\
		transformed_color =texture2D(u_image, v_texCoord);\
	}\
	float kernel_2[9];\
	target=vec2(-1,-1);\
	vec4 preSum = vec4(0.0,0.0,0.0,0.0);\
	for(int i=0;i<9;i++){\
		kernel_2[i] = .0;\
		if(texture2D(u_image, v_texCoord + onePixel * target).r != 1.0){\
			preSum +=vec4(texture2D(u_image, v_texCoord + onePixel * target) * u_kernel[i]);\
			kernel_2[i] = u_kernel[i];\
		}else{\
			kernel_2[i] = .0;\
		}\
		target+=vec2(1.,0.);\
		if(target[0] > 1.){\
			target[0] = -1.;\
			target[1] += 1.;\
			if(target[1] > 1.){\
				target[1] = -1.;\
			}\
		}\
	}\
   vec4 colorSum =preSum;\
  float kernelWeight =\
		kernel_2[0] +\
		kernel_2[1] +\
     kernel_2[2] +\
     kernel_2[3] +\
     kernel_2[4] +\
     kernel_2[5] +\
     kernel_2[6] +\
     kernel_2[7] +\
     kernel_2[8] ;\
	if (kernelWeight <= 0.0) {\
     kernelWeight = 1.0;\
   }\
   vec4 pre_color =  vec4((colorSum / kernelWeight).rgb, 1.0* v_alpha);\
   if(pre_color.r ==1.0) {\
	   discard;\
	}\
	gl_FragColor =transformed_color2;\
}\
</script>';
var kernels={
	normal:[	0,0,0,
				0,1,0,
				0,0,0],
	gaussianBlur:[	0.045,0.122,0.045,
					0.122,0.332,0.122,
					0.045,0.122,0.045],
	gaussianBlur2:[	1,2,1,
					2,4,2,
					1,2,1],
	gaussianBlur3:[	0,1,0,
					1,1,1,
					0,1,0],
	unsharpen:[-1,-1,-1,-1,9,-1,-1,-1,-1],
	sharpness:[0,-1,0,-1,5,-1,0,-1,0],
	sharpen:[-1,-1,-1,-1,16,-1,-1,-1,-1],
	edgeDetect:[-0.125,-0.125,-0.125,-0.125,1,-0.125,-0.125,-0.125,-0.125],
	edgeDetect2:[-1,-1,-1,-1,8,-1,-1,-1,-1],
	edgeDetect3:[-5,0,0,0,0,0,0,0,5],
	edgeDetect4:[-1,-1,-1,0,0,0,1,1,1],
	edgeDetect5:[-1,-1,-1,2,2,2,-1,-1,-1],
	edgeDetect6:[-5,-5,-5,-5,39,-5,-5,-5,-5],
	sobelHorizontal:[1,2,1,0,0,0,-1,-2,-1],
	sobelVertical:[1,0,-1,2,0,-2,1,0,-1],
	previtHorizontal:[1,1,1,0,0,0,-1,-1,-1],
	previtVertical:[1,0,-1,1,0,-1,1,0,-1],
	boxBlur:[	0.111,0.111,0.111,
				0.111,0.111,0.111,
				0.111,0.111,0.111],
	triangleBlur:[0.0625,0.125,0.0625,0.125,0.25,0.125,0.0625,0.125,0.0625],
	emboss:[-2,-1,0,-1,1,1,0,1,2],
	vertical_blur:[	0,0,0,
					0.25,0.5,0.25,
					0,0,0]
	};

// List of effects to apply.
var effectsToApply = [
  "gaussianBlur",
  "emboss",
  "gaussianBlur",
  "unsharpen"
];
if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame				|| // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
		window.oRequestAnimationFrame				||
		window.msRequestAnimationFrame				||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
			window.setTimeout( callback, 30 );
		};
	} )();
}
function create_sprite_grid(nb_y,nb_x,w,h,tex){
	var grid  = new sprite_grid(nb_y,nb_x,w,h,tex);
	grid.set_grid();
	return grid;
}
function sprite_grid(nb_y,nb_x,w,h,tex){
	this.nb_y = nb_y;
	this.nb_x = nb_x;
	this.w = w;
	this.h = h;
	this.sprites =[];
	this.list=[];
	for(i=0;i<8;i++){
		var ara = [];
		for(j=0;j<10;j++){
			ara.push([]);
		}
		this.list.push(ara);
	}
	this.tex = tex
	
}
sprite_grid.prototype.draw_grid=function(WebGl2d){
	var yL = this.nb_y*this.nb_x,
		xL = this.nb_x,
		Z = 1,
		sprite_index = 0,
		w = this.w,
		h = this.h,
		ListxL = this.list.length;
	for(i=0;i<ListxL;i++){
		var tab = this.list[i],
			tabL = tab.length;
		for(j=0;j<tabL;j++){
			var cell = tab[j]
				s0 = cell[0];
			if(s0 !=null){
				var ceL = cell.length;
				sfX = Math.floor(s0.frameX),
				Spx = (sfX*(1/10))*(600/1024),
				Spy = (s0.frameY*(1/8))*(635/1024),
				Srw = (1/10)*(600/1024),
				Srh = (1/8)*(635/1024),
				Gl2d.set_tex_src_coordinates(triangle_coords(Spx,Spy,Srw,Srh));
				for(y=0;y<ceL;y++){
					var s = cell[y],
					Rpx = s.X,
					Rpy = s.Y;
					Gl2d.draw_tex(Rpx,Rpy,w,h,Z);
					s.frameX+=0.5;
					s.X+=1-(Math.random()*2);
					s.Y+=1-(Math.random()*2);
					if(s.frameX>=10){
						s.frameX = 0;
					}
					var rand = Math.random()*2;
					if(rand > 1.8){
						var rY= s.frameY+1,
							rX = Math.floor(s.frameX);
						if(rY >=8){
							rY =0;
						}
						s.frameY = rY;
						var cut = cell.splice(y,1);
						this.list[rY][rX].push(cut[0]);
						y+=-1;
						ceL +=-1;
					}
					Z += 0.00001;
					sprite_index++;
				}
			}
		}
	}
}
sprite_grid.prototype.set_grid =function(){
	var Cnv = document.getElementById("canvas"),
		wi = Cnv.width-40,
		hi = Cnv.height-50;
	for(y=0;y<this.nb_y;y++){
		for(x=0;x<this.nb_x;x++){
			var fX = Math.floor(Math.random()*10);
			var fY = Math.floor(Math.random()*8);
			var new_S = new sprite(fX,fY,Math.random()*wi,Math.random()*hi);
			this.sprites.push(new_S);
			this.list[fY][fX].push(new_S);
		}
	}
}
function sprite(fX,fY,x,y){
	this.frameX=fX;
	this.frameY=fY;
	this.X=x;
	this.Y=y;
}
