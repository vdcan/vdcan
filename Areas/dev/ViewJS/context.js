
/*
//------------------------------------------------------------------------------ 
//        Date  2018-05-19
//        Author  蔡捷   
//			 				文本内容维护 
//        File  context.cshtml  Page file  
//        File  context.js JS File 
//------------------------------------------------------------------------------
 Path ~/Areas/dev/ViewJS/context.js
 Description 文本内容维护(context)  js File 
*/
// Current page object 
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model();
    //   km.template.init();
    context_6_Init();


    // if it is static combobox can be deleted 
    $('.easyui-combobox').each(function (index, element) {
        var options = $(this).combobox('options')
        var u = $(this).attr("url2")

        if (u != undefined) {

            options.url = km.model.urls[u];
            if (options.multiple == true) {

                options.formatter = function (row) { //formatter this method is used to add options checkbox select method   
                    var opts = $(this).combobox('options');
                    return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField]
                };
                options.onLoadSuccess = function () {  // after select load successfuly   
                    var opts = $(this).combobox('options');
                    var target = this;
                    var values = $(target).combobox('getValues');// get selected value values  
                    $.map(values, function (value) {
                        var el = opts.finder.getEl(target, value);
                        el.find('input.combobox-checkbox')._propAttr('checked', true);
                    })
                };
                options.onSelect = function (row) { // when select an option   
                    var opts = $(this).combobox('options');
                    // get selected value values  
                    //$("#"+id).val($(this).combobox('getValues'));  

                    // set check box in combobox   
                    var el = opts.finder.getEl(this, row[opts.valueField]);
                    el.find('input.combobox-checkbox')._propAttr('checked', true);
                }
                options.onUnselect = function (row) {// nothing selected   
                    var opts = $(this).combobox('options');
                    // get selected value values  
                    //    $("#"+id).val($(this).combobox('getValues'));  

                    var el = opts.finder.getEl(this, row[opts.valueField]);
                    el.find('input.combobox-checkbox')._propAttr('checked', false);
                }
            }
            $(this).combobox(options);

        }


        // <input id='test' class='easyui-combobox' loader="ttn" name='test' type='text' data-options="valueField:'text',textField:'text',mode : 'remote' " style='width:100px' />
        var loader = $(this).attr("loader");
        if (loader != undefined) {
            options.loader = function (param, success, error) {
                var q = param.q || "";
                if (q.length <= 0) {
                    console.log("q.length <= 0");
                    return false;
                }
                var jsonParam = { loader: loader, value: q }
                com.ajax({
                    url: km.model.urls["loader"], data: jsonParam, success: function (result) {
                        success(result);
                    }
                });
            };
            $(this).combobox(options);
        }

    });

}

/* Init iframe parent page model object app.index.js client object */
km.init_parent_model = function () {
    // Only in child page, it can get parent page model object  parent.wrapper.model
    if (window != parent) {
        if (parent.wrapper) {
            km.parent_model = parent.wrapper.model;
            //com.message('s', ' Got parent page model object <br>' + JSON.stringify(km.parent_model));
        } else {
            com.showcenter(' message ', " exist parent page, but can not get it parent.wrapper object ");
        }
    } else {
        com.showcenter(' message ', " the cureent page is out of iframe ，can not get parent.wrapper Object ");
    }
}

$(km.init);

// page object parameters 
km.settings = {};

// Data format 
km.gridformat = {};


function showValue(value, data, type) {

    var tmp = "";
    var a = data.split(" ");
    for (var i = 0; i < a.length; i++) {

        var v = a[i].split("=")[0];
        var t = a[i].split("=")[1];
        if (type == "checkbox") {

            if (("," + value + ",").indexOf("," + v + ",") >= 0)
                tmp += "&nbsp;<input type='checkbox' checked  disabled='true'  >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox' disabled='true' >&nbsp;" + t;


        } else if (type == "radio") {
            if (value == v)
                tmp += "&nbsp;<input type='radio' checked disabled='true' >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='radio' disabled='true' >&nbsp;" + t;
        } else {
            if (value == v)
                return t;
        }
    }
    return tmp;
}



//------------------------------------------------------------------------------ 
//        Date  2018-05-19
//        Author  蔡捷   
//			   
//------------------------------------------------------------------------------  

function context_6_Init() {
    km.context.init();
    if (km.context.LoadData != undefined)
        km.context.LoadData();
}



function addcontext(index) {


    km.toolbar.do_add();
}

function editcontext(index) {
    $('#context').datagrid('selectRow', index);//  the key is   

    km.toolbar.do_edit();
}
function deletecontext(index) {
    $('#context').datagrid('selectRow', index);//  the key is   

    km.toolbar.do_delete();
}


function g_context_type() {
    if (gMenuCodeAlias == '')
        return '1';
    else return gMenuCodeAlias;
}

var selectedcontextIndex = 0;



km.context = {
    jq: null,

    LoadData: function () {
        var options = $('#context').datagrid('options')
        options.queryParams = {
            _t: com.settings.timestamp(),
            type: g_context_type(),
        };
        options.url = km.model.urls["context_pager"];
        $('#context').datagrid(options);

    },

    init: function () {
        this.jq = $("#context").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',




            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[

                { field: 'id', title: gDictionary["id"], width: 20, align: 'center', sortable: true },
                { field: 'title', title: gDictionary["title"], width: 80, align: 'left', sortable: true },

 	                {
 	                    field: 'active_flag', title: gDictionary["active"], width: 30, align: 'left', sortable: true, formatter: function (value, row, index) {

 	                        return showValue(value, '1=是 0=否', 'checkbox');
 	                    }
 	                },
                                                { field: 'add_by', title: gDictionary["add_by"], width: 20, align: 'center', sortable: true },
                { field: 'add_on', title: gDictionary["add_on"], width: 60, align: 'center', sortable: true },
                //{ field: 'context', title: gDictionary["context"], width: 80, align: 'center', sortable: true },
                //{ field: 'type', title: gDictionary["type"], width: 80, align: 'left', sortable: true,formatter: function (value, row, index) {

                //                    return showValue(value,'1=FAQ 2=框架 3=生成器','combobox' );
                //               }},
    //                                 {
    //                            field: 'id', title: '<a href="#" onclick="addcontext( )"> increase </a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
    //                                return '<a href="#" onclick="editcontext(' + index + ')"> modifiy </a>&nbsp;|&nbsp;<a href="#" onclick="deletecontext(' + index + ')"> delete </a>';
    //}  },



            ]],
            onClickRow: function (index, row) {

                selectedcontextIndex = index;
                km.context.selectedIndex = index;
                km.context.selectedRow = row;

                if (km.context.selectedRow)
                    km.set_mode_context('show');
            },
            onLoadSuccess: function (data) {

                if (data.rows.length > 0) {

                    if (data.rows.length <= selectedcontextIndex)
                        selectedcontextIndex = 0
                    $("#context").datagrid("selectRow", selectedcontextIndex);
                }
                km.context.selectedRow = km.context.getSelectedRow();

                if (km.context.selectedRow)
                    km.set_mode_context('show');
            }
        });//end grid init
    },
    reload: function (queryParams) {

        this.LoadData();
    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};



/* menu bar button event */
km.toolbar = {
    do_refresh: function () { km.context.reload(); },
    do_add: function () {

        km.set_mode_context('add');

    },
    do_edit: function () {

        if (km.context.selectedRow == null) { layer.msg(' Please select an recorder '); return; }
        km.set_mode_context('edit');


    },
    do_delete: function () {
        var sRow = km.context.getSelectedRow();
        if (sRow == null) { layer.msg(' Please select an recorder '); return; }
        //if (km.model.loginer.IsSuperAdmin == 0 && sRow.AllowEdit == 0) { layer.msg(' 此参数不可删除！ '); return; }
        var jsonParam = JSON.stringify(sRow);
        com.message('c', ' <b style="color:red"> Are you sure to delete it? 文本表 ( ' + sRow.id + ' )?  </b>', function (b) {
            if (b) {
                com.ajax({
                    url: km.model.urls["context_delete"], data: jsonParam, success: function (result) {
                        if (result.s) {
                            com.message('s', result.message);
                            km.context.reload();
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
        var jsonObject = $("#context_content").serializeJson();
        jsonObject.type = 0;



        if (jsonObject.active_flag == undefined)
            jsonObject.active_flag = "";





        var jsonStr = jsonObject;
        jsonStr.type = g_context_type();
        if (!$("#context_content").form('validate')) {
            layer.msg(' Data incorrect, please try again ');
            return false;
        }

        jsonObject.context = jsonObject.context.replaceAll(">", "&gt;").replaceAll("<", "&lt;");
        // add define 
        //if (jsonObject.ParamCode == "" || jsonObject.ParamValue == "") { flagValid = false; com.message('e', ' the parameters can not be empty '); return; }
        if (flagValid) {
            if (km.settings.op_mode == 'edit') {
                com.ajax({
                    type: 'POST', url: km.model.urls["context_update"], data: jsonStr, success: function (result) {
                        AfterEditcontext(result);
                    }
                });
            }

            if (km.settings.op_mode == 'add') {
                com.ajax({
                    type: 'POST', url: km.model.urls["context_insert"], data: jsonStr, success: function (result) {
                        AfterEditcontext(result);
                    }
                });
            }
        }



    }
    ,
    do_undo: function () {
        var op_mode = km.context.selectedRow == null ? 'clear' : 'show';
        km.set_mode_context(op_mode);
    }
};


function AfterEditcontext(result) {
    if (result.s) {
        com.message('s', result.message);
        km.context.reload();
        if (km.settings.op_mode == 'add') {
            //    km.context.unselectAll();
            km.set_mode_context('clear');
        }
        if (km.settings.op_mode == 'edit') {
            km.context.selectRow(km.context.selectedIndex);
            km.context.selectedRow = $.extend(km.context.selectedRow, jsonObject);
            km.set_mode_context('show');
        }


    } else {
        com.message('e', result.message);
    }
}



/* display 'show'   add 'add'   edit  'edit'   clean  'clear'*/
km.set_mode_context = function (op_mode) {
    km.settings.op_mode = op_mode;
    $('#km_toolbar').show();
    $('#km_toolbar_2').hide();
    com.mask($('#west_panel'), false);
    // $('#user_tabs').tabs('enableTab', 1);
    // $('#user_tabs').tabs('enableTab', 2);
    $('#context_content .easyui-combobox').combobox('readonly', true);
    $('#context_content .easyui-combotree').combotree('readonly', true);
    $('#context_content .easyui-textbox').textbox('readonly', true);
    $('#context_content .easyui-numberbox').numberbox('readonly', true);

    $("#context_content").find("input[type='radio']").attr("disabled", "true");// this  
    $("#context_content").find("input[type='checkbox']").attr("disabled", "true");// this  
    if (op_mode == 'show') {
        //console.info(JSON.stringify(km.context.selectedRow));
        var sRow = km.context.selectedRow;

        if ((sRow.active_flag + "").indexOf(",") > 0)
            sRow.active_flag = sRow.active_flag.split(",");





        $("#tdText").html('<textarea rows="3" style="width:100%;  " class="v_content" id="TPL_context" name="context" ></textarea>');

        //  description = jsonObject.description.replaceAll("<", "&gt;").replaceAll(">", "&lt;");
        $("#TPL_context").val(sRow.context.replaceAll("&gt;", ">").replaceAll("&lt;", "<"));


        var h = 500;// $("#main-panel_b").height();
        //  alert(h);
        editor = KindEditor.create('.v_content', {
            resizeType: 1, width: "100%;", height: h + "px",
            allowPreviewEmoticons: false,

            allowImageUpload: true,//允许上传图片

            allowFileManager: false, //允许对上传图片进行管理

            uploadJson: '/dev/titan2/uploadImg', //上传图片的java代码，只不过放在jsp中

            //afterChange:function(){
            //this.sync();
            //},

            afterBlur: function () {
                this.sync();
            }
        });




        $('#context_content').form('load', sRow);
        //   km.orgcombotree.jq.combotree('setValue', km.context.selectedRow.DepartmentCode);
    } else if (op_mode == 'add') {
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);

        //  $('#user_tabs').tabs('disableTab', 1);
        //  $('#user_tabs').tabs('disableTab', 2);
        //  $('#user_tabs').tabs('select', 0);

        $("#context_content").find("input[type='radio']").removeAttr("disabled");
        $("#context_content").find("input[type='checkbox']").removeAttr("disabled");

        $('#context_content .easyui-combobox').combobox('readonly', false);
        $('#context_content .easyui-combotree').combotree('readonly', false);
        $('#context_content .easyui-textbox').textbox('readonly', false);
        $('#context_content .easyui-numberbox').numberbox('readonly', false);

        $('#context_content').form('clear');


        //  $('#TPL_id').val(0);
        //$('#TPL_Enabled').combobox('setValue', 1);
        //$('#TPL_UserType').combobox('setValue', 3);
        //$('#TPL_IsSingleLogin').combobox('setValue', 1);
        //$('#TPL_Sex').combobox('setValue', ' male ');
        //$('#TPL_Sort').numberbox('setValue', 888);

    } else if (op_mode == 'edit') {

        $("#context_content").find("input[type='radio']").removeAttr("disabled");
        $("#context_content").find("input[type='checkbox']").removeAttr("disabled");
        //alert($('#context_content .easyui-text'));
        $('#context_content .easyui-combobox').combobox('readonly', false);
        $('#context_content .easyui-combotree').combotree('readonly', false);
        $('#context_content .easyui-textbox').textbox('readonly', false);
        $('#context_content .easyui-numberbox').numberbox('readonly', false);
        $('#km_toolbar').hide();
        $('#km_toolbar_2').show();
        com.mask($('#west_panel'), true);
        $('#TPL_add_on').textbox('readonly', true);

        //$('#user_tabs').tabs('disableTab', 1);
        //$('#user_tabs').tabs('disableTab', 2);
        //$('#user_tabs').tabs('select', 0);
    } else if (op_mode == 'clear') {
        $('#context_content').form('clear');

    }
}





