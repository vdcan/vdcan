using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JTS.Utils;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using JSBase;

namespace JSBase.Controllers
{
    //[AllowAnonymous]
    public class MobileController : BaseController
    {


         


        public void MyInitSession()
        {
            Session.Timeout = 3000;

            Session["add_by"] = CurrentUser.UserId.ToString();
            Session["sstore_id"] = CurrentUser.DepartmentID.ToString();
        }
        public MobileController()
        {
            InitSession = new CallBackFun(MyInitSession);
            EncryptKey = System.Configuration.ConfigurationManager.AppSettings["EncryptKey"].ToString(); ;
            log_level = System.Configuration.ConfigurationManager.AppSettings["LogLevel"].ToInt() ;
        }
        public ActionResult Index()
        {
             
            JObject data = new JObject();
            data["role_ids"] = CurrentUser.RoleIDs;
            DataSet dt = base.RunProcedureDataSet(data, "vdp_get_mobile_menu", "sys"); 
            EncryptKey = System.Configuration.ConfigurationManager.AppSettings["EncryptKey"].ToString(); ;

            foreach (DataRow r in dt.Tables[0].Rows)
            {
                r["menu_token"] = Server.UrlEncode(JTS.Utils.DESEncrypt.Encrypt(r["url"] + "]" + r["menu_code"], EncryptKey));
            } 

            ViewBag.UserMenus = Dtb2Json(dt.Tables[0]);
            return BaseIndexA("index");
        
    }}
}