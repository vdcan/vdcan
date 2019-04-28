
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-17
//       作者： fdsaf   
//			 复杂查询 
//       文件： search_popup.cshtml 页面文件 
//       文件： search_popup.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/dev/ViewJS/search_popup.js
说明：复杂查询(search_popup)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
     test_user_3_Init();
 
 
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
//       时间： 2018-03-17
//       作者： fdsaf   
//			   
//------------------------------------------------------------------------------  

function  test_user_3_Init(){
	km.test_user.init();
	km.test_user.LoadData();
	 $('._easyui-combobox').each(function (index, element) {
        var opstr1 = $(this).attr("data-options");
        var u = $(this).attr("url2")
        if (u != undefined) { 
            $(this).attr("data-options", opstr1 + ",url:'" + km.model.urls[u] + "'");

        }

    });
//	km.test_user_search.init();
	// search_test_user() ;
}


var gCompareData =[
                                                        { 'id': 'gt', 'text': '>' },
                                                        { 'id': 'lt', 'text': '<' },
                                                        { 'id': '=', 'text': '=' },

                                                        { 'id': 'like', 'text': '包含' },
                                                        { 'id': 'not like', 'text': '不包含' },
                                                        { 'id': '=', 'text': '完全包含' }
];



var gOrAndData = [
                                             { 'id': 'or', 'text': '或者' },
                                             { 'id': 'and', 'text': '并且' } 
];


var gColumnData	=[
{ 'id': 'id'  , 'text': ''   , 'type': 'int'   }
 , { 'id': 'add_on'  , 'text': '创建日期'   , 'type': 'datetime'   }
 , { 'id': 'add_by'  , 'text': '创建人'   , 'type': 'int'   }
 , { 'id': 'user_name'  , 'text': '用户名'   , 'type': 'nvarchar'   }
 , { 'id': 'password'  , 'text': '口令'   , 'type': 'nvarchar'   }
		];
		
var selectedtest_userIndex = 0;
km.test_user= {
    jq: null,
     	             		
    LoadData: function () { 
					var options = $('#test_user').datagrid('options')
					options.queryParams={_t: com.settings.timestamp(),
					email:'',name:'',department_id:0,xml:'',};
					options.url = km.model.urls["test_user_query"]; 
					$('#test_user').datagrid(options);
                
    },
               	             	
    init: function () {
        this.jq = $("#test_user").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	             		 
             		   
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[
            
   
            
 	                { field: 'add_on', title: '创建日期', width: 80, align: 'center', sortable: true },
                { field: 'add_by', title: '创建人', width: 80, align: 'center', sortable: true },
                { field: 'user_name', title: '用户名', width: 80, align: 'center', sortable: true },
                { field: 'password', title: '口令', width: 80, align: 'center', sortable: true },
                { field: 'email', title: 'email', width: 80, align: 'center', sortable: true },
                { field: 'name', title: '姓名', width: 80, align: 'center', sortable: true },
                { field: 'department_id', title: '部门编号', width: 80, align: 'center', sortable: true },
             
            ]],
            onClickRow: function (index, row) {
            
                selectedtest_userIndex = index;
                km.test_user.selectedIndex = index;
                km.test_user.selectedRow = row;  
                if(                km.test_user.selectedRow ){
                	
                }
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedtest_userIndex)
             		selectedtest_userIndex =0
              $("#test_user").datagrid("selectRow", selectedtest_userIndex);
             }
                km.test_user.selectedRow = km.test_user.getSelectedRow(); 
                if(                km.test_user.selectedRow ){
                	
                }
             }
        });//end grid init
    },
    reload: function (queryParams) {
       	             		
     this.LoadData();
             	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


 
 
 /*
 for searching
 */
 
 
var selectedtest_user_searchIndex = 0;
km.test_user_search= {
    jq: null, 
             
             	
    init: function (win) {
        this.jq = win.find("#test_user_search").datagrid({
            fit: false, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',             	 
            //pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,
            fitColumns:true, 
            columns: [[

				{field: 'orand', title: '是否同时满足', width: 80, align: 'left', sortable: false,
					formatter: function (value, row, index) {
						for (var i = 0; i < gOrAndData.length; i++)
						{
						if (gOrAndData[i].id == value)
						return gOrAndData[i].text;
						}
						return "";
					} , 
					editor: {
						type: 'combobox',
						options: {
							valueField: 'id', textField: 'text', editable: true, hasDownArrow: true, panelHeight: 200,
							data: gOrAndData,
						}
					}
				},    
                                            
				{field: 'column_name', title: '列名', width: 280, align: 'left', sortable: false,
					formatter: function (value, row, index) {
						for (var i = 0; i < gColumnData.length; i++)
						{
						if (gColumnData[i].id == value)
						return gColumnData[i].text;
						}
						return "";
					} , 
					editor: {
						type: 'combobox',
						options: {
						valueField: 'id', textField: 'text', editable: true, hasDownArrow: true, panelHeight: 200,
						data: gColumnData,
					}
				}
				},
				{field: 'compare', title: '比较', width: 80, align: 'left', sortable: false,
						formatter: function (value, row, index) {
							for (var i = 0; i < gCompareData.length; i++)
							{
							if (gCompareData[i].id == value)
							return gCompareData[i].text;
							}
							return "";
						} , 
						editor: {
							type: 'combobox',
							options: {
							valueField: 'id', textField: 'text', editable: true, hasDownArrow: true, panelHeight: 200,
							data: gCompareData,
						}
      }},    
			{field: 'value', title: '值', width: 280, align: 'left', sortable: false,
     
     			editor: {
			    type: 'validatebox',
			    options: {
			        required: true
			    }
			}
      },{
			    field: 'value2', title: '', width: 80, align: 'left', sortable: false, formatter: function (v, r, i) {
			        return '<a href="javascript:removeit_test_user_search('+i+')">删除';
			    }
			}, 
                                                                                      
            ]],
            onLoadSuccess: function () { }
        });//end grid init
    } ,
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};
		 
		
		
var xml_json = '';

		function accept_test_user_search(win){
		  xml_json = '';
		    var data = win.find('#test_user_search').datagrid('getData');
		    //alert('总数据量:'+data.total)
		    for (var i = 0; i < data.total; i++) {

		    win.find('#test_user_search').datagrid('endEdit', i);
		    }  
            
        var inserted = win.find('#test_user_search').datagrid('getRows');
            
            for (var i = 0; i < inserted.length; i++) {
            	
            if (inserted[i].orand == "")
                inserted[i].orand = "and";
       xml_json += '<item column_name="' + inserted[i].column_name + '" value= "' + inserted[i].value + '" compare= "' + inserted[i].compare + '" orand= "' + inserted[i].orand + '"/>\r\n';
         
            }  
		} 
  

function CreateXML(xml_sql) {

    var xml = "<root>";

    xml += xml_sql;
    xml += "</root>"; 
    xml = xml.replaceAll(">", "&gt").replaceAll("<", "&lt");
    return xml
}
 
 
if (km.toolbar == undefined)
    km.toolbar = {};


/*工具栏权限按钮事件*/
km.toolbar.do_search= function () {  
    	
    	
        $('#test_user_dialog').html($('#test_user_dialog').html().replaceAll("_easyui", "easyui"));
        $('#test_user_dialog').dialog_ext({
            title: '查询', iconCls: 'icon-standard-zoom', top: 100, height: 400,
            onOpenEx: function (win) {
                //win.find('#TPL_Enabled').combobox('setValue', 1);
                //win.find('#TPL_Sort').numberbox('setValue', 100);
             //   gWin = win;
                km.test_user_search.init(win);
              //  $(".easyui-textbox3").textbox();

                win.find(".form_content").find("input[type='radio']").removeAttr("disabled");
                win.find(".form_content").find("input[type='checkbox']").removeAttr("disabled");
            },
            onClickButton: function (win) { //保存操作 
            //    if (editIndextest_user_search != undefined)
                    var data = win.find('#test_user_search').datagrid('getData');
                //alert('总数据量:'+data.total)
                for (var i = 0; i < data.total; i++) {
                if (!win.find('#test_user_search').datagrid('validateRow', i)) {
                  //  layer.msg('请填查询条件！')
                    com.message('e', '请填查询条件！');
                  //  alert('请填查询条件！')
                        return;
                    }
                }
                   
                var jsonObject = win.find("#test_user_content").serializeJson();
                
                
                
                         
                
               parent.add_test_user_search(false);
                accept_test_user_search(win);

                var xml_json2 = CreateXML(xml_json, win);

                jsonObject.xml = xml_json2;
                

                jsonObject._t = com.settings.timestamp();
                var options = $('#test_user').datagrid('options')

                options.url = km.model.urls["test_user_query"];
                options.queryParams = jsonObject;//{ _t: com.settings.timestamp(), crops_id: gcrops_id }; 
                $('#test_user').datagrid(options);

                win.dialog('destroy');
                
            }
        }); 
    	
    	 
  } 
