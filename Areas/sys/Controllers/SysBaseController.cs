using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using JSBase.Controllers;

using Newtonsoft.Json.Linq;
using System.Dynamic;
using System.Data.Sql;
using System.Data;
using JSBase;
using JSBase2;

using System.Data.Sql;
using System.Data.SqlClient;
//using Microsoft.SqlServer;

using System.Configuration;

using JTS.Utils;

namespace JSBase.Areas.Sys.Controllers
{
    public class SysBaseController : BaseController
    {
        public String JSToken = System.Configuration.ConfigurationManager.AppSettings["UserKey"].ToString() + "," + System.Configuration.ConfigurationManager.AppSettings["PlanKey"].ToString();

        public String JSLanguage = System.Configuration.ConfigurationManager.AppSettings["JSLanguage"].ToString();
        public String JSFramework = System.Configuration.ConfigurationManager.AppSettings["JSFramework"].ToString();

        //
        public ActionResult Index(string menucode)
        {
            Session.Timeout = 3000;

            MyInitSession();

            initLan();
            ViewBag.menucode = GetMenuCode(menucode);
            ViewBag.token2 = CreatePassmenucode("/sys/sysbase", "page_detail_config");
            string page_id = "0";
            if (Request.Params["page_id"] != null)
                page_id = Request.Params["page_id"].ToString();
            ViewBag.page_id = page_id;

            // var m =   GetMenuCode(ViewBag.token);

            ViewBag.Source = JTS.Utils.DESEncrypt.Encrypt("/sys/sysbase]source", EncryptKey);
            string s = JTS.Utils.DESEncrypt.Encrypt("/sys/sysbase]page_detail_config", EncryptKey);
            ViewBag.Config = JTS.Utils.DESEncrypt.Encrypt("/sys/sysbase]page_detail_config", EncryptKey);
            return BaseIndex(menucode);

        }


        public void MyInitSession()
        {
            Session.Timeout = 3000;

            Session["add_by"] = CurrentUser.UserId.ToString();
            Session["sstore_id"] = CurrentUser.DepartmentID.ToString();
            Session["add_by"] = CurrentUser.UserId.ToString();
            Session["user_id"] = CurrentUser.UserId.ToString();
            Session["scompany_id"] = CurrentUser.DepartmentCode.ToString();
            Session["sparentid"] = CurrentUser.DepartmentCode.ToString();
            Session["sdepartment_id"] = CurrentUser.DepartmentCode.ToString();
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
        public SysBaseController()
        {
            InitSession = new CallBackFun(MyInitSession);
            EncryptKey = System.Configuration.ConfigurationManager.AppSettings["EncryptKey"].ToString(); ;
            log_level = System.Configuration.ConfigurationManager.AppSettings["LogLevel"].ToInt();
        }
        //disable this function on production
        public JsonResult GetProcParamters(JObject data)
        {

            ProcInfo pinfo = new ProcInfo(data["procedure_name"].ToString(), data["conn_str"].ToString());
            return JsonNet(GetParamters(pinfo));

        }


        //public new JsonResult  GenerateCode(JObject data)

        public JsonResult runProcM(JObject data)
        {
            string url = (string)data["Url"];
            string MenuCode = (string)data["MenuCode"];

            string MenuToken = Server.UrlEncode(JTS.Utils.DESEncrypt.Encrypt(url + "]" + MenuCode));


            data["MenuToken"] = MenuToken;
            return base.runProc(data);
        }





        public JsonResult ResetPasswrod(JObject data)
        {
            string Password = data.Value<string>("pwd");

            data["pwd"] = Md5Util.MD5(Password);
            data["add_by"] = CurrentUser.UserId;
            base.RunProcedureByName(data, "vdp_reset_password", "app");


            return Json(new { s = true, message = GetSysText("success")  }, JsonRequestBehavior.DenyGet);
        }
        public JsonResult GenerateCode(JObject data)
        {

            //DataSet ds = RunProcedureDataSet(data, "vdp_get_page_for_gen");


            //DataSet ds2 = RunProcedureDataSet(data, "vdp_get_page_detail_for_gen");

            string p = Server.MapPath("\\") + "\\source\\" + (string)data["page_id"] + "\\";
            if (!System.IO.Directory.Exists(p))
                System.IO.Directory.CreateDirectory(p);


            Result[] r3 = PreGenerateCode(data);

            if (r3 == null)
            {

                return JsonNet(new { s = false, message =  GetSysText("failed")  });
            }
            else
            {


                foreach (Result r in r3)
                {
                    data["file_name"] = r.FileName.Replace("$", "_");
                    data["file_type"] = r.FileType;
                    data["add_by"] = CurrentUser.UserId;

                    base.RunProcedureByName(data, "vdp_insert_vd_Source", "sys");
                    System.IO.File.WriteAllText(p + r.FileName.Replace("$", "_"), r.Context, System.Text.Encoding.UTF8);


                }

                return JsonNet(new { s = true, message =  GetSysText("success")  });
            }



            // return GenerateCode2(data);
        }
        public JsonResult Synchronize(JObject data)
        {

            JSBase2.TemplageData r3 = mycs.Synchronize(JSToken, JSLanguage, JSFramework);

            for (int i = 0; i < r3.templates.Length; i++)
            {
                data = new JObject();
                data["id"] = r3.templates[i].id;
                data["template_name"] = r3.templates[i].template_name;
                data["description"] = r3.templates[i].description;
                data["files"] = r3.templates[i].files;
                data["html"] = r3.templates[i].html;
                data["areas"] = r3.templates[i].areas;
                data["language"] = r3.templates[i].language;
                data["js_framwork"] = r3.templates[i].JSFramework;
                data["clean_table_flag"] = i;

                RunProcedureByName(data, "vdp_synchronize_vd_template", "sys");
                //  r3.templates[i]

            }



            for (int i = 0; i < r3.modules.Length; i++)
            {

                data = new JObject();
                data["id"] = r3.modules[i].id;
                data["template_id"] = r3.modules[i].template_id;
                data["module_name"] = r3.modules[i].module_name;
                data["description"] = r3.modules[i].description;
                data["files_text"] = r3.modules[i].files_text;
                data["edit_flag"] = r3.modules[i].edit_flag;
                data["language"] = r3.modules[i].language;
                data["js_framwork"] = r3.modules[i].JSFramework;
                data["clean_table_flag"] = i;
                RunProcedureByName(data, "vdp_synchronize_vd_module", "sys");
                //  r3.templates[i]

            }

            return JsonNet(new { s = true, message =  GetSysText("success")  });
        }

        CodeServiceClient mycs = new CodeServiceClient();
        protected Result[] PreGenerateCode(JObject data)
        {
            CSParameter entry = new CSParameter();

            DataSet ds = RunProcedureDataSet(data, "vdp_get_page_for_gen_client", "sys");

            if (ds.Tables.Count >= 2)
            {
                entry.page = new Page();
                entry.page.Author = CurrentUser.RealName;
                entry.page.id = (int)ds.Tables[0].Rows[0]["id"];
                entry.page.template_id = (int)ds.Tables[0].Rows[0]["template_id"];
                entry.page.page_name = (string)ds.Tables[0].Rows[0]["page_name"];
                entry.page.description = (string)ds.Tables[0].Rows[0]["description"];
                entry.page.parent_menu_code = (string)ds.Tables[0].Rows[0]["parent_menu_code"];
                entry.page.page_name_text = (string)ds.Tables[0].Rows[0]["page_name_text"];
                entry.page.controller_area = (string)ds.Tables[0].Rows[0]["controller_area"];
                entry.page.controller = (string)ds.Tables[0].Rows[0]["controller"];


                entry.page_detail = new List<PageDetail>();
                //   ds.Tables[1];

                //  entry.columns = new List<ColumnSet>();
                foreach (DataRow r in ds.Tables[1].Rows)
                {
                    PageDetail tmpPageDetail = new PageDetail();
                    //   tmpPageDetail.columns = new List<ColumnSet>();
                    tmpPageDetail.id = (int)r["id"];
                    tmpPageDetail.area = (string)r["area"];
                    tmpPageDetail.table_name = (string)r["table_name"];
                    tmpPageDetail.module_id = (int)r["module_id"];
                    tmpPageDetail.comments = (string)r["comments"];
                    tmpPageDetail.name_text = (string)r["name_text"];
                    tmpPageDetail.class_name = (string)r["class_name"];;
                    tmpPageDetail.RelatedChildenTable = (string)r["related_childen_table"];
                    tmpPageDetail.table_description = "";
                    //  tmpPageDetail.edit_flag = (int)r["edit_flag"]; 
                    entry.page_detail.Add(tmpPageDetail);
                    data["page_detail_id"] = tmpPageDetail.id;
                    DataSet ds2 = RunProcedureDataSet(data, "vdp_get_page_detail_for_gen_client", "sys");
                    int w = 0;

                    ColumnSet cs;
                    tmpPageDetail.columns = new List<ColumnSet>();
                    foreach (DataRow r2 in ds2.Tables[0].Rows)
                    {
                        cs = new ColumnSet();
                        cs.isInsert = r2["is_insert"].ToString() == "0" ? false : true;
                        cs.isShow = r2["is_show"].ToString() == "0" ? false : true;
                        cs.isUpdate = r2["is_update"].ToString() == "0" ? false : true;
                        cs.isRequired = r2["is_required"].ToString() == "0" ? false : true;
                        cs.isWhere = r2["is_where"].ToString() == "0" ? false : true;
                        tmpPageDetail.table_description = (string)r2["table_description"];
                        if (r2["size"].ToString() == "")
                            w = 0;
                        else
                            w = int.Parse(r2["length"].ToString()) * 10;
                        if (w > 500)
                            w = 500;
                        cs.width = w;
                        cs.data = (string)r2["data"];
                        cs.valid = (string)r2["valid"];
                        cs.staticValue = (string)r2["static_value"];
                        cs.FlagIdentity = int.Parse(r2["flag_identity"].ToString());
                        cs.FlagPrimary = int.Parse(r2["flag_primary"].ToString());// (int)r2["flag_primary"];
                        cs.ColumnName = (string)r2["column_name"];
                        cs.Type = (string)r2["type"];
                        if (r2["size"].ToString() == "")
                            cs.Size = 0;
                        else
                        {
                            string tmpstr = r2["size"].ToString();
                            if (tmpstr.Length >= 5)
                                tmpstr = "50000";
                            if (int.Parse(tmpstr) > 6000)
                                cs.Size = 6000;
                            else
                            {
                                cs.Size = Int16.Parse(tmpstr);//(Int16)r2["size"];
                            }
                        }
                        if (r2["length"].ToString() == "")
                            cs.Length = 0;
                        else
                            cs.Length = int.Parse(r2["length"].ToString());// (int)r2["length"];
                        cs.htmlType = (string)r2["html_type"];
                        cs.ColumnCaption = (string)r2["column_caption"];
                        cs.ColumnDescription = (string)r2["column_description"];
                        cs.RelatedParentTable = (string)r2["related_table"]; 
                        cs.staticValue = (string)r2["static_value"];
                        cs.PrimaryField = (string)r2["primary_field"];
                        if (r2["is_identity"].ToString() == "1")
                            cs.IsIdentity = true;
                        else
                            cs.IsIdentity = false;
                        tmpPageDetail.columns.Add(cs);
                    }
                }
            }



            //string p2 = Server.MapPath("\\") + "\\templates\\test2.data";

            //FileStream fs3 = new FileStream(p2, FileMode.Create); 

            //BinaryFormatter bf = new BinaryFormatter();
            //bf.Serialize(fs3, entry);
            //fs3.Close();


            Result[] r3 = mycs.CreateCode(JSToken, entry);
            return r3;


        }


        public JsonResult test(JObject data)
        {
            return JsonNet(new { message =  GetSysText("success") , r = 1 });
        }
        public JsonResult publish(JObject data)
        {

            DataTable dt = base.ListDTVD(data, "vdp_get_page_detail");
            if (dt.Rows.Count > 0)
            {
                string p = Server.MapPath("/");
                p = p + "\\source\\" + (string)data["page_id"] + "\\";

                if (!System.IO.Directory.Exists(p))
                    System.IO.Directory.CreateDirectory(p);

                string f = (string)data["file_name"];


                string p2 = Server.MapPath("/");

                if (f.EndsWith(".js"))
                {

                    if (dt.Rows[0]["controller"].ToString() == "")
                    {

                        if (!System.IO.Directory.Exists(p2 + "\\areas\\ViewJS\\"))
                            System.IO.Directory.CreateDirectory(p2 + "\\areas\\ViewJS\\");

                        p2 = p2 + "\\areas\\ViewJS\\" + f;
                    }
                    else
                        p2 = p2 + "\\areas\\" + dt.Rows[0]["controller_area"].ToString() + "\\ViewJS\\" + f;
                    f = p + "\\" + f;
                    System.IO.File.Copy(f, p2, true);
                }

                if (f.EndsWith(".cshtml"))
                {
                    if (dt.Rows[0]["controller"].ToString() == "")
                        p2 = p2 + "\\Views\\" + dt.Rows[0]["controller_area"].ToString() + "\\";
                    else
                        p2 = p2 + "\\areas\\" + dt.Rows[0]["controller_area"].ToString() + "\\Views\\" + dt.Rows[0]["controller"].ToString() + "\\";
                    if (!System.IO.Directory.Exists(p2))
                        System.IO.Directory.CreateDirectory(p2);

                    p2 = p2 + f;
                    f = p + "\\" + f;
                    System.IO.File.Copy(f, p2, true);

                }
                //if (f.EndsWith(".sql"))
                //{

                //    f = p + "\\" + f;
                //    string result = "";
                //    if (!ExceSQL(f, ConfigurationManager.ConnectionStrings["app"].ConnectionString, ref result))
                //    {
                //        return JsonNet(new { message = result, r = 0 });
                //    }
                //}

                //   System.IO.File.WriteAllText(f, html);

                return JsonNet(new { message =  GetSysText("success") , r = 1 });
            }
            else
                return JsonNet(new { message =  GetSysText("failed") , r = 0 });
        }

        //private bool ExceSQL(string path, string constr, ref string logtxt)
        //{
        //    string sql = System.IO.File.ReadAllText(path);

        //    bool isBuild = false;
        //    logtxt = "ExceSQL Finished,sql count:0.";
        //    try
        //    {
        //        // string connectonstring = "data source=10.1.8.188;initial catalog=WAPPDB;user id=sa;password=mindray99!";
        //        SqlConnection conn = new SqlConnection(constr);
        //        Microsoft.SqlServer.Management.Smo.Server server = new Microsoft.SqlServer.Management.Smo.Server(new Microsoft.SqlServer.Management.Common.ServerConnection(conn));
        //        int i = server.ConnectionContext.ExecuteNonQuery(sql);
        //        if (i > 0)
        //        {
        //            isBuild = true;
        //            logtxt = "ExceSQL Success,sql count:" + (0 - i).ToString() + ".";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        logtxt = "ExceSQL Failed - " + ex.Message;
        //    }
        //    return isBuild;
        //}


        public JsonResult Save(JObject data)
        {

            string p = Server.MapPath("/");
            p = p + "\\source\\" + (string)data["page_id"] + "\\";

            if (!System.IO.Directory.Exists(p))
                System.IO.Directory.CreateDirectory(p);
            string f = (string)data["file_name"];
            string html = (string)data["source"];
            f = p + "\\" + f;
            html = html.Replace("&gt;", ">").Replace("&lt;", "<");

            html = html.Replace("&g1;", "]").Replace("&l1;", "[");
            System.IO.File.WriteAllText(f, html, System.Text.Encoding.UTF8);

            return JsonNet(new { message =  GetSysText("success") , r = 0 });
        }

        public JsonResult Open(JObject data)
        {

            string p = Server.MapPath("/");
            p = p + "\\source\\" + (string)data["page_id"] + "\\";
            //  string tmpFile = "";

            if (!System.IO.Directory.Exists(p))
                System.IO.Directory.CreateDirectory(p);

            string f = (string)data["file_name"];
            f = p + "\\" + f;
            if (System.IO.File.Exists(f))
            {

                string html = System.IO.File.ReadAllText(f);
                html = html.Replace(">", "&gt;").Replace("<", "&lt;");
                return JsonNet(new { source = html, r = 0 });
            }
            else
                return JsonNet(new { html = "", r = 1 });
        }
    }
}