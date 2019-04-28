
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-22
//       作者： fdsaf   
//			 区域维护用于维护区域, 控制器 
//       文件： area_admin.cshtml 页面文件 
//       文件： area_admin.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/sys/ViewJS/area_admin.js
说明：区域维护(area_admin)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
     area_6_Init();
controller_12_Init();
 
 
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
            com.showcenter(gDictionary["message"], gDictionary["no_wrapper"]);
        }
    } else {
        com.showcenter(gDictionary["message"], gDictionary["out_iframe"]);
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
//       时间： 2018-03-22
//       作者： fdsaf   
//			   
//------------------------------------------------------------------------------  

function  area_6_Init(){
	km.area.init();
	if(	km.area.LoadData!=undefined)	
		km.area.LoadData(); 
}



function addarea(index) {
    
   
    km.toolbar.do_add();
}

function editarea(index) {
    $('#area').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_edit();
}
function deletearea(index) {
    $('#area').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_delete();
}



var selectedareaIndex = 0;



km.area= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#area").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
            url: km.model.urls["area_pager"],
               	  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[
   
            
 	                { field: 'area_name', title: gDictionary["area name"], width: 80, align: 'center', sortable: true },
    // {
    //                            field: 'id', title: '<a href="#" onclick="addarea( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
    //                                return '<a href="#" onclick="editarea(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deletearea(' + index + ')">删除</a>';
    //}  },
    
                 
            ]],
            onClickRow: function (index, row) {
            
                selectedareaIndex = index;
                km.area.selectedIndex = index;
                km.area.selectedRow = row; 
                
                if (km.area.selectedRow)
                    km.set_mode_area('show');
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedareaIndex)
             		selectedareaIndex =0
              $("#area").datagrid("selectRow", selectedareaIndex);
             }
                km.area.selectedRow = km.area.getSelectedRow(); 
            
                if (km.area.selectedRow)
                  km.set_mode_area('show');
                  }
        });//end grid init
    },
    reload: function (queryParams) {
    		         var defaults = { _t: com.settings.timestamp() };
       if (queryParams) { defaults = $.extend(defaults, queryParams); }
     this.jq.datagrid('reload', defaults);
      	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};



/*工具栏权限按钮事件*/
km.toolbar = {
    do_refresh: function () { km.area.reload(); },
     do_add: function () {

        km.set_mode_area('add');

    },
    do_edit: function () {

        if (km.area.selectedRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        km.set_mode_area('edit');


    },
    do_delete: function () {
        var sRow = km.area.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam =  sRow ;
        com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["area_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.area.reload();
                        } else {
                            com.message('e', result.message);
                        }
                    }
                });
            }
        });
    },
    do_search: function () { },
    
    do_save: function () {

                    var flagValid = true;
                    var jsonObject = $("#area_content").serializeJson();
                        
     
     
                  
     
                    var jsonStr =  jsonObject ;
                    	                       if (!$("#area_content").form('validate')) {
                        layer.msg(gDictionary["data is incorrect, please try again"]);
                        return false;
                    }
        //添加自定义判断
                    //if (jsonObject.param_code == "" || jsonObject.param_value == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            com.ajax({
                                type: 'POST', url: km.model.urls["area_update"], data: jsonStr, success: function (result) {
                                    AfterEditarea(result);
                                }
                            });
                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["area_insert"], data: jsonStr, success: function (result) {
                                    AfterEditarea(result);
                                }
                            });
                        }
                    }

 

    } 
    ,
    do_undo: function () {
        var op_mode = km.area.selectedRow == null ? 'clear' : 'show';
        km.set_mode_area(op_mode);
    }
};


function AfterEditarea(result) {
    if (result.s) {
        com.message('s', result.message);
        km.area.reload();
        if (km.settings.op_mode == 'add') {
        //    km.area.unselectAll();
            km.set_mode_area('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.area.selectRow(km.area.selectedIndex);
            km.area.selectedRow = $.extend(km.area.selectedRow, jsonObject);
            km.set_mode_area('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode_area = function (op_mode) {
    km.settings.op_mode = op_mode;
    $('#km_toolbar').show();
    $('#km_toolbar_2').hide();
    com.mask($('#west_panel'), false);
   // $('#user_tabs').tabs('enableTab', 1);
   // $('#user_tabs').tabs('enableTab', 2);
    $('#area_content .easyui-combobox').combobox('readonly', true);
    $('#area_content .easyui-combotree').combotree('readonly', true);
    $('#area_content .easyui-textbox').textbox('readonly', true);
    $('#area_content .easyui-numberbox').numberbox('readonly', true);

    $("#area_content").find("input[type='radio']").attr("disabled", "true");//这
    $("#area_content").find("input[type='checkbox']").attr("disabled", "true");//这
    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.area.selectedRow));
      var sRow = km.area.selectedRow;
                   
        
        
      $('#area_content').form('load', sRow);
      km.controller.LoadData();
     //   km.orgcombotree.jq.combotree('setValue', km.area.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
        
      //  $('#user_tabs').tabs('disableTab', 1);
      //  $('#user_tabs').tabs('disableTab', 2);
      //  $('#user_tabs').tabs('select', 0);
        
    $("#area_content").find("input[type='radio']").removeAttr("disabled" ); 
    $("#area_content").find("input[type='checkbox']").removeAttr("disabled" ); 
        
        $('#area_content .easyui-combobox').combobox('readonly', false);
        $('#area_content .easyui-combotree').combotree('readonly', false);
        $('#area_content .easyui-textbox').textbox('readonly', false);
        $('#area_content .easyui-numberbox').numberbox('readonly', false);
        
        $('#area_content').form('clear');
        
        
      //  $('#TPL_id').val(0);
        //$('#TPL_enabled').combobox('setValue', 1);
        //$('#TPL_user_type').combobox('setValue', 3);
        //$('#TPL_IsSingleLogin').combobox('setValue', 1);
        //$('#TPL_sex').combobox('setValue', gDictionary["male"]);
        //$('#TPL_sort').numberbox('setValue', 888);

    } else if (op_mode == 'edit') {
    	
    $("#area_content").find("input[type='radio']").removeAttr("disabled" ); 
    $("#area_content").find("input[type='checkbox']").removeAttr("disabled" ); 
        //alert($('#area_content .easyui-text'));
        $('#area_content .easyui-combobox').combobox('readonly', false);
        $('#area_content .easyui-combotree').combotree('readonly', false);
        $('#area_content .easyui-textbox').textbox('readonly', false);
        $('#area_content .easyui-numberbox').numberbox('readonly', false);
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
              
        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#area_content').form('clear');
        
    }
}






 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-22
//       作者： fdsaf   
//			   
//------------------------------------------------------------------------------  



var controllerupdatedRows = new Array();


 
function controllershowValue(value, data, type, index, col) {
    var tmp = "";
    var a = data.split(" ");
    for (var i = 0; i < a.length; i++) {

        var v = a[i].split("=")[0];
        var t = a[i].split("=")[1];
        if (type == "checkbox") {

            var str = "controllerChangeValue2(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (("," + value + ",").indexOf("," + v + ",") >= 0)
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\' onchange='" + str + "' checked >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\'  onchange='" + str + "' >&nbsp;" + t;


        } else if (type == "radio") {

            var str = "controllerChangeValue(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (value == undefined && i == 0) {
                console.log(index);
                controllerChangeValue(null, col, index, v);
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

function controllerChangeValue2(me, col, index, v) {
    // var row = km.controller.getSelectedRow();

    var data = $('#controller').datagrid('getData');
    // var k = controllerupdatedRows[j];
    var row = data.rows[index]

    var cs = $("input[name='" + col + index + "']:checked");
    var p = [];
    cs.each(function () {
      //  console.log(this.value);
        p.push(this.value);
    });

    row[col] = p;

    controllerpushChangedRow(index);
    // console.log(km.controller.getSelectedRow());
}
function controllerpushChangedRow(index) {
    for (var i = 0; i < controllerupdatedRows.length; i++) {
        if (controllerupdatedRows[i] == index)
            return;
    }
    controllerupdatedRows.push(index)
}

function controllerChangeValue(me, col, index, v) {
    // var row = km.controller.getSelectedRow();

    var data = $('#controller').datagrid('getData');
    // var k = controllerupdatedRows[j];
    var row = data.rows[index]
    row[col] = v;
    controllerpushChangedRow(index);
}


function  controller_12_Init(){
	km.controller.init();
	//if(	km.controller.LoadData!=undefined)	
	//	km.controller.LoadData(); 
}

   function g_controller_area_id(){
   console.log("replace this value");
   return km.area.selectedRow.id; 
   	}

var selectedcontrollerIndex = 0;



km.controller= {
    jq: null,
     	             		
    LoadData: function () { 
					var options = $('#controller').datagrid('options')
					options.queryParams={_t: com.settings.timestamp(),
					area_id:g_controller_area_id(),};
					options.url = km.model.urls["controller_pager"]; 
					$('#controller').datagrid(options);
                
    },
               	             	
    init: function () {
        this.jq = $("#controller").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
             	             		 
             		  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true, toolbar: '#tbcontroller', onClickRow: onClickRow_controller,
            columns: [[
               	        { field: 'controller_name', title: gDictionary["controller name"], width: 280, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
            ]],
            onLoadSuccess: function () { }
        });//end grid init
    },
    reload: function (queryParams) {
      	             		
     this.LoadData();
             	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


		var editIndexcontroller = undefined;
		function controllerendEditing(){
			if (editIndexcontroller == undefined){return true}
			if ($('#controller').datagrid('validateRow', editIndexcontroller)){
			
			//需要手工修改
			//	var ed = $('#controller').datagrid('getEditor', {index:editIndexcontroller,field:'productid'});
			//	var productname = $(ed.target).combobox('getText');
			//	$('#controller').datagrid('getRows')[editIndexcontroller]['productname'] = productname;
				$('#controller').datagrid('endEdit', editIndexcontroller);
				
				
				editIndexcontroller = undefined;
				return true;
			} else {
				return false;
			}
		}
		function onClickRow_controller(index){
			if (editIndexcontroller != index){
				if (controllerendEditing()){
					$('#controller').datagrid('selectRow', index)
							.datagrid('beginEdit', index);
					editIndexcontroller = index;
				} else {
					$('#controller').datagrid('selectRow', editIndexcontroller);
				}
			}
		}
		function append_controller(){
			if (controllerendEditing()){
				$('#controller').datagrid('appendRow',{status:'P'});
				editIndexcontroller = $('#controller').datagrid('getRows').length-1;
				$('#controller').datagrid('selectRow', editIndexcontroller)
						.datagrid('beginEdit', editIndexcontroller);
			}
		}
		function removeit_controller(){
			if (editIndexcontroller == undefined){layer.msg(gDictionary["please select one record"]); return; }
			
			 var sRow = km.controller.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam =  sRow ;
        com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + '</b>', function (b) {
        	
        	
            for (var j = controllerupdatedRows.length - 1; j > 0  ; j--) {
                var data = $('#controller').datagrid('getData');
                var k = controllerupdatedRows[j];
                var tmpstr =  data.rows[k] 
                if (jsonParam == tmpstr)
                    controllerupdatedRows.splice(j, 1);
            }
            
            if (b) {
                com.ajax({
                    url: km.model.urls["controller_delete"], data: sRow, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message); 
			
			$('#controller').datagrid('cancelEdit', editIndexcontroller)
					.datagrid('deleteRow', editIndexcontroller);
			editIndexcontroller = undefined;
			
                        km.controller.reload();
                            
                        } else {
                            com.message('e', result.message);
                        }
                    }
                });
            }
        });
        
		}
	
function controllerSubmitChanges(rows, url) {

    for (var i = 0; i < rows.length; i++) {

      
                          
     	  rows[i].area_id = g_controller_area_id();
        var jsonStr =  rows[i] ;

        com.ajax({
            type: 'POST', url: km.model.urls[url], data: rows[i], success: function (result) {
            	
                        if (i == rows.length-1)
                km.controller.reload();
            }
        });

        for (var j = controllerupdatedRows.length - 1; j > 0  ; j--) {
            var data = $('#controller').datagrid('getData');
            var k = controllerupdatedRows[j];
            var tmpstr =  data.rows[k] 
            if (jsonStr == tmpstr)
                controllerupdatedRows.splice(j, 1);
        }

    }
}

function accept_controller() {
    if (controllerendEditing()) {


        if ($("#controller").datagrid('getChanges').length) {
            ////获取插入更改的行的集合
            var inserted = $("#controller").datagrid('getChanges', "inserted");

            controllerSubmitChanges(inserted, "controller_insert");

            var updated = $("#controller").datagrid('getChanges', "updated");

            controllerSubmitChanges(updated, "controller_update");

        }
        for (var j = controllerupdatedRows.length - 1; j >= 0  ; j--) {

            var data = $('#controller').datagrid('getData');
            var k = controllerupdatedRows[j];
            var rows = data.rows;

           
                
                          
 	 data.rows[k].area_id = g_controller_area_id();
            var tmpstr =  data.rows[k] 
            com.ajax({
                type: 'POST', url: km.model.urls["controller_update"], data: data.rows[k], success: function (result) {
                    //     AfterEdit(result);

                        if (j ==0)
                    km.controller.reload();
                }
            });
            controllerupdatedRows = new Array();
        }

        return;

    }

    $('#controller').datagrid('acceptChanges');

}
		function reject_controller(){
			$('#controller').datagrid('rejectChanges');
			editIndexcontroller = undefined;
		}
		function getChanges_controller(){
			var rows = $('#controller').datagrid('getChanges');
			alert(rows.length+' rows are changed!');
		}


 
 
