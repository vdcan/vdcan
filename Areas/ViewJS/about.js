
/*
//------------------------------------------------------------------------------ 
//        Date  2018-05-27
//        Author  蔡捷   
//			 About page 
//        File  about.cshtml  Page file  
//        File  about.js JS
//------------------------------------------------------------------------------ 
*/
 
 // Current page object 
var km = {};
km.model = null; 
km.init = function () {
    
     };



$(function () { 
    $(km.init); 
});

 
 
//------------------------------------------------------------------------------ 
//        Date  2018-05-27
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  
   function g_context_id(){
   console.log("replace this value");
   return 1; 
   	}

 $(function () {
     Load_contextData();
 })

 function Load_contextData(){
 	jsonObject={_t: com.settings.timestamp(),
					id:g_context_id(),};
 	
com.ajax({

            type: 'POST', url: km.model.urls["context_detail"], data: jsonObject, success: function (result) { 

                $("#abountDiv").html("<h4>" + result[0].title + "</h4>" + result[0].context.replaceAll("&gt;", ">").replaceAll("&lt;", "<"));
        var t = {};
        t.Table = result
            	   //$("#template_context").tmpl(t)
                   //  .appendTo("#detail_div_context" );
                     
            }
    });
  }

