using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;

using System.Data.Sql;
using System.Data.SqlClient;

using JSBase.App_Start;

using System.Configuration;
using System.Data;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using System.Net.Mail;
namespace JSBase
{
    // 注意: 有关启用 IIS6 或 IIS7 经典模式的说明，
    // 请访问 http://go.microsoft.com/?LinkId=9394801
    public class MvcApplication : System.Web.HttpApplication
    { 
            System.Timers.Timer t = new System.Timers.Timer(1000 * 60 ); //设置时间间隔为5秒
                JSBase.Controllers.WeChatController w = new JSBase.Controllers.WeChatController();
            protected void Application_Start()
            {
                AreaRegistration.RegisterAllAreas();
                //GlobalConfiguration.Configure(WebApiConfig.Register);
                FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
                RouteConfig.RegisterRoutes(RouteTable.Routes);
                BundleConfig.RegisterBundles(BundleTable.Bundles);
                //  BaseController bc = new BaseController();
                // string p = Server.MapPath("/");
                //  bc.ListActionFromDB();
                // bc.WriteActionToFile(p);
                //  bc.ListActionFromFile(p);
                // ListAction();
                //注册框架配置
                FrameworkConfig.Register();
                t.Elapsed += new System.Timers.ElapsedEventHandler(Timer_TimesUp);
                t.AutoReset = true; //每到指定时间Elapsed事件是触发一次（false），还是一直触发（true）
                t.Start();

            }
            private void Timer_TimesUp(object sender, System.Timers.ElapsedEventArgs e)
            {
                //w.MyServer = Server;

                ProcInfo pi = new ProcInfo();
                JObject data= new JObject();
                pi.ProcedureName = "vdp_get_unsent_email";
                pi.Type = "proc";
                pi.ConnStr = "app";
                DataSet ds = w.RunProcedureDataSet(data, pi);

                foreach (DataRow dr in ds.Tables[0].Rows)
                {
                    SendEmail(dr["to_email"].ToString(), dr["subject"].ToString(), dr["context"].ToString());
                    //tmpestr += string.Format(ReplyType.Message_News_Item, dr["Title"], dr["Description"],
                    // dr["PicUrl"],
                    // dr["Url"]);

                }
                //pi.ProcedureName = "vdp_get_unsent_message"; 
                //pi.Type = "proc";
                //pi.ConnStr = "app";
                //DataSet ds = w.RunProcedureDataSet(data, pi);

                //foreach (DataRow dr in ds.Tables[0].Rows)
                //{
                //    w.PostTextMessageToUser(dr["open_id"].ToString(), dr["message"].ToString());
                //    //tmpestr += string.Format(ReplyType.Message_News_Item, dr["Title"], dr["Description"],
                //    // dr["PicUrl"],
                //    // dr["Url"]);

                //}
               // WeChatController w = new WeChatController();
           //    w.PostTextMessageToUser("ojbqdwKTA8VqKpEKoMql01gSK56Y", "test222");
                //到达指定时间5秒触发该事件输出 Hello World!!!!
                //  System.Diagnostics.Debug.WriteLine("Hello World!!!!");
            }


        public static void  SendEmail(string email, string subject, string context)
        {
            
            try
            {
                MailMessage mail = new MailMessage();
                SmtpClient SmtpServer = new SmtpClient(System.Configuration.ConfigurationManager.AppSettings["smtp_server"].ToString() );

                mail.From = new MailAddress(System.Configuration.ConfigurationManager.AppSettings["from_email"].ToString());
                mail.To.Add(email);
                mail.Subject = subject;
                mail.Body = context;

                SmtpServer.Port = 587;
                SmtpServer.Credentials = new System.Net.NetworkCredential(System.Configuration.ConfigurationManager.AppSettings["smtp_user"].ToString(), System.Configuration.ConfigurationManager.AppSettings["smtp_pwd"].ToString());
                SmtpServer.EnableSsl = true;

                SmtpServer.Send(mail); 
            }
            catch (Exception ex)
            { 
            }
        }


            public static object GetCache(string CacheKey)
            {
                System.Web.Caching.Cache objCache = HttpRuntime.Cache;
                return objCache[CacheKey];
            }

            public static void SetCache(string cacheKey, object objObject)
            {
                if (objObject == null)
                    return;
                System.Web.Caching.Cache objCache = HttpRuntime.Cache;
                objCache.Insert(cacheKey, objObject);
            }


            //public DataTable ListAction()
            //{
            //    //if (HttpContext.Application)
            //    //Application.Add("UserOnlineCount", UserCount);

            //    DataSet tmpds = (DataSet)GetCache("ActionList");
            //    if (tmpds != null)
            //        return tmpds.Tables[0];
            //    SqlConnection sqlCon = new SqlConnection(ConfigurationManager.ConnectionStrings["Sys"].ConnectionString);
            //    SqlCommand sqlCmd = new SqlCommand("vdp_list_action", sqlCon); 
            //    sqlCmd.CommandType = CommandType.StoredProcedure;//设置调用的类型为存储过程   
            //    SqlDataAdapter dp = new SqlDataAdapter(sqlCmd); 
            //    DataSet ds = new DataSet();
            //    // 填充dataset
            //    sqlCon.Open();
            //    dp.Fill(ds);
            //    sqlCon.Close();
            //    if (ds.Tables[0].Rows.Count > 0)
            //        SetCache("ActionList", ds);
            //    return ds.Tables[0];
            //} 

            protected void Application_Error(object sender, EventArgs e)
            {
                Exception exception = Server.GetLastError();
                Response.Clear();
                HttpException httpException = exception as HttpException;
                RouteData routeData = new RouteData();
                routeData.Values.Add("controller", "Error");
                if (httpException == null)
                {
                    routeData.Values.Add("action", "Index");
                }
                else //It's an Http Exception, Let's handle it.
                {
                    switch (httpException.GetHttpCode())
                    {
                        case 404:
                            // Page not found.
                            routeData.Values.Add("action", "HttpError404");
                            break;
                        case 500:
                            // Server error.
                            routeData.Values.Add("action", "HttpError500");
                            break;
                        // Here you can handle Views to other error codes.
                        // I choose a General error template  
                        default:
                            routeData.Values.Add("action", "General");
                            break;
                    }
                    // Pass exception details to the target error View.
                    routeData.Values.Add("error", exception.Message + "位置：" + exception.StackTrace.ToString());
                    JTS.Utils.LogHelper.Error("全局错误：" + exception.Message, exception);
                }
                // Clear the error on server.
                Server.ClearError();
                // Call target Controller and pass the routeData.
                IController errorController = new JSBase.Controllers.ErrorController();
                errorController.Execute(new RequestContext(
               new HttpContextWrapper(Context), routeData));


            }
            //protected static void SetOndDayTimer()
            //{
            //    //第一次开始的时间
            //    DateTime startTime = new DateTime(
            //        DateTime.Now.Year,
            //        DateTime.Now.Month,
            //        DateTime.Now.Day,
            //        23, 58, 0);
            //    if (startTime < DateTime.Now)
            //        startTime = startTime.AddDays(1.0);
            //    TimeSpan delayTime = (startTime - DateTime.Now);

            //    TimeSpan intervalTime = new TimeSpan(1, 0, 0, 0); // 1 天

            //    // OnOndDayTimer为你每天需要调用的方法
            //    TimerCallback timerDelegate = new TimerCallback(OnOndDayTimer);

            //    // Create a timer that signals the delegate to invoke
            //    oneDayTimer = new System.Threading.Timer(timerDelegate, null, delayTime, intervalTime);
            //}

        }
    } 