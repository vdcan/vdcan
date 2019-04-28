
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-26
//       作者： fdsaf   
//			  
//       文件： search_test.cshtml 页面文件 
//       文件： search_test.js JS文件
//------------------------------------------------------------------------------ 
*/
 

 
 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-26
//       作者： fdsaf   
//			 sub page  
//------------------------------------------------------------------------------  


 function LoadTable(){
 	jsonObject={_t: com.settings.timestamp(),
					};
 	
com.ajax({

    type: 'POST', url: km.model.urls["test_list"], data: jsonObject, success: function (result) {
        var t = {};
        t.Table = result
        $("#template_test").tmpl(t)
                     .appendTo("#detail_div_test" );
                     
            }
    });
 }
 $(function () {
     LoadTable();
 })
