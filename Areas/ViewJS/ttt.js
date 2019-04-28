
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-04-27
//       作者： 蔡捷   
//			 tt 
//       文件： ttt.cshtml 页面文件 
//       文件： ttt.js JS文件
//------------------------------------------------------------------------------
路径：~/Areas/home/ViewJS/ttt.js
说明：tt(ttt)的js文件
*/
//当前页面对象
var km = {};
km.model = null;
km.parent_model = null;

km.init = function () {
    com.initbuttons($('#km_toolbar'), km.model.buttons);
    km.init_parent_model(); 
 //   km.template.init();
     flow_2_Init();
 
 
    //如果没有动态combobox可删除
     $('.easyui-combobox').each(function (index, element) {
       var options = $(this).combobox('options')
          var u = $(this).attr("url2")
      
        if (u!= undefined) { 
         
            options.url = km.model.urls[u];
            if (options.multiple == true) {

                options.formatter= function (row) { //formatter方法就是实现了在每个下拉选项前面增加checkbox框的方法  
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
            options.onUnselect =function (row) {//不选中一个选项时调用  
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

 
 
//------------------------------------------------------------------------------ 
//       时间： 2018-04-27
//       作者： 蔡捷   
//			   
//------------------------------------------------------------------------------  

function  flow_2_Init(){
	km.flow.init();
	
	if(	km.flow.LoadData!=undefined)	
		km.flow.LoadData(); 
}



function addflow(index) {
    
   
    km.toolbar.do_add();
}

function editflow(index) {
    $('#flow').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_edit();
}
function deleteflow(index) {
    $('#flow').datagrid('selectRow', index);// 关键在这里  
   
    km.toolbar.do_delete();
}


var selectedflowIndex = 0;



km.flow= {
    jq: null,
     	             	
    init: function () {
        this.jq = $("#flow").datagrid({
            fit: true, border: false, singleSelect: true, rownumbers: true, remoteSort: true, cache: false, method: 'get', idField: 'id',
             	            
            queryParams: { _t: com.settings.timestamp(), keyword: "" }, 
            url: km.model.urls["flow_pager"],
               	  

            pagination: true, pageList: [5, 10, 15, 20, 30, 50, 100], pageSize:  km.pageSize,fitColumns:true,
            columns: [[
   
            
 	                { field: 'add_by', title: '创建人', width: 80, align: 'center', sortable: true },
                { field: 'add_on', title: '创建日期', width: 80, align: 'center', sortable: true },
                { field: 'column_name', title: '状态列名', width: 80, align: 'center', sortable: true },
                { field: 'deadline_column_name', title: '过期日列名', width: 80, align: 'center', sortable: true },
                { field: 'flow_description', title: '流程描述', width: 80, align: 'center', sortable: true },
                { field: 'flow_name', title: '流程名', width: 80, align: 'center', sortable: true },
                { field: 'flow_type', title: '流程类型', width: 80, align: 'center', sortable: true },
                { field: 'id', title: '编号', width: 80, align: 'center', sortable: true },
                { field: 'id_column_name', title: '主列名', width: 80, align: 'center', sortable: true },
                { field: 'page_id', title: '页面编号', width: 80, align: 'center', sortable: true },
                { field: 'table_name', title: '表名', width: 80, align: 'center', sortable: true },
                { field: 'test_deadline', title: '测试过期日期', width: 80, align: 'center', sortable: true },
                { field: 'test_status', title: '测试状态', width: 80, align: 'center', sortable: true },
     {
                                field: 'id', title: '<a href="#" onclick="addflow( )">增加</a>', width: 80, align: 'center', sortable: false, formatter: function (val, row, index) {
                                    return '<a href="#" onclick="editflow(' + index + ')">修改</a>&nbsp;|&nbsp;<a href="#" onclick="deleteflow(' + index + ')">删除</a>';
    }  },
    
                 
            ]],
            onClickRow: function (index, row) {
            
                selectedflowIndex = index;
                km.flow.selectedIndex = index;
                km.flow.selectedRow = row;  
                if(                km.flow.selectedRow ){
                	
                	flow_selected();
                }
            },
            onLoadSuccess: function (data) {
            
             if (data.rows.length >0){
            
             	if (data.rows.length <= selectedflowIndex)
             		selectedflowIndex =0
              $("#flow").datagrid("selectRow", selectedflowIndex);
             }
                km.flow.selectedRow = km.flow.getSelectedRow(); 
                if(                km.flow.selectedRow ){
                	
                	flow_selected();
                }
             }
        });//end grid init
    },
    reload: function (queryParams) {	         var defaults = { _t: com.settings.timestamp() };
       if (queryParams) { defaults = $.extend(defaults, queryParams); }
     this.jq.datagrid('reload', defaults);
      	    },
    getSelectedRow: function () { return this.jq.datagrid('getSelected'); }
};


function flow_selected(){
// km.flow.selectedRow 

      	
console.log("flow selected");
   

}


