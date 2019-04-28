
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-04-18
//       作者： fdsaf   
//			 测试模块, 仅仅用于测试 
//       文件： test_only.cshtml 页面文件 
//       文件： test_only.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/dev/ViewJS/test_only.js
说明：test_only(test_only)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
     department_2_Init();
my_user_4_Init();
my_user_11_Init();
 
 
    //如果没有动态combobox可删除
     $('.easyui-combobox').each(function (index, element) {
       var options = $(this).combobox('options')
          var u = $(this).attr("url2")
      
        if (u!= undefined) { 
         
            options.url = km.model.urls[u];
            if (options.multiple == true) {

                options.formatter= function (row) { //formatter方法就是实现了在每个下拉选项前面增加checkbox框的方法  
                    var opts = $(this).combobox('options');  
                    return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField]  
                };
            options.onLoadSuccess = function () {  //下拉框数据加载成功调用  
                var opts = $(this).combobox('options');  
                var target = this;  
                var values = $(target).combobox('getValues');//获取选中的值的values  
                $.map(values, function (value) {  
                    var el = opts.finder.getEl(target, value);  
                    el.find('input.combobox-checkbox')._propAttr('checked', true);   
                })  
            };
            options.onSelect = function (row) { //选中一个选项时调用  
                var opts = $(this).combobox('options');  
                //获取选中的值的values  
                //$("#"+id).val($(this).combobox('getValues'));  
                     
                //设置选中值所对应的复选框为选中状态  
                var el = opts.finder.getEl(this, row[opts.valueField]);  
                el.find('input.combobox-checkbox')._propAttr('checked', true);  
            }
            options.onUnselect =function (row) {//不选中一个选项时调用  
                var opts = $(this).combobox('options');  
                //获取选中的值的values  
            //    $("#"+id).val($(this).combobox('getValues'));  
                    
                var el = opts.finder.getEl(this, row[opts.valueField]);  
                el.find('input.combobox-checkbox')._propAttr('checked', false);  
            }
            }
            $(this).combobox(options);

        } 
        
        
        // <input id='test' class='easyui-combobox' loader="ttn" name='test' type='text' data-options="valueField:'text',textField:'text',mode : 'remote' " style='width:100px' />
        var loader = $(this).attr("loader");
        if (loader != undefined) {
            options.loader = function (param, success, error) {
                var q = param.q || "";
                if (q.length <= 0) {
                    console.log("q.length <= 0");
                    return false;
                }
                var jsonParam = { loader: loader, value: q }
                com.ajax({
                    url: km.model.urls["loader"], data: jsonParam, success: function (result) {
                        success(result);
                    }
                });
            };
            $(this).combobox(options); 
        }

    });
    
}

/*初始化iframe父页面的model对象，即：访问app.index.js文件中的客户端对象*/
km.init_parent_model = function () {
    //只有当前页面有父页面时，可以获取到父页面的model对象 parent.wrapper.model
    if (window != parent) {
        if (parent.wrapper) {
            km.parent_model = parent.wrapper.model;
            //com.message('s', '获取到父页面的model对象：<br>' + JSON.stringify(km.parent_model));
        } else {
            com.showcenter(gDictionary["message"], "存在父页面，但未能获取到parent.wrapper对象");
        }
    } else {
        com.showcenter(gDictionary["message"], "当前页面已经脱离iframe，无法获得parent.wrapper对象！");
    }
}

$(km.init);

//页面对象参数设置
km.settings = {};

//格式化数据
km.gridformat = {};


function showValue(value, data, type) {

    var tmp = "";
    var a = data.split(" ");
    for (var i = 0; i < a.length; i++) {

        var v= a[i].split("=")[0];
        var  t = a[i].split("=")[1];
        if (type == "checkbox") {

            if ( (","+value+",").indexOf  (","+v+",")>=0)
                tmp += "&nbsp;<input type='checkbox' checked  disabled='true'  >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox' disabled='true' >&nbsp;" + t;


        } else if (type == "radio") {
            if (value ==v)
                tmp += "&nbsp;<input type='radio' checked disabled='true' >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='radio' disabled='true' >&nbsp;" + t;
        } else {
            if (value ==v)
                return t;
        }
    }
    return tmp;
} 

 
 
//------------------------------------------------------------------------------ 
//       时间： 2018-04-18
//       作者： fdsaf   
//			   
//------------------------------------------------------------------------------  

function  department_2_Init(){
	km.department.init();
	
	if(	km.department.LoadData!=undefined)	
		km.department.LoadData(); 
}



function adddepartment(index) {
    
   
    km.toolbar.do_add();
}

function editdepartment(index) {
    $('#department').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_edit();
}
function deletedepartment(index) {
    $('#department').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_delete();
}


var selecteddepartmentIndex = 0;



km.department= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#department").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
            url: km.model.urls["department_pager"],
               	  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[
   
            
 	                { field: 'id', title: gDictionary["id"], width: 80, align: 'center', sortable: true },
                { field: 'add_on', title: '创建日期3', width: 80, align: 'center', sortable: true },
                { field: 'add_by', title: '创建人2', width: 80, align: 'center', sortable: true },
                { field: 'department_name', title: '部门名称4', width: 80, align: 'center', sortable: true },
                { field: 'description', title: gDictionary["description"], width: 80, align: 'center', sortable: true },
     {
                                field: 'id', title: '<a href="#" onclick="adddepartment( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
                                    return '<a href="#" onclick="editdepartment(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deletedepartment(' + index + ')">删除</a>';
    }  },
    
                 
            ]],
            onClickRow: function (index, row) {
            
                selecteddepartmentIndex = index;
                km.department.selectedIndex = index;
                km.department.selectedRow = row;  
                if(                km.department.selectedRow ){
                	
                	department_selected();
                }
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selecteddepartmentIndex)
             		selecteddepartmentIndex =0
              $("#department").datagrid("selectRow", selecteddepartmentIndex);
             }
                km.department.selectedRow = km.department.getSelectedRow(); 
                if(                km.department.selectedRow ){
                	
                	department_selected();
                }
             }
        });//end grid init
    },
    reload: function (queryParams) {	         var defaults = { _t: com.settings.timestamp() };
       if (queryParams) { defaults = $.extend(defaults, queryParams); }
     this.jq.datagrid('reload', defaults);
      	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


function department_selected(){
// km.department.selectedRow 

      km.my_user.LoadData(); 
   

}



 
//------------------------------------------------------------------------------ 
//       时间： 2018-04-18
//       作者： fdsaf   
//			   
//------------------------------------------------------------------------------  

function  my_user_4_Init(){ 
	 $('._easyui-combobox').each(function (index, element) {
        var opstr1 = $(this).attr("data-options");
        var u = $(this).attr("url2")
        if (u != undefined) { 
            $(this).attr("data-options", opstr1 + ",url:'" + km.model.urls[u] + "'");

        }
				
				
        var loader = $(this).attr("loader");
        if (loader != undefined) {
            options.loader = function (param, success, error) {
                var q = param.q || "";
                if (q.length <= 0) {
                    console.log("q.length <= 0");
                    return false;
                }
                var jsonParam = { loader: loader, value: q }
                com.ajax({
                    url: km.model.urls["loader"], data: jsonParam, success: function (result) {
                        success(result);
                    }
                });
            };
            $(this).combobox(options); 
        }
    });
}
  


/*工具栏权限按钮事件*/
km.toolbar = {
    do_refresh: function () { km.my_user.reload(); },
    do_add: function () {
    	
        $('#my_user_dialog').html($('#my_user_dialog').html().replaceAll("_easyui", "easyui"));
        $("#my_user_dialog").dialog_ext({
            title: gDictionary["add"], iconCls: 'icon-standard-add', top: 100,
            onOpenEx: function (win) {
                //win.find('#TPL_Enabled').combobox('setValue', 1);
                //win.find('#TPL_Sort').numberbox('setValue', 100);
                
                         
            },
            onClickButton: function (win) { //保存操作
                var flagValid = true;
                var jsonObject = win.find("#my_user_content").serializeJson();
                
                
                           jsonObject.department_id = g_my_user_department_id();
             
                var jsonStr =  jsonObject ;
                    if (!win.find("#my_user_content").form('validate')) {
                        com.message('e', gDictionary["data is incorrect, please try again"]);
                        return false;
                    }
	//添加自定义判断
                //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
                if (flagValid) {
                    com.ajax({
                        type: 'POST', url: km.model.urls["my_user_insert"], data: jsonStr, success: function (result) {
                            if (result.s) {
                                com.message('s', result.message);
                                win.dialog('destroy');
                                km.my_user.reload();
                            } else {
                                com.message('e', result.message);
                            }
                        }
                    });
                }
            }
        });
    },
    do_edit: function () {
        var sRow = km.my_user.getSelectedRow();
          $('#my_user_dialog').html($('#my_user_dialog').html().replaceAll("_easyui", "easyui"));
      
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        
        
               
     
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg(gDictionary["can not edit it"]); return; }//额外判断
        //var t = '【' + sRow.ParamCode + '：' + sRow.ParamValue + gDictionary["k"];
        $("#my_user_dialog").dialog_ext({
            title: gDictionary["edit"], iconCls: 'icon-standard-pencil', top: 100,
            onOpenEx: function (win) { win.find('#my_user_content').form('load', sRow); 
            	             win.find('#TPL_add_on').textbox('readonly', true);
                 win.find('#TPL_add_by').textbox('readonly', true);
              
            	},
            onClickButton: function (win) { //保存操作
                var flagValid = true;
                var jsonObject = win.find("#my_user_content").serializeJson();
                
                       
      jsonObject.department_id = g_my_user_department_id();
              
                var jsonStr =  jsonObject ;
                    if (!win.find("#my_user_content").form('validate')) {
                        com.message('e', gDictionary["data is incorrect, please try again"]);
                        return false;
                    }
                    
	//添加自定义判断
                //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
                if (flagValid) {
                    com.ajax({
                        type: 'POST', url: km.model.urls["my_user_update"], data: jsonStr, success: function (result) {
                            if (result.s) {
                                com.message('s', result.message);
                                win.dialog('destroy');
                                km.my_user.reload();
                            } else {
                                com.message('e', result.message);
                            }
                        }
                    });
                }
            }
        });

    },
    do_delete: function () {
        var sRow = km.my_user.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">确定要删除【' + sRow.id + '】吗？ </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["my_user_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.my_user.reload();
                        } else {
                            com.message('e', result.message);
                        }
                    }
                });
            }
        });
    },
    do_search: function () { }
};






 
//------------------------------------------------------------------------------ 
//       时间： 2018-04-18
//       作者： fdsaf   
//			   
//------------------------------------------------------------------------------  

function  my_user_11_Init(){
	km.my_user.init();
	
	if(	km.my_user.LoadData!=undefined)	
		km.my_user.LoadData(); 
}



function addmy_user(index) {
    
   
    km.toolbar.do_add();
}

function editmy_user(index) {
    $('#my_user').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_edit();
}
function deletemy_user(index) {
    $('#my_user').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_delete();
}

   function g_my_user_department_id(){
   
      return km.department.selectedRow.id; 
      	}

var selectedmy_userIndex = 0;



km.my_user= {
    jq: null,
     	             		
    LoadData: function () { 
					var options = $('#my_user').datagrid('options')
					options.queryParams={_t: com.settings.timestamp(),
					department_id:g_my_user_department_id(),};
					options.url = km.model.urls["my_user_pager"]; 
					$('#my_user').datagrid(options);
                
    },
               	             	
    init: function () {
        this.jq = $("#my_user").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	             		 
             		  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[
   
            
 	                { field: 'id', title: 'id2', width: 80, align: 'center', sortable: true },
                { field: 'add_on', title: gDictionary["add_on"], width: 80, align: 'center', sortable: true },
                { field: 'add_by', title: gDictionary["add_by"], width: 80, align: 'center', sortable: true },
                { field: 'user_name', title: gDictionary["user_name"], width: 80, align: 'center', sortable: true },
                { field: 'password', title: gDictionary["password"], width: 80, align: 'center', sortable: true },
                { field: 'email', title: 'email', width: 80, align: 'center', sortable: true },
                { field: 'name', title: gDictionary["name"], width: 80, align: 'center', sortable: true },
                { field: 'department_id', title: gDictionary["department_id"], width: 80, align: 'center', sortable: true },
     {
                                field: 'id', title: '<a href="#" onclick="addmy_user( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
                                    return '<a href="#" onclick="editmy_user(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deletemy_user(' + index + ')">删除</a>';
    }  },
    
                 
            ]],
            onClickRow: function (index, row) {
            
                selectedmy_userIndex = index;
                km.my_user.selectedIndex = index;
                km.my_user.selectedRow = row;  
                if(                km.my_user.selectedRow ){
                	
                	my_user_selected();
                }
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedmy_userIndex)
             		selectedmy_userIndex =0
              $("#my_user").datagrid("selectRow", selectedmy_userIndex);
             }
                km.my_user.selectedRow = km.my_user.getSelectedRow(); 
                if(                km.my_user.selectedRow ){
                	
                	my_user_selected();
                }
             }
        });//end grid init
    },
    reload: function (queryParams) {	             		
     this.LoadData();
             	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


function my_user_selected(){
// km.my_user.selectedRow 

      	
console.log("my_user selected");
   

}


