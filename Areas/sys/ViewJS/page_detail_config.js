
/*
//------------------------------------------------------------------------------
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       文件： xx_page_detail_config.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/Dev/ViewJS/xx_page_detail_config.js
说明：页面详细配置(xx_page_detail_config)的js文件
*/
//当前页面对象
var km = {};
var galias_columns = [];

km.model = null;
km.parent_model = null;
var gID = 1;
km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model();
    gID = geturlParam("pid");
    if (gID == null)
        gID = 1;
    km.xx_page_detail_configgrid.init();
}


function geturlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
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

var gHTMLtype = [{ id: 'textbox', text: 'textbox' }, { id: 'textarea', text: 'textarea' }, { id: 'combobox', text: 'combobox' }, { id: 'datebox', text: 'datebox' }, { id: 'checkbox', text: 'checkbox' }, { id: 'radio', text: 'radio' }];



km.toolbar = {
    do_refresh: function () { km.xx_pagegrid.reload(); },
    do_back: function () { window.history.go(-1); },
    do_edit: function () {
        accept_xx_page_detail_config();
    },
};

km.xx_page_detail_configgrid = {
    jq: null,
    init: function () {
        this.jq = $("#xx_page_detail_configgrid").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
            queryParams: { _t: com.settings.timestamp(), keyword: "", page_detail_id: gID }, url: km.model.urls["pagelist"],
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, onClickRow: onClickRow_xx_page_detail_config, fitColumns: true,
            //toolbar: '#tbxx_page_detail_config',
            columns: [[{ field: 'column_name', title: '列名', width: 250, align: 'left', sortable: true },
                          { field: 'col_alias', title: '别名', width: 280, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },

    	                      //   { field: 'id', title: '编号', width: 80, align: 'center', sortable: true },
                          { field: 'column_caption', title: '列标题', width: 280, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },



                                 //   { field: 'id', title: '编号', width: 80, align: 'center', sortable: true },


                          //    { field: 'page_detail_id', title: '页面详细编号', width: 50, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },
{
    field: 'is_show', title: '<input    type="checkbox"/>s', width: 60, align: 'center', sortable: false, formatter: function (value, row, index) {
        var str = '';
        if (value == 1)
            str = '<input disable=true checked type="checkbox"/>'
        else
            str = '<input  disable=true type="checkbox"/>';
        return str;
    }, editor: { type: 'checkbox', options: { on: '1', off: '0' } }
}, {
    field: 'is_insert', title: '<input    type="checkbox"/>i', width: 60, align: 'center', sortable: false, formatter: function (value, row, index) {
        var str = '';
        if (value == 1)
            str = '<input disable=true checked type="checkbox"/>'
        else
            str = '<input  disable=true type="checkbox"/>';
        return str;
    }, editor: { type: 'checkbox', options: { on: '1', off: '0' } }
},
                            {
                                field: 'is_update', title: '<input  onclick="ClickMe(1,this )"  type="checkbox"/>u', width: 60, align: 'center', sortable: false, formatter: function (value, row, index) {
                                    var str = '';
                                    if (value == 1)
                                        str = '<input name="cu" disable=true checked type="checkbox"/>'
                                    else
                                        str = '<input  name="cu" disable=true type="checkbox"/>';
                                    return str;
                                }, editor: { type: 'checkbox', options: { on: '1', off: '0' } }
                            },

                            {
                                field: 'is_where', title: '<input    type="checkbox"/>w', width: 60, align: 'center', sortable: false, formatter: function (value, row, index) {
                                    var str = '';
                                    if (value == 1)
                                        str = '<input disable=true checked type="checkbox"/>'
                                    else
                                        str = '<input  disable=true type="checkbox"/>';
                                    return str;
                                }, editor: { type: 'checkbox', options: { on: '1', off: '0' } }
                            },


                         //   { field: 'width', title: '宽度', width: 50, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },


                          { field: 'data', title: '参数', width: 180, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },


                          //{ field: 'valid', title: '校验', width: 280, align: 'left', sortable: true, editor: { type: 'textbox', options: {} } },

                          //{
                          //    field: '', title: '', width: 80, align: 'left', sortable: false,
                          //    formatter: function (value, row, index) { return '<a ref="#" onclick="SetValid(' + row.id + ' )" name="opera" class="easyui-linkbutton">set</a>' }

                          //},

                           {
                               field: 'valid', title: '校验', width: 280, align: 'left', sortable: true,
                               editor: {
                                   type: 'combobox',
                                   options: {
                                       valueField: 'id', textField: 'text', editable: true, hasDownArrow: true, panelHeight: 200, multiple: true,
                                       data: gvalidation
                                   }


                               }
                           },

                             // { field: 'is_required', title: '必填', width: 50, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },





                           //   { field: 'column_type', title: '列类型', width: 100, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },


                              { field: 'column_length', title: '列长度', width: 50, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },


                                {
                                    field: 'html_type', title: 'html类型', width: 120, align: 'center', sortable: true, formatter: function (value, row) {
                                        return value;
                                    },
                                    editor: {
                                        type: 'combobox',
                                        options: {
                                            valueField: 'id', textField: 'text', editable: false, hasDownArrow: false, panelHeight: 90, data: gHTMLtype
                                        }
                                    }
                                },


                              { field: 'static_value', title: '静态数据', width: 250, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },





            ]],
            onLoadSuccess: function (data) {
               // console.log(data.footer[0].files_text);
                var tmp = ',' + data.footer[0].files_text + ',';
                if (tmp.indexOf("]") > 0)
                    galias_columns = tmp.split(']')[1].split(',');

                tmp = tmp.replaceAll("]", ',]')
                if (tmp.indexOf(",s,") < 0)
                    $('#xx_page_detail_configgrid').datagrid('hideColumn', 'is_show');
                if (tmp.indexOf(",u,") < 0)
                    $('#xx_page_detail_configgrid').datagrid('hideColumn', 'is_update');
                if (tmp.indexOf(",i,") < 0)
                    $('#xx_page_detail_configgrid').datagrid('hideColumn', 'is_insert');
                if (tmp.indexOf(",w,") < 0)
                    $('#xx_page_detail_configgrid').datagrid('hideColumn', 'is_where');

            }
        });//end grid init
    },
    reload: function (queryParams) {


        //var options = $('#xx_page_detail_configgrid').datagrid('options')

        //options.url = km.model.urls["pagelist_config"];
        //options.queryParams = { _t: com.settings.timestamp(), page_detail_id: id };
        //$('#xx_page_detail_configgrid').datagrid(options);

        var defaults = { _t: com.settings.timestamp(), page_detail_id: id };
        if (queryParams) { defaults = $.extend(defaults, queryParams); }
        this.jq.datagrid('reload', defaults);
    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};
var lastIndex = 0;
var editIndexxx_page_detail_config = undefined;
function endEditing() {
    if (editIndexxx_page_detail_config == undefined) { return true }
    if ($('#xx_page_detail_configgrid').datagrid('validateRow', editIndexxx_page_detail_config)) {

        //需要手工修改
        //	var ed = $('#xx_page_detail_configgrid').datagrid('getEditor', {index:editIndexxx_page_detail_config,field:'productid'});
        //	var productname = $(ed.target).combobox('getText');
        //	$('#xx_page_detail_configgrid').datagrid('getRows')[editIndexxx_page_detail_config]['productname'] = productname;
        $('#xx_page_detail_configgrid').datagrid('endEdit', editIndexxx_page_detail_config);


        editIndexxx_page_detail_config = undefined;
        return true;
    } else {
        return false;
    }
}
function onClickRow_xx_page_detail_config(index) {
    lastIndex = index;
    if (editIndexxx_page_detail_config != index) {
        if (endEditing()) {
            $('#xx_page_detail_configgrid').datagrid('selectRow', index)
                    .datagrid('beginEdit', index);
            editIndexxx_page_detail_config = index;
        } else {
            $('#xx_page_detail_configgrid').datagrid('selectRow', editIndexxx_page_detail_config);
        }
    }
}
function append_xx_page_detail_config() {
    if (endEditing()) {
        $('#xx_page_detail_configgrid').datagrid('appendRow', { status: 'P' });
        editIndexxx_page_detail_config = $('#xx_page_detail_configgrid').datagrid('getRows').length - 1;
        $('#xx_page_detail_configgrid').datagrid('selectRow', editIndexxx_page_detail_config)
                .datagrid('beginEdit', editIndexxx_page_detail_config);
    }
}
function removeit_xx_page_detail_config() {
    if (editIndexxx_page_detail_config == undefined) { layer.msg('请选择一条记录！'); return; }

    var sRow = km.xx_page_detail_configgrid.getSelectedRow();
    if (sRow == null) { layer.msg('请选择一条记录！'); return; }
    //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg('此参数不可删除！'); return; }
    var jsonParam =  sRow ;
    com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {
        if (b) {
            com.ajax({
                url: km.model.urls["delete"], data: jsonParam, success: function (result) {
                    if (result.s) {
                        com.message('s', result.message);

                        $('#xx_page_detail_configgrid').datagrid('cancelEdit', editIndexxx_page_detail_config)
                                .datagrid('deleteRow', editIndexxx_page_detail_config);
                        editIndexxx_page_detail_config = undefined;

                        km.xx_page_detail_configgrid.reload();

                    } else {
                        com.message('e', result.message);
                    }
                }
            });
        }
    });

}
function accept_xx_page_detail_config() {
    if (endEditing()) {

        
        var alldata = $("#xx_page_detail_configgrid").datagrid('getData');
        var alias = ","
        console.log(alldata);
        for (var i = 0; i < alldata.rows.length; i++) {
            if (alias.indexOf("," + alldata.rows[i].col_alias + ",") >= 0) {
                com.message('s', "别名" + alldata.rows[i].col_alias + "重复");
                return;
            }
            if (alldata.rows[i].is_show==1)
            alias =alias+ alldata.rows[i].col_alias + ",";
        }
        console.log(galias_columns);
        for (var i = 0; i < galias_columns.length; i++) {
            if (galias_columns[i]!="")
            if (alias.indexOf("," + galias_columns[i] + ",") < 0) {
                com.message('s', "别名" + galias_columns[i]+"未定义");
                return;
            }
        }
         

        if ($("#xx_page_detail_configgrid").datagrid('getChanges').length) {
            ////获取插入更改的行的集合
            var inserted = $("#xx_page_detail_configgrid").datagrid('getChanges', "inserted");



            for (var i = 0; i < inserted.length; i++) {


                var jsonStr =  inserted[i] ;

                com.ajax({
                    type: 'POST', url: km.model.urls["add"], data: jsonStr, success: function (result) {
                        //     AfterEdit(result);
                        if (result.s) {
                            com.message('s', result.message);
                        }
                        //   km.xx_page_detail_configgrid.reload();
                    }
                });
            }

            ////获取删除更改的行的集合
            //var deleted = $("#xx_page_detail_configgrid").datagrid('getChanges', "deleted");
            //获取更新更改的行的集合
            var updated = $("#xx_page_detail_configgrid").datagrid('getChanges', "updated");

            if (updated.length == 0)
                return;

            //  alert(updated.length);


            for (var i = 0; i < updated.length; i++) {


                var jsonStr =  updated[i] ;

                com.ajax({
                    type: 'POST', url: km.model.urls["edit"], data: jsonStr, success: function (result) {
                        //     AfterEdit(result);
                        if (result.s) {
                            com.message('s', result.message);
                        }
                        //  km.xx_page_detail_configgrid.reload();
                    }
                });
            }

            return;

        }

        $('#xx_page_detail_configgrid').datagrid('acceptChanges');
    }
}
function reject_xx_page_detail_config() {
    $('#xx_page_detail_configgrid').datagrid('rejectChanges');
    editIndexxx_page_detail_config = undefined;
}
function getChanges_xx_page_detail_config() {
    var rows = $('#xx_page_detail_configgrid').datagrid('getChanges');
    alert(rows.length + ' rows are changed!');
}

function ClickMe(n, me) {
    // alert(n);
}

function SetValid(id) {
    $('#valid_dialog').dialog('open');
}

function Selectalid() {
    var str = "";
    $("input[name='cbValid']").each(
function () {
    if ($(this).get(0).checked) {
        if (str == "")
            str = $(this).attr("mvalidtype");
        else
            str = str + "," + $(this).attr("mvalidtype");
    }
});

    $("input[name='cbRequired']").each(
function () {
    if ($(this).get(0).checked) {
        if (str == "")
            str = $(this).attr("mvalidtype");
        else
            str = $(this).attr("mvalidtype") + ",validtype:[" + str + "]";
    }
});


    var columns = $('#xx_page_detail_configgrid').datagrid("options").columns;

    // 得到rows对象

    var rows = $('#xx_page_detail_configgrid').datagrid("getRows"); // 这段代码是// 对某个单元格赋值
    //columns[0][5].field
    rows[lastIndex]["valid"] = str;
    $('#xx_page_detail_configgrid').datagrid('endEdit', lastIndex).datagrid('refreshRow', lastIndex).datagrid('selectRow', lastIndex).datagrid(
                       'beginEdit', lastIndex);
    // 刷新该行, 只有刷新了才有效果
    $('#xx_page_detail_configgrid').datagrid('refreshRow', lastIndex);


    //   var row = $('#xx_page_detail_configgrid').datagrid("getSelected");
    //   row.valid = str;
    ////   console.info(row);

    //   $('#xx_page_detail_configgrid').datagrid('endEdit', lastIndex).datagrid('refreshRow', lastIndex).datagrid('selectRow', lastIndex).datagrid(
    //                       'beginEdit', lastIndex);
    //   $('#xx_page_detail_configgrid').datagrid('updateRow', row);

    $('#valid_dialog').dialog('close');
}








