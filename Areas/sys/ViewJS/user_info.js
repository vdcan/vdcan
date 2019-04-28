
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-01-11
//       作者： 蔡捷   
//			 修改个人信息. 
//       文件： user_info.cshtml 页面文件 
//       文件： user_info.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/sys/ViewJS/user_info.js
说明：个人信息(user_info)的js文件
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
//       时间： 2018-01-11
//       作者： 蔡捷   
//			 用户  
//------------------------------------------------------------------------------  
var gData;

function  xx_User_6_Init(){
	 
    com.ajax({
        type: 'POST', url: km.model.urls["User_detail"],  showLoading: false, success: function (result) {
            gData = result;
            km.set_mode_xx_User("show");
        }
    });// end ajax  
    com.ajax({
        type: 'POST', url: "/dev/titan/GetQR", showLoading: false, success: function (result) {
           
            $("#qrImg").attr("src", result.url);
        }
    });// end ajax    
   

}
 


/*工具栏权限按钮事件*/
km.toolbar = {
    do_refresh: function () { xx_User_6_Init();},
   
    do_edit: function () {
        km.set_mode_xx_User("edit");;
    },
    do_save: function () {

                    var flagValid = true;
                    var jsonObject = $("#xx_User_content").serializeJson();
                    jsonObject.active = 1;
                   jsonObject.user_type=0;//替换该值     
                    var jsonStr = JSON.stringify(jsonObject);
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
        xx_User_6_Init();
    }
};


function AfterEditxx_User(result) {
    if (result.s) {
        com.message('s', result.message);
        //km.xx_User.reload();
        //if (km.settings.op_mode == 'add') {
        //    km.xx_User.unselectAll();
        //    km.set_mode_xx_User('clear');
        //}
        //if (km.settings.op_mode == 'edit') {
        //    //km.xx_User.selectRow(km.xx_User.selectedIndex);
        //    //km.xx_User.selectedRow = $.extend(km.xx_User.selectedRow, jsonObject);
        //    km.set_mode_xx_User('show');
        //}


        //var op_mode = km.xx_User.selectedRow == null ? 'clear' : 'show';
        //km.set_mode_xx_User(op_mode);
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
        $('#xx_User_content').form('load', gData[0]);
     //   km.orgcombotree.jq.combotree('setValue', km.xx_User.selectedRow.DepartmentCode);
    }   else if (op_mode == 'edit') {
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





