using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JTS.Utils;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Text;

using JSBase;

namespace JSBase.Controllers
{
    //[AllowAnonymous]
    public class HomeController : BaseController
    {



        public void MyInitSession()
        {
            Session.Timeout = 3000;
            try
            {
                if (CurrentUser != null)
                {

                    Session["add_by"] = CurrentUser.UserId.ToString();
                    Session["sstore_id"] = CurrentUser.DepartmentID.ToString();
                    Session["add_by"] = CurrentUser.UserId.ToString();
                    Session["user_id"] = CurrentUser.UserId.ToString();
                    Session["scompany_id"] = CurrentUser.DepartmentCode.ToString();
                    Session["sparentid"] = CurrentUser.DepartmentCode.ToString();
                    Session["sdepartment_id"] = CurrentUser.DepartmentCode.ToString();
                }

            }
            catch (Exception e)
            {
                Session["add_by"] = -1;
                Session["sstore_id"] = -1;
                Session["add_by"] = -1;
                Session["user_id"] = -1;
                Session["scompany_id"] = -1;
                Session["sparentid"] = -1;
                Session["sdepartment_id"] = -1;
            }


            HttpCookie cookie = Request.Cookies.Get("language");
            if (cookie == null)
            {
                Session["slanguage"] = GetLanguage();
            }
            else
            {

                Session["slanguage"] = cookie.Value;
            }


        }

        [AllowAnonymous]
        public void Download()
        {
            string fileName = Request.QueryString["file"].ToString();
            string fn = Request.QueryString["fn"].ToString();
            string filePath = Server.MapPath("~/data/" + fileName);
            //Be sure the file exists
            System.IO.FileInfo file = new System.IO.FileInfo(filePath);
            if (!file.Exists)
            {
                Response.StatusCode = 500;
                Response.End();
                return;
            }
            //Call to business layer to update the count based on the filename
            //  DownloadsService.UpdateDownloadCount(fileName);
            //Don't allow response to be cached
            Response.Clear();
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.Cache.SetNoStore();
            Response.Cache.SetExpires(DateTime.MinValue);
            //The next few lines is what actually starts downloads the file.
            Response.AddHeader("Content-Disposition", "attachment; filename=" + fn);
            Response.AddHeader("Content-Length", file.Length.ToString());
            Response.ContentType = "application/octet-stream";
            Response.WriteFile(file.FullName);


            ProcInfo pinfo = new ProcInfo("usp_insert_download_log", "app");

            JObject data = new JObject();
            data["ip"] = Request.ServerVariables.Get("Remote_Addr").ToString();

            data["file"] = fileName;



            //  ApplicationInstance.CompleteRequest();
            Response.End();
            RunProcedure(data, pinfo);
        }
        public HomeController()
        {
            InitSession = new CallBackFun(MyInitSession);
            EncryptKey = System.Configuration.ConfigurationManager.AppSettings["EncryptKey"].ToString(); ;
        }
        //首页
        public ActionResult admin(string timestamp)
        {
          //  / Login ?#/access/signin
            if (!FormsAuth.IsAuthenticated)
                return RedirectToAction("Index", "Login");
            if(CurrentUser.Status != "")
            {
                JObject data2 = new JObject();
                data2["add_by"] = CurrentUser.UserId; ;
                DataTable dt4 = base.RunProcedureDataTable(data2, "usp_vd_user_get_status");
                string status = dt4.Rows[0]["status"].ToString();

                if (status == "step1")
                    status = "steps";
                if (status!="")
                return Redirect("/home?mc=steps#/access/"+ status);
            }
            initLan();


            var jason2 = JsonConvert.SerializeObject(JsonNet(CurrentUser).Data, Newtonsoft.Json.Formatting.Indented, this.IsoDateTimeConverter);


            ViewData["UserInfo"] = jason2;

            return View( ); ;

            ViewBag.Token = CreateToken();
            ViewBag.user_info = JTS.Utils.DESEncrypt.Encrypt("/sys/sysbase]user_info", EncryptKey);
            var loginer = FormsAuth.GetBaseLoginerData();
            ViewBag.Title = System.Configuration.ConfigurationManager.AppSettings["title"].ToString(); ;
            ViewBag.UserId = loginer.UserId;
            ViewBag.UserCode = loginer.UserCode;
            ViewBag.UserName = loginer.UserName;
            // ViewBag.navigation = "menubutton";
            ViewBag.navigation = "accordion";
            ViewBag.Settings = new { gridrows = 20, navigation = "accordion" };
            if (CurrentUser.DepartmentCode.Length > 0)
                ViewBag.LoginUser = "[" + loginer.UserCode + "]" + loginer.UserName;// + "-" + CurrentUser.DepartmentCode;
            else
                ViewBag.LoginUser = "[" + loginer.UserCode + "]" + loginer.UserName;
            ViewBag.EasyuiVersion = JTS.Utils.ConfigUtil.GetConfigString("EasyuiVersion");//easyui版本
            ViewBag.SystemVersion = JTS.Utils.ConfigUtil.GetConfigString("SystemVersion");//系统版本
            CookiesUtil.WriteCookies("EasyuiTheme", 0, "");
            CookiesUtil.WriteCookies("EasyuiVersion", 0, JTS.Utils.ConfigUtil.GetConfigString("EasyuiVersion"));

            JObject data = new JObject();
            data["role_ids"] = loginer.RoleIDs;
            data["slanguage"] = Session["slanguage"].ToString();



            ProcInfo pi = new ProcInfo("vdp_get_menu", "sys");
            SetData(pi, data);

            DataSet dt = base.RunProcedureDataSet(data, pi);// base.RunProcedureDataTable(data2, "vdp_get_home_menu");


            //  DataSet dt = base.RunProcedureDataSet(data, "vdp_get_menu", "sys");
            EncryptKey = System.Configuration.ConfigurationManager.AppSettings["EncryptKey"].ToString(); ;

            foreach (DataRow r in dt.Tables[0].Rows)
            {

                //  r["menu_token"] = Server.UrlEncode(JTS.Utils.DESEncrypt.Encrypt(r["url"] + "]" + r["menu_code"], EncryptKey));
                if (r["visible_flag"].ToString() == "1")

                    r["menu_token"] = GetMenu(r["menu_code"].ToString(), r["url"].ToString(), EncryptKey);
                else
                    GetMenu(r["menu_code"].ToString(), r["url"].ToString(), EncryptKey);
            }

            ViewBag.desktop = GetMenu("desktop", "/sys/sysbase", EncryptKey);
            var model = new
            {
                //  userSettings = userSettings,
                UserId = loginer.UserId,
                UserCode = loginer.UserCode,
                UserName = loginer.UserName//,
                //  UserMenus2 =Dtb2Json( dt.Tables[0])
            };

            string filter = String.Format(" visible_flag   = {0}  ", 1);//获取顶级目录;//获取顶级目录);
            DataRow[] drows = dt.Tables[0].Select(filter);

            DataTable dt2 = dt.Tables[0].Clone(); ;
            foreach (DataRow row in drows)
            {
                dt2.ImportRow(row);
            }

            ViewBag.UserMenus = Dtb2Json(dt2);
            return View(model);
        }

        [AllowAnonymous]
        public ActionResult register()
        {
            initLan();

            return View();
        }
        [AllowAnonymous]
        public ActionResult ViewAPP(string mc, string app_code)
        {
            JObject data2 = new JObject();
            data2["app_code"] = app_code;
            DataTable dt4 = base.RunProcedureDataTable(data2, "usp_app_detail_app_code");
            ViewData["app_info"] = dt4;
            initLan();
            return BaseIndexA(mc);
        }
        [AllowAnonymous]
        public JsonResult Query(JObject data)
        {

            string sort = Request.Params.Get("sort");
            if (sort == null)
                sort = "";
            string order = Request.Params.Get("order");
            if (order == null)
                order = "";

            int pageIndex = data.Value<int>("page");
            int pageSize = data.Value<int>("rows");
            int pageCount = 0;
            int totalRows = 0;
            ProcInfo pinfo = new ProcInfo();
            pinfo.ProcedureName = "vdp_search_breed";
            pinfo.SQL = "";
            pinfo.Type = "proc";
            var list = ListDataPager(sort, order, pageIndex, pageSize, out pageCount, out totalRows, pinfo, data);
            return JsonNet(new { rows = list, total = totalRows });


        }
        [AllowAnonymous]
        public ActionResult Detail(string id)
        {
            ViewBag.Message = "Your application description page.";
            ProcInfo pinfo = new ProcInfo();
            pinfo.ProcedureName = "vdp_get_review_detail";
            pinfo.SQL = "";
            pinfo.Type = "proc";
            JObject data = new JObject();
            data["id"] = id;
            var d = RunProcedureDataTable(data, pinfo);
            ViewData["DetailData"] = d;

            initLan();
            return View();
        }

        [AllowAnonymous]
        public ActionResult Index(string mc)
        {
            initLan();
            JObject data2 = new JObject();
            data2["slanguage"] = Session["slanguage"].ToString();

            ProcInfo pi = new ProcInfo("vdp_get_home_menu", "sys");
            JObject data = new JObject();
            SetData(pi, data2);

            DataTable dt3 = base.RunProcedureDataTable(data2, pi);// base.RunProcedureDataTable(data2, "vdp_get_home_menu");
            ViewData["menu"] = dt3;
            if (mc != null && mc.Trim().Length > 0)
            {
            }
            else
                mc = "index_lan";
            ViewData["mc"] = mc;

            mc = mc.Replace("_lan", "_lan@" + Session["slanguage"].ToString());
            return BaseIndexA(mc);
        }
        [AllowAnonymous]
        public JsonResult RegisterMe(JObject data)
        {
            data["slanguage"] = Session["slanguage"].ToString();
            //string result = RunProcedure(data, new ProcInfo("vdp_user_register", "sys"));
            //if (isNumberic(result))
            //    return JsonNet(new { s = true, message = GetSysText("success") }, JsonRequestBehavior.DenyGet);
            //else
            //    return JsonNet(new { s = false, message = result }, JsonRequestBehavior.DenyGet);


            data["password"] = Md5Util.MD5(data["password"].ToString());
            RunProcResult result = RunProcedure(data, new ProcInfo("vdp_user_signup", "sys"));


            result.message = GetSysText(result.message);
            return JsonNet(result);

        }
        public ActionResult Portal()
        {
            initLan();
            JObject data2 = new JObject();
            data2["slanguage"] = Session["slanguage"].ToString();
            //DataTable dt3 = base.RunProcedureDataTable(data2, "vdp_get_home_menu");


            ProcInfo pi = new ProcInfo("vdp_get_home_menu", "sys");
            JObject data = new JObject();
            SetData(pi, data2);

            DataTable dt3 = base.RunProcedureDataTable(data2, pi);// base.RunProcedureDataTable(data2, "vdp_get_home_menu");

            ViewData["menu"] = dt3;
            string mc = "Portal";

            ViewData["mc"] = mc;

            mc = mc.Replace("_lan", "_lan@" + Session["slanguage"].ToString());
            return BaseIndexA(mc);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            return View();
        }
        //修改自己密码
        //POST /Home/ModifySelfPassword
        public JsonResult ModifySelfPassword(JObject data)
        {
            string UserCode = CurrentUser.UserCode;
            string Password = data.Value<string>("newpassword");
            data["UserCode"] = UserCode;
            data["Password"] = Md5Util.MD5(Password);
            base.RunProcedureByName(data, "vdp_reset_pwd", "sys");
            return Json(new { s = true, message = GetSysText("success") }, JsonRequestBehavior.DenyGet);
        }
        [AllowAnonymous]
        public JavaScriptResult GetConfigRouterJS(string name)
        {
            if (name == null)
                name = "";
            string p = Server.MapPath("/");
            p = p + "\\tpl\\";

            string root_path = p;


            string result = System.IO.File.ReadAllText(root_path + "/config.router"+ name + ".js");
            //foreach (DataRow r in dt.Tables[0].Rows)
            //{

            //    //  r["menu_token"] = Server.UrlEncode(JTS.Utils.DESEncrypt.Encrypt(r["url"] + "]" + r["menu_code"], EncryptKey));
            //    if (r["visible_flag"].ToString() == "1")

            //        r["menu_token"] = GetMenu(r["menu_code"].ToString(), r["url"].ToString(), EncryptKey);
            //    else
            //        GetMenu(r["menu_code"].ToString(), r["url"].ToString(), EncryptKey);
            //}

            //ProcInfo pinfo = new ProcInfo();
            //pinfo.ProcedureName = "usp_angular_state_list";
            //pinfo.SQL = "";
            //pinfo.Type = "proc";
            JObject data = new JObject();
            DataTable dt = base.RunProcedureDataTable(data, "usp_angular_state_list");
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            foreach (DataRow r in dt.Rows)
            {
                StringBuilder tmpsb = new StringBuilder();

                tmpsb.Append("url:'").Append(r["url"]).Append("'");

                if (r["template"].ToString() != "")
                    tmpsb.Append(",\r\n template:'").Append(r["template"]).Append("'");

                if (r["templateUrl"].ToString() != "")
                    tmpsb.Append(",\r\n templateUrl:'").Append(r["templateUrl"]).Append("'");
                else
                {
      tmpsb.Append(",\r\n templateUrl:'").Append(r["url2"].ToString()+ "?menucode=" + GetMenu(r["menu_code"].ToString(), r["url2"].ToString(), EncryptKey)).Append("'");
        //            tmpsb.Append(",\r\n templateUrl: function(stateParams){ return '").Append(r["url2"].ToString() + "?menucode=" + GetMenu(r["menu_code"].ToString(), r["url2"].ToString(), EncryptKey)).Append("&id=' + stateParams.id;}");

               //     function(stateParams){ return '&id=' + stateParams.id; }
                }
              
                if (r["controller"].ToString() != "")
                    tmpsb.Append(",\r\n controller:'").Append(r["controller"]).Append("'");

                if (r["resolve"].ToString() != "")
                    tmpsb.Append(",\r\n resolve:").Append(r["resolve"]).Append("");

                if (r["views1"].ToString() != "")
                    tmpsb.Append(",\r\n views:").Append(r["views"]).Append("");

                if (r["cache"].ToString() != "")
                    tmpsb.Append(",\r\n cache:").Append(r["cache"]).Append("");

                if (r["abstract"].ToString() == "True")
                    tmpsb.Append(",\r\n abstract:").Append("true").Append("");

                sb.Append(string.Format(".state('{0}', {{{1}}})\r\n", r["state_name"], tmpsb));
            }

            result = result.Replace("###DETAIL###", sb.ToString());
            return new JavaScriptResult(result);
        }


        [AllowAnonymous]
        public HtmlResult GetNavigation()
        { 
            JObject data = new JObject();
            DataTable dt = base.RunProcedureDataTable(data, "vdp_get_menu_angular");
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            sb.Append("<ul class='nav'>");
            foreach (DataRow r in dt.Rows)
            {
                if (r["parent_id"].ToString() == "0")
                {
                    // StringBuilder tmpsb = new StringBuilder();

                    if (r["url"].ToString() == "#")
                    {

                        sb.Append(string.Format("<li> <a href class= 'auto '> <span class= 'pull-right text-muted '> <i class= 'fa fa-fw fa-angle-right text '></i> <i class= 'fa fa-fw fa-angle-down text-active '></i></span> <i class= 'glyphicon glyphicon-stats icon text-primary-dker '></i> <span class= 'font-bold ' >{0}</span></a>{1}</li>\r\n", r["menu_name"], GetSubMenu(r["id"].ToString(), dt, r["menu_name"].ToString())));


                    }
                    else
                    {

                        sb.Append(string.Format("<li ui-sref-active='active'><a ui-sref='{1}'> <i class='glyphicon glyphicon-calendar icon text-info-dker'></i> <span class='font-bold' >{0}</span> </a></li>\r\n", r["menu_name"],
                                     r["turl"].ToString()
                           // r["url"].ToString() + "?menucode=" + GetMenu(r["menu_code"].ToString(), r["url"].ToString(), EncryptKey)
                            ));
                    }
                    //tmpsb.Append("url:'").Append(r["url"]).Append("'");


                }
            }

            sb.Append("</ul>");
            return new HtmlResult(sb.ToString());
        }

        String GetSubMenu(string pid, DataTable dt, string pname)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(string.Format(" <ul class='nav nav-sub dk'> <li class='nav-sub-header'> <a href> <span translate='aside.nav.DASHBOARD'>{0}</span> </a> </li>", pname));
            foreach (DataRow r in dt.Rows)
            {

                if (r["parent_id"].ToString() == pid)

                    sb.Append(string.Format(" <li ui-sref-active='active'> <a ui-sref='{1}'> <span>{0}</span> </a> </li>\r\n", r["menu_name"],
                         r["turl"].ToString()
                        //r["url"].ToString() + "?menucode=" + GetMenu(r["menu_code"].ToString(), r["url"].ToString(), EncryptKey)
                        ));
            }
            sb.Append(" </ul>");
            return sb.ToString();
        }


    }
}