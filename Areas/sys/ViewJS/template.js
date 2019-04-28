
/*
//------------------------------------------------------------------------------
//       时间： 2017-08-04
//       作者： 蔡捷     
//			  
//       文件： xx_template.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/Dev/ViewJS/xx_template.js
说明：模板(xx_template)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    LoadTemplate();
    km.init_parent_model();
    km.template.init();
    km.xx_templategrid.init();

   // km.xx_module_grid.init();
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

var selectedxx_templateIndex = 0;
km.xx_templategrid = {
    jq: null,
    init: function () {
        this.jq = $("#xx_templategrid").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: '{id}',
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, url: km.model.urls["pagelist"],
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[
            
 	                { field: 'id', title: gDictionary["id"], width: 40, align: 'center', sortable: true },
                            { field: 'template_name', title: gDictionary["template name"], width: 80, align: 'left', sortable: true },
                        //    { field: 'description', title: gDictionary["description"], width: 180, align: 'left', sortable: true },
                            //{ field: 'files', title: gDictionary["File"], width: 80, align: 'center', sortable: true },
                            //{ field: 'html', title: 'html', width: 80, align: 'center', sortable: true },
                            { field: 'areas', title: gDictionary["area"], width: 40, align: 'left', sortable: true },
                            { field: 'language', title: gDictionary["language"], width: 50, align: 'center', sortable: true },
                 
            ]],
            onClickRow: function (index, row) {
            
                selectedxx_templateIndex = index;
                km.xx_templategrid.selectedIndex = index;
                km.xx_templategrid.selectedRow = row;
              //  km.rolegrid.setUserRoles(row);
                if (km.xx_templategrid.selectedRow)
                    km.set_mode('show');
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length > selectedxx_templateIndex)
                $("#xx_templategrid").datagrid("selectRow", selectedxx_templateIndex);
              
                km.xx_templategrid.selectedRow = km.xx_templategrid.getSelectedRow();
                    km.set_mode('show');
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
    do_refresh: function () { km.xx_templategrid.reload(); },
     do_add: function () {

        km.set_mode('add');

    },
    do_edit: function () {

        if (km.xx_templategrid.selectedRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        km.set_mode('edit');


    },
    do_delete: function () {
        var sRow = km.xx_templategrid.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam =  sRow;
        com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + '</b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.xx_templategrid.reload();
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
                    var jsonObject = $("#xx_template_content").serializeJson();
                    jsonObject.html = jsonObject.html.replaceAll(">", "&gt;").replaceAll("<", "&lt;");

                    jsonObject.description = jsonObject.description.replaceAll(">", "&gt;").replaceAll("<", "&lt;");
                    var jsonStr =  jsonObject;
        //添加自定义判断
                    //if (jsonObject.param_code == "" || jsonObject.param_value == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            com.ajax({
                                type: 'POST', url: km.model.urls["edit"], data: jsonStr, success: function (result) {
                                    AfterEditxx_template(result);
                                }
                            });
                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["add"], data: jsonStr, success: function (result) {
                                    AfterEditxx_template(result);
                                }
                            });
                        }
                    }


        var op_mode = km.xx_templategrid.selectedRow == null ? 'clear' : 'show';
        km.set_mode(op_mode);

    },
    do_search: function () {

    }
    ,
    do_undo: function () {
        var op_mode = km.xx_templategrid.selectedRow == null ? 'clear' : 'show';
        km.set_mode(op_mode);
    }
};
var gTemplates = {};
function LoadTemplate() {

    com.ajax({
        url: "/dev/titan2/GetTemplate", success: function (result) {
           // console.log(result)
           // var menus = utils.toTreeData(result, 'id', 'parent_id', 'children');
        //    gTemplates = utils.toTreeData(result, 'path', 'my_path', 'children');

            //var d = utils.copyProperty(result, ["id", "icon_class", "menu_name"], ["id", "iconCls", "text"], false);

            var d = utils.copyProperty(result, ["path",  "file_name"], ["id",    "text"], false);
              gTemplates = utils.toTreeData(d, 'id', 'my_path', "children");
           

         //   km.xx_module_filesgrid.init();
         //   console.log(menus)
        }
        }); 
}

function AfterEditxx_template(result) {
    if (result.s) {
        com.message('s', result.message);
        km.xx_templategrid.reload();
        if (km.settings.op_mode == 'add') {
            km.xx_templategrid.unselectAll();
            km.set_mode('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.xx_templategrid.selectRow(km.xx_templategrid.selectedIndex);
            km.xx_templategrid.selectedRow = $.extend(km.xx_templategrid.selectedRow, jsonObject);
            km.set_mode('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode = function (op_mode) {
    Load_file();
    Load_module();
    km.settings.op_mode = op_mode;
    $('#km_toolbar').show();
    $('#km_toolbar_2').hide();
    com.mask($('#west_panel'), false);
  //  ('#user_tabs').tabs('enableTab', 1);
   // $('#user_tabs').tabs('enableTab', 2);
    $('.form_content .easyui-combobox').combobox('readonly', true);
    $('.form_content .easyui-combotree').combotree('readonly', true);
    $('.form_content .easyui-textbox').textbox('readonly', true);
    $('.form_content .easyui-numberbox').numberbox('readonly', true);

    km.xx_templategrid.selectedRow.html = km.xx_templategrid.selectedRow.html.replaceAll("&gt;", ">").replaceAll("&lt;","<");
    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.xx_templategrid.selectedRow));
        $('#xx_template_content').form('load', km.xx_templategrid.selectedRow);
        $("#tdText").html('<textarea rows="3" style="width:100%;  " class="v_content" id="TPL_description" name="description" ></textarea>');

        //  description = jsonObject.description.replaceAll("<", "&gt;").replaceAll(">", "&lt;");
        $("#TPL_description").val(km.xx_templategrid.selectedRow.description.replaceAll("&gt;", ">").replaceAll("&lt;", "<"));


        var h = 500;// $("#main-panel_b").height();
        //  alert(h);
        editor = KindEditor.create('.v_content', {
            resizetype: 1, width: "100%", height: h + "px",
            allowPreviewEmoticons: false,

            allowImageUpload: true,//允许上传图片

            allowFileManager: false, //允许对上传图片进行管理

            //uploadJson:'/dev/titan/uploadImage', //上传图片的java代码，只不过放在jsp中

            //afterChange:function(){
            //this.sync();
            //},

            afterBlur: function () {
                this.sync();
            }
        });
        editor.readonly();

     //   km.orgcombotree.jq.combotree('setValue', km.xx_templategrid.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
        
     //   $('#user_tabs').tabs('disableTab', 1);
      //  $('#user_tabs').tabs('disableTab', 2);
      //  $('#user_tabs').tabs('select', 0);
        
        
        $('.form_content .easyui-combobox').combobox('readonly', false);
        $('.form_content .easyui-combotree').combotree('readonly', false);
        $('.form_content .easyui-textbox').textbox('readonly', false);
        $('.form_content .easyui-numberbox').numberbox('readonly', false);
        
        $('#xx_template_content').form('clear');
        


        editor.readonly(false);
        editor.html("");
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

        editor.readonly(false);
        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#xx_template_content').form('clear');
        
    }
}




function Load_file() {

    //console.log(gTemplates);

    //if (km.xx_templategrid.selectedRow) {
    //    var options = $('#xx_module_filesgrid').datagrid('options')

    //    options.url = km.model.urls["pagelistfile"];
    //    options.queryParams = { _t: com.settings.timestamp(), template_id: km.xx_templategrid.selectedRow.id };
    //    $('#xx_module_filesgrid').datagrid(options);
    //}

}


//km.xx_module_filesgrid = {
//    jq: null,
//    init: function () {
//        this.jq = $("#xx_module_filesgrid").datagrid({
//            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
//            queryParams: { _t: com.settings.timestamp(), keyword: "" },// url: km.model.urls["pagelistfile"],
//            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, onClickRow: onClickRow_xx_module_files, fitColumns: true, toolbar: '#tbxx_module_files',
//            columns: [[
//    	                      //   { field: 'id', title: gDictionary["id"], width: 80, align: 'center', sortable: true },


//                              //{ field: 'module_id', title: gDictionary["template id"], width: 50, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },


//                          {
//                              field: 'file', title: gDictionary["File"], width: 280, align: 'left', sortable: true, editor: {
//                              type: 'combotree',
//                                         options: {
//                                             data: gTemplates,
//                                             valueField: 'path', textField: 'file_name', editable: true, hasDownArrow: true, panelHeight: 90
//                                         }
//                                     }  },


//                              //{ field: 'target', title: gDictionary["target area"], width: 100, align: 'center', sortable: true, editor: { type: 'textbox', options: {} } },


//                                 {
//                                     field: 'type', title: gDictionary["type"], width: 280, align: 'left', sortable: true, formatter: function (value, row) {
//                                         return value;
//                                     },
//                                     editor: {
//                                         type: 'combobox',
//                                         options: {
//                                             data: data = [{ id: 'js', text: 'js' }, { id: 'cshtml', text: 'cshtml' }, { id: 'sql', text: 'sql' }, { id: 'php', text: 'php' }, { id: 'jsp', text: 'jsp' }, ],
//                                             valueField: 'id', textField: 'text', editable: false, hasDownArrow: false, panelHeight: 90
//                                         }
//                                     }
//                                 },


// //                         {
// //                             field: 'button_name', title: gDictionary["button"], width: 280, align: 'center', sortable: true, formatter: function (value, row) {
// //                                 return value;
// //                             },
// //                             editor: {
// //                                 type: 'combobox',
// //                                 options: {
// //                                     data: data = [{ id: 'delete', text: 'delete' }, { id: 'add', text: 'add' }, { id: 'edit', text: 'edit' }, { id: 'refresh', text: 'refresh' }, ],
// //                                     valueField: 'id', textField: 'text', editable: true, hasDownArrow: true, panelHeight: 90
// //                                 }
// //                             }
// //                         },
// //                         {
// //                             field: 'action_type', title: gDictionary["action"], width: 280, align: 'center', sortable: true, formatter: function (value, row) {
// //                                 return value;
// //                             },
// //                             editor: {
// //                                 type: 'combobox',
// //                                 options: {
// //                                     data: data = [{ id: 'Pager', text: 'Pager' }, { id: 'RunProc', text: 'RunProc' }, { id: 'ListDT', text: 'ListDT' },
// //{ id: 'ListDTVD', text: 'ListDTVD' }, { id: 'ListDSVD', text: 'ListDSVD' },
// //                                     ],
// //                                     valueField: 'id', textField: 'text', editable: true, hasDownArrow: true, panelHeight: 90
// //                                 }
// //                             }
// //                         },

                    


//            ]],
//            onLoadSuccess: function () { }
//        });//end grid init
//    },
//    reload: function (queryParams) {
//        var defaults = { _t: com.settings.timestamp() };
//        if (queryParams) { defaults = $.extend(defaults, queryParams); }
//        this.jq.datagrid('reload', defaults);
//    },
//    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
//};


//var editIndexxx_module_files = undefined;
//function endEditing() {
//    if (editIndexxx_module_files == undefined) { return true }
//    if ($('#xx_module_filesgrid').datagrid('validateRow', editIndexxx_module_files)) {

//        //需要手工修改
//        //	var ed = $('#xx_module_filesgrid').datagrid('getEditor', {index:editIndexxx_module_files,field:'productid'});
//        //	var productname = $(ed.target).combobox('getText');
//        //	$('#xx_module_filesgrid').datagrid('getRows')[editIndexxx_module_files]['productname'] = productname;
//        $('#xx_module_filesgrid').datagrid('endEdit', editIndexxx_module_files);


//        editIndexxx_module_files = undefined;
//        return true;
//    } else {
//        return false;
//    }
//}
//function onClickRow_xx_module_files(index) {
//    if (editIndexxx_module_files != index) {
//        if (endEditing()) {
//            $('#xx_module_filesgrid').datagrid('selectRow', index)
//                    .datagrid('beginEdit', index);
//            editIndexxx_module_files = index;
//        } else {
//            $('#xx_module_filesgrid').datagrid('selectRow', editIndexxx_module_files);
//        }
//    }
//}
//function append_xx_module_files() {
//    if (endEditing()) {
//        $('#xx_module_filesgrid').datagrid('appendRow', { status: 'P' });
//        editIndexxx_module_files = $('#xx_module_filesgrid').datagrid('getRows').length - 1;
//        $('#xx_module_filesgrid').datagrid('selectRow', editIndexxx_module_files)
//                .datagrid('beginEdit', editIndexxx_module_files);
//    }
//}
//function removeit_xx_module_files() {
//    if (editIndexxx_module_files == undefined) { layer.msg(gDictionary["please select one record"]); return; }

//    var sRow = km.xx_module_filesgrid.getSelectedRow();
//    if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
//    //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
//    var jsonParam = JSON.stringify(sRow);
//    com.message('c', ' <b style="color:red">确定要删除模块文件【' + sRow.id + '】吗？ </b>', function (b) {
//        if (b) {
//            com.ajax({
//                url: km.model.urls["deletefile"], data: jsonParam, success: function (result) {
//                    if (result.s) {
//                        com.message('s', result.message);

//                        $('#xx_module_filesgrid').datagrid('cancelEdit', editIndexxx_module_files)
//                                .datagrid('deleteRow', editIndexxx_module_files);
//                        editIndexxx_module_files = undefined;

//                        km.xx_module_filesgrid.reload();

//                    } else {
//                        com.message('e', result.message);
//                    }
//                }
//            });
//        }
//    });

//}
//function accept_xx_module_files() {
//    if (endEditing()) {


//        if ($("#xx_module_filesgrid").datagrid('getChanges').length) {
//            ////获取插入更改的行的集合
//            var inserted = $("#xx_module_filesgrid").datagrid('getChanges', "inserted");



//            for (var i = 0; i < inserted.length; i++) {
//                inserted[i].template_id = km.xx_templategrid.selectedRow.id;

//                var jsonStr = JSON.stringify(inserted[i]);

//                com.ajax({
//                    type: 'POST', url: km.model.urls["addfile"], data: jsonStr, success: function (result) {
//                        //     AfterEdit(result);

//                        km.xx_module_filesgrid.reload();
//                    }
//                });
//            }

//            ////获取删除更改的行的集合
//            //var deleted = $("#xx_module_filesgrid").datagrid('getChanges', "deleted");
//            //获取更新更改的行的集合
//            var updated = $("#xx_module_filesgrid").datagrid('getChanges', "updated");

//            if (updated.length == 0)
//                return;

//            //  alert(updated.length);


//            for (var i = 0; i < updated.length; i++) {


//                updated[i].template_id = km.xx_templategrid.selectedRow.id;
//                var jsonStr = JSON.stringify(updated[i]);

//                com.ajax({
//                    type: 'POST', url: km.model.urls["editfile"], data: jsonStr, success: function (result) {
//                        //     AfterEdit(result);

//                        km.xx_module_filesgrid.reload();
//                    }
//                });
//            }

//            return;

//        }

//        $('#xx_module_filesgrid').datagrid('acceptChanges');
//    }
//}
//function reject_xx_module_files() {
//    $('#xx_module_filesgrid').datagrid('rejectChanges');
//    editIndexxx_module_files = undefined;
//}
//function getChanges_xx_module_files() {
//    var rows = $('#xx_module_filesgrid').datagrid('getChanges');
//    alert(rows.length + ' rows are changed!');
//}




function Load_module() {

    //if (km.xx_templategrid.selectedRow) {
    //    var options = $('#xx_module_grid').datagrid('options')

    //    options.url = km.model.urls["template_module_list"];
    //    options.queryParams = { _t: com.settings.timestamp(), template_id: km.xx_templategrid.selectedRow.id };
    //    $('#xx_module_grid').datagrid(options);
    //}

}


var selectedBase_User_adminIndex = 0;
km.xx_module_grid = {
    jq: null,
    init: function () {
        this.jq = $("#xx_module_grid").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: '{}',
            queryParams: { _t: com.settings.timestamp() },// url: km.model.urls["pagelist"],
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[

                   {
                       field: 'checked', title: ' ', width: 30,
                       formatter: function (value, rec, rowIndex) {
                           if (value == 0)
                               return "<input type=\"checkbox\"  name=\"PD\" value=\"" + rec.id + "\" >";
                           else
                               return "<input type=\"checkbox\" checked='checked'  name=\"PD\" value=\"" + rec.id + "\"  \" >";
                       }
                   },

 	                { field: 'module_name', title: gDictionary["module name"], width: 80, align: 'center', sortable: true },
                            { field: 'description', title: gDictionary["description"], width: 80, align: 'center', sortable: true } 


            ]],
            onClickRow: function (index, row) {
            },
            onLoadSuccess: function () {

                $("input[name='PD']").unbind().bind("click", function () {
                    // alert($(this).attr("value") + "," + ($(this).attr('checked')));

                    SetModule($(this).attr("value"));
                    return;


                });

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



function SetModule(uid) {



    var jsonParam =  { template_id: km.xx_templategrid.selectedRow.id, module_id: uid  } ;
    // alert(jsonParam);
    // return;
    com.ajax({
        type: 'POST', url: km.model.urls["update_template_module"], data: jsonParam, success: function (result) {
            // Raiserror('Name 不可为空 ...',16,1)  
            if (result.s) {
                com.message('s', result.message);
            } else {
                com.message('e', result.message);
            }
            //  alert(result);
            //  LoadOptions();
        }
    });
}
