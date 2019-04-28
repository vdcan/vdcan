using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace JSBase.Controllers
{
    /// <summary>
    /// 自定义全局错误控制器
    /// </summary>
    public class ErrorController : Controller
    {
        //
        // GET: /Error/
        public ActionResult Index(string error)
        {
            ViewBag.Title = "抱歉，系统内部出现错误！";
            ViewBag.Description = error;
            return View();
        } 
        public ActionResult HttpError404(string error)
        {
            ViewBag.Title = "HTTP 404- 无法找到文件";
            ViewBag.Description = error;
            return View("Index");
        }
        public ActionResult HttpError500(string error)
        {
            ViewBag.Title = "HTTP 500 - 内部服务器错误";
            ViewBag.Description = error;
            return View("Index");
        }
        public ActionResult General(string error)
        {
            ViewBag.Title = "HTTP 发生错误";
            ViewBag.Description = error;
            return View("Index");
        }
	}
}