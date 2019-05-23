
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

 
 
//------------------------------------------------------------------------------ 
//        Date  2018-05-27
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  
   function g_context_id(){
   console.log("replace this value");
   return 1; 
   	}
//jQuery(function ($) {
//    Load_contextData();
//})
 $(function () {
     Load_contextData();
 })

 function Load_contextData(){
 	 
    
     var jsonStr = {_t: com.settings.timestamp(),
         type: 1, slanguage: '',
     }
     com.ajax({
         type: 'POST', url: km.model.urls["context_list"], data: jsonStr, success: function (result) {
             result.forEach(function (r) {
                 $("#abountDiv").html($("#abountDiv").html()+"<h4>" + r.title + "</h4>" + r.context.replaceAll("&gt;", ">").replaceAll("&lt;", "<"));
             })
             //var t = {};
             //t.Table = result

         }
     }); 

  }

