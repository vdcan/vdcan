
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-22
//       作者： fdsaf   
//			 技术文档 
//       文件： code_help.cshtml 页面文件 
//       文件： code_help.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/sys/ViewJS/code_help.js
说明：技术文档(code_help)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model();
    LoadPages();
 //   km.template.init();
    // loader_2_Init();
 
 
    ////如果没有动态combobox可删除
    // $('.easyui-combobox').each(function (index, element) {
    //   var options = $(this).combobox('options')
    //      var u = $(this).attr("url2")
      
    //    if (u!= undefined) { 
         
    //        options.url = km.model.urls[u];
    //        if (options.multiple == true) {

    //            options.formatter= function (row) { //formatter方法就是实现了在每个下拉选项前面增加checkbox框的方法  
    //                var opts = $(this).combobox('options');  
    //                return '<input type="checkbox" class="combobox-checkbox">' + row[opts.textField]  
    //            };
    //        options.onLoadSuccess = function () {  //下拉框数据加载成功调用  
    //            var opts = $(this).combobox('options');  
    //            var target = this;  
    //            var values = $(target).combobox('getValues');//获取选中的值的values  
    //            $.map(values, function (value) {  
    //                var el = opts.finder.getEl(target, value);  
    //                el.find('input.combobox-checkbox')._propAttr('checked', true);   
    //            })  
    //        };
    //        options.onSelect = function (row) { //选中一个选项时调用  
    //            var opts = $(this).combobox('options');  
    //            //获取选中的值的values  
    //            //$("#"+id).val($(this).combobox('getValues'));  
                     
    //            //设置选中值所对应的复选框为选中状态  
    //            var el = opts.finder.getEl(this, row[opts.valueField]);  
    //            el.find('input.combobox-checkbox')._propAttr('checked', true);  
    //        }
    //        options.onUnselect =function (row) {//不选中一个选项时调用  
    //            var opts = $(this).combobox('options');  
    //            //获取选中的值的values  
    //        //    $("#"+id).val($(this).combobox('getValues'));  
                    
    //            var el = opts.finder.getEl(this, row[opts.valueField]);  
    //            el.find('input.combobox-checkbox')._propAttr('checked', false);  
    //        }
    //        }
    //        $(this).combobox(options);

    //    } 
        
        
    //    // <input id='test' class='easyui-combobox' loader="ttn" name='test' type='text' data-options="valueField:'text',textField:'text',mode : 'remote' " style='width:100px' />
    //    var loader = $(this).attr("loader");
    //    if (loader != undefined) {
    //        options.loader = function (param, success, error) {
    //            var q = param.q || "";
    //            if (q.length <= 0) {
    //                console.log("q.length <= 0");
    //                return false;
    //            }
    //            var jsonParam = { loader: loader, value: q }
    //            com.ajax({
    //                url: km.model.urls["loader"], data: jsonParam, success: function (result) {
    //                    success(result);
    //                }
    //            });
    //        };
    //        $(this).combobox(options); 
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


function showValue(value, data, type) {

    var tmp = "";
    var a = data.split(" ");
    for (var i = 0; i < a.length; i++) {

        var v= a[i].split("=")[0];
        var  t = a[i].split("=")[1];
        if (type == "checkbox") {

            if ( (","+value+",").indexOf  (","+v+",")>=0)
                tmp += "&nbsp;<input type='checkbox' checked  disabled='true'  >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='checkbox' disabled='true' >&nbsp;" + t;


        } else if (type == "radio") {
            if (value ==v)
                tmp += "&nbsp;<input type='radio' checked disabled='true' >&nbsp;" + t;
            else
                tmp += "&nbsp;<input type='radio' disabled='true' >&nbsp;" + t;
        } else {
            if (value ==v)
                return t;
        }
    }
    return tmp;
} 

var gPages = {};

function LoadPages() {
     

    com.ajax({
        type: 'POST', url: km.model.urls["page_list"], success: function (result) {
            gPages = result;

            $.each(result, function (i, n) {
                $('#main_div').append("<div id='div_"+i+"'><h1>" + n.menu_name + "</h1></div>")
                LoadData(i);

                //$('#main_div').accordion('add', {
                //    title: n.menu_name,
                //    selected: false,
                //    content:'<div style="padding:10px" id="detail_div_'+i+'">' +'</div>'
                //});
            });


            //$('#main_div').accordion({
            //    onSelect: function (title, index) {
            //       // console.log(title);

            //        LoadData(index);
            //    }
            //});
            //$("#movieTemplate").tmpl(result)
            //         .appendTo("#main_div");
            ////$("#main_div").accordion();

            //$('#main_div').accordion({
            //    onSelect: function (title, index) {
            //        //$("ul[name='" + title + "']").tree({
            //        //    url: 'menu/getModules?menuName=' + title,
            //        //});
            //        console.log(title);
            //    }
            //});
        }
    });
}
 
 

function LoadData(id) {
    //console.log(id);
    //console.log(gPages);
    //console.log(gPages[id].id);

    var jsonStr = { page_id: gPages[id].pid}

    com.ajax({
        type: 'POST', url: km.model.urls["code_detail"], data: jsonStr, success: function (result) {
            $("#templage_detail").tmpl(result)
                     .appendTo("#div_" + id);

        }
    });
}
 
 

