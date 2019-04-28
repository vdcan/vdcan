
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-01-12
//       作者： 蔡捷2   
//			 无easyui 
//       文件： noeasyui.cshtml 页面文件 
//       文件： noeasyui.js JS文件
//------------------------------------------------------------------------------ 
*/
//当前页面对象

    $(function () {
 test_user2_1_Init();
 
    });

 
 
//------------------------------------------------------------------------------ 
//       时间： 2018-01-12
//       作者： 蔡捷2   
//			   
//------------------------------------------------------------------------------  
var gpage =20;
var gpageSize=5;
function  test_user2_1_Init(){
	
	Query(1);
 
        
}
 
        function Query(page) { 
        	
            var json = { page: page, rows: gpageSize,   _t: com.settings.timestamp(),department_id:0 };
            var jsonParam = JSON.stringify(json);
            com.ajax({
                url: gmodel.urls["pager"], data: jsonParam, success: function (result) {
                    //解析json
                    //  var data = eval("(" + data + ")");
                    //清空数据 
                    fillTable(result.rows);
                    totalPage = result.total / gpageSize; 
                    
                    if(gpage !=totalPage){
                    gpage = 	totalPage ;
                    	 window.pagObj = $('#paginationtest_user2').twbsPagination({
            totalPages: totalPage,
            visiblePages: gpageSize,
            onPageClick: function (event, page) {
               // console.data(page + ' (from options)');
            }
        }).on('page', function (event, page) {
           // console.data(page + ' (from event listening)');
                	Query(page);
        }); 
                    	
                    }
                }
            });
        }
        
        
        //填充数据
        function fillTable(data) {
            if (data.length > 1) {
                //  totalPage = data[data.length - 1].totalPage;
                var tbody_content = "";//不初始化字符串"",会默认"undefined"
                for (var i = 0; i < data.length  ; i++) {
                    tbody_content += "<div  >" 
                                        + "<span   >" + data[i].add_on + "</span>"  
                                + "<span   >" + data[i].add_by + "</span>"  
                                + "<span   >" + data[i].user_name + "</span>"  
                                + "<span   >" + data[i].password + "</span>"  
                                + "<span   >" + data[i].email + "</span>"  
                                + "<span   >" + data[i].name + "</span>"  
                                + "<span   >" + data[i].department_id + "</span>"  
                                 
                     + "</div>";
                } 
                $("#contexttest_user2").html(tbody_content);
            }
            else { 
                $("#contexttest_user2").html("<div style='height: 200px;width: 700px;padding-top: 100px;' align='center'>" + data.msg + "</div>");
            }
        } 
    
