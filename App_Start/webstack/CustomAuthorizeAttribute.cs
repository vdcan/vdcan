using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
 
namespace JSBase.App_Start.webstack
{
    /// <summary>
    ///  自定义授权过滤器。 在 Action过滤器前执行
    /// </summary>
    public class CustomAuthorizeAttribute : AuthorizeAttribute
    {
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            //filterContext.HttpContext.Response.Write("<br/>OnAuthorization<br/>");
            //注释掉 父类方法，因为 父类里的 OnAuthorization 方法会 调用 asp.net的授权验证机制！
            base.OnAuthorization(filterContext);
        }
    }
}