using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace JSBase.App_Start
{
    public class BundleConfig
    {
        // 有关绑定的详细信息，请访问 http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            //ResetIgnorePatterns(bundles.IgnoreList);

            //string easyui_version = JTS.Utils.CookiesUtil.GetCookies("easyui_version");
            //string easyui_theme = JTS.Utils.CookiesUtil.GetCookies("easyui_theme");

            //if (easyui_theme.IsNullOrEmpty())
            //    easyui_theme = "bootstrap";

            //if (easyui_version.IsNullOrEmpty())
            //    easyui_version = "1.4.4";


            //bundles.Add(new StyleBundle("~/common/css").Include(
            //          "~/Content/css/base.css",
            //          "~/Scripts/02jquery/jnotify/jquery.jnotify.css",
            //          "~/Scripts/02jquery//showloading/showLoading.css"));
            //bundles.Add(new StyleBundle("~/easyui/css").Include(
            //          "~/Scripts/03jeasyui/jquery-easyui-" + easyui_version + "/themes/" + easyui_theme + "/easyui.css",
            //          "~/Scripts/03jeasyui/jquery-easyui-" + easyui_version + "/themes/icon.css",
            //          "~/Content/themes/" + easyui_theme + "/style.css",
            //          "~/Scripts/03jeasyui/icons/icon-all.css"));

            //bundles.Add(new ScriptBundle("~/easyui/js").Include(
            //          "~/Scripts/03jeasyui/jquery-easyui-1.4.4/jquery.min.js",
            //          "~/Scripts/03jeasyui/jquery-easyui-1.4.4/jquery.easyui.min.js",
            //          "~/Scripts/03jeasyui/jquery-easyui-1.4.4/locale/easyui-lang-zh_CN.js",
            //          "~/Scripts/03jeasyui/jeasyui_extend/datagrid-detailview.js",
            //          "~/Scripts/03jeasyui/jeasyui_extend/jeasyui.treegrid.extend.js"));

            //bundles.Add(new ScriptBundle("~/common/js").Include(
            //        "~/Scripts/01core/utils.js",
            //        "~/Scripts/01core/json2.min.js",
            //        "~/Scripts/02jquery/jquery.cookie.js",
            //        "~/Scripts/02jquery/jqext.yxz.js",
            //        "~/Scripts/02jquery/layer/layer.js",
            //        "~/Scripts/02jquery/jnotify/jquery.jnotify.js",
            //        "~/Scripts/02jquery/showloading/jquery.showLoading.min.js",
            //        "~/Scripts/01core/BaiduTemplate.js",
            //        "~/Scripts/01core/common.js"));

            //BundleTable.EnableOptimizations = false;

        }
        public static void ResetIgnorePatterns(IgnoreList ignoreList)
        {
            ignoreList.Clear();
            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");
            ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
            //ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
            ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
        }
    }
}