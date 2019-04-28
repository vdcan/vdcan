
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-01-10
//       作者： 蔡捷   
//			 用户管理 
//       文件： admin_user.cshtml 页面文件 
//       文件： admin_user.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas//dev/ViewJS/admin_user.js
说明：用户管理(admin_user)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
    xx_User_6_Init();
    user_role_9_Init();
    km.xx_Department.init();

    
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





km.xx_Department = {
    jq: null,
    treedata: null,
    selectedNode: null,
    selectedData: null,
    setRowData: function (node) {
        //var rowData = {
        //    OrgCode: node.attributes.org_code,
        //    ParentOrgCode: node.attributes.org_pcode,
        //    OrgName: node.text,
        //    Orgcompany_code: node.attributes.org_fcode,//部门用
        //    Orgtype: node.attributes.org_type,//1=总部 2=分部 9=部门
        //    Orgsort: node.attributes.org_sort,
        //    Orgenabled: node.attributes.org_enabled,
        //    Orgremark: node.attributes.org_remark,
        //};
        km.xx_Department.selectedData = node;
    },
    init: function () {
        this.treedata = null;
        this.selectedNode = null;
        this.selectedData = null;
        this.jq = $("#xx_Department").tree({
            method: 'GET', animate: true,
            url: km.model.urls["department_tree"],
            loadFilter: function (data) {
                var d = utils.copyProperty(data.rows || data, ["id", "icon_class"], ["_id", "iconCls"], false);
                var resultData = utils.toTreeData(d, '_id', 'pid', "children");
                return resultData;
            },
            formatter: function (node) {
                return node.text;
            },
            onClick: function (node) {// 在用户点击的时候提示
                //alert(JSON.stringify(node)); 
                km.xx_Department.selectedNode = node;
                km.xx_Department.setRowData(node);
                //  km.set_mode_xx_Department('show');
                km.xx_User.LoadData();
            },
            onLoadSuccess: function (node, data) { // $("#div_content").html(JSON.stringify(data));
                km.xx_Department.treedata = data;
                //km.xx_Department.jq.tree('collapseAll');
            }



        });//end tree init
    }
};




 
 
//------------------------------------------------------------------------------ 
//       时间： 2018-01-10
//       作者： 蔡捷   
//			 用户  
//------------------------------------------------------------------------------  

function  xx_User_6_Init(){
	km.xx_User.init();
}

var selectedxx_UserIndex = 0;
km.xx_User= {
    jq: null,
     	             		
    LoadData: function () { 
					var options = $('#xx_User').datagrid('options')
					
					options.url = km.model.urls["xx_User_pager"]; 
					options.queryParams = { _t: com.settings.timestamp(), department_id: km.xx_Department.selectedData.id, };
					$('#xx_User').datagrid(options);
                
    },
               	             	
    init: function () {
        this.jq = $("#xx_User").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
             	             		
            queryParams: { _t: com.settings.timestamp(), 	department_id:0,     	}, 
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[
            
 	               { field: 'id', title: gDictionary["id"], width: 80, align: 'center', sortable: true },
                            { field: 'user_code', title: gDictionary["user code"], width: 80, align: 'center', sortable: true },
                            { field: 'real_name', title: gDictionary["name"], width: 80, align: 'center', sortable: true },
                           // { field: 'spell', title: gDictionary["spell"], width: 80, align: 'center', sortable: true },
                          //  { field: 'sex', title: gDictionary["sex"], width: 80, align: 'center', sortable: true },
                          //  { field: 'phone', title: gDictionary["phone"], width: 80, align: 'center', sortable: true },
                          //  { field: 'email', title: gDictionary["email"], width: 80, align: 'center', sortable: true },
                            { field: 'add_by', title: gDictionary["add_by"], width: 80, align: 'center', sortable: true },
                            { field: 'add_on', title: gDictionary["add_on"], width: 80, align: 'center', sortable: true },
                 
            ]],
            onClickRow: function (index, row) {
            
                selectedxx_UserIndex = index;
                km.xx_User.selectedIndex = index;
                km.xx_User.selectedRow = row; 
                
                if (km.xx_User.selectedRow)
                    km.set_mode_xx_User('show');
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedxx_UserIndex)
             		selectedxx_UserIndex =0
              $("#xx_User").datagrid("selectRow", selectedxx_UserIndex);
             }
                km.xx_User.selectedRow = km.xx_User.getSelectedRow(); 
            
                if (km.xx_User.selectedRow)
                  km.set_mode_xx_User('show');
                  }
        });//end grid init
    },
    reload: function (queryParams) {
    		             		
     this.LoadData();
             	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};



/*工具栏权限按钮事件*/
km.toolbar = {
    do_refresh: function () { km.xx_User.reload(); },
     do_add: function () {
         var sRow = km.xx_Department.selectedData;
         if (sRow == null) { layer.msg(gDictionary["please select a department"]); return; }
        km.set_mode_xx_User('add');

    },
    do_edit: function () {

        if (km.xx_User.selectedRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        km.set_mode_xx_User('edit');


    },
    do_resetpwd: function ()
{

        var jsonStr ={ user_code:km.xx_User.selectedRow.user_code ,
        }
        com.ajax({
            type: 'POST', url: km.model.urls["reset_pwd"], data: jsonStr, success: function (result) {
                if (result.s) {
                    com.message('s', result.message);
                }else {
                    com.message('e', result.message);
                }

            }});
    } ,
    do_delete: function () {
        var sRow = km.xx_User.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam =  sRow ;
        com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["xx_User_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.xx_User.reload();
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
                    var jsonObject = $("#xx_User_content").serializeJson();
                    jsonObject.department_id = km.xx_Department.selectedData.id;//替换该值     
                    var jsonStr = jsonObject ;
                       if (!$("#xx_User_content").form('validate')) {
                        layer.msg(gDictionary["data is incorrect, please try again"]);
                        return false;
                    }
        //添加自定义判断
                    //if (jsonObject.param_code == "" || jsonObject.param_value == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            com.ajax({
                                type: 'POST', url: km.model.urls["xx_User_update"], data: jsonStr, success: function (result) {
                                    AfterEditxx_User(result);
                                }
                            });
                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["xx_User_insert"], data: jsonStr, success: function (result) {
                                    AfterEditxx_User(result);
                                }
                            });
                        }
                    }



    },
    do_search: function () {

    }
    ,
    do_undo: function () {
        var op_mode = km.xx_User.selectedRow == null ? 'clear' : 'show';
        km.set_mode_xx_User(op_mode);
    }
};


function AfterEditxx_User(result) {
    if (result.s) {
        com.message('s', result.message);
        km.xx_User.reload();
        if (km.settings.op_mode == 'add') {
            km.xx_User.unselectAll();
            km.set_mode_xx_User('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.xx_User.selectRow(km.xx_User.selectedIndex);
            km.xx_User.selectedRow = $.extend(km.xx_User.selectedRow, jsonObject);
            km.set_mode_xx_User('show');
        }

       

    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode_xx_User = function (op_mode) {
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
        //console.info(JSON.stringify(km.xx_User.selectedRow));
        $('#xx_User_content').form('load', km.xx_User.selectedRow);
        km.user_role.LoadData();
     //   km.orgcombotree.jq.combotree('setValue', km.xx_User.selectedRow.DepartmentCode);
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
        
        $('#xx_User_content').form('clear');
        
                  $('#TPL_password').textbox('readonly', true);
                    $('#TPL_department_id').textbox('readonly', true);
                    $('#TPL_add_by').textbox('readonly', true);
                    $('#TPL_add_on').textbox('readonly', true);
          
      //  $('#TPL_id').val(0);
        //$('#TPL_enabled').combobox('setValue', 1);
        //$('#TPL_user_type').combobox('setValue', 3);
        //$('#TPL_IsSingleLogin').combobox('setValue', 1);
        //$('#TPL_sex').combobox('setValue', gDictionary["male"]);
        //$('#TPL_sort').numberbox('setValue', 888);

    } else if (op_mode == 'edit') {
        //alert($('.form_content .easyui-text'));
        $('.form_content .easyui-combobox').combobox('readonly', false);
        $('.form_content .easyui-combotree').combotree('readonly', false);
        $('.form_content .easyui-textbox').textbox('readonly', false);
        $('.form_content .easyui-numberbox').numberbox('readonly', false);
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
              
        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#xx_User_content').form('clear');
        
    }
}


 
//------------------------------------------------------------------------------ 
//       时间： 2018-01-16
//       作者： 蔡捷2   
//			 用户角色  
//------------------------------------------------------------------------------  

function  user_role_9_Init(){
    km.user_role.init();
}

var selecteduser_roleIndex = 0;
km.user_role= {
    jq: null,
     	             		
    LoadData: function () { 
        var options = $('#user_role').datagrid('options')
        options.queryParams= { _t: com.settings.timestamp(), 	user_id:km.xx_User.getSelectedRow().id     	}
        options.url = km.model.urls["user_role_pager_check"]; 
        $('#user_role').datagrid(options);
                
    },
               	             	
    init: function () {
        this.jq = $("#user_role").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
             	             		
            queryParams: { _t: com.settings.timestamp(), 	user_id:0,     	}, 
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[
            			{
            			    field: 'checked', title: ' ', width: 10,
            			    formatter: function (value, rec, rowIndex) {
            			        if (value == 0)
            			            return "<input type=\"checkbox\"  name=\"PD\" value=\"" + rec.id    + "\">";
            			    else
                                    return "<input type=\"checkbox\" checked='checked'  name=\"PD\" value=\"" + rec.id +   "\" >";
            			    }
            			},
 	             //   { field: 'user_id', title: gDictionary["user code"], width: 80, align: 'center', sortable: true },
                            { field: 'role_name', title: gDictionary["role"], width: 80, align: 'left', sortable: false },
                 
            ]],
            onClickRow: function (index, row) {
            
                selecteduser_roleIndex = index;
                km.user_role.selectedIndex = index;
                km.user_role.selectedRow = row;  
                if(                km.user_role.selectedRow ){
                	
                }
            },
            onLoadSuccess: function (data) {
            
                $("input[name='PD']").unbind().bind("click", function () {
                    // alert($(this).attr("value") + "," + ($(this).attr('checked')));

                    Setuser_role($(this).attr("value"));
                    return;


                });


                if (data.rows.length >0){
            
                    if (data.rows.length <= selecteduser_roleIndex)
                        selecteduser_roleIndex =0
                    $("#user_role").datagrid("selectRow", selecteduser_roleIndex);
                }
                km.user_role.selectedRow = km.user_role.getSelectedRow(); 
                if(                km.user_role.selectedRow ){
                	
                }
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

function Setuser_role(id) {



    var jsonParam =  { uid: km.xx_User.getSelectedRow().id, rid: id } ;
    com.ajax({
        type: 'POST', url: km.model.urls["user_role_check"], data: jsonParam, success: function (result) {
            //  alert(result);
            //  LoadOptions();

            com.message('s', "更新成功!");
        }
    });
}






