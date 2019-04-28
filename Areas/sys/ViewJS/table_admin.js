
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-02-04
//       作者： 蔡捷2   
//			 为表格和列添加注释 
//       文件： table_admin.cshtml 页面文件 
//       文件： table_admin.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/dev/ViewJS/table_admin.js
说明：表格注释(table_admin)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
     table_list_5_Init();
column_list_11_Init();
 
 
   //如果没有动态combobox可删除
     $('.easyui-combobox').each(function (index, element) {
       var options = $(this).combobox('options')
          var u = $(this).attr("url2")
      
        if (u!= undefined) { 
         
            options.url =  km.model.urls[u];
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
                tmp += "&nbsp;<input type='checkbox' checked >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox' >&nbsp;" + t;


        } else if (type == "radio") {
            if (value ==v)
                tmp += "&nbsp;<input type='radio' checked >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='radio' >&nbsp;" + t;
        } else {
            if (value ==v)
                return t;
        }
    }
    return tmp;
} 

 
 
//------------------------------------------------------------------------------ 
//       时间： 2018-02-04
//       作者： 蔡捷2   
//			   
//------------------------------------------------------------------------------  



var table_listupdatedRows = new Array();


 
function table_listshowValue(value, data, type, index, col) {
    var tmp = "";
    var a = data.split(" ");
    for (var i = 0; i < a.length; i++) {

        var v = a[i].split("=")[0];
        var t = a[i].split("=")[1];
        if (type == "checkbox") {

            var str = "table_listChangeValue2(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (("," + value + ",").indexOf("," + v + ",") >= 0)
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\' onchange='" + str + "' checked >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\'  onchange='" + str + "' >&nbsp;" + t;


        } else if (type == "radio") {

            var str = "table_listChangeValue(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (value == undefined && i == 0) {
                console.log(index);
                table_listChangeValue(null, col, index, v);
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

function table_listChangeValue2(me, col, index, v) {
    // var row = km.table_list.getSelectedRow();

    var data = $('#table_list').datagrid('getData');
    // var k = table_listupdatedRows[j];
    var row = data.rows[index]

    var cs = $("input[name='" + col + index + "']:checked");
    var p = [];
    cs.each(function () {
      //  console.log(this.value);
        p.push(this.value);
    });

    row[col] = p;

    table_listpushChangedRow(index);
    // console.log(km.table_list.getSelectedRow());
}
function table_listpushChangedRow(index) {
    for (var i = 0; i < table_listupdatedRows.length; i++) {
        if (table_listupdatedRows[i] == index)
            return;
    }
    table_listupdatedRows.push(index)
}

function table_listChangeValue(me, col, index, v) {
    // var row = km.table_list.getSelectedRow();

    var data = $('#table_list').datagrid('getData');
    // var k = table_listupdatedRows[j];
    var row = data.rows[index]
    row[col] = v;
    table_listpushChangedRow(index);
}


function  table_list_5_Init(){
	km.table_list.init();
}

var selectedtable_listIndex = 0;
km.table_list= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#table_list").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
            url: km.model.urls["table_list_pager"],
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true, toolbar: '#tbtable_list', onClickRow: onClickRow_table_list,
            columns: [[
               	 
                          { field: 'table_name', title: gDictionary["table_name"], width: 180, align: 'left', sortable: true ,editor:{type:'textbox',options:{}}},
                          
                             
                          { field: 'description', title: gDictionary["description"], width: 280, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },
                          
                                 
            ]],
            onLoadSuccess: function () { }
        });//end grid init
    },
    reload: function (queryParams) {
      	         var defaults = { _t: com.settings.timestamp() };
       if (queryParams) { defaults = $.extend(defaults, queryParams); }
     this.jq.datagrid('reload', defaults);
      	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


		var editIndextable_list = undefined;
		function table_listendEditing(){
			if (editIndextable_list == undefined){return true}
			if ($('#table_list').datagrid('validateRow', editIndextable_list)){
			
			//需要手工修改
			//	var ed = $('#table_list').datagrid('getEditor', {index:editIndextable_list,field:'productid'});
			//	var productname = $(ed.target).combobox('getText');
			//	$('#table_list').datagrid('getRows')[editIndextable_list]['productname'] = productname;
				$('#table_list').datagrid('endEdit', editIndextable_list);
				
				
				editIndextable_list = undefined;
				return true;
			} else {
				return false;
			}
		}
		function onClickRow_table_list(index) {
			if (editIndextable_list != index){
				if (table_listendEditing()){
					$('#table_list').datagrid('selectRow', index)
							.datagrid('beginEdit', index);
					editIndextable_list = index;
				} else {
					$('#table_list').datagrid('selectRow', editIndextable_list);
				}
			}
		    km.column_list.LoadData(index);
		}
		function append_table_list(){
			if (table_listendEditing()){
				$('#table_list').datagrid('appendRow',{status:'P'});
				editIndextable_list = $('#table_list').datagrid('getRows').length-1;
				$('#table_list').datagrid('selectRow', editIndextable_list)
						.datagrid('beginEdit', editIndextable_list);
			}
		}
		function removeit_table_list(){
			if (editIndextable_list == undefined){layer.msg(gDictionary["please select one record"]); return; }
			
			 var sRow = km.table_list.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam =  sRow ;
        com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {
        	
        	
            for (var j = table_listupdatedRows.length - 1; j > 0  ; j--) {
                var data = $('#table_list').datagrid('getData');
                var k = table_listupdatedRows[j];
                var tmpstr = data.rows[k]
                if (jsonParam == tmpstr)
                    table_listupdatedRows.splice(j, 1);
            }
            
            if (b) {
                com.ajax({
                    url: km.model.urls["table_list_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message); 
			
			$('#table_list').datagrid('cancelEdit', editIndextable_list)
					.datagrid('deleteRow', editIndextable_list);
			editIndextable_list = undefined;
			
                        km.table_list.reload();
                            
                        } else {
                            com.message('e', result.message);
                        }
                    }
                });
            }
        });
        
		}
	
function table_listSubmitChanges(rows, url) {

    for (var i = 0; i < rows.length; i++) {

      
                          
        var jsonStr =  rows[i];

        com.ajax({
            type: 'POST', url: km.model.urls[url], data: jsonStr, success: function (result) {
                km.table_list.reload();
            }
        });

        for (var j = table_listupdatedRows.length - 1; j > 0  ; j--) {
            var data = $('#table_list').datagrid('getData');
            var k = table_listupdatedRows[j];
            var tmpstr =  data.rows[k]
            if (jsonStr == tmpstr)
                table_listupdatedRows.splice(j, 1);
        }

    }
}

function accept_table_list() {
    if (table_listendEditing()) {


        if ($("#table_list").datagrid('getChanges').length) {
            ////获取插入更改的行的集合
            var inserted = $("#table_list").datagrid('getChanges', "inserted");

            table_listSubmitChanges(inserted, "table_list_insert");

            var updated = $("#table_list").datagrid('getChanges', "updated");

            table_listSubmitChanges(updated, "table_list_update");

        }
        for (var j = table_listupdatedRows.length - 1; j >= 0  ; j--) {

            var data = $('#table_list').datagrid('getData');
            var k = table_listupdatedRows[j];
            var rows = data.rows;

           
                
                          

            var tmpstr =  data.rows[k] 
            com.ajax({
                type: 'POST', url: km.model.urls["table_list_update"], data: tmpstr, success: function (result) {
                    //     AfterEdit(result);

                    km.table_list.reload();
                }
            });
            table_listupdatedRows = new Array();
        }

        return;

    }

    $('#table_list').datagrid('acceptChanges');

}
		function reject_table_list(){
			$('#table_list').datagrid('rejectChanges');
			editIndextable_list = undefined;
		}
		function getChanges_table_list(){
			var rows = $('#table_list').datagrid('getChanges');
			alert(rows.length+' rows are changed!');
		}


 
 

 
//------------------------------------------------------------------------------ 
//       时间： 2018-02-04
//       作者： 蔡捷2   
//			   
//------------------------------------------------------------------------------  



var column_listupdatedRows = new Array();


 
function column_listshowValue(value, data, type, index, col) {
    var tmp = "";
    var a = data.split(" ");
    for (var i = 0; i < a.length; i++) {

        var v = a[i].split("=")[0];
        var t = a[i].split("=")[1];
        if (type == "checkbox") {

            var str = "column_listChangeValue2(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (("," + value + ",").indexOf("," + v + ",") >= 0)
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\' onchange='" + str + "' checked >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\'  onchange='" + str + "' >&nbsp;" + t;


        } else if (type == "radio") {

            var str = "column_listChangeValue(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (value == undefined && i == 0) {
                console.log(index);
                column_listChangeValue(null, col, index, v);
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

function column_listChangeValue2(me, col, index, v) {
    // var row = km.column_list.getSelectedRow();

    var data = $('#column_list').datagrid('getData');
    // var k = column_listupdatedRows[j];
    var row = data.rows[index]

    var cs = $("input[name='" + col + index + "']:checked");
    var p = [];
    cs.each(function () {
      //  console.log(this.value);
        p.push(this.value);
    });

    row[col] = p;

    column_listpushChangedRow(index);
    // console.log(km.column_list.getSelectedRow());
}
function column_listpushChangedRow(index) {
    for (var i = 0; i < column_listupdatedRows.length; i++) {
        if (column_listupdatedRows[i] == index)
            return;
    }
    column_listupdatedRows.push(index)
}

function column_listChangeValue(me, col, index, v) {
    // var row = km.column_list.getSelectedRow();

    var data = $('#column_list').datagrid('getData');
    // var k = column_listupdatedRows[j];
    var row = data.rows[index]
    row[col] = v;
    column_listpushChangedRow(index);
}


function  column_list_11_Init(){
	km.column_list.init();
}

var selectedcolumn_listIndex = 0;
km.column_list= {
    jq: null,
     	             		
    LoadData: function () { 
					var options = $('#column_list').datagrid('options')
					
					var row = $('#table_list').datagrid('getSelected' );
					options.url = km.model.urls["column_list_pager"]; 
					options.queryParams = { _t: com.settings.timestamp(), table_name: row.table_name, };
					$('#column_list').datagrid(options);
                
    },
               	             	
    init: function () {
        this.jq = $("#column_list").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
             	             		
            queryParams: { _t: com.settings.timestamp(), 	table_name:'',     	}, 
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true, toolbar: '#tbcolumn_list', onClickRow: onClickRow_column_list,
            columns: [[
               	 
                          //{ field: 'table_name', title: gDictionary["table_name"], width: 80, align: 'left', sortable: true },
                          
                             
                          { field: 'column_name', title: gDictionary["column name"], width: 180, align: 'left', sortable: true },
                          { field: 'caption', title: gDictionary["title"], width: 280, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },
                          
                             
                          { field: 'description', title: gDictionary["description"], width: 380, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },
                          
                                 
            ]],
            onLoadSuccess: function () { }
        });//end grid init
    },
    reload: function (queryParams) {
      	             		
     this.LoadData();
             	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


		var editIndexcolumn_list = undefined;
		function column_listendEditing(){
			if (editIndexcolumn_list == undefined){return true}
			if ($('#column_list').datagrid('validateRow', editIndexcolumn_list)){
			
			//需要手工修改
			//	var ed = $('#column_list').datagrid('getEditor', {index:editIndexcolumn_list,field:'productid'});
			//	var productname = $(ed.target).combobox('getText');
			//	$('#column_list').datagrid('getRows')[editIndexcolumn_list]['productname'] = productname;
				$('#column_list').datagrid('endEdit', editIndexcolumn_list);
				
				
				editIndexcolumn_list = undefined;
				return true;
			} else {
				return false;
			}
		}
		function onClickRow_column_list(index){
			if (editIndexcolumn_list != index){
				if (column_listendEditing()){
					$('#column_list').datagrid('selectRow', index)
							.datagrid('beginEdit', index);
					editIndexcolumn_list = index;
				} else {
					$('#column_list').datagrid('selectRow', editIndexcolumn_list);
				}
			}
		}
		function append_column_list(){
			if (column_listendEditing()){
				$('#column_list').datagrid('appendRow',{status:'P'});
				editIndexcolumn_list = $('#column_list').datagrid('getRows').length-1;
				$('#column_list').datagrid('selectRow', editIndexcolumn_list)
						.datagrid('beginEdit', editIndexcolumn_list);
			}
		}
		function removeit_column_list(){
			if (editIndexcolumn_list == undefined){layer.msg(gDictionary["please select one record"]); return; }
			
			 var sRow = km.column_list.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam =  sRow;
        com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {
        	
        	
            for (var j = column_listupdatedRows.length - 1; j > 0  ; j--) {
                var data = $('#column_list').datagrid('getData');
                var k = column_listupdatedRows[j];
                var tmpstr =  data.rows[k]
                if (jsonParam == tmpstr)
                    column_listupdatedRows.splice(j, 1);
            }
            
            if (b) {
                com.ajax({
                    url: km.model.urls["column_list_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message); 
			
			$('#column_list').datagrid('cancelEdit', editIndexcolumn_list)
					.datagrid('deleteRow', editIndexcolumn_list);
			editIndexcolumn_list = undefined;
			
                        km.column_list.reload();
                            
                        } else {
                            com.message('e', result.message);
                        }
                    }
                });
            }
        });
        
		}

		function add_default() {
		    var row = $('#table_list').datagrid('getSelected'); 
		    var a = [{ col: 'id', caption: '编号' }, { col: 'add_on', caption: '创建日期' }, { col: 'add_by', caption: '创建人' }, { col: 'description', caption: gDictionary["description"] },
                { col: 'comments', caption: '注释' }, { col: 'department_id', caption: gDictionary["department_id"] }, ];
		    for (var i = 0; i < a.length; i++)
		    {

		        var sRow = {};
		        sRow.column_name = a[i].col;
		        sRow.description = a[i].caption;
		        sRow.caption = a[i].caption;
		        sRow.table_name = row.table_name;
		    com.ajax({
		        url: km.model.urls["column_list_update"], data: sRow, success: function (result) {
		        }
		    });
		    }
		}
	
function column_listSubmitChanges(rows, url) {

    for (var i = 0; i < rows.length; i++) {

      
                          
        var jsonStr =  rows[i];

        com.ajax({
            type: 'POST', url: km.model.urls[url], data: jsonStr, success: function (result) {
                km.column_list.reload();
            }
        });

        for (var j = column_listupdatedRows.length - 1; j > 0  ; j--) {
            var data = $('#column_list').datagrid('getData');
            var k = column_listupdatedRows[j];
            var tmpstr =  data.rows[k]
            if (jsonStr == tmpstr)
                column_listupdatedRows.splice(j, 1);
        }

    }
}

function accept_column_list() {
    if (column_listendEditing()) {


        if ($("#column_list").datagrid('getChanges').length) {
            ////获取插入更改的行的集合
            var inserted = $("#column_list").datagrid('getChanges', "inserted");

            column_listSubmitChanges(inserted, "column_list_insert");

            var updated = $("#column_list").datagrid('getChanges', "updated");

            column_listSubmitChanges(updated, "column_list_update");

        }
        for (var j = column_listupdatedRows.length - 1; j >= 0  ; j--) {

            var data = $('#column_list').datagrid('getData');
            var k = column_listupdatedRows[j];
            var rows = data.rows;

           
                
                          

            var tmpstr =  data.rows[k]
            com.ajax({
                type: 'POST', url: km.model.urls["column_list_update"], data: tmpstr, success: function (result) {
                    //     AfterEdit(result);

                    km.column_list.reload();
                }
            });
            column_listupdatedRows = new Array();
        }

        return;

    }

    $('#column_list').datagrid('acceptChanges');

}
		function reject_column_list(){
			$('#column_list').datagrid('rejectChanges');
			editIndexcolumn_list = undefined;
		}
		function getChanges_column_list(){
			var rows = $('#column_list').datagrid('getChanges');
			alert(rows.length+' rows are changed!');
		}


 
 
