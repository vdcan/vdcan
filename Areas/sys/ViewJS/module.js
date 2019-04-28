
/*
//------------------------------------------------------------------------------
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       文件： xx_module.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/Dev/ViewJS/xx_module.js
说明：模块(xx_module)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    LoadTemplate();
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model();
    km.template.init();
    km.xx_modulegrid.init();
    //km.xx_templategrid.init();
  

    //如果没有动态combobox可删除
    $('.easyui-combobox').each(function (index, element) {
        var options = $(this).combobox('options')
        var u = $(this).attr("url2")

        if (u != undefined) {

            options.url = km.model.urls[u];
            $(this).combobox(options);
        }

    });


}


var gTemplates = {};
function LoadTemplate() {

    //com.ajax({
    //    url: "/dev/titan2/GetTemplate", success: function (result) {
    //        // console.log(result)
    //        // var menus = utils.toTreeData(result, 'id', 'parent_id', 'children');
    //        //    gTemplates = utils.toTreeData(result, 'path', 'my_path', 'children');

    //        //var d = utils.copyProperty(result, ["id", "icon_class", "menu_name"], ["id", "iconCls", "text"], false);

    //        var d = utils.copyProperty(result, ["path", "file_name"], ["id", "text"], false);
    //        gTemplates = utils.toTreeData(d, 'id', 'my_path', "children");

    //        km.xx_module_filesgrid.init(); 
    //        //   console.log(menus)
    //    }
    //});
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


//百度模板引擎使用 详情：http://tangram.baidu.com/BaiduTemplate/
km.template = {
    tpl_add_html: '',
    jq_add: null,
    initTemplate: function () {
        var data = { title: 'baiduTemplate', list: ['test data 1', 'test data 2', 'test data3'] };
        this.tpl_add_html = baidu.template('tpl_add', data);//使用baidu.template命名空间
        this.jq_add = $(this.tpl_add_html);
    },
    init: function () { this.initTemplate(); }
};



//var selectedxx_templateIndex = 0;
//km.xx_templategrid = {
//    jq: null,
//    init: function () {
//        this.jq = $("#xx_templategrid").datagrid({
//            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: '{id}',
//            queryParams: { _t: com.settings.timestamp(), keyword: "" }, url: km.model.urls["templatepagelist"],
//            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
//            columns: [[

// 	                { field: 'id', title: gDictionary["id"], width: 80, align: 'center', sortable: true },
//                            { field: 'template_name', title: gDictionary["template name"], width: 80, align: 'center', sortable: true },
//                            { field: 'description', title: gDictionary["description"], width: 80, align: 'center', sortable: true },
//                            //{ field: 'files', title: gDictionary["File"], width: 80, align: 'center', sortable: true },
//                            //{ field: 'html', title: 'html', width: 80, align: 'center', sortable: true },
//                            //{ field: 'areas', title: gDictionary["area"], width: 80, align: 'center', sortable: true },

//            ]],
//            onClickRow: function (index, row) {

//                selectedxx_templateIndex = index;
//                km.xx_templategrid.selectedIndex = index;
//                km.xx_templategrid.selectedRow = row;
//                //  km.rolegrid.setUserRoles(row);
//                Load_module();
//            },
//            onLoadSuccess: function (data) {

//                if (data.rows.length > selectedxx_templateIndex)
//                    $("#xx_templategrid").datagrid("selectRow", selectedxx_templateIndex);

//                km.xx_templategrid.selectedRow = km.xx_templategrid.getSelectedRow();
//                Load_module();
//            }
//        });//end grid init
//    },
//    reload: function (queryParams) {
//        var defaults = { _t: com.settings.timestamp() };
//        if (queryParams) { defaults = $.extend(defaults, queryParams); }
//        this.jq.datagrid('reload', defaults);
//    },
//    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
//};

//function Load_module() {

//    if (km.xx_templategrid.selectedRow) {
//        var options = $('#xx_modulegrid').datagrid('options')

//        options.url = km.model.urls["pagelist"];
//        options.queryParams = { _t: com.settings.timestamp(), template_id: km.xx_templategrid.selectedRow.id };
//        $('#xx_modulegrid').datagrid(options);
//    }

//}

var selectedxx_moduleIndex = 0;
km.xx_modulegrid = {
    jq: null,
    init: function () {
        this.jq = $("#xx_modulegrid").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: '{id}',
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, url: km.model.urls["pagelist"],
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[

 	                { field: 'id', title: gDictionary["id"], width: 80, align: 'center', sortable: true },
                            //{ field: 'template_id', title: gDictionary["template id"], width: 80, align: 'center', sortable: true },
                            { field: 'module_name', title: gDictionary["template name"], width: 600, align: 'left', sortable: true },
                            { field: 'language', title: gDictionary["language"], width: 180, align: 'center', sortable: true },
                            //{ field: 'description', title: gDictionary["teplate description"], width: 80, align: 'center', sortable: true },
                            //{ field: 'files_text', title: gDictionary["File"], width: 80, align: 'center', sortable: true },

            ]],
            onClickRow: function (index, row) {

                selectedxx_moduleIndex = index;
                km.xx_modulegrid.selectedIndex = index;
                km.xx_modulegrid.selectedRow = row;
                //  km.rolegrid.setUserRoles(row);
                if (km.xx_modulegrid.selectedRow)
                    km.set_mode('show');
            },
            onLoadSuccess: function (data) {

                if (data.rows.length > selectedxx_moduleIndex)
                    $("#xx_modulegrid").datagrid("selectRow", selectedxx_moduleIndex);

                km.xx_modulegrid.selectedRow = km.xx_modulegrid.getSelectedRow();
                km.set_mode('show');
            }
        });//end grid init
    },
    reload: function (queryParams) {
       // var defaults = { _t: com.settings.timestamp(), template_id: km.xx_templategrid.selectedRow.id };
        var defaults = { _t: com.settings.timestamp() };
        if (queryParams) { defaults = $.extend(defaults, queryParams); }
        this.jq.datagrid('reload', defaults);
    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};

/*工具栏权限按钮事件*/
km.toolbar = {
    do_refresh: function () { km.xx_modulegrid.reload(); },
    do_add: function () {

        km.set_mode('add');

    },
    do_edit: function () {

        if (km.xx_modulegrid.selectedRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        km.set_mode('edit');


    },
    do_delete: function () {
        var sRow = km.xx_modulegrid.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam =  sRow ;
        com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.xx_modulegrid.reload();
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
        var jsonObject = $("#xx_module_content").serializeJson();
        jsonObject.template_id = 0;// km.xx_templategrid.selectedRow.id;
        var jsonStr =  jsonObject ;
        //添加自定义判断
        //if (jsonObject.param_code == "" || jsonObject.param_value == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
        if (flagValid) {
            if (km.settings.op_mode == 'edit') {
                com.ajax({
                    type: 'POST', url: km.model.urls["edit"], data: jsonStr, success: function (result) {
                        AfterEditxx_module(result);
                    }
                });
            }

            if (km.settings.op_mode == 'add') {
                com.ajax({
                    type: 'POST', url: km.model.urls["add"], data: jsonStr, success: function (result) {
                        AfterEditxx_module(result);
                    }
                });
            }
        }


        var op_mode = km.xx_modulegrid.selectedRow == null ? 'clear' : 'show';
        km.set_mode(op_mode);

    },
    do_search: function () {

    }
    ,
    do_undo: function () {
        var op_mode = km.xx_modulegrid.selectedRow == null ? 'clear' : 'show';
        km.set_mode(op_mode);
    }
};


function AfterEditxx_module(result) {
    if (result.s) {
        com.message('s', result.message);
        km.xx_modulegrid.reload();
        if (km.settings.op_mode == 'add') {
            km.xx_modulegrid.unselectAll();
            km.set_mode('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.xx_modulegrid.selectRow(km.xx_modulegrid.selectedIndex);
            km.xx_modulegrid.selectedRow = $.extend(km.xx_modulegrid.selectedRow, jsonObject);
            km.set_mode('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode = function (op_mode) {
    km.settings.op_mode = op_mode;
    $('#km_toolbar').show();
    $('#km_toolbar_2').hide();
    com.mask($('#west_panel'), false); 
    //$('#user_tabs').tabs('enableTab', 2);
    $('.form_content .easyui-combobox').combobox('readonly', true);
    $('.form_content .easyui-combotree').combotree('readonly', true);
    $('.form_content .easyui-textbox').textbox('readonly', true);
    $('.form_content .easyui-numberbox').numberbox('readonly', true);

    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.xx_modulegrid.selectedRow));
        $('#xx_module_content').form('load', km.xx_modulegrid.selectedRow); 
        Load_file();
        //   km.orgcombotree.jq.combotree('setValue', km.xx_modulegrid.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
         
        //$('#user_tabs').tabs('disableTab', 2); 


        $('.form_content .easyui-combobox').combobox('readonly', false);
        $('.form_content .easyui-combotree').combotree('readonly', false);
        $('.form_content .easyui-textbox').textbox('readonly', false);
        $('.form_content .easyui-numberbox').numberbox('readonly', false);

        $('#xx_module_content').form('clear');


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
         
        //$('#user_tabs').tabs('disableTab', 2); 
    } else if (op_mode == 'clear') {
        $('#xx_module_content').form('clear');

    }
}


function Load_file() {

    

}

 




