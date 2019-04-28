
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-19
//       作者： fdsaf   
//			 用于模板测试 
//       文件： user_test.cshtml 页面文件 
//       文件： user_test.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/dev/ViewJS/user_test.js
说明：模板测试(user_test)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
     myuser_1_Init();
myuser_8_Init();
department_13_Init();
 
 
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
            com.showcenter('提示', "存在父页面，但未能获取到parent.wrapper对象");
        }
    } else {
        com.showcenter('提示', "当前页面已经脱离iframe，无法获得parent.wrapper对象！");
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
//       时间： 2018-03-19
//       作者： fdsaf   
//			 测试使用  
//------------------------------------------------------------------------------  

function  myuser_1_Init(){ 
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
    do_refresh: function () { km.myuser.reload(); },
    do_add: function () {
    	
        $('#myuser_dialog').html($('#myuser_dialog').html().replaceAll("_easyui", "easyui"));
        $("#myuser_dialog").dialog_ext({
            title: '新增', iconCls: 'icon-standard-add', top: 100,
            onOpenEx: function (win) {
                //win.find('#TPL_Enabled').combobox('setValue', 1);
                //win.find('#TPL_Sort').numberbox('setValue', 100);
                
                         
            },
            onClickButton: function (win) { //保存操作
                var flagValid = true;
                var jsonObject = win.find("#myuser_content").serializeJson();
                
                
                          jsonObject.department_id=0;//替换该值             
                var jsonStr =  jsonObject ;
                    if (!win.find("#myuser_content").form('validate')) {
                        com.message('e', '输入数据有错误，请纠正后再存。');
                        return false;
                    }
	//添加自定义判断
                //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', '参数代码或参数名称不能为空！'); return; }
                if (flagValid) {
                    com.ajax({
                        type: 'POST', url: km.model.urls["myuser_insert"], data: jsonStr, success: function (result) {
                            if (result.s) {
                                com.message('s', result.message);
                                win.dialog('destroy');
                                km.myuser.reload();
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
        var sRow = km.myuser.getSelectedRow();
          $('#myuser_dialog').html($('#myuser_dialog').html().replaceAll("_easyui", "easyui"));
      
        if (sRow == null) { layer.msg('请选择一条记录！'); return; }
        
        
               
     
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg('此参数不可编辑！'); return; }//额外判断
        //var t = '【' + sRow.ParamCode + '：' + sRow.ParamValue + '】';
        $("#myuser_dialog").dialog_ext({
            title: '编辑', iconCls: 'icon-standard-pencil', top: 100,
            onOpenEx: function (win) { win.find('#myuser_content').form('load', sRow); 
            	          
            	},
            onClickButton: function (win) { //保存操作
                var flagValid = true;
                var jsonObject = win.find("#myuser_content").serializeJson();
                
                       
     jsonObject.department_id=0;//替换该值              
                var jsonStr =  jsonObject ;
                    if (!win.find("#myuser_content").form('validate')) {
                        com.message('e', '输入数据有错误，请纠正后再存。');
                        return false;
                    }
                    
	//添加自定义判断
                //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', '参数代码或参数名称不能为空！'); return; }
                if (flagValid) {
                    com.ajax({
                        type: 'POST', url: km.model.urls["myuser_update"], data: jsonStr, success: function (result) {
                            if (result.s) {
                                com.message('s', result.message);
                                win.dialog('destroy');
                                km.myuser.reload();
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
        var sRow = km.myuser.getSelectedRow();
        if (sRow == null) { layer.msg('请选择一条记录！'); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg('此参数不可删除！'); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">确定要删除【' + sRow.id + '】吗？ </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["myuser_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.myuser.reload();
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
//       时间： 2018-03-19
//       作者： fdsaf   
//			 测试使用  
//------------------------------------------------------------------------------  

function  myuser_8_Init(){
	km.myuser.init();
	
	if(	km.myuser.LoadData!=undefined)	
		km.myuser.LoadData(); 
}



function addmyuser(index) {
    
   
    km.toolbar.do_add();
}

function editmyuser(index) {
    $('#myuser').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_edit();
}
function deletemyuser(index) {
    $('#myuser').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_delete();
}

	   function g_myuser_department_id(){
   console.log("replace this value");
   return 0; 
   	}

var selectedmyuserIndex = 0;



km.myuser= {
    jq: null,
     	             		
    LoadData: function () { 
					var options = $('#myuser').datagrid('options')
					options.queryParams={_t: com.settings.timestamp(),
					department_id:g_myuser_department_id(),};
					options.url = km.model.urls["myuser_pager"]; 
					$('#myuser').datagrid(options);
                
    },
               	             	
    init: function () {
        this.jq = $("#myuser").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	             		 
             		  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[
   
            
 	                { field: 'add_on', title: '创建日期', width: 80, align: 'center', sortable: true },
                { field: 'add_by', title: '创建人', width: 80, align: 'center', sortable: true },
                { field: 'user_name', title: '用户名', width: 80, align: 'center', sortable: true },
                { field: 'name', title: '姓名', width: 80, align: 'center', sortable: true },
                { field: 'department_id', title: '部门编号', width: 80, align: 'center', sortable: true },
                { field: 'password', title: '口令', width: 80, align: 'center', sortable: true },
                { field: 'email', title: 'email', width: 80, align: 'center', sortable: true },
     {
                                field: 'id', title: '<a href="#" onclick="addmyuser( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
                                    return '<a href="#" onclick="editmyuser(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deletemyuser(' + index + ')">删除</a>';
    }  },
    
                 
            ]],
            onClickRow: function (index, row) {
            
                selectedmyuserIndex = index;
                km.myuser.selectedIndex = index;
                km.myuser.selectedRow = row;  
                if(                km.myuser.selectedRow ){
                	
                	myuser_selected();
                }
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedmyuserIndex)
             		selectedmyuserIndex =0
              $("#myuser").datagrid("selectRow", selectedmyuserIndex);
             }
                km.myuser.selectedRow = km.myuser.getSelectedRow(); 
                if(                km.myuser.selectedRow ){
                	
                	myuser_selected();
                }
             }
        });//end grid init
    },
    reload: function (queryParams) {	             		
     this.LoadData();
             	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


function myuser_selected(){
// km.myuser.selectedRow 
console.log("myuser selected");
}



 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-19
//       作者： fdsaf   
//			 department  
//------------------------------------------------------------------------------  



var departmentupdatedRows = new Array();


 
function departmentshowValue(value, data, type, index, col) {
    var tmp = "";
    var a = data.split(" ");
    for (var i = 0; i < a.length; i++) {

        var v = a[i].split("=")[0];
        var t = a[i].split("=")[1];
        if (type == "checkbox") {

            var str = "departmentChangeValue2(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (("," + value + ",").indexOf("," + v + ",") >= 0)
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\' onchange='" + str + "' checked >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\'  onchange='" + str + "' >&nbsp;" + t;


        } else if (type == "radio") {

            var str = "departmentChangeValue(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (value == undefined && i == 0) {
                console.log(index);
                departmentChangeValue(null, col, index, v);
            }
            if (value == v || (value == undefined && i == 0))
                tmp += "&nbsp;<input type='radio' name='" + col + index + "'  id='" + col + index + i + "' onchange='" + str + "' checked >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='radio' name='" + col + index + "'  id='" + col + index + i + "'  onchange='" + str + "' >&nbsp;" + t;
        } else {
            if (value == v)
                return t;
        }
    }
    return tmp;
}

function departmentChangeValue2(me, col, index, v) {
    // var row = km.department.getSelectedRow();

    var data = $('#department').datagrid('getData');
    // var k = departmentupdatedRows[j];
    var row = data.rows[index]

    var cs = $("input[name='" + col + index + "']:checked");
    var p = [];
    cs.each(function () {
      //  console.log(this.value);
        p.push(this.value);
    });

    row[col] = p;

    departmentpushChangedRow(index);
    // console.log(km.department.getSelectedRow());
}
function departmentpushChangedRow(index) {
    for (var i = 0; i < departmentupdatedRows.length; i++) {
        if (departmentupdatedRows[i] == index)
            return;
    }
    departmentupdatedRows.push(index)
}

function departmentChangeValue(me, col, index, v) {
    // var row = km.department.getSelectedRow();

    var data = $('#department').datagrid('getData');
    // var k = departmentupdatedRows[j];
    var row = data.rows[index]
    row[col] = v;
    departmentpushChangedRow(index);
}


function  department_13_Init(){
	km.department.init();
	if(	km.department.LoadData!=undefined)	
		km.department.LoadData(); 
}

	   function g_department_add_by(){
   console.log("replace this value");
   return 0; 
   	}

var selecteddepartmentIndex = 0;



km.department= {
    jq: null,
     	             		
    LoadData: function () { 
					var options = $('#department').datagrid('options')
					options.queryParams={_t: com.settings.timestamp(),
					add_by:g_department_add_by(),};
					options.url = km.model.urls["department_pager"]; 
					$('#department').datagrid(options);
                
    },
               	             	
    init: function () {
        this.jq = $("#department").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	             		 
             		  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,toolbar: '#tbdepartment',onClickRow: onClickRow_department,
            columns: [[
               	 
                          { field: 'department_name', title: '部门名称', width: 280, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                          
                             
                              { field: 'add_on', title: '创建日期', width: 230, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                        
                             
                              { field: 'add_by', title: '创建人', width: 100, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                        
                             
                          { field: 'description', title: '描述', width: 280, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                          
                                 
            ]],
            onLoadSuccess: function () { }
        });//end grid init
    },
    reload: function (queryParams) {
      	             		
     this.LoadData();
             	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


		var editIndexdepartment = undefined;
		function departmentendEditing(){
			if (editIndexdepartment == undefined){return true}
			if ($('#department').datagrid('validateRow', editIndexdepartment)){
			
			//需要手工修改
			//	var ed = $('#department').datagrid('getEditor', {index:editIndexdepartment,field:'productid'});
			//	var productname = $(ed.target).combobox('getText');
			//	$('#department').datagrid('getRows')[editIndexdepartment]['productname'] = productname;
				$('#department').datagrid('endEdit', editIndexdepartment);
				
				
				editIndexdepartment = undefined;
				return true;
			} else {
				return false;
			}
		}
		function onClickRow_department(index){
			if (editIndexdepartment != index){
				if (departmentendEditing()){
					$('#department').datagrid('selectRow', index)
							.datagrid('beginEdit', index);
					editIndexdepartment = index;
				} else {
					$('#department').datagrid('selectRow', editIndexdepartment);
				}
			}
		}
		function append_department(){
			if (departmentendEditing()){
				$('#department').datagrid('appendRow',{status:'P'});
				editIndexdepartment = $('#department').datagrid('getRows').length-1;
				$('#department').datagrid('selectRow', editIndexdepartment)
						.datagrid('beginEdit', editIndexdepartment);
			}
		}
		function removeit_department(){
			if (editIndexdepartment == undefined){layer.msg('请选择一条记录！'); return; }
			
			 var sRow = km.department.getSelectedRow();
        if (sRow == null) { layer.msg('请选择一条记录！'); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg('此参数不可删除！'); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">确定要删除描述【' + sRow.id + '】吗？ </b>', function (b) {
        	
        	
            for (var j = departmentupdatedRows.length - 1; j > 0  ; j--) {
                var data = $('#department').datagrid('getData');
                var k = departmentupdatedRows[j];
                var tmpstr = JSON.stringify(data.rows[k])
                if (jsonParam == tmpstr)
                    departmentupdatedRows.splice(j, 1);
            }
            
            if (b) {
                com.ajax({
                    url: km.model.urls["department_delete"], data: sRow, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message); 
			
			$('#department').datagrid('cancelEdit', editIndexdepartment)
					.datagrid('deleteRow', editIndexdepartment);
			editIndexdepartment = undefined;
			
                        km.department.reload();
                            
                        } else {
                            com.message('e', result.message);
                        }
                    }
                });
            }
        });
        
		}
	
function departmentSubmitChanges(rows, url) {

    for (var i = 0; i < rows.length; i++) {

      
                          
     	  rows[i].add_by = g_department_add_by();
        var jsonStr = JSON.stringify(rows[i]);

        com.ajax({
            type: 'POST', url: km.model.urls[url], data: rows[i], success: function (result) {
            	
                        if (i == rows.length-1)
                km.department.reload();
            }
        });

        for (var j = departmentupdatedRows.length - 1; j > 0  ; j--) {
            var data = $('#department').datagrid('getData');
            var k = departmentupdatedRows[j];
            var tmpstr = JSON.stringify(data.rows[k])
            if (jsonStr == tmpstr)
                departmentupdatedRows.splice(j, 1);
        }

    }
}

function accept_department() {
    if (departmentendEditing()) {


        if ($("#department").datagrid('getChanges').length) {
            ////获取插入更改的行的集合
            var inserted = $("#department").datagrid('getChanges', "inserted");

            departmentSubmitChanges(inserted, "department_insert");

            var updated = $("#department").datagrid('getChanges', "updated");

            departmentSubmitChanges(updated, "department_update");

        }
        for (var j = departmentupdatedRows.length - 1; j >= 0  ; j--) {

            var data = $('#department').datagrid('getData');
            var k = departmentupdatedRows[j];
            var rows = data.rows;

           
                
                          
 	 data.rows[k].add_by = g_department_add_by();
            var tmpstr = JSON.stringify(data.rows[k])
            com.ajax({
                type: 'POST', url: km.model.urls["department_update"], data: data.rows[k], success: function (result) {
                    //     AfterEdit(result);

                        if (j ==0)
                    km.department.reload();
                }
            });
            departmentupdatedRows = new Array();
        }

        return;

    }

    $('#department').datagrid('acceptChanges');

}
		function reject_department(){
			$('#department').datagrid('rejectChanges');
			editIndexdepartment = undefined;
		}
		function getChanges_department(){
			var rows = $('#department').datagrid('getChanges');
			alert(rows.length+' rows are changed!');
		}


 
 
