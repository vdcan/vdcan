
/*
//------------------------------------------------------------------------------
//       时间： 2017-03-28 09:07:29
//       作者： 蔡捷     
//			  
//       文件： Base_Procedure_Parameters.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/Dev/ViewJS/Base_Procedure_Parameters.js
说明：存储过程参数(Base_Procedure_Parameters)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model();
    km.template.init();
    km.Base_Procedure_Parametersgrid.init();
    
    
   //如果没有动态combobox可删除
     $('.easyui-combobox').each(function (index, element) {
       var options = $(this).combobox('options')
          var u = $(this).attr("url2")
      
        if (u!= undefined) { 
         
            options.url =  km.model.urls[u];
         $(this).combobox(options);
        } 

    });
    

     $('#TPL_procedure_name').combobox({
         onChange: function (c, o) {
       //     alert('');
           var options = $("#TPL_parameter_name").combobox('options')
              var u = $("#TPL_parameter_name").attr("url3")

            if (u != undefined) {
               var jsonParam =  { proc: c } ;
                 options.url = km.model.urls[u]+"&proc="+c;
               //  options.queryParams = jsonParam;
                  $("#TPL_parameter_name").combobox(options);
             }
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

var selectedBase_Procedure_ParametersIndex = 0;
km.Base_Procedure_Parametersgrid = {
    jq: null,
    init: function () {
        this.jq = $("#Base_Procedure_Parametersgrid").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: '{identityField}',
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, url: km.model.urls["pagelist"],
            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[
            
 	                { field: 'id', title: gDictionary["id"], width: 40, align: 'center', sortable: true },
                            { field: 'procedure_name', title: gDictionary["stored procedure name"], width: 300, align: 'left', sortable: true },
                            { field: 'parameter_name', title: gDictionary["parameter"], width: 100, align: 'left', sortable: true },
                  //          { field: 'parameter_type', title: gDictionary["parameter type"], width: 80, align: 'center', sortable: true },
                 //           { field: 'max_length', title: gDictionary["length"], width: 80, align: 'center', sortable: true },
                 //           { field: 'is_out', title: gDictionary["ouput flag"], width: 80, align: 'center', sortable: true,formatter: function (value, row, index) {
                 //var h = gDictionary["undefined"];
             
                 //                   if(value=='0') h =gDictionary["input"]; 
                 //                   if(value=='1') h =gDictionary["output"];                                    return h;
                 //              } 
                 //                },
                                                { field: 'from__where', title: gDictionary["from where"], width: 80, align: 'center', sortable: true,formatter: function (value, row, index) {
                 var h = gDictionary["undefined"];
             
                                    if(value=='session') h ='session'; 
                                    if(value=='param') h ='param'; 
                                    if(value=='data') h ='data';                                    return h;
                               } 
                                 },
                                     
            ]],
            onClickRow: function (index, row) {
            
                selectedBase_Procedure_ParametersIndex = index;
                km.Base_Procedure_Parametersgrid.selectedIndex = index;
                km.Base_Procedure_Parametersgrid.selectedRow = row;
              //  km.rolegrid.setUserRoles(row);
                if (km.Base_Procedure_Parametersgrid.selectedRow)
                    km.set_mode('show');
            },
            onLoadSuccess: function () {
            
                $("#Base_Procedure_Parametersgrid").datagrid("selectRow", selectedBase_Procedure_ParametersIndex);
              
                km.Base_Procedure_Parametersgrid.selectedRow = km.Base_Procedure_Parametersgrid.getSelectedRow();
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
    do_refresh: function () { km.Base_Procedure_Parametersgrid.reload(); },
     do_add: function () {

        km.set_mode('add');

    },
    do_edit: function () {

        if (km.Base_Procedure_Parametersgrid.selectedRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        km.set_mode('edit');


    },
    do_delete: function () {
        var sRow = km.Base_Procedure_Parametersgrid.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam =  sRow ;
        com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.Base_Procedure_Parametersgrid.reload();
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
                    var jsonObject = $("#Base_Procedure_Parameters_content").serializeJson();
                    var jsonStr =  jsonObject ;
        //添加自定义判断
                    //if (jsonObject.param_code == "" || jsonObject.param_value == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            com.ajax({
                                type: 'POST', url: km.model.urls["edit"], data: jsonStr, success: function (result) {
                                    AfterEditBase_Procedure_Parameters(result);
                                }
                            });
                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["add"], data: jsonStr, success: function (result) {
                                    AfterEditBase_Procedure_Parameters(result);
                                }
                            });
                        }
                    }


       

    },
    do_search: function () {

    }
    ,
    do_undo: function () {
        var op_mode = km.Base_Procedure_Parametersgrid.selectedRow == null ? 'clear' : 'show';
        km.set_mode(op_mode);
    }
};


function AfterEditBase_Procedure_Parameters(result) {
    if (result.s) {
        com.message('s', result.message);
        km.Base_Procedure_Parametersgrid.reload();
        if (km.settings.op_mode == 'add') {
            km.Base_Procedure_Parametersgrid.unselectAll();
            km.set_mode('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.Base_Procedure_Parametersgrid.selectRow(km.Base_Procedure_Parametersgrid.selectedIndex);
            km.Base_Procedure_Parametersgrid.selectedRow = $.extend(km.Base_Procedure_Parametersgrid.selectedRow, jsonObject);
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
    $('#user_tabs').tabs('enableTab', 2);
    $('.form_content .easyui-combobox').combobox('readonly', true);
    $('.form_content .easyui-combotree').combotree('readonly', true);
    $('.form_content .easyui-textbox').textbox('readonly', true);
    $('.form_content .easyui-numberbox').numberbox('readonly', true);

    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.Base_Procedure_Parametersgrid.selectedRow));
        $('#Base_Procedure_Parameters_content').form('load', km.Base_Procedure_Parametersgrid.selectedRow);
        $('#Base_Procedure_Parameters_content_other').form('load', km.Base_Procedure_Parametersgrid.selectedRow);
     //   km.orgcombotree.jq.combotree('setValue', km.Base_Procedure_Parametersgrid.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
        
        $('#user_tabs').tabs('disableTab', 1);
        $('#user_tabs').tabs('disableTab', 2);
        $('#user_tabs').tabs('select', 0);
        
        
        $('.form_content .easyui-combobox').combobox('readonly', false);
        $('.form_content .easyui-combotree').combotree('readonly', false);
        $('.form_content .easyui-textbox').textbox('readonly', false);
        $('.form_content .easyui-numberbox').numberbox('readonly', false);
        
        $('#Base_Procedure_Parameters_content').form('clear');
        
                //  $('#TPL_procedure_name').textbox('readonly', true);
                 //   $('#TPL_parameter_name').textbox('readonly', true);
                   // $('#TPL_parameter_type').textbox('readonly', true);
                   // $('#TPL_max_length').textbox('readonly', true);
                   // $('#TPL_is_out').textbox('readonly', true);
          
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
        $('#Base_Procedure_Parameters_content').form('clear');
        
    }
}



