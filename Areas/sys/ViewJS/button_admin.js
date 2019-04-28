
/*
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 新按钮管理，使用最新的程序生成器。 
//       文件： button_admin.cshtml 页面文件 
//       文件： button_admin.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/sys/ViewJS/button_admin.js
说明：按钮管理(button_admin)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
    km.template.init();
     button_6_Init();
     $('#TPL_icon_class').textbox({
         buttonText: gDictionary["choose"],
         buttonIcon: '', editable: true, value: 'icon-standard-bricks',
         onClickButton: function () {
             km.initIcon();
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
    tpl_add_html: '',//tpl_add模板的html
    tpl_icon_html: '',
    jq_add: null,
    jq_icon: null,
    initTemplate: function () {
        var data = { title: 'baiduTemplate', list: ['test data 1', 'test data 2', 'test data3'] };
        this.tpl_add_html = baidu.template('tpl_add', data);//使用baidu.template命名空间
        this.jq_add = $(this.tpl_add_html);

        var data16 = $.kmui.icons.all;
        var listData = { "title": 'icon16x16', "list": data16 }
        this.tpl_icon_html = baidu.template('tpl_icon', listData);
        this.jq_icon = $(this.tpl_icon_html);
    },
    init: function () {
        this.initTemplate();
    }
};
 
 
//------------------------------------------------------------------------------ 
//       时间： 2017-09-19
//       作者： 蔡捷   
//			 按钮管理  
//------------------------------------------------------------------------------  

function  button_6_Init(){
	km.button.init();
}

var selectedbuttonIndex = 0;
km.button= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#button").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remotesort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
            url: km.model.urls["button_pager"],
            pagination: true, pageList: [10, 20, 30, 50, 100], pageSize:   km.pageSize


            , fitColumns: true,
            columns: [[
            
 	                { field: 'button_code', title: gDictionary["button code"], width: 80, align: 'center', sortable: true },
                     {
                         field: 'button_name', title: gDictionary["button name"], width: 150, align: 'left', sortable: true, formatter: function (value, row, index) {
                             return '&nbsp;&nbsp;<a href="#"><span class="icon ' + row.icon_class + '" style="padding:7px;width:16px;">&nbsp;</span>&nbsp;' + value + '</a>';
                         }
                     },

                            { field: 'button_type', title: gDictionary["button type"], width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {
                 var h = gDictionary["undefined"];
             
                                    if(value=='0') h =gDictionary["toolbar button"]; 
                                    if(value=='1') h =gDictionary["right click button"]; 
                                    if(value=='2') h =gDictionary["other"];                                    return h;
                               } 
                                 },
                                                //{ field: 'icon_url', title: '图标URL', width: 80, align: 'center', sortable: true },
                            { field: 'sort', title: gDictionary["sort"], width: 80, align: 'center', sortable: true },
                            { field: 'js_event', title: gDictionary["JS event"], width: 80, align: 'center', sortable: true },
                            { field: 'enabled', title: gDictionary["enabled"], width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {
                 var h = gDictionary["undefined"];
             
                                    if(value=='0') h =gDictionary["disable"]; 
                                    if(value=='1') h =gDictionary["enabled"];                                    return h;
                               } 
                                 },
                                                { field: 'remark', title: gDictionary["comments"], width: 80, align: 'center', sortable: true },
                 
            ]],
            onClickRow: function (index, row) {
            
                selectedbuttonIndex = index;
                km.button.selectedIndex = index;
                km.button.selectedRow = row; 
                
                if (km.button.selectedRow)
                    km.set_mode_button('show');
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedbuttonIndex)
             		selectedbuttonIndex =0
              $("#button").datagrid("selectRow", selectedbuttonIndex);
             }
                km.button.selectedRow = km.button.getSelectedRow(); 
            
                if (km.button.selectedRow)
                  km.set_mode_button('show');
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
    do_refresh: function () { km.button.reload(); },
     do_add: function () {

        km.set_mode_button('add');

    },
    do_edit: function () {

        if (km.button.selectedRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        km.set_mode_button('edit');


    },
    do_delete: function () {
        var sRow = km.button.getSelectedRow();
        if (sRow == null) { layer.msg(gDictionary["please select one record"]); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.allow_edit == 0) { layer.msg(gDictionary["can not delete it"]); return; }
        var jsonParam =  sRow;
        com.message('c', ' <b style="color:red">' + gDictionary["confirm_delete"] + ' </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["button_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.button.reload();
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
                    var jsonObject = $("#button_content").serializeJson();
                        
                    var jsonStr =  jsonObject ;
                       if (!$("#button_content").form('validate')) {
                        layer.msg(gDictionary["data is incorrect, please try again"]);
                        return false;
                    }
        //添加自定义判断
                    //if (jsonObject.param_code == "" || jsonObject.param_value == "") { flagValid = false; com.message('e', gDictionary["the parameter can not be empty"]); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            com.ajax({
                                type: 'POST', url: km.model.urls["button_update"], data: jsonStr, success: function (result) {
                                    AfterEditbutton(result);
                                }
                            });
                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["button_insert"], data: jsonStr, success: function (result) {
                                    AfterEditbutton(result);
                                }
                            });
                        }
                    }


        //var op_mode = km.button.selectedRow == null ? 'clear' : 'show';
        //km.set_mode_button(op_mode);

    },
    do_search: function () {

    }
    ,
    do_undo: function () {
        var op_mode = km.button.selectedRow == null ? 'clear' : 'show';
        km.set_mode_button(op_mode);
    }
};


function AfterEditbutton(result) {
    if (result.s) {
        com.message('s', result.message);
        km.button.reload();
        if (km.settings.op_mode == 'add') {
            km.button.unselectAll();
            km.set_mode_button('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.button.selectRow(km.button.selectedIndex);
            km.button.selectedRow = $.extend(km.button.selectedRow, jsonObject);
            km.set_mode_button('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/*显示：'show'  新增：'add'  编辑 'edit'  清空 'clear'*/
km.set_mode_button = function (op_mode) {
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
        $('#button_content').form('load', km.button.selectedRow);
     //   km.orgcombotree.jq.combotree('setValue', km.button.selectedRow.DepartmentCode);
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
        
        $('#button_content').form('clear');
        
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
        $('#button_content').form('clear');
        
    }
}

//初始化图标选择
km.initIcon = function () {
    //addwin.find('#TPL_icon_class').textbox({
    //    buttonText: gDictionary["choose"],
    //    buttonIcon: '', editable: false,
    //    onClickButton: function () {
    //        km.initIcon(win);
    //    }
    //});
    var $this = $('#TPL_icon_class').textbox();
    var $spanicon = $('#span_icon');
   // var win = $('#button_content');
    km.showIconSelector(km.template.tpl_icon_html, function (win) {
        var hwin = win.html();
        win.find("span").click(function () {
            //alert($(this)[0].id);
            var old_icontext = win.find("#icontext").text();
            if (old_icontext != "") {
                win.find("#" + old_icontext).removeClass("icon_selected");
            }
            var new_icontext = $(this)[0].id;
            $(this).addClass("icon_selected");
            win.find("#icontext").text(new_icontext);
            win.find("#span_selected_icon").removeClass();
            win.find("#span_selected_icon").addClass("icon ").addClass(new_icontext).addClass("iconbox");

        });
    }, function (win) {
        var selected_icontext = win.find("#icontext").text();
        if (selected_icontext == "") {
            com.message('w', gDictionary["please select an icon"]);
            return;
        }
        //console.info($this);
        $this.textbox('setValue', selected_icontext);
        $spanicon.removeClass().addClass("icon").addClass(selected_icontext);
        $spanicon.attr('title', selected_icontext);
        parent.$(win).dialog('destroy');
        //alert(selected_icontext);
    });
}
//显示图标选择对话框
km.showIconSelector = function (html, before, dosave) {
    com.dialog({
        title: gDictionary["icon select"],
        html: html, resizable: true, maximizable: true, width: 600,
        height: 400, btntext: gDictionary["are you sure to select this one"]
    }, before, dosave);
}






