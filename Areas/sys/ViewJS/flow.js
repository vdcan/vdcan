
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			 流程控制 
//       文件： flow.cshtml 页面文件 
//       文件： flow.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/dev/ViewJS/flow.js
说明：流程控制(flow)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
     flow_lines_5_Init();
flow_12_Init();
flow_nodes_18_Init();
flow_status_24_Init();
 
 
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
//       时间： 2018-03-18
//       作者： fdsaf   
//			   
//------------------------------------------------------------------------------  



var flow_linesupdatedRows = new Array();


 
function flow_linesshowValue(value, data, type, index, col) {
    var tmp = "";
    var a = data.split(" ");
    for (var i = 0; i < a.length; i++) {

        var v = a[i].split("=")[0];
        var t = a[i].split("=")[1];
        if (type == "checkbox") {

            var str = "flow_linesChangeValue2(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (("," + value + ",").indexOf("," + v + ",") >= 0)
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\' onchange='" + str + "' checked >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\'  onchange='" + str + "' >&nbsp;" + t;


        } else if (type == "radio") {

            var str = "flow_linesChangeValue(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (value == undefined && i == 0) {
                console.log(index);
                flow_linesChangeValue(null, col, index, v);
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

function flow_linesChangeValue2(me, col, index, v) {
    // var row = km.flow_lines.getSelectedRow();

    var data = $('#flow_lines').datagrid('getData');
    // var k = flow_linesupdatedRows[j];
    var row = data.rows[index]

    var cs = $("input[name='" + col + index + "']:checked");
    var p = [];
    cs.each(function () {
      //  console.log(this.value);
        p.push(this.value);
    });

    row[col] = p;

    flow_linespushChangedRow(index);
    // console.log(km.flow_lines.getSelectedRow());
}
function flow_linespushChangedRow(index) {
    for (var i = 0; i < flow_linesupdatedRows.length; i++) {
        if (flow_linesupdatedRows[i] == index)
            return;
    }
    flow_linesupdatedRows.push(index)
}

function flow_linesChangeValue(me, col, index, v) {
    // var row = km.flow_lines.getSelectedRow();

    var data = $('#flow_lines').datagrid('getData');
    // var k = flow_linesupdatedRows[j];
    var row = data.rows[index]
    row[col] = v;
    flow_linespushChangedRow(index);
}


function  flow_lines_5_Init(){
	km.flow_lines.init();
	//if(	km.flow_lines.LoadData!=undefined)	
	//	km.flow_lines.LoadData(); 
}

var selectedflow_linesIndex = 0;
km.flow_lines= {
    jq: null,
     	             		
    LoadData: function () { 
					var options = $('#flow_lines').datagrid('options')
					options.queryParams={_t: com.settings.timestamp(),
					flow_id:km.flow.selectedRow.id,};
					options.url = km.model.urls["flow_lines_pager"]; 
					$('#flow_lines').datagrid(options);
                
    },
               	             	
    init: function () {
        this.jq = $("#flow_lines").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
             	             		 
             		  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true, toolbar: '#tbflow_lines', onClickRow: onClickRow_flow_lines,
            columns: [[
               	 
                         //     { field: 'flow_id', title: '流程编号', width: 100, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                        
                             
                          { field: 'name', title: gDictionary["name"], width: 280, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
                          
                             
                          { field: 'from', title: gDictionary["from"], width: 280, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
                          
                             
                          { field: 'to', title: gDictionary["to"], width: 280, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
                          
                             
                          { field: 'gf_id', title: gDictionary["gf_id"], width: 280, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
                          
                                 
            ]],
            onLoadSuccess: function () { }
        });//end grid init
    },
    reload: function (queryParams) {
      	             		
     this.LoadData();
             	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


		var editIndexflow_lines = undefined;
		function flow_linesendEditing(){
			if (editIndexflow_lines == undefined){return true}
			if ($('#flow_lines').datagrid('validateRow', editIndexflow_lines)){
			
			//需要手工修改
			//	var ed = $('#flow_lines').datagrid('getEditor', {index:editIndexflow_lines,field:'productid'});
			//	var productname = $(ed.target).combobox('getText');
			//	$('#flow_lines').datagrid('getRows')[editIndexflow_lines]['productname'] = productname;
				$('#flow_lines').datagrid('endEdit', editIndexflow_lines);
				
				
				editIndexflow_lines = undefined;
				return true;
			} else {
				return false;
			}
		}
		function onClickRow_flow_lines(index){
			if (editIndexflow_lines != index){
				if (flow_linesendEditing()){
					$('#flow_lines').datagrid('selectRow', index)
							.datagrid('beginEdit', index);
					editIndexflow_lines = index;
				} else {
					$('#flow_lines').datagrid('selectRow', editIndexflow_lines);
				}
			}
		}
		function append_flow_lines(){
			if (flow_linesendEditing()){
				$('#flow_lines').datagrid('appendRow',{status:'P'});
				editIndexflow_lines = $('#flow_lines').datagrid('getRows').length-1;
				$('#flow_lines').datagrid('selectRow', editIndexflow_lines)
						.datagrid('beginEdit', editIndexflow_lines);
			}
		}
		function removeit_flow_lines(){
		    if (editIndexflow_lines == undefined) { layer.msg(gDictionary["please_select"]); return; }
			
			 var sRow = km.flow_lines.getSelectedRow();
			 if (sRow == null) { layer.msg(gDictionary["please_select"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg('此参数不可删除！'); return; }
        var jsonParam =  sRow ;
        com.message('c', ' <b style="color:red">'+gDictionary["confirm_delete"]+' </b>', function (b) {
        	
        	
            for (var j = flow_linesupdatedRows.length - 1; j > 0  ; j--) {
                var data = $('#flow_lines').datagrid('getData');
                var k = flow_linesupdatedRows[j];
                var tmpstr = data.rows[k] 
                if (jsonParam == tmpstr)
                    flow_linesupdatedRows.splice(j, 1);
            }
            
            if (b) {
                com.ajax({
                    url: km.model.urls["flow_lines_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message); 
			
			$('#flow_lines').datagrid('cancelEdit', editIndexflow_lines)
					.datagrid('deleteRow', editIndexflow_lines);
			editIndexflow_lines = undefined;
			
                        km.flow_lines.reload();
                            
                        } else {
                            com.message('e', result.message);
                        }
                    }
                });
            }
        });
        
		}
	
function flow_linesSubmitChanges(rows, url) {

    for (var i = 0; i < rows.length; i++) {
         
        rows[i].flow_id = km.flow.selectedRow.id;
                          
        var jsonStr =  rows[i] ;

        com.ajax({
            type: 'POST', url: km.model.urls[url], data: jsonStr, success: function (result) {
            	
                        if (i == rows.length-1)
                km.flow_lines.reload();
            }
        });

        for (var j = flow_linesupdatedRows.length - 1; j > 0  ; j--) {
            var data = $('#flow_lines').datagrid('getData');
            var k = flow_linesupdatedRows[j];
            var tmpstr =  data.rows[k] 
            if (jsonStr == tmpstr)
                flow_linesupdatedRows.splice(j, 1);
        }

    }
}

function accept_flow_lines() {
    if (flow_linesendEditing()) {


        if ($("#flow_lines").datagrid('getChanges').length) {
            ////获取插入更改的行的集合
            var inserted = $("#flow_lines").datagrid('getChanges', "inserted");

            flow_linesSubmitChanges(inserted, "flow_lines_insert");

            var updated = $("#flow_lines").datagrid('getChanges', "updated");

            flow_linesSubmitChanges(updated, "flow_lines_update");

        }
        for (var j = flow_linesupdatedRows.length - 1; j >= 0  ; j--) {

            var data = $('#flow_lines').datagrid('getData');
            var k = flow_linesupdatedRows[j];
            var rows = data.rows;

           

            data.rows[k].flow_id = km.flow.selectedRow.id;
                          

            var tmpstr =  data.rows[k] 
            com.ajax({
                type: 'POST', url: km.model.urls["flow_lines_update"], data: tmpstr, success: function (result) {
                    //     AfterEdit(result);

                        if (j ==0)
                    km.flow_lines.reload();
                }
            });
            flow_linesupdatedRows = new Array();
        }

        return;

    }

    $('#flow_lines').datagrid('acceptChanges');

}
		function reject_flow_lines(){
			$('#flow_lines').datagrid('rejectChanges');
			editIndexflow_lines = undefined;
		}
		function getChanges_flow_lines(){
			var rows = $('#flow_lines').datagrid('getChanges');
			alert(rows.length+' rows are changed!');
		}


 
 

 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			   
//------------------------------------------------------------------------------  

function  flow_12_Init(){
	km.flow.init();
	if(	km.flow.LoadData!=undefined)	
		km.flow.LoadData(); 
}



function addflow(index) {
    
   
    km.toolbar.do_add();
}

function editflow(index) {
    $('#flow').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_edit();
}
function deleteflow(index) {
    $('#flow').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_delete();
}


var selectedflowIndex = 0;
km.flow= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#flow").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
            url: km.model.urls["flow_pager"],
               	  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[
   
            
 	                { field: 'add_on', title: gDictionary["add_on"], width: 80, align: 'center', sortable: true },
              //  { field: 'add_by', title: '创建人', width: 80, align: 'center', sortable: true },
                { field: 'flow_name', title: gDictionary["flow_name"], width: 80, align: 'center', sortable: true },
                { field: 'flow_description', title: gDictionary["flow_description"], width: 80, align: 'center', sortable: true },
                { field: 'table_name', title: gDictionary["table_name"], width: 80, align: 'center', sortable: true },
             //   { field: 'column_name', title: '状态列名', width: 80, align: 'center', sortable: true },
            //    { field: 'id_column_name', title: '主列名', width: 80, align: 'center', sortable: true },
    //            { field: 'deadline_column_name', title: '过期日列名', width: 80, align: 'center', sortable: true },
    //            { field: 'flow_type', title: '流程类型', width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {
              
    //                                return showValue(value,'1=单页流程图模式 2=多页模式 3=流程图内编辑模式 4=流程图内页面混合模式','textbox' );
    //                           }},
    //                                            { field: 'page_id', title: '页面编号', width: 80, align: 'center', sortable: true },
    //            { field: 'test_deadline', title: '测试过期日期', width: 80, align: 'center', sortable: true },
    //            { field: 'test_status', title: '测试状态', width: 80, align: 'center', sortable: true },
    // {
    //                            field: 'id', title: '<a href="#" onclick="addflow( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
    //                                return '<a href="#" onclick="editflow(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deleteflow(' + index + ')">删除</a>';
    //}  },
    
                 
            ]],
            onClickRow: function (index, row) {
            
                selectedflowIndex = index;
                km.flow.selectedIndex = index;
                km.flow.selectedRow = row; 
                
                if (km.flow.selectedRow)
                    km.set_mode_flow('show');
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedflowIndex)
             		selectedflowIndex =0
              $("#flow").datagrid("selectRow", selectedflowIndex);
             }
                km.flow.selectedRow = km.flow.getSelectedRow(); 
            
                if (km.flow.selectedRow)
                  km.set_mode_flow('show');
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
    do_refresh: function () { km.flow.reload(); },
     do_add: function () {

        km.set_mode_flow('add');

    },
    do_edit: function () {

        if (km.flow.selectedRow == null) { layer.msg(gDictionary["please_select"]); return; }
        km.set_mode_flow('edit');


    },
    do_delete: function () {
        var sRow = km.flow.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please_select"]  ); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg('此参数不可删除！'); return; }
        var jsonParam =  sRow ;
        com.message('c', ' <b style="color:red">'+gDictionary["confirm_delete"]+'  </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["flow_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.flow.reload();
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
                    var jsonObject = $("#flow_content").serializeJson();
                        
     
     
                  
     
                    var jsonStr =  jsonObject ;
                       if (!$("#flow_content").form('validate')) {
                           layer.msg( gDictionary["input_incorrect"] );
                        return false;
                    }
        //添加自定义判断
                    //if (jsonObject.param_code == "" || jsonObject.param_value == "") { flagValid = false; com.message('e', '参数代码或参数名称不能为空！'); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            com.ajax({
                                type: 'POST', url: km.model.urls["flow_update"], data: jsonStr, success: function (result) {
                                    AfterEditflow(result);
                                }
                            });
                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["flow_insert"], data: jsonStr, success: function (result) {
                                    AfterEditflow(result);
                                }
                            });
                        }
                    }

 

    } 
    ,
    do_undo: function () {
        var op_mode = km.flow.selectedRow == null ? 'clear' : 'show';
        km.set_mode_flow(op_mode);
    }
};


function AfterEditflow(result) {
    if (result.s) {
        com.message('s', result.message);
        km.flow.reload();
        if (km.settings.op_mode == 'add') {
            km.flow.unselectAll();
            km.set_mode_flow('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.flow.selectRow(km.flow.selectedIndex);
            km.flow.selectedRow = $.extend(km.flow.selectedRow, jsonObject);
            km.set_mode_flow('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode_flow = function (op_mode) {
    km.settings.op_mode = op_mode;
    $('#km_toolbar').show();
    $('#km_toolbar_2').hide();
    com.mask($('#west_panel'), false);
   // $('#user_tabs').tabs('enableTab', 1);
   // $('#user_tabs').tabs('enableTab', 2);
    $('#flow_content .easyui-combobox').combobox('readonly', true);
    $('#flow_content .easyui-combotree').combotree('readonly', true);
    $('#flow_content .easyui-textbox').textbox('readonly', true);
    $('#flow_content .easyui-numberbox').numberbox('readonly', true);

    $("#flow_content").find("input[type='radio']").attr("disabled", "true");//这
    $("#flow_content").find("input[type='checkbox']").attr("disabled", "true");//这
    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.flow.selectedRow));
      var sRow = km.flow.selectedRow;
                   
        
        
      $('#flow_content').form('load', sRow);
      km.flow_lines.LoadData();
      km.flow_nodes.LoadData();
      km.flow_status.LoadData();
       
     //   km.orgcombotree.jq.combotree('setValue', km.flow.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
        
      //  $('#user_tabs').tabs('disableTab', 1);
      //  $('#user_tabs').tabs('disableTab', 2);
      //  $('#user_tabs').tabs('select', 0);
        
    $("#flow_content").find("input[type='radio']").removeAttr("disabled" ); 
    $("#flow_content").find("input[type='checkbox']").removeAttr("disabled" ); 
        
        $('#flow_content .easyui-combobox').combobox('readonly', false);
        $('#flow_content .easyui-combotree').combotree('readonly', false);
        $('#flow_content .easyui-textbox').textbox('readonly', false);
        $('#flow_content .easyui-numberbox').numberbox('readonly', false);
        
        $('#flow_content').form('clear');
        
        
      //  $('#TPL_id').val(0);
        //$('#TPL_enabled').combobox('setValue', 1);
        //$('#TPL_user_type').combobox('setValue', 3);
        //$('#TPL_IsSingleLogin').combobox('setValue', 1);
        //$('#TPL_sex').combobox('setValue', '男');
        //$('#TPL_sort').numberbox('setValue', 888);

    } else if (op_mode == 'edit') {
    	
    $("#flow_content").find("input[type='radio']").removeAttr("disabled" ); 
    $("#flow_content").find("input[type='checkbox']").removeAttr("disabled" ); 
        //alert($('#flow_content .easyui-text'));
        $('#flow_content .easyui-combobox').combobox('readonly', false);
        $('#flow_content .easyui-combotree').combotree('readonly', false);
        $('#flow_content .easyui-textbox').textbox('readonly', false);
        $('#flow_content .easyui-numberbox').numberbox('readonly', false);
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
              
        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#flow_content').form('clear');
        
    }
}






 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			   
//------------------------------------------------------------------------------  



var flow_nodesupdatedRows = new Array();


 
function flow_nodesshowValue(value, data, type, index, col) {
    var tmp = "";
    var a = data.split(" ");
    for (var i = 0; i < a.length; i++) {

        var v = a[i].split("=")[0];
        var t = a[i].split("=")[1];
        if (type == "checkbox") {

            var str = "flow_nodesChangeValue2(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (("," + value + ",").indexOf("," + v + ",") >= 0)
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\' onchange='" + str + "' checked >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\'  onchange='" + str + "' >&nbsp;" + t;


        } else if (type == "radio") {

            var str = "flow_nodesChangeValue(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (value == undefined && i == 0) {
                console.log(index);
                flow_nodesChangeValue(null, col, index, v);
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

function flow_nodesChangeValue2(me, col, index, v) {
    // var row = km.flow_nodes.getSelectedRow();

    var data = $('#flow_nodes').datagrid('getData');
    // var k = flow_nodesupdatedRows[j];
    var row = data.rows[index]

    var cs = $("input[name='" + col + index + "']:checked");
    var p = [];
    cs.each(function () {
      //  console.log(this.value);
        p.push(this.value);
    });

    row[col] = p;

    flow_nodespushChangedRow(index);
    // console.log(km.flow_nodes.getSelectedRow());
}
function flow_nodespushChangedRow(index) {
    for (var i = 0; i < flow_nodesupdatedRows.length; i++) {
        if (flow_nodesupdatedRows[i] == index)
            return;
    }
    flow_nodesupdatedRows.push(index)
}

function flow_nodesChangeValue(me, col, index, v) {
    // var row = km.flow_nodes.getSelectedRow();

    var data = $('#flow_nodes').datagrid('getData');
    // var k = flow_nodesupdatedRows[j];
    var row = data.rows[index]
    row[col] = v;
    flow_nodespushChangedRow(index);
}


function  flow_nodes_18_Init(){
	km.flow_nodes.init();
	//if(	km.flow_nodes.LoadData!=undefined)	
	//	km.flow_nodes.LoadData(); 
}

var selectedflow_nodesIndex = 0;
km.flow_nodes= {
    jq: null,
     	             		
    LoadData: function () { 
					var options = $('#flow_nodes').datagrid('options')
					options.queryParams={_t: com.settings.timestamp(),

					    flow_id: km.flow.selectedRow.id,
					};
					options.url = km.model.urls["flow_nodes_pager"]; 
					$('#flow_nodes').datagrid(options);
                
    },
               	             	
    init: function () {
        this.jq = $("#flow_nodes").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
             	             		 
             		  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true, toolbar: '#tbflow_nodes', onClickRow: onClickRow_flow_nodes,
            columns: [[
               	 
                          { field: 'name', title: gDictionary["name"], width: 280, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
                          
                             
                              { field: 'type', title: gDictionary["type"], width: 200, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
                        
                             
                            //  { field: 'flow_id', title: '流程编号', width: 100, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                        
                             
                          { field: 'gf_id', title: gDictionary["gf_id"], width: 280, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
                          
                             
                            { field: 'can_cancel', title: gDictionary["can_cancel"], width: 100, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
                        
                             
                          { field: 'page_type', title: gDictionary["page_type"], width: 280, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
                          
                             
                          { field: 'status', title: gDictionary["status"], width: 280, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
                          
                                 
            ]],
            onLoadSuccess: function () { }
        });//end grid init
    },
    reload: function (queryParams) {
      	             		
     this.LoadData();
             	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


		var editIndexflow_nodes = undefined;
		function flow_nodesendEditing(){
			if (editIndexflow_nodes == undefined){return true}
			if ($('#flow_nodes').datagrid('validateRow', editIndexflow_nodes)){
			
			//需要手工修改
			//	var ed = $('#flow_nodes').datagrid('getEditor', {index:editIndexflow_nodes,field:'productid'});
			//	var productname = $(ed.target).combobox('getText');
			//	$('#flow_nodes').datagrid('getRows')[editIndexflow_nodes]['productname'] = productname;
				$('#flow_nodes').datagrid('endEdit', editIndexflow_nodes);
				
				
				editIndexflow_nodes = undefined;
				return true;
			} else {
				return false;
			}
		}
		function onClickRow_flow_nodes(index){
			if (editIndexflow_nodes != index){
				if (flow_nodesendEditing()){
					$('#flow_nodes').datagrid('selectRow', index)
							.datagrid('beginEdit', index);
					editIndexflow_nodes = index;
				} else {
					$('#flow_nodes').datagrid('selectRow', editIndexflow_nodes);
				}
			}
		}
		function append_flow_nodes(){
			if (flow_nodesendEditing()){
				$('#flow_nodes').datagrid('appendRow',{status:'P'});
				editIndexflow_nodes = $('#flow_nodes').datagrid('getRows').length-1;
				$('#flow_nodes').datagrid('selectRow', editIndexflow_nodes)
						.datagrid('beginEdit', editIndexflow_nodes);
			}
		}
		function removeit_flow_nodes(){
			if (editIndexflow_nodes == undefined){layer.msg('请选择一条记录！'); return; }
			
			 var sRow = km.flow_nodes.getSelectedRow();
			 if (sRow == null) { layer.msg(gDictionary["please_select"] ); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg('此参数不可删除！'); return; }
        var jsonParam =  sRow ;
        com.message('c', ' <b style="color:red">'+gDictionary["confirm_delete"]+'  </b>', function (b) {
        	
        	
            for (var j = flow_nodesupdatedRows.length - 1; j > 0  ; j--) {
                var data = $('#flow_nodes').datagrid('getData');
                var k = flow_nodesupdatedRows[j];
                var tmpstr =  data.rows[k] 
                if (jsonParam == tmpstr)
                    flow_nodesupdatedRows.splice(j, 1);
            }
            
            if (b) {
                com.ajax({
                    url: km.model.urls["flow_nodes_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message); 
			
			$('#flow_nodes').datagrid('cancelEdit', editIndexflow_nodes)
					.datagrid('deleteRow', editIndexflow_nodes);
			editIndexflow_nodes = undefined;
			
                        km.flow_nodes.reload();
                            
                        } else {
                            com.message('e', result.message);
                        }
                    }
                });
            }
        });
        
		}
	
function flow_nodesSubmitChanges(rows, url) {

    for (var i = 0; i < rows.length; i++) {

        rows[i].flow_id = km.flow.selectedRow.id;
      
                          
        var jsonStr =  rows[i] ;

        com.ajax({
            type: 'POST', url: km.model.urls[url], data: jsonStr, success: function (result) {
            	
                        if (i == rows.length-1)
                km.flow_nodes.reload();
            }
        });

        for (var j = flow_nodesupdatedRows.length - 1; j > 0  ; j--) {
            var data = $('#flow_nodes').datagrid('getData');
            var k = flow_nodesupdatedRows[j];
            var tmpstr =  data.rows[k] 
            if (jsonStr == tmpstr)
                flow_nodesupdatedRows.splice(j, 1);
        }

    }
}

function accept_flow_nodes() {
    if (flow_nodesendEditing()) {


        if ($("#flow_nodes").datagrid('getChanges').length) {
            ////获取插入更改的行的集合
            var inserted = $("#flow_nodes").datagrid('getChanges', "inserted");

            flow_nodesSubmitChanges(inserted, "flow_nodes_insert");

            var updated = $("#flow_nodes").datagrid('getChanges', "updated");

            flow_nodesSubmitChanges(updated, "flow_nodes_update");

        }
        for (var j = flow_nodesupdatedRows.length - 1; j >= 0  ; j--) {

            var data = $('#flow_nodes').datagrid('getData');
            var k = flow_nodesupdatedRows[j];
            var rows = data.rows;

           
                

            data.rows[k].flow_id = km.flow.selectedRow.id;

            var tmpstr =  data.rows[k] 
            com.ajax({
                type: 'POST', url: km.model.urls["flow_nodes_update"], data: tmpstr, success: function (result) {
                    //     AfterEdit(result);

                        if (j ==0)
                    km.flow_nodes.reload();
                }
            });
            flow_nodesupdatedRows = new Array();
        }

        return;

    }

    $('#flow_nodes').datagrid('acceptChanges');

}
		function reject_flow_nodes(){
			$('#flow_nodes').datagrid('rejectChanges');
			editIndexflow_nodes = undefined;
		}
		function getChanges_flow_nodes(){
			var rows = $('#flow_nodes').datagrid('getChanges');
			alert(rows.length+' rows are changed!');
		}


 
 

 
//------------------------------------------------------------------------------ 
//       时间： 2018-03-18
//       作者： fdsaf   
//			   
//------------------------------------------------------------------------------  



var flow_statusupdatedRows = new Array();


 
function flow_statusshowValue(value, data, type, index, col) {
    var tmp = "";
    var a = data.split(" ");
    for (var i = 0; i < a.length; i++) {

        var v = a[i].split("=")[0];
        var t = a[i].split("=")[1];
        if (type == "checkbox") {

            var str = "flow_statusChangeValue2(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (("," + value + ",").indexOf("," + v + ",") >= 0)
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\' onchange='" + str + "' checked >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\'  onchange='" + str + "' >&nbsp;" + t;


        } else if (type == "radio") {

            var str = "flow_statusChangeValue(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (value == undefined && i == 0) {
                console.log(index);
                flow_statusChangeValue(null, col, index, v);
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

function flow_statusChangeValue2(me, col, index, v) {
    // var row = km.flow_status.getSelectedRow();

    var data = $('#flow_status').datagrid('getData');
    // var k = flow_statusupdatedRows[j];
    var row = data.rows[index]

    var cs = $("input[name='" + col + index + "']:checked");
    var p = [];
    cs.each(function () {
      //  console.log(this.value);
        p.push(this.value);
    });

    row[col] = p;

    flow_statuspushChangedRow(index);
    // console.log(km.flow_status.getSelectedRow());
}
function flow_statuspushChangedRow(index) {
    for (var i = 0; i < flow_statusupdatedRows.length; i++) {
        if (flow_statusupdatedRows[i] == index)
            return;
    }
    flow_statusupdatedRows.push(index)
}

function flow_statusChangeValue(me, col, index, v) {
    // var row = km.flow_status.getSelectedRow();

    var data = $('#flow_status').datagrid('getData');
    // var k = flow_statusupdatedRows[j];
    var row = data.rows[index]
    row[col] = v;
    flow_statuspushChangedRow(index);
}


function  flow_status_24_Init(){
	km.flow_status.init();
	//if(	km.flow_status.LoadData!=undefined)	
	//	km.flow_status.LoadData(); 
}

var selectedflow_statusIndex = 0;
km.flow_status= {
    jq: null,
     	             		
    LoadData: function () { 
					var options = $('#flow_status').datagrid('options')
					options.queryParams={_t: com.settings.timestamp(),

					    flow_id: km.flow.selectedRow.id,
					};
					options.url = km.model.urls["flow_status_pager"]; 
					$('#flow_status').datagrid(options);
                
    },
               	             	
    init: function () {
        this.jq = $("#flow_status").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
             	             		 
             		  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true, toolbar: '#tbflow_status', onClickRow: onClickRow_flow_status,
            columns: [[
               	 
                              { field: 'status', title:   gDictionary["status"], width: 200, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                        
                             
{ field: 'status_text', title:   gDictionary["status_text"], width: 280, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                          
                                 
            ]],
            onLoadSuccess: function () { }
        });//end grid init
    },
    reload: function (queryParams) {
      	             		
     this.LoadData();
             	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


		var editIndexflow_status = undefined;
		function flow_statusendEditing(){
			if (editIndexflow_status == undefined){return true}
			if ($('#flow_status').datagrid('validateRow', editIndexflow_status)){
			
			//需要手工修改
			//	var ed = $('#flow_status').datagrid('getEditor', {index:editIndexflow_status,field:'productid'});
			//	var productname = $(ed.target).combobox('getText');
			//	$('#flow_status').datagrid('getRows')[editIndexflow_status]['productname'] = productname;
				$('#flow_status').datagrid('endEdit', editIndexflow_status);
				
				
				editIndexflow_status = undefined;
				return true;
			} else {
				return false;
			}
		}
		function onClickRow_flow_status(index){
			if (editIndexflow_status != index){
				if (flow_statusendEditing()){
					$('#flow_status').datagrid('selectRow', index)
							.datagrid('beginEdit', index);
					editIndexflow_status = index;
				} else {
					$('#flow_status').datagrid('selectRow', editIndexflow_status);
				}
			}
		}
		function append_flow_status(){
			if (flow_statusendEditing()){
				$('#flow_status').datagrid('appendRow',{status:'P'});
				editIndexflow_status = $('#flow_status').datagrid('getRows').length-1;
				$('#flow_status').datagrid('selectRow', editIndexflow_status)
						.datagrid('beginEdit', editIndexflow_status);
			}
		}
		function removeit_flow_status(){
		    if (editIndexflow_status == undefined) { layer.msg(gDictionary["please_select"]); return; }
			
			 var sRow = km.flow_status.getSelectedRow();
			 if (sRow == null) { layer.msg(gDictionary["please_select"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg('此参数不可删除！'); return; }
        var jsonParam =  sRow ;
        com.message('c', ' <b style="color:red">'+gDictionary["confirm_delete"]+' </b>', function (b) {
        	
        	
            for (var j = flow_statusupdatedRows.length - 1; j > 0  ; j--) {
                var data = $('#flow_status').datagrid('getData');
                var k = flow_statusupdatedRows[j];
                var tmpstr =  data.rows[k] 
                if (jsonParam == tmpstr)
                    flow_statusupdatedRows.splice(j, 1);
            }
            
            if (b) {
                com.ajax({
                    url: km.model.urls["flow_status_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message); 
			
			$('#flow_status').datagrid('cancelEdit', editIndexflow_status)
					.datagrid('deleteRow', editIndexflow_status);
			editIndexflow_status = undefined;
			
                        km.flow_status.reload();
                            
                        } else {
                            com.message('e', result.message);
                        }
                    }
                });
            }
        });
        
		}
	
function flow_statusSubmitChanges(rows, url) {

    for (var i = 0; i < rows.length; i++) {

        rows[i].flow_id = km.flow.selectedRow.id;
                          
        var jsonStr =  rows[i] ;

        com.ajax({
            type: 'POST', url: km.model.urls[url], data: jsonStr, success: function (result) {
            	
                        if (i == rows.length-1)
                km.flow_status.reload();
            }
        });

        for (var j = flow_statusupdatedRows.length - 1; j > 0  ; j--) {
            var data = $('#flow_status').datagrid('getData');
            var k = flow_statusupdatedRows[j];
            var tmpstr =  data.rows[k] 
            if (jsonStr == tmpstr)
                flow_statusupdatedRows.splice(j, 1);
        }

    }
}

function accept_flow_status() {
    if (flow_statusendEditing()) {


        if ($("#flow_status").datagrid('getChanges').length) {
            ////获取插入更改的行的集合
            var inserted = $("#flow_status").datagrid('getChanges', "inserted");

            flow_statusSubmitChanges(inserted, "flow_status_insert");

            var updated = $("#flow_status").datagrid('getChanges', "updated");

            flow_statusSubmitChanges(updated, "flow_status_update");

        }
        for (var j = flow_statusupdatedRows.length - 1; j >= 0  ; j--) {

            var data = $('#flow_status').datagrid('getData');
            var k = flow_statusupdatedRows[j];

            data.rows[k].flow_id = km.flow.selectedRow.id;
            var rows = data.rows;

           
                
                          

            var tmpstr =  data.rows[k] 
            com.ajax({
                type: 'POST', url: km.model.urls["flow_status_update"], data: tmpstr, success: function (result) {
                    //     AfterEdit(result);

                        if (j ==0)
                    km.flow_status.reload();
                }
            });
            flow_statusupdatedRows = new Array();
        }

        return;

    }

    $('#flow_status').datagrid('acceptChanges');

}
		function reject_flow_status(){
			$('#flow_status').datagrid('rejectChanges');
			editIndexflow_status = undefined;
		}
		function getChanges_flow_status(){
			var rows = $('#flow_status').datagrid('getChanges');
			alert(rows.length+' rows are changed!');
		}
		function recreate_status() {
		    var jsonStr = {
 flow_id: km.flow.selectedRow.id
		    }
		    ;
             
		    com.ajax({
		        type: 'POST', url: km.model.urls["recreate_status"], data: jsonStr, success: function (result) {
                     
		                km.flow_status.reload();
		        }
		    });
		}

		//recreate_status
 
