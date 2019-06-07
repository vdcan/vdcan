
/*
//------------------------------------------------------------------------------ 
//        Date  2019-06-07
//        Author  蔡捷   
//			 				Class Admin 
//        File  class_admin.cshtml  Page file  
//        File  class_admin.js JS File 
//------------------------------------------------------------------------------
 Path ~/Areas/anjs/ViewJS/class_admin.js
 Description Class Admin(class_admin)  js File 
*/
// Current page object 
var km = {}; 
km.init = function () {
}
 

 
 
//------------------------------------------------------------------------------ 
//        Date  2019-06-07
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  

function  ClassAdmin_6_Init(){
	km.ClassAdmin.init();
	if(	km.ClassAdmin.LoadData!=undefined)	
		km.ClassAdmin.LoadData(); 
}



function addClassAdmin(index) {
    
   
    km.toolbar.do_add();
}

function editClassAdmin(index) {
    $('#ClassAdmin').datagrid('selectRow', index);//  the key is   
   
    km.toolbar.do_edit();
}
function deleteClassAdmin(index) {
    $('#ClassAdmin').datagrid('selectRow', index);//  the key is   
   
    km.toolbar.do_delete();
}



var selectedClassAdminIndex = 0;



km.ClassAdmin= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#ClassAdmin").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
            url: km.model.urls["ClassAdmin_pager"],
               	 
 

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[
   
            
 	                { field: 'active_flag', title: 'Active Flag', width: 80, align: 'center', sortable: true },
                { field: 'add_by', title: 'Add By', width: 80, align: 'center', sortable: true },
                { field: 'add_on', title: 'Add On', width: 80, align: 'center', sortable: true },
                { field: 'class_title', title: 'Class Title', width: 80, align: 'center', sortable: true },
                { field: 'class_type', title: 'Class Type', width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {
              
                                    return showValue(value,'english=english chinese=chinese','combobox' );
                               }},
                                                { field: 'comments', title: 'Comments', width: 80, align: 'center', sortable: true },
                { field: 'CONTEXT', title: 'Context', width: 80, align: 'center', sortable: true },
                { field: 'id', title: 'Id', width: 80, align: 'center', sortable: true },
                { field: 'method', title: 'Method', width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {
              
                                    return showValue(value,'web=web wechat=wechat','combobox' );
                               }},
                                     {
                                field: 'id', title: '<a href="#" onclick="addClassAdmin( )"> increase </a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
                                    return '<a href="#" onclick="editClassAdmin(' + index + ')"> modifiy </a>&nbsp;|&nbsp;<a href="#" onclick="deleteClassAdmin(' + index + ')"> delete </a>';
    }  },
    
                
 
            ]],
            onClickRow: function (index, row) {
            
                selectedClassAdminIndex = index;
                km.ClassAdmin.selectedIndex = index;
                km.ClassAdmin.selectedRow = row; 
                
                if (km.ClassAdmin.selectedRow)
                    km.set_mode_ClassAdmin('show');
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedClassAdminIndex)
             		selectedClassAdminIndex =0
              $("#ClassAdmin").datagrid("selectRow", selectedClassAdminIndex);
             }
                km.ClassAdmin.selectedRow = km.ClassAdmin.getSelectedRow(); 
            
                if (km.ClassAdmin.selectedRow)
                  km.set_mode_ClassAdmin('show');
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



/* menu bar button event */
km.toolbar = {
    do_refresh: function () { km.ClassAdmin.reload(); },
     do_add: function () {

        km.set_mode_ClassAdmin('add');

    },
    do_edit: function () {

        if (km.ClassAdmin.selectedRow == null) { layer.msg(' Please select an recorder '); return; }
        km.set_mode_ClassAdmin('edit');


    },
    do_delete: function () {
        var sRow = km.ClassAdmin.getSelectedRow();
        if (sRow == null) { layer.msg(' Please select an recorder '); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg(' 此参数不可删除！ '); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red"> Are you sure to delete it?  ( ' + sRow.id + ' )?  </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["ClassAdmin_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.ClassAdmin.reload();
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
                    var jsonObject = $("#ClassAdmin_content").serializeJson();
                        
     
     
                  
     
                    var jsonStr =  jsonObject ;
                    	                       if (!$("#ClassAdmin_content").form('validate')) {
                        layer.msg(' Data incorrect, please try again ');
                        return false;
                    }
        // add define 
                    //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', ' the parameters can not be empty '); return; }
                    if (flagValid) {
                        if (km.settings.op_mode == 'edit') {
                            com.ajax({
                                type: 'POST', url: km.model.urls["ClassAdmin_update"], data: jsonStr, success: function (result) {
                                    AfterEditClassAdmin(result);
                                }
                            });
                        }
                        
                        if (km.settings.op_mode == 'add') {
                                com.ajax({
                                type: 'POST', url: km.model.urls["ClassAdmin_insert"], data: jsonStr, success: function (result) {
                                    AfterEditClassAdmin(result);
                                }
                            });
                        }
                    }

 

    } 
    ,
    do_undo: function () {
        var op_mode = km.ClassAdmin.selectedRow == null ? 'clear' : 'show';
        km.set_mode_ClassAdmin(op_mode);
    }
};


function AfterEditClassAdmin(result) {
    if (result.s) {
        com.message('s', result.message);
        km.ClassAdmin.reload();
        if (km.settings.op_mode == 'add') {
        //    km.ClassAdmin.unselectAll();
            km.set_mode_ClassAdmin('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.ClassAdmin.selectRow(km.ClassAdmin.selectedIndex);
            km.ClassAdmin.selectedRow = $.extend(km.ClassAdmin.selectedRow, jsonObject);
            km.set_mode_ClassAdmin('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/* display 'show'   add 'add'   edit  'edit'   clean  'clear'*/
km.set_mode_ClassAdmin = function (op_mode) {
    km.settings.op_mode = op_mode;
    $('#km_toolbar').show();
    $('#km_toolbar_2').hide();
    com.mask($('#west_panel'), false);
   // $('#user_tabs').tabs('enableTab', 1);
   // $('#user_tabs').tabs('enableTab', 2);
    $('#ClassAdmin_content .easyui-combobox').combobox('readonly', true);
    $('#ClassAdmin_content .easyui-combotree').combotree('readonly', true);
    $('#ClassAdmin_content .easyui-textbox').textbox('readonly', true);
    $('#ClassAdmin_content .easyui-numberbox').numberbox('readonly', true);

    $("#ClassAdmin_content").find("input[type='radio']").attr("disabled", "true");// this  
    $("#ClassAdmin_content").find("input[type='checkbox']").attr("disabled", "true");// this  
    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.ClassAdmin.selectedRow));
      var sRow = km.ClassAdmin.selectedRow;
                   
        
        
        $('#ClassAdmin_content').form('load', sRow);
     //   km.orgcombotree.jq.combotree('setValue', km.ClassAdmin.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
        
      //  $('#user_tabs').tabs('disableTab', 1);
      //  $('#user_tabs').tabs('disableTab', 2);
      //  $('#user_tabs').tabs('select', 0);
        
    $("#ClassAdmin_content").find("input[type='radio']").removeAttr("disabled" ); 
    $("#ClassAdmin_content").find("input[type='checkbox']").removeAttr("disabled" ); 
        
        $('#ClassAdmin_content .easyui-combobox').combobox('readonly', false);
        $('#ClassAdmin_content .easyui-combotree').combotree('readonly', false);
        $('#ClassAdmin_content .easyui-textbox').textbox('readonly', false);
        $('#ClassAdmin_content .easyui-numberbox').numberbox('readonly', false);
        
        $('#ClassAdmin_content').form('clear');
        
        
      //  $('#TPL_id').val(0);
        //$('#TPL_Enabled').combobox('setValue', 1);
        //$('#TPL_UserType').combobox('setValue', 3);
        //$('#TPL_IsSingleLogin').combobox('setValue', 1);
        //$('#TPL_Sex').combobox('setValue', ' male ');
        //$('#TPL_Sort').numberbox('setValue', 888);

    } else if (op_mode == 'edit') {
    	
    $("#ClassAdmin_content").find("input[type='radio']").removeAttr("disabled" ); 
    $("#ClassAdmin_content").find("input[type='checkbox']").removeAttr("disabled" ); 
        //alert($('#ClassAdmin_content .easyui-text'));
        $('#ClassAdmin_content .easyui-combobox').combobox('readonly', false);
        $('#ClassAdmin_content .easyui-combotree').combotree('readonly', false);
        $('#ClassAdmin_content .easyui-textbox').textbox('readonly', false);
        $('#ClassAdmin_content .easyui-numberbox').numberbox('readonly', false);
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
                   $('#TPL_add_by').textbox('readonly', true);
                    $('#TPL_add_on').textbox('readonly', true);
               
        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#ClassAdmin_content').form('clear');
        
    }
}





