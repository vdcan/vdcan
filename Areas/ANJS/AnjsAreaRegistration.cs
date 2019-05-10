using System.Web.Mvc;

namespace JSBase.Areas.Anjs
{
    public class ANJSAreaRegistration : AreaRegistration 
    {
        /// <summary>
        /// 当前区域名称
        /// </summary>
        public override string AreaName { get { return "anjs"; } }
        public override void RegisterArea(AreaRegistrationContext context)
        {
            /*以下配置每一个区域必须配置*/
            context.MapRoute(
                this.AreaName + "_default",
                this.AreaName + "/{controller}/{action}/{id}",
                new { area = this.AreaName, controller = "Home", action = "Index", id = UrlParameter.Optional },
                new string[] { "JSBase.Areas." + this.AreaName + ".Controllers" });
        }
    }
}