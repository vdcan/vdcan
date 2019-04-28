
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-04-16
//       作者： fdsaf   
//			 手机1 
//       文件： m_test1.cshtml 页面文件 
//       文件： m_test1.js JS文件
//------------------------------------------------------------------------------ 
*/
 
 //当前页面对象
var vd = {};

vd.model = null; 
vd.init = function () {
    
     my_user_1_Init();
};



$$(function () {
    $$.init();
    $(vd.init); 
});

 
 



function  my_user_1_Init(){
	vd.List_my_user.Init();
	
}
var gmy_userData= {}

vd.List_my_user = {
    Page: 1,
    loading: false,
    // 最多可加载的条目
    maxItems: 100,
    lastIndex: 0,
    // 每次加载添加多少条目
    itemsPerLoad: 15,
    RrfresData: function () {
        Page = 1;
        this.LoadData();
    },
    LoadData: function () {
        var json = { page: this.Page, rows: this.itemsPerLoad, department_id: 0, _t: com.settings.timestamp() }; 
        com.ajax2({
            type: 'GET', url: vd.model.urls["my_user_pager"], data: json, success: function (result) {
            	
                gmy_userData = result;
                //解析json
                vd.List_my_user.Page++;
                var t = { Table: result.rows };
                $("#template_my_user").tmpl(t).appendTo("#LC_my_user");
                if (result.rows.length == 0 || result.rows.length < vd.List_my_user.itemsPerLoad) {
                    $$.detachInfiniteScroll($$('#ISB_my_user'));
                    // 删除加载提示符
                    $$('#ISP_my_user').remove();
                    return;
                }
            }
        });
    }
    , Init: function () { 
        $$(document).on('infinite', '#ISB_my_user', function () {
            if (vd.List_my_user.loading) return;
            // 设置flag
            vd.List_my_user.loading = true;
            // 模拟1s的加载过程
            setTimeout(function () {
                // 重置加载flag
                vd.List_my_user.loading = false;
                if (vd.List_my_user.lastIndex >= vd.List_my_user.maxItems) {
                    // 加载完毕，则注销无限加载事件，以防不必要的加载
                    $.detachInfiniteScroll($('#ISB_my_user'));
                    // 删除加载提示符
                    $('#ISP_my_user').remove();
                    return;
                }
                // 添加新条目
                vd.List_my_user.LoadData();
                // 更新最后加载的序号
                vd.List_my_user.lastIndex = $('#LC_my_user li').length;
                //容器发生改变,如果是js滚动，需要刷新滚动
                $$.refreshScroller();
            }, 400);
        });

       this.RrfresData();
    }

};


 
 


 

 
function show_my_user(index) {
     //  console.log( $('#my_user_content') );
    $$.openPanel('.panel-my_user');
    $("#my_user_content").form("load", gmy_userData.rows[index]); 
}

