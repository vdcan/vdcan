
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-02-06
//       作者： 蔡捷2   
//			 用于测试模板 
//       文件： user_test_edit.cshtml 页面文件 
//       文件： user_test_edit.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/dev/ViewJS/user_test_edit.js
说明：测试(user_test_edit)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
     department_edit_6_Init();
 
 
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
                $("#"+id).val($(this).combobox('getValues'));  
                     
                //设置选中值所对应的复选框为选中状态  
                var el = opts.finder.getEl(this, row[opts.valueField]);  
                el.find('input.combobox-checkbox')._propAttr('checked', true);  
            }
            options.onUnselect =function (row) {//不选中一个选项时调用  
                var opts = $(this).combobox('options');  
                //获取选中的值的values  
                $("#"+id).val($(this).combobox('getValues'));  
                    
                var el = opts.finder.getEl(this, row[opts.valueField]);  
                el.find('input.combobox-checkbox')._propAttr('checked', false);  
            }
            }
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
//       时间： 2018-02-06
//       作者： 蔡捷2   
//			 test  
//------------------------------------------------------------------------------  

function  department_edit_6_Init(){
	km.department_edit.init();
}

var selecteddepartment_editIndex = 0;
km.department_edit= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#department_edit").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
            url: km.model.urls["department_edit_pager"],
               	  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[
   
            
 	                { field: 'add_on', title: '创建日期', width: 80, align: 'center', sortable: true },
                { field: 'add_by', title: '创建人', width: 80, align: 'center', sortable: true },
                { field: 'department_name', title: '部门名称', width: 80, align: 'center', sortable: true },
                { field: 'description', title: '描述', width: 80, align: 'center', sortable: true },
                { field: 'roles', title: '角色', width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {
              
                                    return showValue(value,'0=测试 1=生产 2=维护','checkbox' );
                               }},
                                                { field: 'type', title: '类型', width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {
              
                                    return showValue(value,'1=私人 0=公家','radio' );
                               }},
                                     {
                                field: 'id', title: '<a href="#" onclick="adddepartment_edit( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
                                    return '<a href="#" onclick="editdepartment_edit(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deletedepartment_edit(' + index + ')">删除</a>';
    }  },
             
            ]],
            onClickRow: function (index, row) {
            
                selecteddepartment_editIndex = index;
                km.department_edit.selectedIndex = index;
                km.department_edit.selectedRow = row; 
                
                if (km.department_edit.selectedRow)
                    km.set_mode_department_edit('show');
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selecteddepartment_editIndex)
             		selecteddepartment_editIndex =0
              $("#department_edit").datagrid("selectRow", selecteddepartment_editIndex);
             }
                km.department_edit.selectedRow = km.department_edit.getSelectedRow(); 
            
                if (km.department_edit.selectedRow)
                  km.set_mode_department_edit('show');
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
    do_refresh: function () { km.department_edit.reload(); },
     do_add: function () {

        km.set_mode_department_edit('add');

    },
    do_edit: function () {

        if (km.department_edit.selectedRow == null) { layer.msg('请选择一条记录！'); return; }
        km.set_mode_department_edit('edit');


    },
    do_delete: function () {
        var sRow = km.department_edit.getSelectedRow();
        if (sRow == null) { layer.msg('请选择一条记录！'); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg('此参数不可删除！'); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red">确定要删除【' + sRow.id + '】吗？ </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["department_edit_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.department_edit.reload();
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
                    var jsonObject = $("#department_edit_content").serializeJson();
                        
     
     
             
                        	  if (jsonObject.roles == undefined)
                    jsonObject.roles = "";
                    
                       
         
              
     
                    var jsonStr = JSON.stringify(jsonObject);
                       if (!$("#department_edit_content").form('validate')) {
                        layer.msg('输入数据有错误，请纠正后再存。');
                        return false;
                    }
        //添加自定义判断
                    //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', '参数代码或参数名称不能为空！'); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            com.ajax({
                                type: 'POST', url: km.model.urls["department_edit_update"], data: jsonStr, success: function (result) {
                                    AfterEditdepartment_edit(result);
                                }
                            });
                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["department_edit_insert"], data: jsonStr, success: function (result) {
                                    AfterEditdepartment_edit(result);
                                }
                            });
                        }
                    }

 

    },
    do_search: function () {

    }
    ,
    do_undo: function () {
        var op_mode = km.department_edit.selectedRow == null ? 'clear' : 'show';
        km.set_mode_department_edit(op_mode);
    }
};


function AfterEditdepartment_edit(result) {
    if (result.s) {
        com.message('s', result.message);
        km.department_edit.reload();
        if (km.settings.op_mode == 'add') {
            km.department_edit.unselectAll();
            km.set_mode_department_edit('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.department_edit.selectRow(km.department_edit.selectedIndex);
            km.department_edit.selectedRow = $.extend(km.department_edit.selectedRow, jsonObject);
            km.set_mode_department_edit('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode_department_edit = function (op_mode) {
    km.settings.op_mode = op_mode;
    $('#km_toolbar').show();
    $('#km_toolbar_2').hide();
    com.mask($('#west_panel'), false);
   // $('#user_tabs').tabs('enableTab', 1);
   // $('#user_tabs').tabs('enableTab', 2);
    $('.form_content .easyui-combobox').combobox('readonly', true);
    $('.form_content .easyui-combotree').combotree('readonly', true);
    $('.form_content .easyui-textbox').textbox('readonly', true);
    $('.form_content .easyui-numberbox').numberbox('readonly', true);

    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.department_edit.selectedRow));
      var sRow = km.department_edit.selectedRow;
               
                 	  if (sRow.roles.indexOf(",") > 0)
                    sRow.roles=sRow.roles.split(",");
                    
                       
         
              
        
        
        $('#department_edit_content').form('load', sRow);
     //   km.orgcombotree.jq.combotree('setValue', km.department_edit.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
        
      //  $('#user_tabs').tabs('disableTab', 1);
      //  $('#user_tabs').tabs('disableTab', 2);
      //  $('#user_tabs').tabs('select', 0);
        
        
        $('.form_content .easyui-combobox').combobox('readonly', false);
        $('.form_content .easyui-combotree').combotree('readonly', false);
        $('.form_content .easyui-textbox').textbox('readonly', false);
        $('.form_content .easyui-numberbox').numberbox('readonly', false);
        
        $('#department_edit_content').form('clear');
        
                  $('#TPL_add_by').textbox('readonly', true);
          
      //  $('#TPL_id').val(0);
        //$('#TPL_Enabled').combobox('setValue', 1);
        //$('#TPL_UserType').combobox('setValue', 3);
        //$('#TPL_IsSingleLogin').combobox('setValue', 1);
        //$('#TPL_Sex').combobox('setValue', '男');
        //$('#TPL_Sort').numberbox('setValue', 888);

    } else if (op_mode == 'edit') {
        //alert($('.form_content .easyui-text'));
        $('.form_content .easyui-combobox').combobox('readonly', false);
        $('.form_content .easyui-combotree').combotree('readonly', false);
        $('.form_content .easyui-textbox').textbox('readonly', false);
        $('.form_content .easyui-numberbox').numberbox('readonly', false);
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
                   $('#TPL_add_on').textbox('readonly', true);
               
        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#department_edit_content').form('clear');
        
    }
}





