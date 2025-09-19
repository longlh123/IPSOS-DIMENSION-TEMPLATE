/*****************************************************************/
/**	Name: CAPTUREBASIC.js										**/
/**	Summary: CAPTURE BASIC QUESTION                             **/
/**	Copyright LongPham								            **/
/*****************************************************************/
(function($){

	$.fn.processImage = function(id){

		var options = {
			client_hints: true,
		};

		return '<img src="'+ $.cloudinary.url(id, options) +'" style="width: 100%; height: auto"/>'
	};

	$.fn.countImages = function($this, image_name){

		var str_imagename = image_name + ($this.children().length == 0 ? "" : ($this.children().length + 1).toString());

		return str_imagename;
	};	
}(jQuery));

$(document).ready(function(){

    //Your Cloudinary account dashboard
	var CLOUDINARY_NAME = "";
	var CLOUDINARY_API_KEY = "";
	var CLOUDINARY_API_SECRET = "";
	var CLOUDINARY_PRESET_NAME = "ctjzx6so";

    var count = 0;

    $('.capturebasic').children().each(function(){

        if($(this).prop('class') == "mrBannerText"){

            $(this).hide();
            var arr_properties = $(this).find(".custom_question_properties").text().split('#');

            for(var i = 0; i < arr_properties.length; i++)
            {
                var property = arr_properties[i].replace("[","").replace("]","").split(':');

                switch(property[0].toLowerCase())
                {
                    case "projectname":
                        projectname = property[1];
                        count++;
                        break;
                    case "imagename":
                        imagename = property[1];
                        imagename_template = property[1];
                        count++;
                        break;
                    case "cloudinaryname":
                        CLOUDINARY_NAME = property[1];
                        count++;
                        break;
                    case "cloudinaryapikey":
                        CLOUDINARY_API_KEY = property[1];
                        count++;
                        break;
                    case "cloudinaryapisecret":
                        CLOUDINARY_API_SECRET = property[1];
                        count++;
                        break;
                }
            }
        } else if($(this).prop('class') == "capture_container"){
            if(count == 5){
                //capture='camera'
                $(this).append("<div class = 'cloudinary_fileupload_container'><input type='file' name='file' accept = 'image/*' class ='cloudinary_fileupload' /><label for = 'cloudinary_fileupload' class = 'cloudinary_fileupload_trigger'>Choose an image to upload (.PNG, .JPG)..</label><progress max = '100' value = '0' class = 'cloudinary_fileupload_progressbar'></progress></div><br></br><div class='thumbnails'></div>");

                if($('input:text').val().length > 0)
                {
                    $('.mrNext').css({'cursor' : 'pointer', 'opacity' : 1});
                    $('.mrNext').prop('disabled', false);

                    var arr_imagenames = $('input:text').val().split('|112633|');
                    
                    $.each(arr_imagenames, function(index, img_name){

                        $('.thumbnails').append('<img src = "' + img_name + '" width = "150px" height = "100px" alt = "' + img_name + '" />');
                    });

                    if(arr_imagenames.length > 4)
                    {
                        $('.cloudinary_fileupload').css({'cursor' : 'not-allowed'});
                        $('.cloudinary_fileupload').prop('disabled', true);
                    }
                }
                else
                {
                    $('.mrNext').css({'cursor' : 'not-allowed', 'opacity' : 0.6});
                    $('.mrNext').prop('disabled', true);
                }

                $.cloudinary.config({"cloud_name" : CLOUDINARY_NAME, 
                                        "api_key"    : CLOUDINARY_API_KEY, 
                                        "api_secret" : CLOUDINARY_API_SECRET
                                    });

                $('.cloudinary_fileupload').unsigned_cloudinary_upload("ctjzx6so", {cloud_name : CLOUDINARY_NAME, 
                                                                                    public_id  : imagename + ($('.thumbnails').children().length == 0 ? "" : "_" + ($('.thumbnails').children().length + 1).toString()), 
                                                                                    tags       : projectname,
                                                                                    folder     : projectname},
                    {multiple: false}).bind('cloudinarydone', function(e, data){

                        var multipleUploads = 0;

                        if(typeof(data.originalFiles) !== 'undefined'){
                            multipleUploads = data.originalFiles.length;
                        }

                        if(multipleUploads > 0)
                        {
                            var arr_imagenames = $('input:text').val().split('|112633|');

                            $('.thumbnails').append($.cloudinary.image(data.result.public_id, {
                                                                                format: 'jpg',
                                                                                width: 150,
                                                                                height: 100,
                                                                                crop: 'thumb',
                                                                                gravity: 'face',
                                                                                effect: 'sharpen:300'
                                                                            }));

                            var str_imagenames = "";

                            $('.thumbnails').children().each(function(){

                                if($(this).is('img'))
                                {
                                    str_imagenames = (str_imagenames.length == 0) ? $(this).prop('src') : str_imagenames + "|112633|" + $(this).prop('src');
                                }
                            });

                            $('input:text').val(str_imagenames);

                            $('.mrNext').css({'cursor' : 'pointer', 'opacity' : 1});
                            $('.mrNext').prop('disabled', false);

                            $('.cloudinary_fileupload_progressbar').attr('value', 0);
                        }	
                    });

                $('.cloudinary_fileupload').bind('fileuploadprogress', function(e, data){

                    $('.cloudinary_fileupload_progressbar').attr('value', Math.round((data.loaded * 100.0) / data.total));
                });
            } else {
                //capture='camera'
                $(this).append("<div class = 'cloudinary_fileupload_container'><input type='file' name='file' accept = 'image/*' class ='cloudinary_fileupload_disable' /><label for = 'cloudinary_fileupload_disable' class = 'cloudinary_fileupload_trigger_disable'>Choose an image to upload (.PNG, .JPG)..</label></div><br></br><div class='thumbnails'></div>");
            }
            
        }

    });

    $('input:text').hide();
})