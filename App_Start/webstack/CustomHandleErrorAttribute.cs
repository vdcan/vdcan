using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JTS.Utils;

namespace JSBase
{
    /// <summary>
    /// 自定义MVC异常处理 过滤器
    /// </summary>
    public class CustomHandleErrorAttribute : HandleErrorAttribute
    {
        /// <summary>
        /// 重写异常事件
        /// </summary>
        /// <param name="filterContext"></param>
        public override void OnException(ExceptionContext filterContext)
        {
            //1、将异常信息写入日志
            string userHostAddress = filterContext.RequestContext.HttpContext.Request.UserHostAddress;
            var requestUrl = filterContext.RequestContext.HttpContext.Request.Url;
            string info = string.Format("<strong>客户机IP：</strong>{0}，<strong>错误地址：</strong>{1}<br>", userHostAddress, requestUrl);
            string stackTrace = filterContext.Exception.StackTrace;
            stackTrace = stackTrace.Replace("\r\n", "<br>").Replace("位置", "<strong style=\"color:red\">位置</strong>");
            string message = string.Format("<strong>异常类型：</strong>{0}<br><strong>异常内容：</strong>{1}<br><strong>异常方法：</strong>{2}<br><strong>异常对象：</strong>{3}，<strong>异常目录：</strong>{4}，<strong>异常文件：</strong>{5} <br><strong>堆栈调用：</strong>{6}"
             , filterContext.Exception.GetType().Name
             , filterContext.Exception.Message
             , filterContext.Exception.TargetSite
             , filterContext.Exception.Source
             , filterContext.RouteData.GetRequiredString("controller")
             , filterContext.RouteData.GetRequiredString("action")
             , stackTrace); 
            info += message;
            LogHelper.Error(info , null);
            //2、重定向到友好页面
            // filterContext.Result = new RedirectResult("~/Error");
            //3、标记异常已处理完毕
            //filterContext.ExceptionHandled = true;
            base.OnException(filterContext);
        }
    }
}