using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JSBase.Controllers;

namespace JSBase.Areas.dev.Controllers
{
    public class TestController : BaseController
    {
        //
        // GET: /dev/Test/

        public ActionResult Index()
        {
            return View();
        }

    }
}
