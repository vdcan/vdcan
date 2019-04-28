using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSBase
{

    /// <summary>
    /// 自定义Action过滤器：全局Action过滤
    /// </summary>
    [AttributeUsage(AttributeTargets.All, AllowMultiple = true)]//多次调用
    public class CustomActionFilterAttribute : ActionFilterAttribute
    {
        /// <summary>
        /// 在  Action方法之前 调用
        /// </summary>
        /// <param name="filterContext"></param>
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            //1. RouteData 中 保存了 当前请求 匹配的 路由信息和路由对象
            //			 如果本次请求 是请求了某个 区域 里的 控制器方法，还可以通过filterContext.RouteData.DataTokens["area"]获取区域名

            //string strArea = filterContext.RouteData.DataTokens["area"].ToString();
            string strController = filterContext.RouteData.Values["controller"].ToString();
            string strAction = filterContext.RouteData.Values["action"].ToString();
            //filterContext.RouteData.GetRequiredString

            //2.另一种方式 获取 请求的 类名和方法名
            string strAction2 = filterContext.ActionDescriptor.ActionName;
            string strController2 = filterContext.ActionDescriptor.ControllerDescriptor.ControllerName;

            //2.1检查 被请求方法 是否 加了 MoneyAttribute 特性
            //if (filterContext.ActionDescriptor.IsDefined(typeof(Filters.), false))
            //{
            //    //直接为 请求 设置 返回结果，而不执行 对应的 Action 方法，也不执行 OnActionExcuted，但是，会执行 Result过滤器和 生成视图
            //    filterContext.Result = new ContentResult() { Content = "<br/>哈哈哈，直接被跳过了吧~~~！<br/>" };
            //}

            //filterContext.HttpContext.Response.Write("哇哈哈哈~！OnActionExecuting<br/>");
            base.OnActionExecuting(filterContext);
        }
        /// <summary>
        /// 在  Action方法之后 调用
        /// </summary>
        /// <param name="filterContext"></param>
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            //filterContext.HttpContext.Response.Write("哇哈哈哈~！OnActionExecuted<br/>");
            base.OnActionExecuted(filterContext);
            GC.Collect();//垃圾回收
        }
    }


    /// <summary>
    /// 自定义Action过滤器：垃圾回收
    /// </summary>
    [AttributeUsage(AttributeTargets.All, AllowMultiple = true)]//多次调用
    public class CustomDisposeFilter : ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            base.OnActionExecuted(filterContext);
            GC.Collect();
        }
    }
}