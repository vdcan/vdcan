//------------------------------------------------------------------------------
//       时间： 2017-01-25 08:45:08
//       作者： 蔡捷     
 
//------------------------------------------------------------------------------
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using JSBase.Controllers;
using JTS.Utils;
using Newtonsoft.Json.Linq;
using System.Dynamic;
using System.Data;
using System.Data.Sql;
using System.Data.SqlClient;
using System.Configuration;

using System.Data.Odbc;
using System.Data.OleDb;

using Newtonsoft.Json.Linq;
using System.Dynamic;
using System.Data;
using System.Data.Sql;
using System.Data.SqlClient;
using System.Configuration;
using System.Text.RegularExpressions;
using System.Data.Odbc;
using System.Data.OleDb;
using System.IO; 
using JTS.Utils.MyImage;


namespace JSBase.Areas.dev.Controllers
{
    /// <summary>
    /// 区域表，用于设置饭馆布局（area） 控制器类 
    /// </summary>
    public class Titan2Controller : BaseController
    {


        public void MyInitSession()
        {
            Session.Timeout = 3000;

            Session["add_by"] = CurrentUser.UserId.ToString();
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
        public Titan2Controller()
        {
            InitSession = new CallBackFun(MyInitSession);
            EncryptKey = System.Configuration.ConfigurationManager.AppSettings["EncryptKey"].ToString(); ;
            log_level = System.Configuration.ConfigurationManager.AppSettings["LogLevel"].ToInt() ;
        }
        public ActionResult Index(string menucode)
        {


            // Session["ActionFrom"] = "readfile";
            //Session.Timeout = 3000;

            //Session["add_by"] = CurrentUser.UserId.ToString();
            //Session["sstore_id"] = CurrentUser.DepartmentID.ToString();
            // ViewBag.QR = GetQR();
          //  ViewBag.Template = GetTemplate().ToString();
            MyInitSession();
            initLan();
            return BaseIndex(menucode);

        }
        public ActionResult t2()
        {
            // Session["ActionFrom"] = "readfile";

            return View("t2");

        }

         public JsonResult GetTemplate()
        { 
             string p = Server.MapPath("/");
            p = p + "\\source\\";

              root_path =p;
            List<path_info> list2 = FindFile(root_path);

            return JsonNet(list2);
        }
        
          List<path_info> list = new List<path_info>();
          string root_path = "";

          public List<path_info> FindFile(string sSourcePath)

        {

            path_info pi;
            string p = "";

            //在指定目录及子目录下查找文件,在list中列出子目录及文件

            DirectoryInfo Dir = new DirectoryInfo(sSourcePath);


            DirectoryInfo[] DirSub = Dir.GetDirectories();

            if (DirSub.Length <= 0)

            {

                foreach (FileInfo f in Dir.GetFiles("*.*", SearchOption.TopDirectoryOnly)) //查找文件

                {
                    pi = new path_info(Dir.ToString().Replace(root_path,"") , f.ToString(), false);
                    
                    list.Add(pi);

                }

            }


            int t = 1;

            foreach (DirectoryInfo d in DirSub)//查找子目录 

            {

                FindFile(Dir + @"\" + d.ToString());


                pi = new path_info(Dir.ToString().Replace(root_path, ""), d.ToString(), true);

                list.Add(pi);

                if (t == 1)

                {

                    foreach (FileInfo f in Dir.GetFiles("*.*", SearchOption.TopDirectoryOnly)) //查找文件

                    {


                        pi = new path_info(Dir.ToString().Replace(root_path, ""), f.ToString(), false);

                        list.Add(pi);

                    }

                    t = t + 1;

                }

            }           

            return list;


        } 

  

        public string upload(System.Web.UI.HtmlControls.HtmlInputFile uploadFiles)
        {

            string p = Server.MapPath("/");
            p = p + "\\data\\";


            if (!System.IO.Directory.Exists(p))
                System.IO.Directory.CreateDirectory(p);

            for (int i = 0; i <= Request.Files.Count - 1; i++)
            {


                //  postedFile = (HttpPostedFile);// Request.Files[i];

                if (Request.Files[i].FileName.Trim().Length > 0)
                {

                    string n = Request.Files[i].FileName.Substring(Request.Files[i].FileName.LastIndexOf("\\") + 1);

                    if (n.EndsWith(".xls"))
                    {

                        Request.Files[i].SaveAs(p + "\\" + n);

                        SaveExcel(p + "\\" + n);

                    }

                }
            }


            return "";
        }


        void SaveExcel(string Path)
        {

            // string Path = @"F:\AllNetProjects\AllNetTaskQTM\啊啊啊.xls";
            //http://blog.csdn.net/sat472291519/article/details/41007681
            try
            {
                string p = Server.MapPath("/");
                p = p + "\\data\\log2.txt";

                string strConn = "Provider=Microsoft.Jet.OLEDB.4.0;" + "Data Source=" + Path + ";" + "Extended Properties=Excel 8.0;";
                OleDbConnection conn = new OleDbConnection(strConn);

                System.IO.File.WriteAllText(p, "connect" + Path);

                conn.Open();
                string strExcel = "";
                OleDbDataAdapter myCommand = null;
                DataSet ds = null;
                strExcel = "select * from [Sheet 1$]";
                myCommand = new OleDbDataAdapter(strExcel, strConn);
                ds = new DataSet();
                myCommand.Fill(ds, "table1");
                JObject data;
                foreach (DataRow r in ds.Tables[0].Rows)
                {
                    data = new JObject();
                    data["add_by"] = CurrentUser.UserId;
                    data["name"] = r["姓名"].ToString().Trim();
                    data["login_date"] = r["时间"].ToString().Trim();
                    runProc(data);

                    System.IO.File.AppendAllText(p, data.ToString());
                }


            }
            catch (Exception e)
            {
                string p = Server.MapPath("/");
                p = p + "\\data\\log.txt";
                System.IO.File.WriteAllText(p, e.ToString());
            }
        }











        [AllowAnonymous]
        public string uploadImage(System.Web.UI.HtmlControls.HtmlInputFile uploadFiles)
        {

            string p = Server.MapPath("/");
            p = p + "\\upload\\";
            string tmpFile = "";

            if (!System.IO.Directory.Exists(p))
                System.IO.Directory.CreateDirectory(p);

            for (int i = 0; i <= Request.Files.Count - 1; i++)
            {

                if (Request.Files[i].FileName.Trim().Length > 0)
                {

                    string n = Request.Files[i].FileName.Substring(Request.Files[i].FileName.LastIndexOf("\\") + 1);

                    DateTime now = DateTime.Now;
                    DateTime old = new DateTime(2017, 6, 28);
                    TimeSpan ts = now - old;
                    int s = (int)ts.TotalSeconds;
                    Random r = new Random();

                    string ext = n.Substring(n.IndexOf("."));
                    n = s.ToString() + "_" + r.Next(100).ToString() + ext;
                    tmpFile = n + "," + tmpFile;
                    Request.Files[i].SaveAs(p + "\\" + n);
                    string thumbP = p + "\\thumb\\";
                    if (!System.IO.Directory.Exists(thumbP))
                        System.IO.Directory.CreateDirectory(thumbP);
                    ImageClass ic = new ImageClass(p + "\\" + n);
                    ic.GetReducedImage(80, 80, thumbP + "\\" + n);
                    //if (n.EndsWith(".xls"))
                    //{

                    //    Request.Files[i].SaveAs(p + "\\" + n);

                    //    SaveExcel(p + "\\" + n);

                    //}

                }
            }


            return Request.Params["testid"] + ";" + tmpFile;
        }

        //public string upload(System.Web.UI.HtmlControls.HtmlInputFile uploadFiles)
        //{

        //    string p = Server.MapPath("/");
        //    p = p + "\\data\\";


        //    if (!System.IO.Directory.Exists(p))
        //        System.IO.Directory.CreateDirectory(p);

        //    for (int i = 0; i <= Request.Files.Count - 1; i++)
        //    {


        //        //  postedFile = (HttpPostedFile);// Request.Files[i];

        //        if (Request.Files[i].FileName.Trim().Length > 0)
        //        {

        //            string n = Request.Files[i].FileName.Substring(Request.Files[i].FileName.LastIndexOf("\\") + 1);

        //            if (n.EndsWith(".xls"))
        //            {

        //                Request.Files[i].SaveAs(p + "\\" + n);

        //                SaveExcel(p + "\\" + n);

        //            }
        //            else
        //            {
        //                Response.Write("error");
        //            }

        //        }
        //    }


        //    return "";
        //}


        public JsonResult GetQR()
        {
            WeChatController w = new WeChatController();
          //  w.MyServer = Server;

           // string p =  Server.MapPath(".");//UserData");
           // p = p + "\\wechat\\UserData\\";
          //  return w.CreateQR(CurrentUser.UserId);

            return JsonNet(new { url = w.CreateQR(CurrentUser.UserId), error = 0 });
        }

        public JsonResult uploadImg(System.Web.UI.HtmlControls.HtmlInputFile uploadFiles)
        {

            string p = Server.MapPath("/");
            p = p + "\\upload\\img\\";

            string tmpFile = "";

            if (!System.IO.Directory.Exists(p))
                System.IO.Directory.CreateDirectory(p);

            for (int i = 0; i <= Request.Files.Count - 1; i++)
            {

                if (Request.Files[i].FileName.Trim().Length > 0)
                {

                    string n = Request.Files[i].FileName.Substring(Request.Files[i].FileName.LastIndexOf("\\") + 1);

                    DateTime now = DateTime.Now;
                    DateTime old = new DateTime(2017, 6, 28);
                    TimeSpan ts = now - old;
                    int s = (int)ts.TotalSeconds;
                    Random r = new Random();

                    string ext = n.Substring(n.IndexOf("."));
                    n = s.ToString() + "_" + r.Next(100).ToString() + ext;
                    tmpFile = n;
                    Request.Files[i].SaveAs(p + "\\" + n);
                }
            }


            return JsonNet(new { url = "/upload/img/" + tmpFile, error = 0 });
        }

        //void SaveExcel(string Path)
        //{

        //    // string Path = @"F:\AllNetProjects\AllNetTaskQTM\啊啊啊.xls";
        //    //http://blog.csdn.net/sat472291519/article/details/41007681
        //    try
        //    {
        //        string p = Server.MapPath("/");
        //        p = p + "\\data\\log2.txt";

        //        string strConn = "Provider=Microsoft.ACE.OLEDB.12.0;" + "Data Source=" + Path + ";" + "Extended Properties=Excel 8.0;";
        //        OleDbConnection conn = new OleDbConnection(strConn);

        //        System.IO.File.WriteAllText(p, "connect" + Path);

        //        conn.Open();
        //        string strExcel = "";
        //        OleDbDataAdapter myCommand = null;
        //        DataSet ds = null;
        //        strExcel = "select * from [Sheet1$]";
        //        myCommand = new OleDbDataAdapter(strExcel, strConn);
        //        ds = new DataSet();
        //        myCommand.Fill(ds, "table1");
        //        JObject data;
        //        foreach (DataRow r in ds.Tables[0].Rows)
        //        {
        //            data = new JObject();
        //            data["group_id"] = Request.Params["group_id"];
        //            data["add_by"] = CurrentUser.UserId;
        //            data["breed_name"] = r["作物名称"].ToString().Trim();
        //            data["breed_company"] = r["育种单位"].ToString().Trim();
        //            data["apply_company"] = r["申请单位"].ToString().Trim();
        //            data["breed_source"] = r["品种来源"].ToString().Trim();
        //            data["techniques"] = r["栽培技术要点"].ToString().Trim();
        //            runProc(data);

        //            System.IO.File.AppendAllText(p, data.ToString());
        //        }


        //    }
        //    catch (Exception e)
        //    {
        //        string p = Server.MapPath("/");
        //        p = p + "\\data\\log.txt";
        //        System.IO.File.WriteAllText(p, e.ToString());
        //    }
        //}
        



        public ActionResult OpenFile(JObject data)
        {
            string id = "";
            id = data["review_id"].ToString();
            string type = "";
            type = data["type"].ToString();

            var rootPath = Server.MapPath("/");
            string path = rootPath + "data\\file\\" + type + "_" + id + ".txt";
            string tmpStr = "";
            if (System.IO.File.Exists(path))
            {
                tmpStr = System.IO.File.ReadAllText(path);
            }

            return JsonNet(new { h = tmpStr });
        }


        public String SaveFile(JObject data)
        {
            string id = "";
            id = data["review_id"].ToString();
            string type = "";
            type = data["type"].ToString();

            var rootPath = Server.MapPath("/");
            string path = rootPath + "data\\file\\" + type + "_" + id + ".txt";
            if (!System.IO.Directory.Exists(rootPath + "data\\file\\"))
                System.IO.Directory.CreateDirectory(rootPath + "data\\file\\");
            string tmpStr = "";
            tmpStr = data["html"].ToString();
            System.IO.File.WriteAllText(path, tmpStr);

            return "";
        }



    }

    public class path_info
    {
        public string path;
        public string my_path;
        public string p_path;
        public string file_name;
        public path_info(string Dir, string f, bool flag)
        {
            path = Dir + @"\" + f;
            my_path = Dir;
            if (flag)
            {
                p_path = Dir;
            }
            else
            {
                if (my_path.LastIndexOf(@"\") >= 0)
                {

                    p_path = Dir.Substring(0, Dir.LastIndexOf(@"\"));
                }
                else
                {
                    p_path = "";
                }

            }
            file_name = f;
        }
    }
}
