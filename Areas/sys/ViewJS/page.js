
/*
//------------------------------------------------------------------------------
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       文件： xx_page.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/Dev/ViewJS/xx_page.js
说明：页面(xx_page)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;
var editFlag
km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model();
    km.template.init();
    km.xx_pagegrid.init();

    InitMenuTree();

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

var gArea = [];



var selectedxx_pageIndex = 0;
km.xx_pagegrid = {
    jq: null,
    init: function () {
        this.jq = $("#xx_pagegrid").datagrid({
            view: detailview,
            detailFormatter: function (rowIndex, rowData) {
                var tmps = '<div id="div' + rowData.id + '"></div>';
                return tmps;
            },
            onExpandRow: function (index, row) {
            },

            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: '{id}',
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, url: km.model.urls["pagelist"],
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[

 	                { field: 'id', title: gDictionary["id"], width: 40, align: 'center', sortable: true },
                         //   { field: 'template_id', title: gDictionary["template"], width: 80, align: 'center', sortable: true },
                            { field: 'page_name', title: gDictionary["page name"], width: 180, align: 'left', sortable: true },
                            { field: 'description', title: gDictionary["description"], width: 280, align: 'left', sortable: true },
                            {
                                field: 'parent_menu_code', title: '', width: 40, align: 'center', sortable: false, formatter: function (value, row, index) {

                                    return '<a href="javascript:GoToPage(' + row.id + ')" >' + gDictionary["code"] + '</a>';
                                }
                            }, {
                                field: 'check', title: '', width: 80, align: 'center', sortable: false, formatter: function (value, row, index) {

                                    return '<a href="javascript:edit_sub_page(' + row.id + ',0)" >' + gDictionary["module"] + '</a>';
                                }
                            },
                        //    { field: 'parent_menu_code', title: gDictionary["parent menu"], width: 80, align: 'center', sortable: true },

            ]],
            onClickRow: function (index, row) {

                selectedxx_pageIndex = index;
                km.xx_pagegrid.selectedIndex = index;
                km.xx_pagegrid.selectedRow = row;
                //  km.rolegrid.setUserRoles(row);
                if (km.xx_pagegrid.selectedRow) {
                    Load_module();
                    km.set_mode('show');
                }
            },
            onLoadSuccess: function (data) {
                var detail = data.footer;

                for (var i = 0; i < detail.length; i++) {
                    //   var price = GetTotalPrice(detail[i].options_price, detail[i].price);
                    var tmps = "";
                    //if (detail[i].department_name == "")
                    //    tmps = String.format('<div id="d{0}" style="float:left; color:red;">{1} ,  </div>',
                    //    detail[i].id, detail[i].check_items, detail[i].department_name
                    //    );
                    //else
                    tmps = String.format('<div id="d{0}" class="sub_page"> <div class="sub_page_title">  {1} </div> <a href="javascript:EditSubPage({0})">' + gDictionary["edit"] + '</a>&nbsp;|&nbsp;<a href="javascript:DeleteSubPage({0})">' + gDictionary["delete"] + '</a>&nbsp;|&nbsp;<a href="javascript:GenSubPage({0})">' + gDictionary["generate"] + '</a> &nbsp;|&nbsp<a href="javascript:GoToPage({0})" >' + gDictionary["code"] + '</a>   </div>',
                        detail[i].id, detail[i].page_name_text
                        );
                    $("#div" + detail[i].parent_id).append(tmps);
                    //  gw.find("#xx_page_detail_configgrid")
                    //  $("#xx_pagegrid").datagrid("expandRow", i);
                }


                if (data.rows.length > selectedxx_pageIndex)
                    $("#xx_pagegrid").datagrid("selectRow", selectedxx_pageIndex);

                km.xx_pagegrid.selectedRow = km.xx_pagegrid.getSelectedRow();
                if (km.xx_pagegrid.selectedRow) {
                    Load_module();
                    km.set_mode('show');
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
function GoToPage(pid) {
    //  document.location = '/sys/sysbase/?menucode=' + menucode + '&page_id=' + pid;
    window.location = "/sys/sysbase/?" + "page_id=" + pid + "&menucode=" + encodeURI(menucode);
}


function Load_module() {

    if (km.xx_pagegrid.selectedRow) {
        gArea = [];
        // alert(km.xx_pagegrid.selectedRow.areas);
        var a = km.xx_pagegrid.selectedRow.areas.split(",");
        for (var i = 0; i < a.length; i++) {
            var b = {

                id: a[i],

                text: a[i]

            };
            gArea.push(b);
        }
        //  alert(JSON.stringify(gArea));

        km.xx_page_detailgrid.init();
        var options = $('#xx_page_detailgrid').datagrid('options')
        options.url = km.model.urls["pagelist_detail"];
        options.queryParams = { _t: com.settings.timestamp(), page_id: km.xx_pagegrid.selectedRow.id };
        $('#xx_page_detailgrid').datagrid(options);
    }

}

/*工具栏权限按钮事件*/
km.toolbar = {
    do_refresh: function () { km.xx_pagegrid.reload(); },

    do_back: function () { window.history.go(-1); },
    do_gen: function () {
        var sRow = km.xx_pagegrid.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam = { page_id: sRow.id };
        parent.ShowLoading(gDictionary["creating code"])
        com.ajax({
            url: km.model.urls["gen"], data: jsonParam, success: function (result) {
                parent.HideLoading();
                if (result.s) {
                    com.message('s', result.message);
                    // km.xx_pagegrid.reload();
                    GoToPage(sRow.id);
                } else {
                    com.message('e', result.message);
                }
            }
        });

    },
    do_sync: function () {
        //var sRow = km.xx_pagegrid.getSelectedRow();
        // if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        //   var jsonParam = JSON.stringify({ page_id: sRow.id });
        //     alert(km.model.urls["sync"]);
        parent.ShowLoading(gDictionary["synchronizing"])
        //parent.ShowMask();
        com.ajax({
            url: km.model.urls["sync"], success: function (result) {
                //parent.wrapper.HideMask();
                parent.HideLoading();
                if (result.s) {
                    com.message('s', result.message);
                    // km.xx_pagegrid.reload();
                    GoToPage(sRow.id);
                } else {
                    com.message('e', result.message);
                }
            }
        });

    },
    do_add: function () {

        km.set_mode('add');

    },
    do_edit: function () {

        if (km.xx_pagegrid.selectedRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        km.set_mode('edit');


    },
    do_delete: function () {
        var sRow = km.xx_pagegrid.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam = sRow;
        com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.xx_pagegrid.reload();
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
        var jsonObject = $("#xx_page_content").serializeJson();
        var jsonStr = jsonObject;
        //添加自定义判断
        if (!$("#xx_page_content").form('validate')) {
            layer.msg(gDictionary["data is incorrect, please try again"]);
            return false;
        }

        //if (jsonObject.param_code == "" || jsonObject.param_value == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
        if (flagValid) {
            if (km.settings.op_mode == 'edit') {
                com.ajax({
                    type: 'POST', url: km.model.urls["edit"], data: jsonStr, success: function (result) {
                        AfterEditxx_page(result);
                    }
                });
            }

            if (km.settings.op_mode == 'add') {
                com.ajax({
                    type: 'POST', url: km.model.urls["add"], data: jsonStr, success: function (result) {
                        AfterEditxx_page(result);
                    }
                });
            }
        }




    },
    do_search: function () {

    }
    ,
    do_undo: function () {
        var op_mode = km.xx_pagegrid.selectedRow == null ? 'clear' : 'show';
        km.set_mode(op_mode);
    }
};

function InitMenuTree() {
    $('#TPL_parent_menu_code').combotree({
        url: km.model.urls["tree"], editable: false, valueField: 'menu_code', textField: 'menu_name', loadFilter: function (data) {
            //   data: gMenuData, editable: false, loadFilter: function (data) {
            var d = utils.copyProperty(data.rows || data, ["id", "icon_class", "menu_name", "menu_code"], ["id2", "iconCls", "text", "id"], true);
            // console.log(d);
            var resultData = utils.toTreeData(d, 'id2', 'parent_id', "children");
            return resultData;
        }
    });
}

function AfterEditxx_page(result) {
    if (result.s) {
        com.message('s', result.message);
        km.xx_pagegrid.reload();
        if (km.settings.op_mode == 'add') {
            km.xx_pagegrid.unselectAll();
            km.set_mode('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.xx_pagegrid.selectRow(km.xx_pagegrid.selectedIndex);
            km.xx_pagegrid.selectedRow = $.extend(km.xx_pagegrid.selectedRow, jsonObject);
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
    $('#user_tabs').tabs('enableTab', 1);
    //   $('#user_tabs').tabs('enableTab', 2);
    $('.form_content .easyui-combobox').combobox('readonly', true);
    $('.form_content .easyui-combotree').combotree('readonly', true);
    $('.form_content .easyui-textbox').textbox('readonly', true);
    $('.form_content .easyui-numberbox').numberbox('readonly', true);

    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.xx_pagegrid.selectedRow));
        $('#xx_page_content').form('load', km.xx_pagegrid.selectedRow);
        //   km.orgcombotree.jq.combotree('setValue', km.xx_pagegrid.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);

        $('#user_tabs').tabs('disableTab', 1);
        //       $('#user_tabs').tabs('disableTab', 2);
        $('#user_tabs').tabs('select', 0);


        $('.form_content .easyui-combobox').combobox('readonly', false);
        $('.form_content .easyui-combotree').combotree('readonly', false);
        $('.form_content .easyui-textbox').textbox('readonly', false);
        $('.form_content .easyui-numberbox').numberbox('readonly', false);

        $('#xx_page_content').form('clear');


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
        $('#xx_page_content').form('clear');

    }
}





km.xx_page_detailgrid = {
    jq: null,
    init: function () {
        this.jq = $("#xx_page_detailgrid").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
            queryParams: { _t: com.settings.timestamp(), keyword: "", page_id: 0 },// url: km.model.urls["pagelist_detail"],
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, onClickRow: onClickRow_xx_page_detail, fitColumns: true, toolbar: '#tbxx_page_detail',
            columns: [[
    	                      //   { field: 'id', title: gDictionary["id"], width: 80, align: 'center', sortable: true },


                       //      { field: 'page_id', title: gDictionary["page_id"], width: 50, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },


                              {
                                  field: 'area', title: gDictionary["area"], width: 50, align: 'center', sortable: true,
                                  editor: {
                                      type: 'combobox',
                                      options: {
                                          valueField: 'id', textField: 'text', editable: false, hasDownArrow: false, panelHeight: 150,
                                          data: gArea
                                      }
                                  }
                              },


                                {
                                    field: 'table_name', title: gDictionary["table_name"], width: 280, align: 'left', sortable: true, formatter: function (value, row) {
                                        return value;
                                    },
                                    editor: {
                                        type: 'combobox',
                                        options: {
                                            valueField: 'id', textField: 'text', editable: true, hasDownArrow: true, panelHeight: 200,
                                            data: table_list.rows

                                            ,
                                            onSelect: function (data) {
                                                var row = $('#xx_page_detailgrid').datagrid('getSelected');
                                                var rowIndex = $('#xx_page_detailgrid').datagrid('getRowIndex', row);//获取行号

                                                //  var rowIndex  = editIndexxx_page_detail;
                                                var thisTarget = $('#xx_page_detailgrid').datagrid('getEditor', { 'index': rowIndex, 'field': 'table_name' }).target;
                                                var value = thisTarget.combobox('getValue');

                                                var target2 = $('#xx_page_detailgrid').datagrid('getEditor', { 'index': rowIndex, 'field': 'comments' }).target;
                                                var target3 = $('#xx_page_detailgrid').datagrid('getEditor', { 'index': rowIndex, 'field': 'name_text' }).target;
                                                var target4 = $('#xx_page_detailgrid').datagrid('getEditor', { 'index': rowIndex, 'field': 'table_description' }).target;
                                                for (var i2 = 0; i2 < table_list.rows.length ; i2++)
                                                    if (table_list.rows[i2].id + "" == value) {

                                                        console.log(table_list.rows[i2].id + "--" + value);
                                                        target2.textbox("setValue", table_list.rows[i2].table_description);
                                                        target3.textbox("setValue", table_list.rows[i2].table_description);
                                                        target4.textbox("setValue", table_list.rows[i2].table_description);
                                                    }
                                            }





                                        }
                                    }
                                },
                                  { field: 'class_name', title: gDictionary["class name"], width: 180, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },


                                {
                                    field: 'module_id', title: gDictionary["module name"], width: 280, align: 'left', sortable: true, formatter: function (value, row) {
                                        return row.module_name;
                                    },
                                    editor: {
                                        type: 'combobox',
                                        options: {
                                            valueField: 'id', textField: 'text', editable: false, hasDownArrow: true, panelHeight: 90,
                                            data: module_list.rows
                                        }
                                    }
                                },
                           { field: 'name_text', title: 'tab名', width: 180, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },


                          { field: 'table_description', title: gDictionary["comments"], width: 380, align: 'left', sortable: true, hidden: true, editor: { type: 'textbox', options: {} } },
                          { field: 'comments', title: gDictionary["comments"], width: 280, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },
                          {
                              field: 'id', title: '', width: 100, align: 'center', sortable: false, formatter: function (value, row, index) {
                                  var str = " edit_sub_page(-1," + row.id + "   )";

                                  return '<a ref="#" onclick="' + str + '" name="opera" class="easyui-linkbutton"></a>'
                                  //var str = " Config_detail(" + row.id + ",'" + row.table_name + "'  )";

                                  //return '<a ref="#" onclick="' + str + '" name="opera" class="easyui-linkbutton"></a>'
                              }
                          },



            ]],
            onLoadSuccess: function () {
                $("a[name='opera']").linkbutton({ text: gDictionary["setup"], plain: true, iconCls: 'icon-add' });
            }
        });//end grid init
    },
    reload: function (queryParams) {
        Load_module();
        //var defaults = { _t: com.settings.timestamp() };
        //if (queryParams) { defaults = $.extend(defaults, queryParams); }
        //this.jq.datagrid('reload', defaults);
    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


function Config_detail(id, table_name) {
    // alert(id);
    //  alert(token);

    var p = { table_name: table_name };




    //com.ajax({
    //    url: km.model.urls["get_column"], data: p, success: function (result) {
    p.page_detail_id = id;
    //   var r = result[0].x + result[1].x;
    //   p.x = result[0].x.replaceAll(">", "&gt;");
    //   p.x = p.x.replaceAll("<", "&lt;");
    ////   alert(result[0].x);
    com.ajax({
        url: km.model.urls["syn_detail_config"], data: p, success: function (result) {

            window.location = "/sys/sysbase/?" + "pid=" + id + "&menucode=" + encodeURI(menucode_config);
        }
    });
    //    }
    //});


    //  syn_detail_config


    //   get_column



}


var editIndexxx_page_detail = undefined;
function endEditing_pd() {
    if (editIndexxx_page_detail == undefined) { return true }
    if ($('#xx_page_detailgrid').datagrid('validateRow', editIndexxx_page_detail)) {

        //需要手工修改
        //	var ed = $('#xx_page_detailgrid').datagrid('getEditor', {index:editIndexxx_page_detail,field:'productid'});
        //	var productname = $(ed.target).combobox('getText');
        //	$('#xx_page_detailgrid').datagrid('getRows')[editIndexxx_page_detail]['productname'] = productname;
        $('#xx_page_detailgrid').datagrid('endEdit', editIndexxx_page_detail);


        editIndexxx_page_detail = undefined;
        return true;
    } else {
        return false;
    }
}
function onClickRow_xx_page_detail(index) {
    if (!editFlag)
        return;

    if (editIndexxx_page_detail != index) {
        if (endEditing_pd()) {
            $('#xx_page_detailgrid').datagrid('selectRow', index)
                    .datagrid('beginEdit', index);
            editIndexxx_page_detail = index;
        } else {
            $('#xx_page_detailgrid').datagrid('selectRow', editIndexxx_page_detail);
        }
    }
}
function append_xx_page_detail() {
    if (endEditing_pd()) {
        $('#xx_page_detailgrid').datagrid('appendRow', { status: 'P' });
        editIndexxx_page_detail = $('#xx_page_detailgrid').datagrid('getRows').length - 1;
        $('#xx_page_detailgrid').datagrid('selectRow', editIndexxx_page_detail)
                .datagrid('beginEdit', editIndexxx_page_detail);
    }
}
function removeit_xx_page_detail() {
    if (editIndexxx_page_detail == undefined) { layer.msg(gDictionary["please select one record"]); return; }

    var sRow = km.xx_page_detailgrid.getSelectedRow();
    if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
    //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
    var jsonParam = sRow;
    com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {
        if (b) {
            com.ajax({
                url: km.model.urls["delete_detail"], data: jsonParam, success: function (result) {
                    if (result.s) {
                        com.message('s', result.message);

                        $('#xx_page_detailgrid').datagrid('cancelEdit', editIndexxx_page_detail)
                                .datagrid('deleteRow', editIndexxx_page_detail);
                        editIndexxx_page_detail = undefined;

                        km.xx_page_detailgrid.reload();

                    } else {
                        com.message('e', result.message);
                    }
                }
            });
        }
    });

}
function accept_xx_page_detail() {
    if (endEditing_pd()) {


        if ($("#xx_page_detailgrid").datagrid('getChanges').length) {
            ////获取插入更改的行的集合
            var inserted = $("#xx_page_detailgrid").datagrid('getChanges', "inserted");



            for (var i = 0; i < inserted.length; i++) {

                inserted[i].page_id = km.xx_pagegrid.selectedRow.id;

                //var j = JSON.parse(JSON.stringify(inserted[i]));
                //j.page_id = km.xx_pagegrid.selected.id;
                var jsonStr = inserted[i];
                //  alert(jsonStr);
                com.ajax({
                    type: 'POST', url: km.model.urls["add_detail"], data: jsonStr, success: function (result) {
                        //     AfterEdit(result);
                        if (i == inserted.length - 1)
                            km.xx_page_detailgrid.reload();
                    }
                });
            }

            ////获取删除更改的行的集合
            //var deleted = $("#xx_page_detailgrid").datagrid('getChanges', "deleted");
            //获取更新更改的行的集合
            var updated = $("#xx_page_detailgrid").datagrid('getChanges', "updated");

            if (updated.length == 0)
                return;

            //  alert(updated.length);


            for (var i = 0; i < updated.length; i++) {

                updated[i].page_id = km.xx_pagegrid.getSelectedRow.id;

                var jsonStr = updated[i];

                com.ajax({
                    type: 'POST', url: km.model.urls["edit_detail"], data: jsonStr, success: function (result) {
                        //     AfterEdit(result);

                        if (i == updated.length - 1)
                            km.xx_page_detailgrid.reload();
                    }
                });
            }

            return;

        }

        $('#xx_page_detailgrid').datagrid('acceptChanges');
    }
}
function reject_xx_page_detail() {
    $('#xx_page_detailgrid').datagrid('rejectChanges');
    editIndexxx_page_detail = undefined;
}
function getChanges_xx_page_detail() {
    var rows = $('#xx_page_detailgrid').datagrid('getChanges');
    alert(rows.length + ' rows are changed!');
}




function edit_xx_page_detailgrid() {
    editFlag = true;


    $("#my_delete").show();
    $("#my_add").show();
    $("#my_save").show();
    $("#my_remove").show();
    $("#my_cancel").show();
    $("#my_edit").hide();

}

function cancel_edit_xx_page_detailgrid() {
    editFlag = false;


    $("#my_delete").hide();
    $("#my_add").hide();
    $("#my_remove").hide();
    $("#my_save").hide();
    $("#my_cancel").hide();
    $("#my_edit").show();

}

var gPwin = null;


function EditSubPage(id) {
    edit_sub_page(0, id)
}
function DeleteSubPage(id) {

    var jsonParam = { id: id };
    com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {
        if (b) {
            com.ajax({
                url: km.model.urls["delete"], data: jsonParam, success: function (result) {
                    if (result.s) {
                        com.message('s', result.message);
                        km.xx_pagegrid.reload();
                    } else {
                        com.message('e', result.message);
                    }
                }
            });
        }
    });
}
function GenSubPage(id) {
    var jsonParam = { page_id: id };
    parent.ShowLoading(gDictionary["creating code"])
    com.ajax({
        url: km.model.urls["gen"], data: jsonParam, success: function (result) {
            parent.HideLoading();
            if (result.s) {
                com.message('s', result.message);
                // km.xx_pagegrid.reload();
                GoToPage(id);
            } else {
                com.message('e', result.message);
            }
        }
    });
}

/*工具栏权限按钮事件*/
function edit_sub_page(parent_id, id) {

 

    $('#tmp').html($('#sub_page_dialog').html().replaceAll("_easyui", "easyui"));
    $('#tmp').dialog_ext2({
        title: gDictionary["subpage"], iconCls: 'icon-standard-zoom', top: 100, height: 600, width: 1200,
        btnText: gDictionary["save"],
        onOpenEx: function (win) {
            //win.find('#TPL_enabled').combobox('setValue', 1);
            //win.find('#TPL_sort').numberbox('setValue', 100);
            //   gWin = win;
            //  km.ub_page_dialogsearch.init(win);
            //  $(".easyui-textbox3").textbox();
            //if (gPwin)
            //    gPwin.dialog('destroy');
            gPwin = win;
            parent.xx_page_detail_configgrid.init(win);
            parent.LoadPageData(parent_id, id);
            win.find(".form_content").find("input[type='radio']").removeAttr("disabled");
            win.find(".form_content").find("input[type='checkbox']").removeAttr("disabled");
        },
        onClickButton: function (win) { //保存操作 
            
            if (parent.accept_xx_page_detail_config()) {

                win.dialog('destroy');
                gPwin = null;
            }

        }
    }, gDictionary["cancel"] );


}











