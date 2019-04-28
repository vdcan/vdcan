
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-01-10
//       作者： 蔡捷   
//			 部门管理,树状结构. 
//       文件： admin_department.cshtml 页面文件 
//       文件： admin_department.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas//dev/ViewJS/admin_department.js
说明：部门管理(admin_department)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
     xx_Department_6_Init();
    
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



 
 
//------------------------------------------------------------------------------ 
//       时间： 2018-01-10
//       作者： 蔡捷   
//			 部门  
//------------------------------------------------------------------------------  

function  xx_Department_6_Init(){
	km.xx_Department.init();
}



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
                km.set_mode_xx_Department('show');
            },
            onLoadSuccess: function (node, data) { // $("#div_content").html(JSON.stringify(data));
                km.xx_Department.treedata = data;
                //km.xx_Department.jq.tree('collapseAll');
            }



        });//end tree init
    }
};
 
 


/*工具栏权限按钮事件*/
km.toolbar = {
    do_refresh: function () { km.xx_Department.reload(); },
    do_add: function () {
        var sRow = km.xx_Department.selectedData;
         if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        km.set_mode_xx_Department('add');

    },
    do_edit: function () {

        if (km.xx_Department.selectedData == null) { layer.msg(gDictionary["please select one record"]); return; }
        km.set_mode_xx_Department('edit');


    },
    do_delete: function () {
        var sRow = km.xx_Department.selectedData;
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam =  sRow ;
        com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["xx_Department_delete"], data: jsonParam, success: function (result) {
                        AfterEditxx_Department(result);
                         
                    }
                });
            }
        });
    },
    do_search: function () { },
    
    do_save: function () {

                    var flagValid = true;
                    var jsonObject = $("#xx_Department_content").serializeJson();
                    var sRow = km.xx_Department.selectedData;
                    jsonObject.parent_id = sRow.id;

                    var jsonStr = jsonObject ;
                    //alert(jsonStr);
                    //return;
                       if (!$("#xx_Department_content").form('validate')) {
                        layer.msg(gDictionary["data is incorrect, please try again"]);
                        return false;
                    }
        //添加自定义判断
                    //if (jsonObject.param_code == "" || jsonObject.param_value == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            com.ajax({
                                type: 'POST', url: km.model.urls["xx_Department_update"], data: jsonStr, success: function (result) {
                                    AfterEditxx_Department(result);
                                }
                            });
                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["xx_Department_insert"], data: jsonStr, success: function (result) {
                                    AfterEditxx_Department(result);
                                }
                            });
                        }
                    }


        var op_mode = km.xx_Department.selectedRow == null ? 'clear' : 'show';
        km.set_mode_xx_Department(op_mode);

    },
    do_search: function () {

    }
    ,
    do_undo: function () {
        var op_mode = km.xx_Department.selectedRow == null ? 'clear' : 'show';
        km.set_mode_xx_Department(op_mode);
    }
};


function AfterEditxx_Department(result) {
    if (result.s) {
        com.message('s', result.message);
        
            $("#xx_Department").tree("reload")


    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode_xx_Department = function (op_mode) {
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
        //console.info(JSON.stringify(km.xx_Department.selectedRow));
        $('#xx_Department_content').form('load', km.xx_Department.selectedData);
     //   km.orgcombotree.jq.combotree('setValue', km.xx_Department.selectedRow.DepartmentCode);
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
        
        $('#xx_Department_content').form('clear');
        
                  $('#TPL_parent_id').textbox('readonly', true);
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
        $('#xx_Department_content').form('clear');
        
    }
}





