using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Newtonsoft.Json.Linq;


namespace JSBase
{

      public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            //如果项目中有aspx页面，则在此处初始化路由访问路径
            //routes.MapPageRoute("Report", "report", "~/Content/page/report.aspx");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                namespaces: new string[] { "JSBase.Controllers" }//支持命名空间
            );

            //MVC添加自定义参数模型绑定ModelBinder
            ModelBinders.Binders.Add(typeof(JObject), new JObjectModelBinder()); //for dynamic model binder
            ModelBinders.Binders.Add(typeof(Dictionary<string, string>), new DictionaryModelBinder());
            ModelBinders.Binders.Add(typeof(JObjectPost), new JObjectPostModelBinder()); //for dynamic model binder
        }
    }
}
