var km = {};
km.model = null;//当前model对象

km.init = function () {
    km.initModelData(km.model);
    $('#btn_save_config').click(function () {
        var theme = $('#txt_theme').combobox('getValue');
        var navigation = $('#txt_menustyle').combobox('getValue');
        var gridrows = $('#txt_grid_rows').numberspinner('getValue');
        var param = { theme: theme, navigation: navigation, gridrows: gridrows };
        com.ajax({
            url: '/Sys/Config/SaveUserSetting', data: JSON.stringify(param), success: function (result) {
                com.message('success', '恭喜，个性设置保存成功,按F5看效果');
            }
        });
    });
}
//初始化模型数据，控制器Controller中载入的数据
km.initModelData = function (data) {
    var t = JSON.stringify(data.dataSource.themes);
    $('#txt_theme').combobox({
        editable: false, panelHeight: 90, valueField: 'value', textField: 'text', data: data.dataSource.themes
    });
    $('#txt_menustyle').combobox({
        editable: false, panelHeight: 90, valueField: 'value', textField: 'text', data: data.dataSource.navigations
    });
    $('#txt_theme').combobox('setValue', data.form.theme);
    $('#txt_menustyle').combobox('setValue', data.form.navigation);

    $('#txt_grid_rows').numberspinner({
        min: 10, max: 100, increment: 10, editable: false, value: parseInt(data.form.gridrows)
    });
    // var userSettings = parent.wrapper.model;
}
$(km.init);
