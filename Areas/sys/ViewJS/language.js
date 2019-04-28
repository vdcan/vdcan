
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-04-21
//       作者： fdsaf   
//			 用于维护多语种 
//       文件： language.cshtml 页面文件 
//       文件： language.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/sys/ViewJS/language.js
说明：语言管理(language)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
     menu_2_Init();
dictionary_8_Init();

dictionary_g_14_Init();
dictionary_home_20_Init();
dictionary_system_20_Init();
 
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
//       时间： 2018-04-21
//       作者： fdsaf   
//			   
//------------------------------------------------------------------------------  

function  menu_2_Init(){
	km.menu.init();
	
	if(	km.menu.LoadData!=undefined)	
		km.menu.LoadData(); 
}



function addmenu(index) {
    
   
    km.toolbar.do_add();
}

function editmenu(index) {
    $('#menu').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_edit();
}
function deletemenu(index) {
    $('#menu').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_delete();
}


var selectedmenuIndex = 0;



km.menu= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#menu").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "", type:'c' }, 
            url: km.model.urls["menu_pager"],
               	  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[
   
            
 	                { field: 'menu_name', title: gDictionary["menu name"], width: 80, align: 'left', sortable: true },
    //            { field: 'menu_token', title: '菜单token', width: 80, align: 'center', sortable: true },
    //            { field: 'menu_type', title: gDictionary["menu type"], width: 80, align: 'center', sortable: true },
    //            { field: 'parent_id', title: gDictionary["parent menu id"], width: 80, align: 'center', sortable: true },
    //            { field: 'remark', title: gDictionary["comments"], width: 80, align: 'center', sortable: true },
    //            { field: 'sort', title: gDictionary["sort"], width: 80, align: 'center', sortable: true },
    //            { field: 'url', title: 'URL', width: 80, align: 'center', sortable: true },
    //            { field: 'visible_flag', title: gDictionary["display"], width: 80, align: 'center', sortable: true },
    //            { field: 'add_by', title: gDictionary["add_by"], width: 80, align: 'center', sortable: true },
    //            { field: 'add_on', title: gDictionary["add_on"], width: 80, align: 'center', sortable: true },
    //            { field: 'button_mode', title: gDictionary["button model"], width: 80, align: 'center', sortable: true },
    //            { field: 'enabled', title: gDictionary["enabled"], width: 80, align: 'center', sortable: true },
    //            { field: 'icon_class', title: gDictionary["icon class"], width: 80, align: 'center', sortable: true },
    //            { field: 'icon_url', title: '图标url', width: 80, align: 'center', sortable: true },
    //            { field: 'id', title: gDictionary["id"], width: 80, align: 'center', sortable: true },
    //            { field: 'menu_code', title: gDictionary["menu code"], width: 80, align: 'center', sortable: true },
    // {
    //                            field: 'id', title: '<a href="#" onclick="addmenu( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
    //                                return '<a href="#" onclick="editmenu(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deletemenu(' + index + ')">删除</a>';
    //}  },
    
                 
            ]],
            onClickRow: function (index, row) {
            
                selectedmenuIndex = index;
                km.menu.selectedIndex = index;
                km.menu.selectedRow = row;  
                if(                km.menu.selectedRow ){
                	
                	menu_selected();
                }
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedmenuIndex)
             		selectedmenuIndex =0
              $("#menu").datagrid("selectRow", selectedmenuIndex);
             }
                km.menu.selectedRow = km.menu.getSelectedRow(); 
                if(                km.menu.selectedRow ){
                	
                	menu_selected();
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


function menu_selected(){
// km.menu.selectedRow 

      km.dictionary.LoadData(); 
   

}



 
//------------------------------------------------------------------------------ 
//       时间： 2018-04-21
//       作者： fdsaf   
//			   
//------------------------------------------------------------------------------  



var dictionaryupdatedRows = new Array();


 
function dictionaryshowValue(value, data, type, index, col) {
    var tmp = "";
    var a = data.split(" ");
    for (var i = 0; i < a.length; i++) {

        var v = a[i].split("=")[0];
        var t = a[i].split("=")[1];
        if (type == "checkbox") {

            var str = "dictionaryChangeValue2(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (("," + value + ",").indexOf("," + v + ",") >= 0)
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\' onchange='" + str + "' checked >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\'  onchange='" + str + "' >&nbsp;" + t;


        } else if (type == "radio") {

            var str = "dictionaryChangeValue(this,\"" + col + "\"," + index + ",\"" + v + "\")";
            if (value == undefined && i == 0) {
                console.log(index);
                dictionaryChangeValue(null, col, index, v);
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

function dictionaryChangeValue2(me, col, index, v) {
    // var row = km.dictionary.getSelectedRow();

    var data = $('#dictionary').datagrid('getData');
    // var k = dictionaryupdatedRows[j];
    var row = data.rows[index]

    var cs = $("input[name='" + col + index + "']:checked");
    var p = [];
    cs.each(function () {
      //  console.log(this.value);
        p.push(this.value);
    });

    row[col] = p;

    dictionarypushChangedRow(index);
    // console.log(km.dictionary.getSelectedRow());
}
function dictionarypushChangedRow(index) {
    for (var i = 0; i < dictionaryupdatedRows.length; i++) {
        if (dictionaryupdatedRows[i] == index)
            return;
    }
    dictionaryupdatedRows.push(index)
}

function dictionaryChangeValue(me, col, index, v) {
    // var row = km.dictionary.getSelectedRow();

    var data = $('#dictionary').datagrid('getData');
    // var k = dictionaryupdatedRows[j];
    var row = data.rows[index]
    row[col] = v;
    dictionarypushChangedRow(index);
}


function  dictionary_8_Init(){
	km.dictionary.init();
//	if(	km.dictionary.LoadData!=undefined)	
	//	km.dictionary.LoadData(); 
}

   function g_dictionary_language(){
   
      return ''; 
      	}
   function g_dictionary_menu_id(){
   
      return km.menu.selectedRow.id; 
      	}

var selecteddictionaryIndex = 0;



km.dictionary= {
    jq: null,
     	             		
    LoadData: function () { 
					var options = $('#dictionary').datagrid('options')
					options.queryParams={_t: com.settings.timestamp(),
					    language: g_dictionary_language(), menu_id: g_dictionary_menu_id(), type: 'c'
					};
					options.url = km.model.urls["dictionary_pager"]; 
					$('#dictionary').datagrid(options);
                
    },
               	             	
    init: function () {
        this.jq = $("#dictionary").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	             		 
             		  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,toolbar: '#tbdictionary',onClickRow: onClickRow_dictionary,
            columns: [[
               	                      //   { field: 'id', title: 'id', width: 80, align: 'center', sortable: true },
                         
                         
                        //  { field: 'language', title: 'language', width: 280, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                          
                             
                           //   { field: 'menu_id', title: 'menu_id', width: 100, align: 'center', sortable: true ,editor:{type:'textbox',options:{}}},
                        
                              { field: 'text', title: gDictionary["text"], width: 200, align: 'left', sortable: true ,editor:{type:'textbox',options:{}}},
                             
                          { field: 'name', title: gDictionary["text code"], width: 200, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },
                          
                             
                        
                                 
            ]],
            onLoadSuccess: function () { }
        });//end grid init
    },
    reload: function (queryParams) {
      	             		
     this.LoadData();
             	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


		var editIndexdictionary = undefined;
		function dictionaryendEditing(){
			if (editIndexdictionary == undefined){return true}
			if ($('#dictionary').datagrid('validateRow', editIndexdictionary)){
			
			//需要手工修改
			//	var ed = $('#dictionary').datagrid('getEditor', {index:editIndexdictionary,field:'productid'});
			//	var productname = $(ed.target).combobox('getText');
			//	$('#dictionary').datagrid('getRows')[editIndexdictionary]['productname'] = productname;
				$('#dictionary').datagrid('endEdit', editIndexdictionary);
				
				
				editIndexdictionary = undefined;
				return true;
			} else {
				return false;
			}
		}
		function onClickRow_dictionary(index){
			if (editIndexdictionary != index){
				if (dictionaryendEditing()){
					$('#dictionary').datagrid('selectRow', index)
							.datagrid('beginEdit', index);
					editIndexdictionary = index;
				} else {
					$('#dictionary').datagrid('selectRow', editIndexdictionary);
				}
			}
		}
		function append_dictionary(){
			if (dictionaryendEditing()){
				$('#dictionary').datagrid('appendRow',{status:'P'});
				editIndexdictionary = $('#dictionary').datagrid('getRows').length-1;
				$('#dictionary').datagrid('selectRow', editIndexdictionary)
						.datagrid('beginEdit', editIndexdictionary);
			}
		}
		function removeit_dictionary(){
			if (editIndexdictionary == undefined){layer.msg(gDictionary["please select one record"]); return; }
			
			 var sRow = km.dictionary.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {
        	
        	
            for (var j = dictionaryupdatedRows.length - 1; j > 0  ; j--) {
                var data = $('#dictionary').datagrid('getData');
                var k = dictionaryupdatedRows[j];
                var tmpstr = JSON.stringify(data.rows[k])
                if (jsonParam == tmpstr)
                    dictionaryupdatedRows.splice(j, 1);
            }
            
            if (b) {
                com.ajax({
                    url: km.model.urls["dictionary_delete"], data: sRow, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message); 
			
			$('#dictionary').datagrid('cancelEdit', editIndexdictionary)
					.datagrid('deleteRow', editIndexdictionary);
			editIndexdictionary = undefined;
			
                        km.dictionary.reload();
                            
                        } else {
                            com.message('e', result.message);
                        }
                    }
                });
            }
        });
        
		}
	
function dictionarySubmitChanges(rows, url) {

    for (var i = 0; i < rows.length; i++) {

      
                          
     	  rows[i].language = g_dictionary_language();
  rows[i].menu_id = g_dictionary_menu_id();
  rows[i].type = 'c';
        var jsonStr = JSON.stringify(rows[i]);

        com.ajax({
            type: 'POST', url: km.model.urls[url], data: rows[i], success: function (result) {
            	
                        if (i == rows.length-1)
                km.dictionary.reload();
            }
        });

        for (var j = dictionaryupdatedRows.length - 1; j > 0  ; j--) {
            var data = $('#dictionary').datagrid('getData');
            var k = dictionaryupdatedRows[j];
            var tmpstr = JSON.stringify(data.rows[k])
            if (jsonStr == tmpstr)
                dictionaryupdatedRows.splice(j, 1);
        }

    }
}

function accept_dictionary() {
    if (dictionaryendEditing()) {


        if ($("#dictionary").datagrid('getChanges').length) {
            ////获取插入更改的行的集合
            var inserted = $("#dictionary").datagrid('getChanges', "inserted");

            dictionarySubmitChanges(inserted, "dictionary_insert");

            var updated = $("#dictionary").datagrid('getChanges', "updated");

            dictionarySubmitChanges(updated, "dictionary_update");

        }
        for (var j = dictionaryupdatedRows.length - 1; j >= 0  ; j--) {

            var data = $('#dictionary').datagrid('getData');
            var k = dictionaryupdatedRows[j];
            var rows = data.rows;

           
                
                          
 	 data.rows[k].language = g_dictionary_language();
 	 data.rows[k].menu_id = g_dictionary_menu_id();
 	 data.rows[i].type = 'c';
            var tmpstr = JSON.stringify(data.rows[k])
            com.ajax({
                type: 'POST', url: km.model.urls["dictionary_update"], data: data.rows[k], success: function (result) {
                    //     AfterEdit(result);

                        if (j ==0)
                    km.dictionary.reload();
                }
            });
            dictionaryupdatedRows = new Array();
        }

        return;

    }

    $('#dictionary').datagrid('acceptChanges');

}
		function reject_dictionary(){
			$('#dictionary').datagrid('rejectChanges');
			editIndexdictionary = undefined;
		}
		function getChanges_dictionary(){
			var rows = $('#dictionary').datagrid('getChanges');
			alert(rows.length+' rows are changed!');
		}






		//------------------------------------------------------------------------------ 
		//       时间： 2018-04-22
		//       作者： fdsaf   
		//			 设置公共文字  
		//------------------------------------------------------------------------------  



		var dictionary_gupdatedRows = new Array();



		function dictionary_gshowValue(value, data, type, index, col) {
		    var tmp = "";
		    var a = data.split(" ");
		    for (var i = 0; i < a.length; i++) {

		        var v = a[i].split("=")[0];
		        var t = a[i].split("=")[1];
		        if (type == "checkbox") {

		            var str = "dictionary_gChangeValue2(this,\"" + col + "\"," + index + ",\"" + v + "\")";
		            if (("," + value + ",").indexOf("," + v + ",") >= 0)
		                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\' onchange='" + str + "' checked >&nbsp;" + t;
		            else
		                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\'  onchange='" + str + "' >&nbsp;" + t;


		        } else if (type == "radio") {

		            var str = "dictionary_gChangeValue(this,\"" + col + "\"," + index + ",\"" + v + "\")";
		            if (value == undefined && i == 0) {
		                console.log(index);
		                dictionary_gChangeValue(null, col, index, v);
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

		function dictionary_gChangeValue2(me, col, index, v) {
		    // var row = km.dictionary_g.getSelectedRow();

		    var data = $('#dictionary_g').datagrid('getData');
		    // var k = dictionary_gupdatedRows[j];
		    var row = data.rows[index]

		    var cs = $("input[name='" + col + index + "']:checked");
		    var p = [];
		    cs.each(function () {
		        //  console.log(this.value);
		        p.push(this.value);
		    });

		    row[col] = p;

		    dictionary_gpushChangedRow(index);
		    // console.log(km.dictionary_g.getSelectedRow());
		}
		function dictionary_gpushChangedRow(index) {
		    for (var i = 0; i < dictionary_gupdatedRows.length; i++) {
		        if (dictionary_gupdatedRows[i] == index)
		            return;
		    }
		    dictionary_gupdatedRows.push(index)
		}

		function dictionary_gChangeValue(me, col, index, v) {
		    // var row = km.dictionary_g.getSelectedRow();

		    var data = $('#dictionary_g').datagrid('getData');
		    // var k = dictionary_gupdatedRows[j];
		    var row = data.rows[index]
		    row[col] = v;
		    dictionary_gpushChangedRow(index);
		}


		function dictionary_g_14_Init() {
		    km.dictionary_g.init();
		    if (km.dictionary_g.LoadData != undefined)
		        km.dictionary_g.LoadData();
		}

		function g_dictionary_g_language() {

		    return '';
		}

		var selecteddictionary_gIndex = 0;



		km.dictionary_g = {
		    jq: null,

		    LoadData: function () {
		        var options = $('#dictionary_g').datagrid('options')
		        options.queryParams = {
		            _t: com.settings.timestamp(),
		            language: g_dictionary_g_language(),
		            type: 'g',
		            menu_id :-1
		        };
		        options.url = km.model.urls["dictionary_pager"];
		        $('#dictionary_g').datagrid(options);

		    },

		    init: function () {
		        this.jq = $("#dictionary_g").datagrid({
		            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',



		            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true, toolbar: '#tbdictionary_g', onClickRow: onClickRow_dictionary_g,
		            columns: [[

                                  //    { field: 'data_id', title: 'data_id', width: 100, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },

                                  //                        //   { field: 'id', title: 'id', width: 80, align: 'center', sortable: true },


                                  //{ field: 'language', title: 'language', width: 280, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },


                                  //    { field: 'menu_id', title: 'menu_id', width: 100, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },


                                  //{ field: 'name', title: 'name', width: 280, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },


                                  //    { field: 'text', title: 'text', width: -10, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },


                                  //{ field: 'type', title: 'type', width: 280, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
                                      { field: 'text', title: gDictionary["text"], width: 200, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },

                          { field: 'name', title: gDictionary["text code"], width: 200, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },


		            ]],
		            onLoadSuccess: function () { }
		        });//end grid init
		    },
		    reload: function (queryParams) {

		        this.LoadData();
		    },
		    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
		};


		var editIndexdictionary_g = undefined;
		function dictionary_gendEditing() {
		    if (editIndexdictionary_g == undefined) { return true }
		    if ($('#dictionary_g').datagrid('validateRow', editIndexdictionary_g)) {

		        //需要手工修改
		        //	var ed = $('#dictionary_g').datagrid('getEditor', {index:editIndexdictionary_g,field:'productid'});
		        //	var productname = $(ed.target).combobox('getText');
		        //	$('#dictionary_g').datagrid('getRows')[editIndexdictionary_g]['productname'] = productname;
		        $('#dictionary_g').datagrid('endEdit', editIndexdictionary_g);


		        editIndexdictionary_g = undefined;
		        return true;
		    } else {
		        return false;
		    }
		}
		function onClickRow_dictionary_g(index) {
		    if (editIndexdictionary_g != index) {
		        if (dictionary_gendEditing()) {
		            $('#dictionary_g').datagrid('selectRow', index)
							.datagrid('beginEdit', index);
		            editIndexdictionary_g = index;
		        } else {
		            $('#dictionary_g').datagrid('selectRow', editIndexdictionary_g);
		        }
		    }
		}
		function append_dictionary_g() {
		    if (dictionary_gendEditing()) {
		        $('#dictionary_g').datagrid('appendRow', { status: 'P' });
		        editIndexdictionary_g = $('#dictionary_g').datagrid('getRows').length - 1;
		        $('#dictionary_g').datagrid('selectRow', editIndexdictionary_g)
						.datagrid('beginEdit', editIndexdictionary_g);
		    }
		}
		function removeit_dictionary_g() {
		    if (editIndexdictionary_g == undefined) { layer.msg(gDictionary["please_select"]); return; }

		    var sRow = km.dictionary_g.getSelectedRow();
		    if (sRow == null) { layer.msg(gDictionary["please_select"]); return; }
		    //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg('此参数不可删除！'); return; }
		    var jsonParam = JSON.stringify(sRow);
		    com.message('c', ' <b style="color:red">'+gDictionary["confirm_delete"]+' </b>', function (b) {


		        for (var j = dictionary_gupdatedRows.length - 1; j > 0  ; j--) {
		            var data = $('#dictionary_g').datagrid('getData');
		            var k = dictionary_gupdatedRows[j];
		            var tmpstr = JSON.stringify(data.rows[k])
		            if (jsonParam == tmpstr)
		                dictionary_gupdatedRows.splice(j, 1);
		        }

		        if (b) {
		            com.ajax({
		                url: km.model.urls["dictionary_delete"], data: sRow, success: function (result) {
		                    if (result.s) {
		                        com.message('s', result.message);

		                        $('#dictionary_g').datagrid('cancelEdit', editIndexdictionary_g)
                                        .datagrid('deleteRow', editIndexdictionary_g);
		                        editIndexdictionary_g = undefined;

		                        km.dictionary_g.LoadData();

		                    } else {
		                        com.message('e', result.message);
		                    }
		                }
		            });
		        }
		    });

		}

		function dictionary_gSubmitChanges(rows, url) {

		    for (var i = 0; i < rows.length; i++) {



		        rows[i].language = g_dictionary_g_language();
		        rows[i].type = 'g';
		        rows[i].menu_id = -1; 
		        var jsonStr = JSON.stringify(rows[i]);

		        com.ajax({
		            type: 'POST', url: km.model.urls[url], data: rows[i], success: function (result) {

		                if (i == rows.length - 1)
		                    km.dictionary_g.reload();
		            }
		        });

		        for (var j = dictionary_gupdatedRows.length - 1; j > 0  ; j--) {
		            var data = $('#dictionary_g').datagrid('getData');
		            var k = dictionary_gupdatedRows[j];
		            var tmpstr = JSON.stringify(data.rows[k])
		            if (jsonStr == tmpstr)
		                dictionary_gupdatedRows.splice(j, 1);
		        }

		    }
		}

		function accept_dictionary_g() {
		    if (dictionary_gendEditing()) {


		        if ($("#dictionary_g").datagrid('getChanges').length) {
		            ////获取插入更改的行的集合
		            var inserted = $("#dictionary_g").datagrid('getChanges', "inserted");

		            dictionary_gSubmitChanges(inserted, "dictionary_insert");

		            var updated = $("#dictionary_g").datagrid('getChanges', "updated");

		            dictionary_gSubmitChanges(updated, "dictionary_update");

		        }
		        for (var j = dictionary_gupdatedRows.length - 1; j >= 0  ; j--) {

		            var data = $('#dictionary_g').datagrid('getData');
		            var k = dictionary_gupdatedRows[j];
		            var rows = data.rows;



		            data.rows[k].type = 'g';
		            data.rows[k].language = g_dictionary_g_language();
		            var tmpstr = JSON.stringify(data.rows[k])
		            com.ajax({
		                type: 'POST', url: km.model.urls["dictionary_update"], data: data.rows[k], success: function (result) {
		                    //     AfterEdit(result);

		                    if (j == 0)
		                        km.dictionary_g.reload();
		                }
		            });
		            dictionary_gupdatedRows = new Array();
		        }

		        return;

		    }

		    $('#dictionary_g').datagrid('acceptChanges');

		}
		function reject_dictionary_g() {
		    $('#dictionary_g').datagrid('rejectChanges');
		    editIndexdictionary_g = undefined;
		}
		function getChanges_dictionary_g() {
		    var rows = $('#dictionary_g').datagrid('getChanges');
		    alert(rows.length + ' rows are changed!');
		}






		//------------------------------------------------------------------------------ 
		//       时间： 2018-04-22
		//       作者： fdsaf   
		//			 用于设置登陆和主页文字  
		//------------------------------------------------------------------------------  



		var dictionary_homeupdatedRows = new Array();



		function dictionary_homeshowValue(value, data, type, index, col) {
		    var tmp = "";
		    var a = data.split(" ");
		    for (var i = 0; i < a.length; i++) {

		        var v = a[i].split("=")[0];
		        var t = a[i].split("=")[1];
		        if (type == "checkbox") {

		            var str = "dictionary_homeChangeValue2(this,\"" + col + "\"," + index + ",\"" + v + "\")";
		            if (("," + value + ",").indexOf("," + v + ",") >= 0)
		                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\' onchange='" + str + "' checked >&nbsp;" + t;
		            else
		                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\'  onchange='" + str + "' >&nbsp;" + t;


		        } else if (type == "radio") {

		            var str = "dictionary_homeChangeValue(this,\"" + col + "\"," + index + ",\"" + v + "\")";
		            if (value == undefined && i == 0) {
		                console.log(index);
		                dictionary_homeChangeValue(null, col, index, v);
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

		function dictionary_homeChangeValue2(me, col, index, v) {
		    // var row = km.dictionary_home.getSelectedRow();

		    var data = $('#dictionary_home').datagrid('getData');
		    // var k = dictionary_homeupdatedRows[j];
		    var row = data.rows[index]

		    var cs = $("input[name='" + col + index + "']:checked");
		    var p = [];
		    cs.each(function () {
		        //  console.log(this.value);
		        p.push(this.value);
		    });

		    row[col] = p;

		    dictionary_homepushChangedRow(index);
		    // console.log(km.dictionary_home.getSelectedRow());
		}
		function dictionary_homepushChangedRow(index) {
		    for (var i = 0; i < dictionary_homeupdatedRows.length; i++) {
		        if (dictionary_homeupdatedRows[i] == index)
		            return;
		    }
		    dictionary_homeupdatedRows.push(index)
		}

		function dictionary_homeChangeValue(me, col, index, v) {
		    // var row = km.dictionary_home.getSelectedRow();

		    var data = $('#dictionary_home').datagrid('getData');
		    // var k = dictionary_homeupdatedRows[j];
		    var row = data.rows[index]
		    row[col] = v;
		    dictionary_homepushChangedRow(index);
		}


		function dictionary_home_20_Init() {
		    km.dictionary_home.init();
		    if (km.dictionary_home.LoadData != undefined)
		        km.dictionary_home.LoadData();
		}


		var selecteddictionary_homeIndex = 0;



		km.dictionary_home = {
		    jq: null,
		    LoadData: function () {
		        var options = $('#dictionary_home').datagrid('options')
		        options.queryParams = {
		            _t: com.settings.timestamp(),
		            language: g_dictionary_g_language(),
		            type: 'c',
		            menu_id: 0
		        };
		        options.url = km.model.urls["dictionary_pager"];
		        $('#dictionary_home').datagrid(options);

		    },
		    init: function () {
		        this.jq = $("#dictionary_home").datagrid({
		            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
                     


		            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true, toolbar: '#tbdictionary_home', onClickRow: onClickRow_dictionary_home,
		            columns: [[
                                     { field: 'text', title: gDictionary["text"], width: 200, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },

                          { field: 'name', title: gDictionary["text code"], width: 200, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },

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


		var editIndexdictionary_home = undefined;
		function dictionary_homeendEditing() {
		    if (editIndexdictionary_home == undefined) { return true }
		    if ($('#dictionary_home').datagrid('validateRow', editIndexdictionary_home)) {

		        //需要手工修改
		        //	var ed = $('#dictionary_home').datagrid('getEditor', {index:editIndexdictionary_home,field:'productid'});
		        //	var productname = $(ed.target).combobox('getText');
		        //	$('#dictionary_home').datagrid('getRows')[editIndexdictionary_home]['productname'] = productname;
		        $('#dictionary_home').datagrid('endEdit', editIndexdictionary_home);


		        editIndexdictionary_home = undefined;
		        return true;
		    } else {
		        return false;
		    }
		}
		function onClickRow_dictionary_home(index) {
		    if (editIndexdictionary_home != index) {
		        if (dictionary_homeendEditing()) {
		            $('#dictionary_home').datagrid('selectRow', index)
							.datagrid('beginEdit', index);
		            editIndexdictionary_home = index;
		        } else {
		            $('#dictionary_home').datagrid('selectRow', editIndexdictionary_home);
		        }
		    }
		}
		function append_dictionary_home() {
		    if (dictionary_homeendEditing()) {
		        $('#dictionary_home').datagrid('appendRow', { status: 'P' });
		        editIndexdictionary_home = $('#dictionary_home').datagrid('getRows').length - 1;
		        $('#dictionary_home').datagrid('selectRow', editIndexdictionary_home)
						.datagrid('beginEdit', editIndexdictionary_home);
		    }
		}
		function removeit_dictionary_home() {
		    if (editIndexdictionary_home == undefined) { layer.msg(gDictionary["please_select"] ); return; }

		    var sRow = km.dictionary_home.getSelectedRow();
		    if (sRow == null) { layer.msg(gDictionary["please_select"]); return; }
		    //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg('此参数不可删除！'); return; }
		    var jsonParam = JSON.stringify(sRow);
		    com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {


		        for (var j = dictionary_homeupdatedRows.length - 1; j > 0  ; j--) {
		            var data = $('#dictionary_home').datagrid('getData');
		            var k = dictionary_homeupdatedRows[j];
		            var tmpstr = JSON.stringify(data.rows[k])
		            if (jsonParam == tmpstr)
		                dictionary_homeupdatedRows.splice(j, 1);
		        }

		        if (b) {
		            com.ajax({
		                url: km.model.urls["dictionary_delete"], data: sRow, success: function (result) {
		                    if (result.s) {
		                        com.message('s', result.message);

		                        $('#dictionary_home').datagrid('cancelEdit', editIndexdictionary_home)
                                        .datagrid('deleteRow', editIndexdictionary_home);
		                        editIndexdictionary_home = undefined;

		                        km.dictionary_home.LoadData();

		                    } else {
		                        com.message('e', result.message);
		                    }
		                }
		            });
		        }
		    });

		}

		function dictionary_homeSubmitChanges(rows, url) {

		    for (var i = 0; i < rows.length; i++) {


		        rows[i].type = 'c';
		        rows[i].menu_id=0;

		        var jsonStr = JSON.stringify(rows[i]);
                
		        com.ajax({
		            type: 'POST', url: km.model.urls[url], data: rows[i], success: function (result) {

		                if (i == rows.length - 1)
		                    km.dictionary_home.reload();
		            }
		        });

		        for (var j = dictionary_homeupdatedRows.length - 1; j > 0  ; j--) {
		            var data = $('#dictionary_home').datagrid('getData');
		            var k = dictionary_homeupdatedRows[j];
		            var tmpstr = JSON.stringify(data.rows[k])
		            if (jsonStr == tmpstr)
		                dictionary_homeupdatedRows.splice(j, 1);
		        }

		    }
		}

		function accept_dictionary_home() {
		    if (dictionary_homeendEditing()) {


		        if ($("#dictionary_home").datagrid('getChanges').length) {
		            ////获取插入更改的行的集合
		            var inserted = $("#dictionary_home").datagrid('getChanges', "inserted");

		            inserted.type = 'c';
		            inserted.menu_id = 0;
		            dictionary_homeSubmitChanges(inserted, "dictionary_insert");

		            var updated = $("#dictionary_home").datagrid('getChanges', "updated");

		            updated.type = 'c';
		            updated.menu_id = 0;
		            dictionary_homeSubmitChanges(updated, "dictionary_update");

		        }
		        for (var j = dictionary_homeupdatedRows.length - 1; j >= 0  ; j--) {

		            var data = $('#dictionary_home').datagrid('getData');
		            var k = dictionary_homeupdatedRows[j];
		            var rows = data.rows;



		            data.rows[k].type = 'c';
		            data.rows[k].menu_id = 0;

		            var tmpstr = JSON.stringify(data.rows[k])
		            com.ajax({
		                type: 'POST', url: km.model.urls["dictionary_update"], data: data.rows[k], success: function (result) {
		                    //     AfterEdit(result);

		                    if (j == 0)
		                        km.dictionary_home.reload();
		                }
		            });
		            dictionary_homeupdatedRows = new Array();
		        }

		        return;

		    }

		    $('#dictionary_home').datagrid('acceptChanges');

		}
		function reject_dictionary_home() {
		    $('#dictionary_home').datagrid('rejectChanges');
		    editIndexdictionary_home = undefined;
		}
		function getChanges_dictionary_home() {
		    var rows = $('#dictionary_home').datagrid('getChanges');
		    alert(rows.length + ' rows are changed!');
		}




		//------------------------------------------------------------------------------ 
		//       时间： 2018-04-22
		//       作者： fdsaf   
		//			 用于设置登陆和主页文字  
		//------------------------------------------------------------------------------  



		var dictionary_systemupdatedRows = new Array();



		function dictionary_systemshowValue(value, data, type, index, col) {
		    var tmp = "";
		    var a = data.split(" ");
		    for (var i = 0; i < a.length; i++) {

		        var v = a[i].split("=")[0];
		        var t = a[i].split("=")[1];
		        if (type == "checkbox") {

		            var str = "dictionary_systemChangeValue2(this,\"" + col + "\"," + index + ",\"" + v + "\")";
		            if (("," + value + ",").indexOf("," + v + ",") >= 0)
		                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\' onchange='" + str + "' checked >&nbsp;" + t;
		            else
		                tmp += "&nbsp;<input type='checkbox'  name='" + col + index + "'  id='" + col + index + i + "' value=\'" + v + "\'  onchange='" + str + "' >&nbsp;" + t;


		        } else if (type == "radio") {

		            var str = "dictionary_systemChangeValue(this,\"" + col + "\"," + index + ",\"" + v + "\")";
		            if (value == undefined && i == 0) {
		                console.log(index);
		                dictionary_systemChangeValue(null, col, index, v);
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

		function dictionary_systemChangeValue2(me, col, index, v) {
		    // var row = km.dictionary_system.getSelectedRow();

		    var data = $('#dictionary_system').datagrid('getData');
		    // var k = dictionary_systemupdatedRows[j];
		    var row = data.rows[index]

		    var cs = $("input[name='" + col + index + "']:checked");
		    var p = [];
		    cs.each(function () {
		        //  console.log(this.value);
		        p.push(this.value);
		    });

		    row[col] = p;

		    dictionary_systempushChangedRow(index);
		    // console.log(km.dictionary_system.getSelectedRow());
		}
		function dictionary_systempushChangedRow(index) {
		    for (var i = 0; i < dictionary_systemupdatedRows.length; i++) {
		        if (dictionary_systemupdatedRows[i] == index)
		            return;
		    }
		    dictionary_systemupdatedRows.push(index)
		}

		function dictionary_systemChangeValue(me, col, index, v) {
		    // var row = km.dictionary_system.getSelectedRow();

		    var data = $('#dictionary_system').datagrid('getData');
		    // var k = dictionary_systemupdatedRows[j];
		    var row = data.rows[index]
		    row[col] = v;
		    dictionary_systempushChangedRow(index);
		}


		function dictionary_system_20_Init() {
		    km.dictionary_system.init();
		    if (km.dictionary_system.LoadData != undefined)
		        km.dictionary_system.LoadData();
		}


		var selecteddictionary_systemIndex = 0;



		km.dictionary_system = {
		    jq: null,
		    LoadData: function () {
		        var options = $('#dictionary_system').datagrid('options')
		        options.queryParams = {
		            _t: com.settings.timestamp(),
		            language: g_dictionary_g_language(),
		            type: 's',
		            menu_id: -1
		        };
		        options.url = km.model.urls["dictionary_pager"];
		        $('#dictionary_system').datagrid(options);

		    },
		    init: function () {
		        this.jq = $("#dictionary_system").datagrid({
		            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',



		            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true, toolbar: '#tbdictionary_system', onClickRow: onClickRow_dictionary_system,
		            columns: [[
                                     { field: 'text', title: gDictionary["text"], width: 200, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },

                          { field: 'name', title: gDictionary["text code"], width: 200, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },

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


		var editIndexdictionary_system = undefined;
		function dictionary_systemendEditing() {
		    if (editIndexdictionary_system == undefined) { return true }
		    if ($('#dictionary_system').datagrid('validateRow', editIndexdictionary_system)) {

		        //需要手工修改
		        //	var ed = $('#dictionary_system').datagrid('getEditor', {index:editIndexdictionary_system,field:'productid'});
		        //	var productname = $(ed.target).combobox('getText');
		        //	$('#dictionary_system').datagrid('getRows')[editIndexdictionary_system]['productname'] = productname;
		        $('#dictionary_system').datagrid('endEdit', editIndexdictionary_system);


		        editIndexdictionary_system = undefined;
		        return true;
		    } else {
		        return false;
		    }
		}
		function onClickRow_dictionary_system(index) {
		    if (editIndexdictionary_system != index) {
		        if (dictionary_systemendEditing()) {
		            $('#dictionary_system').datagrid('selectRow', index)
							.datagrid('beginEdit', index);
		            editIndexdictionary_system = index;
		        } else {
		            $('#dictionary_system').datagrid('selectRow', editIndexdictionary_system);
		        }
		    }
		}
		function append_dictionary_system() {
		    if (dictionary_systemendEditing()) {
		        $('#dictionary_system').datagrid('appendRow', { status: 'P' });
		        editIndexdictionary_system = $('#dictionary_system').datagrid('getRows').length - 1;
		        $('#dictionary_system').datagrid('selectRow', editIndexdictionary_system)
						.datagrid('beginEdit', editIndexdictionary_system);
		    }
		}
		function removeit_dictionary_system() {
		    if (editIndexdictionary_system == undefined) { layer.msg(gDictionary["please_select"]); return; }

		    var sRow = km.dictionary_system.getSelectedRow();
		    if (sRow == null) { layer.msg(gDictionary["please_select"]); return; }
		    //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg('此参数不可删除！'); return; }
		    var jsonParam = JSON.stringify(sRow);
		    com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {


		        for (var j = dictionary_systemupdatedRows.length - 1; j > 0  ; j--) {
		            var data = $('#dictionary_system').datagrid('getData');
		            var k = dictionary_systemupdatedRows[j];
		            var tmpstr = JSON.stringify(data.rows[k])
		            if (jsonParam == tmpstr)
		                dictionary_systemupdatedRows.splice(j, 1);
		        }

		        if (b) {
		            com.ajax({
		                url: km.model.urls["dictionary_delete"], data: sRow, success: function (result) {
		                    if (result.s) {
		                        com.message('s', result.message);

		                        $('#dictionary_system').datagrid('cancelEdit', editIndexdictionary_system)
                                        .datagrid('deleteRow', editIndexdictionary_system);
		                        editIndexdictionary_system = undefined;

		                        km.dictionary_system.LoadData();

		                    } else {
		                        com.message('e', result.message);
		                    }
		                }
		            });
		        }
		    });

		}

		function dictionary_systemSubmitChanges(rows, url) {

		    for (var i = 0; i < rows.length; i++) {


		        rows[i].type = 's';
		        rows[i].menu_id = -1;

		        var jsonStr = JSON.stringify(rows[i]);

		        com.ajax({
		            type: 'POST', url: km.model.urls[url], data: rows[i], success: function (result) {

		                if (i == rows.length - 1)
		                    km.dictionary_system.reload();
		            }
		        });

		        for (var j = dictionary_systemupdatedRows.length - 1; j > 0  ; j--) {
		            var data = $('#dictionary_system').datagrid('getData');
		            var k = dictionary_systemupdatedRows[j];
		            var tmpstr = JSON.stringify(data.rows[k])
		            if (jsonStr == tmpstr)
		                dictionary_systemupdatedRows.splice(j, 1);
		        }

		    }
		}

		function accept_dictionary_system() {
		    if (dictionary_systemendEditing()) {


		        if ($("#dictionary_system").datagrid('getChanges').length) {
		            ////获取插入更改的行的集合
		            var inserted = $("#dictionary_system").datagrid('getChanges', "inserted");

		            inserted.type = 's';
		            inserted.menu_id = -1;
		            dictionary_systemSubmitChanges(inserted, "dictionary_insert");

		            var updated = $("#dictionary_system").datagrid('getChanges', "updated");

		            updated.type = 's';
		            updated.menu_id = -1;
		            dictionary_systemSubmitChanges(updated, "dictionary_update");

		        }
		        for (var j = dictionary_systemupdatedRows.length - 1; j >= 0  ; j--) {

		            var data = $('#dictionary_system').datagrid('getData');
		            var k = dictionary_systemupdatedRows[j];
		            var rows = data.rows;



		            data.rows[k].type = 's';
		            data.rows[k].menu_id = -1;

		            var tmpstr = JSON.stringify(data.rows[k])
		            com.ajax({
		                type: 'POST', url: km.model.urls["dictionary_update"], data: data.rows[k], success: function (result) {
		                    //     AfterEdit(result);

		                    if (j == 0)
		                        km.dictionary_system.reload();
		                }
		            });
		            dictionary_systemupdatedRows = new Array();
		        }

		        return;

		    }

		    $('#dictionary_system').datagrid('acceptChanges');

		}
		function reject_dictionary_system() {
		    $('#dictionary_system').datagrid('rejectChanges');
		    editIndexdictionary_system = undefined;
		}
		function getChanges_dictionary_system() {
		    var rows = $('#dictionary_system').datagrid('getChanges');
		    alert(rows.length + ' rows are changed!');
		}

 
 
