using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Web.Mvc; 
using JTS.Utils;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;
using Newtonsoft.Json.Converters;
using System.Collections;
using System.Dynamic; 

using System.Xml;
using Newtonsoft.Json;
using System.Data;
using System.Collections;


using System.Configuration;

using System.Data.Sql;
using System.Data.SqlClient;
using System.Web;



using System.IO.MemoryMappedFiles;

using JSBase;


namespace JSBase.Controllers
{
    public class BaseController : JBaseController
    {


        /// <summary>
        /// 获取当前系统登录用户
        /// </summary>
        protected internal Base_User CurrentUser
        {
            get
            {
                return (CurrentBaseLoginer.Data as JObject).ToObject<Base_User>();
            }
        }

        /// <summary>
        /// 获取当前的登录用户者
        /// </summary>
        protected internal BaseLoginer CurrentBaseLoginer
        {
            get
            {
                return FormsAuth.GetBaseLoginerData();
            }
        }

        public void initLan()
        {

            HttpCookie cookie = Request.Cookies.Get("language");
            if (cookie == null)
            {
                Session["slanguage"] = GetLanguage();
            }
            else
            {

                Session["slanguage"] = cookie.Value;
            }
            JObject data2 = new JObject();
            data2["menu_code"] = "";
            data2["slanguage"] = Session["slanguage"].ToString();
            DataTable dt2 = base.RunProcedureDataTable(data2, "vdp_sys_get_text");
            ViewData["dictionary"] = dt2;
            ViewData["language"] = Session["slanguage"].ToString();
            DataTable dt3 = base.RunProcedureDataTable(data2, "vdp_list_text_language");


            var jason = JsonConvert.SerializeObject(JsonNet(dt3).Data, Newtonsoft.Json.Formatting.Indented, this.IsoDateTimeConverter);

            // ViewData[dr["action_url_name"].ToString()] = jason.Replace("\r\n", "").Replace("&quot;", "'");
            ViewData["language_list"] = jason.Replace("\r\n", "").Replace("&quot;", "'"); ;
        }

    }


    public class JavaScriptResult : ContentResult
    {
        public JavaScriptResult(string script)
        {
            this.Content = script;
            this.ContentType = "application/javascript";
        }
    }
    public class HtmlResult : ContentResult
    {
        public HtmlResult(string script)
        {
            this.Content = script;
            this.ContentType = "text/html";
        }
    }
}
