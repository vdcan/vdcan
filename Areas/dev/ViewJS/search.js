
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-17
//       作者： fdsaf   
//			 s 
//       文件： search.cshtml 页面文件 
//       文件： search.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/dev/ViewJS/search.js
说明：search(search)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;
var gdlg = {};
km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model();
    //   km.template.init();
    test_user_1_Init();

    //如果没有动态combobox可删除
    $('.easyui-combobox').each(function (index, element) {
        var options = $(this).combobox('options')
        var u = $(this).attr("url2")

        if (u != undefined) {

            options.url = km.model.urls[u];
            if (options.multiple == true) {

                options.formatter = function (row) { //formatter方法就是实现了在每个下拉选项前面增加checkbox框的方法  
                    var opts = $(this).combobox('options');
                    return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField]
                };
                options.onLoadSuccess = function () {  //下拉框数据加载成功调用  
                    var opts = $(this).combobox('options');
                    var target = this;
                    var values = $(target).combobox('getValues');//获取选中的值的values  
                    $.map(values, function (value) {
                        var el = opts.finder.getEl(target, value);
                        el.find('input.combobox-checkbox')._propAttr('checked', true);
                    })
                };
                options.onSelect = function (row) { //选中一个选项时调用  
                    var opts = $(this).combobox('options');
                    //获取选中的值的values  
                    //$("#"+id).val($(this).combobox('getValues'));  

                    //设置选中值所对应的复选框为选中状态  
                    var el = opts.finder.getEl(this, row[opts.valueField]);
                    el.find('input.combobox-checkbox')._propAttr('checked', true);
                }
                options.onUnselect = function (row) {//不选中一个选项时调用  
                    var opts = $(this).combobox('options');
                    //获取选中的值的values  
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

/*初始化iframe父页面的model对象，即：访问app.index.js文件中的客户端对象*/
km.init_parent_model = function () {
    //只有当前页面有父页面时，可以获取到父页面的model对象 parent.wrapper.model
    if (window != parent) {
        if (parent.wrapper) {
            km.parent_model = parent.wrapper.model;
            //com.message('s', '获取到父页面的model对象：<br>' + JSON.stringify(km.parent_model));
        } else {
            com.showcenter('提示', "存在父页面，但未能获取到parent.wrapper对象");
        }
    } else {
        com.showcenter('提示', "当前页面已经脱离iframe，无法获得parent.wrapper对象！");
    }
}

$(km.init);

//页面对象参数设置
km.settings = {};

//格式化数据
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
//       时间： 2018-03-17
//       作者： fdsaf   
//			   
//------------------------------------------------------------------------------  

function test_user_1_Init() {

    $("#addition_bar_test_user").detach().appendTo('#km_toolbar2');;
    km.test_user.init();
    km.test_user.LoadData();
}


var selectedtest_userIndex = 0;
km.test_user = {
    jq: null,

    LoadData: function () {
        var options = $('#test_user').datagrid('options')

        options.queryParams = $("#test_user_s").serializeJson();
        options.queryParams._t = com.settings.timestamp();

        options.url = km.model.urls["search_test_user"];
        $('#test_user').datagrid(options);

    },

    init: function () {
        this.jq = $("#test_user").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',



            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize: km.pageSize, fitColumns: true,
            columns: [[



 	                { field: 'add_on', title: '创建日期', width: 80, align: 'center', sortable: true },
                { field: 'add_by', title: '创建人', width: 80, align: 'center', sortable: true },
                { field: 'user_name', title: '用户名', width: 80, align: 'center', sortable: true },
                { field: 'password', title: '口令', width: 80, align: 'center', sortable: true },
                { field: 'email', title: 'email', width: 80, align: 'center', sortable: true },
                { field: 'name', title: '姓名', width: 80, align: 'center', sortable: true },
                { field: 'department_id', title: '部门编号', width: 80, align: 'center', sortable: true },

            ]],
            onClickRow: function (index, row) {

                selectedtest_userIndex = index;
                km.test_user.selectedIndex = index;
                km.test_user.selectedRow = row;
                if (km.test_user.selectedRow) {

                }
            },
            onLoadSuccess: function (data) {

                if (data.rows.length > 0) {

                    if (data.rows.length <= selectedtest_userIndex)
                        selectedtest_userIndex = 0
                    $("#test_user").datagrid("selectRow", selectedtest_userIndex);
                }
                km.test_user.selectedRow = km.test_user.getSelectedRow();
                if (km.test_user.selectedRow) {

                }
            }
        });//end grid init
    },
    reload: function (queryParams) {

        this.LoadData();
    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


var editor = {};

/*
for searching
*/
if (km.toolbar) {

    km.toolbar.do_search = function () {

        km.test_user.LoadData();
    };


    km.toolbar.do_help = function () {

        $("[href]").addClass("selected");
        $("[href]").css("border", "solid 1px red");
        $("[onclick]").css("border", "solid 1px red");
        // console.log( $("[onclick]"));//.addClass("selected");
        $("textarea").parent().css("border", "solid 1px red");
        $("input").css("border", "solid 1px red");
        $("input[type=radio]").parent().css("border", "solid 1px red");
        $("input[type=checkbox]").parent().css("border", "solid 1px red");
        $(".layout-panel").css("border", "solid 1px green");
    };
} else {
    km.toolbar = {
        do_search: function () {

            km.test_user.LoadData();
        },

        do_help: function () {

            $("[href]").addClass("selected");
            //$("[href]").css("border", "solid 1px red");
            //$("[onclick]").css("border", "solid 1px red");
            // console.log( $("[onclick]"));//.addClass("selected");
            //   $("textarea").parent().addClass("selected");//.css("border", "solid 1px red");
            $("input").addClass("selected");//.css("border", "solid 1px red");
            $("input").parent().addClass("selected");//.css("border", "solid 1px red");
            $("input[type=radio]").parent().addClass("selected");//.css("border", "solid 1px red");
            $("input[type=checkbox]").parent().addClass("selected");//.css("border", "solid 1px red");
            //  $(".layout-panel").addClass("selected");//.css("border", "solid 1px green");
            //  $(".selected").

            editor = KindEditor.create('.v_content', {
                resizeType: 1, width: "100%",// height: h + "px",
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

            gdlg = $("#dlg").dialog("open");
            $(".selected").hover(function () {
                $(this).css("background-color", "yellow");
                var str = $(this).html();
                str = str.replaceAll(" ", '').replaceAll(">", '').replaceAll("<", '').replaceAll('"', '').replaceAll('-', '')
                str = str.replaceAll("span", '').replaceAll("&nbsp;", '').replaceAll("//", '')
                str = str.replaceAll("class=", '')
                //  console.log(str);
                RefreshHelp(str);
                //  $("#mydiv1").show();
            }, function () {
                $(this).css("background-color", "pink");
                //   $("#mydiv1").hide();
            });
        }
    };

    //editor.readonly();
}
var gHelpArray = [];

function Help(id, text) {
    this.id = id;
    this.text = text;
}
var pid = '';
function RefreshHelp(id) {

    if (pid != id) {
        pid = id;

        console.log(gHelpArray);
        console.log($("#TPL_description").val());
        for (var i = 0; i < gHelpArray.length; i++) {
            if (gHelpArray[i].id == pid) {
                editor.sync();
                gHelpArray[i].text = $("#TPL_description").val();

               // console.log("found pid:" + pid)
            }
        }

        for (var i = 0; i < gHelpArray.length; i++) {
            if (gHelpArray[i].id == id) {
               // console.log("found id:"+id)
               // $("#TPL_description").val(gHelpArray[i].text);
                KindEditor.html('#TPL_description', gHelpArray[i].text);
               // editor.sync();
                return;
            }
        }
     //   console.log("new id:" + id)

        //  
        KindEditor.html('#TPL_description', id); editor.sync();
        var n = new Help(id, $("#TPL_description").val());
        gHelpArray.push(n);
    }


}

function g_json_id() {
    console.log("replace this value");
    return 0;
}


function ShowInfo() {

}

//var nodesToRecover = [];
//var nodesToRemove = [];
//var $svgElem = $targetElem.find('svg');
//$svgElem.each(function(index, node) {
//    var parentNode = node.parentNode;
//    var canvas = document.createElement('canvas');

//    canvg(canvas, parentNode, {ignoreMouse: true, ignoreAnimation: true});

//    //将svg转换成canvas
//    nodesToRecover.push({
//        parent: parentNode,
//        child: node
//    });
//    parentNode.removeChild(node);

//    nodesToRemove.push({
//        parent: parentNode,
//        child: canvas
//    });

//    parentNode.appendChild(canvas);
//});
//html2canvas($targetElem, {
//    useCORS: true,
//    onrendered: function(canvas) {
//        var base64Image = canvas.toDataURL('image/png').substring(22);

//        //回复svg
//        nodesToRemove.forEach(function(pair) {
//            pair.parent.removeChild(pair.child);
//        });

//        nodesToRecover.forEach(function(pair) {
//            pair.parent.appendChild(pair.child);
//        });
//    });
//html2canvas($targetElem, {
//    useCORS: true,
//    onrendered: function(canvas) {
//    }
//});
