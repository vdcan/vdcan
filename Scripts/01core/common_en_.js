/*
==================================================================
程序：框架基础函数包
创建：键盘男
说明：通用方法。
最近更新：16:46 2015-06-10
==================================================================
*/
var com = {};

//弹框提示messager
com.show = function (msg) {
    if (parent == window) {
        $.messager.show({ title: 'Message', msg: msg, showType: 'show' });
    } else {
        parent.$.messager.show({ title: 'Message', msg: msg, showType: 'show' });
    }
}

//提示messager-页面中间显示
com.showcenter = function (title, msg) {
    if (parent == window) {
        $.messager.show({
            title: title,
            msg: msg,
            showType: 'show',
            style: {
                right: '',
                top: document.body.scrollTop + document.documentElement.scrollTop,
                bottom: ''
            }
        });
    } else {
        parent.$.messager.show({
            title: title,
            msg: msg,
            showType: 'show',
            style: {
                right: '',
                top: document.body.scrollTop + document.documentElement.scrollTop,
                bottom: ''
            }
        });
    }
}

//警告alert
com.alert = function (msg) {
    var htmlHS = '<span style="font-size:15px;color:red;font-weight:bold">' + msg + '</span>';
    if (parent == window) {
        $.messager.alert('Alert', htmlHS, 'warning');
    } else {
        parent.$.messager.alert('Alert', htmlHS, 'warning');
    }
}


//弹messagee
com.message = function (type, message, callback) {
    var html_success = '<span style="font-size:13px;color:green;font-weight:bold"> ' + message + '</span>';
    var html_alert = '<span style="font-size:13px;color:red;font-weight:bold">' + message + '</span>';
    var html_confirm = '<span style="font-size:13px;color:#E2392D;font-weight:bold">' + message + '</span>';
    switch (type) {
        case "s":
        case "success":
            if (parent == window) {
                $.messager.show({
                    title: 'Success', msg: html_success, showType: 'slide', style: {
                        right: '',
                        top: document.body.scrollTop + document.documentElement.scrollTop,
                        bottom: ''
                    }
                });
            }
            else {
                parent.$('#notity').jnotifyAddMessage({ text: message, permanent: false });
            }
            break;
        case "error":
        case "e":
            if (parent == window) {
                //$.messager.show({ title: '错误', msg: html_success });
                $.messager.alert('Warning', html_alert, 'warning');
                console.info(html_alert);
            }
            else {
                parent.$('#notity').jnotifyAddMessage({ text: message, permanent: false, type: 'error' });
            }
            break;
        case "warning":
        case "w":
            if (parent == window) {
                $.messager.alert('Warning', html_alert, 'warning');
            }
            else {
                parent.$('#notity').jnotifyAddMessage({ text: message, permanent: false, type: 'warning' });
            }
            break;
        case "information":
        case "i":
        case "info":
            if (parent == window) {
                $.messager.show({ title: 'Message', msg: message });
            }
            else {
                parent.$.messager.show({ title: 'Message', msg: message });
            }
            break;
        case "confirm":
        case "c":
            if (parent == window) {
                return $.messager.confirm('Confirm', html_confirm, callback);
            }
            else {
                return parent.$.messager.confirm('Confirm', html_confirm, callback);
            }
    }

    if (callback) callback();
    return null;
};

//显示模态dialog-顶层模态。
com.dialog = function (opts, onBeforeOpen, onSave) {
    var query = parent.$;
    var win = query('<div></div>').appendTo('body').html(opts.html);
    var btntext = 'Save';
    if (opts.btntext) btntext = opts.btntext;
    opts = query.extend({
        title: 'My Dialog', cache: false, modal: true, html: '', url: '',
        buttons: [{
            text: '&nbsp;&nbsp;&nbsp;&nbsp;<b>' + btntext + '<b>&nbsp;&nbsp;&nbsp;&nbsp;', handler: function () {
                if (onSave instanceof Function) {
                    onSave(win); //win.dialog('destroy');
                }
            }
        }],
        onBeforeOpen: function () {
            if (onBeforeOpen instanceof Function) {
                onBeforeOpen(win);
            }
        },
        onClose: function () {
            query(this).dialog('destroy');
        }
    }, opts);

    win.dialog(opts);
    query.parser.parse(win);
    return win;
} 

//初始化模态dialog--iframe内模态。
com.initdialog = function (target, title, callback) {
    var d = target.dialog({
        title: title, top: 10, cache: false, modal: true, inline: true,
        buttons: [{
            text: 'Save', iconCls: 'icon-save', handler: function () {
                if (callback instanceof Function) {
                    callback();
                }
            }
        }]
    }).dialog('close');
}

//局部遮罩。
com.mask = function (locale, show) {
    var zindex = 1;
    if (show == true) {
        locale.addClass("mask-container");
        //var mask = $("<div style='background-color:#000 '><div style='position:absolute;background-color:yellow;color:blue;height: 22px; width: 100px;margin: 0 auto ;top:10px; left:10px;border-radius:5px;z-index:0'><img src='../style/images/ajax-loader.gif' />正在加载...</div></div>").addClass("datagrid-mask").css({ display: "block", "z-index": +zindex }).appendTo(locale);
        var mask = $("<div style='background-color:#ccc '></div>").addClass("datagrid-mask").css({ display: "block", "z-index": +zindex }).appendTo(locale);
    } else {
        locale.removeClass("mask-container");
        locale.children("div.datagrid-mask-msg,div.datagrid-mask").remove();
    }
}

//ajax请求
com.ajax = function (options) {
    options = $.extend({
        showLoading: false//新加属性，是否显示loading效果
    }, options);

    if (typeof options.data == "object") {
        var jsonStr = JSON.stringify(options.data);
        delete options["data"];
        options.data = jsonStr;
    }

    if (options.data != undefined) {
       // console.log(typeof options.data)
        //将数组变成字符串
        var m = options.data.match(/\[(.*?)\]/g);
        if (m != null)
            for (var i = 0; i < m.length; i++) {
                var s = m[i];
                s = s.replaceAll("\\[", "").replaceAll("\\]", "").replaceAll("\\\",\\\"", ",");

                var s2 = m[i];
                s2 = "\\" + s2.substring(0, s2.length - 1) + "\\]"
                options.data = options.data.replaceAll(s2, s);

                //   console.log(options.data);
            }
    //    console.log(options.data);
    options.data = options.data.replaceAll(">", "&gt;").replaceAll("<", "&lt;");
    }
    //options.data = options.data.replaceAll("\\[", "").replaceAll("\\]", "").replaceAll("\\\",\\\"", ",");
    var ajaxDefaults = {
        type: 'POST',////数据的提交方式：get和post
        dataType: 'json',////服务器返回数据的类型，例如xml,String,Json等
        //contentType: 'application/json',
        error: function (e) {
            var msg = e.responseText + '|' + e.statusText;
            //console.info(e);
            // alert('ajax出现错误：' + msg);
        }
    };

    if (options.showLoading) {
        ajaxDefaults.beforeSend = $.showLoading;
        ajaxDefaults.complete = $.hideLoading;
    }

    $.ajax($.extend(ajaxDefaults, options));
};

com.ajax2 = function (options) {
    options = $.extend({
        showLoading: false//新加属性，是否显示loading效果
    }, options);

    var ajaxDefaults = {
        type: 'POST',////数据的提交方式：get和post
        dataType: 'json',////服务器返回数据的类型，例如xml,String,Json等
        //contentType: 'application/json',
        error: function (e) {
            var msg = e.responseText + '|' + e.statusText;
            //console.info(e);
            // alert('ajax出现错误：' + msg);
        }
    };

    if (options.showLoading) {
        ajaxDefaults.beforeSend = $.showLoading;
        ajaxDefaults.complete = $.hideLoading;
    }

    $.ajax($.extend(ajaxDefaults, options));
};

/*关于页面html公共格式化方式*/
com.html_formatter = {
    get_color_html: function (text, color) {
        return '<span style="font-weight:bold; color:' + color + ';">' + text + '</span>';
    },
    yesno: function (value, row, index) {
        var text = value == 1 ? 'Yes' : 'No';
        var color = value == 1 ? 'green' : 'red';
        var result = com.html_formatter.get_color_html(text, color);
        return result;
    }
    ,
    yesno2: function (value, row, index) {
        var text = value == 1 ? gDictionary["yes"] : gDictionary["no"];
    var color = value == 1 ? 'green' : 'red';
    var result = com.html_formatter.get_color_html(text, color);
    return result;
}
};

/*公共设置*/
com.settings = {
    timestamp: function () {
        var d = new Date();
        var result = d.getYear() + '' + d.getMonth() + '' + d.getDay() + '' + d.getMinutes() + '' + d.getSeconds() + '' + d.getMilliseconds();
        return result;
    },
    ajax_timestamp: function () {
        return '?timestamp=' + this.timestamp();
    }
};

/*初始化页面权限按钮*/
com.initbuttons = function (target, listbuttons) {
    //alert($(target).html());
   // $(target).html('');
    var htmlButtons = '';
    if (km.model.buttons.length > 0) {
        for (var i = 0; i < listbuttons.length; i++) {
            htmlButtons += '<a id="toolbar_' + listbuttons[i].ButtonCode + '" href="javascript:void(0)" class="easyui-linkbutton" data-options="plain:true,iconCls:\'' + listbuttons[i].icon_class + '\' "  title="' + listbuttons[i].button_name + '" onclick="km.toolbar.' + listbuttons[i].js_event + ';">' + listbuttons[i].button_name + '</a>';
        }
        $(target).append(htmlButtons);
        $(target).find(".easyui-linkbutton").linkbutton();
    }
    //else {
    //    //alert($(target).parent()[0].id); 
    //    $(target).parent().height(0);
    //    $(target).remove();
    //}
}





































