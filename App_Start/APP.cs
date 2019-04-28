using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using JTS.Utils;
namespace JSBase.App_Start
{
    public class APP
    {
        //消息字段
        public static string Msg_NotAuth_Code = "NotAuth";
        public static string Msg_NotAuth_Text = "未登录";
        public static string Msg_Save_Success = "保存成功！";
        public static string Msg_Delete_Success = "删除成功！";
        public static string Msg_Update_Success = "更新成功！";
        public static string Msg_Insert_Success = "新增成功！";
        public static string Msg_File_NotExist = "请求的文件不存在！";
        public static string Msg_Miss_Module_Attr = "业务类{0}，缺少特性ModuleAttribute";



        //配置自动新值和更新的字段名
        public static string Field_AddBy = "AddBy";
        public static string Field_AddOn = "AddOn";
        public static string Field_EditBy = "EditBy";
        public static string Field_EditOn = "EditOn";

        //下载路径
        public static string Download_RootPath = "/upload/"; //通过download service url方式下载的根目录

        /// <summary>
        /// 数据库默认数据库链接字符串
        /// </summary>
        public static string Db_Default_ConnName = "Sys";// ConfigurationManager.ConnectionStrings[1].Name;


        //public static Action<AjaxAction> OnAjaxRequst = null;

        /// <summary>
        /// 执行数据库事件
        /// </summary>
      //  public static Action<CommandEventArgs> OnDbExecuting = null;

        //框架初始化函数
        public static void Init()
        {
            //ClownFishHelper.Init(APP.Db_Default_ConnName);
        //    LogHelper.();
            //PinYinHelper.Init();
            //OnDbExecuting = DbExecuting;
        }

        //public static void DbExecuting(CommandEventArgs args)
        //{
        //    //暂时没多大用
        //    //var sql = args.Command.CommandText;
        //    //LogHelper.WriteDb("DbExecuting执行sql语句：" + sql);
        //}
    }
}