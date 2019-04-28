using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml;
using System.IO;
using System.Text;
using System.Collections.Generic;
using System.Net;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
namespace JSBase.Controllers
{
    [AllowAnonymous]
    public class WeChatController : JBaseController
    {
       // public string redirect_url = "http://mywechat.imwork.net/wechat/OAuthHandle";  
         OAuthManage _oauth = null;  
         
        public WeChatController()
         {
             string appid = System.Configuration.ConfigurationManager.AppSettings["appid"].ToString(); //; "wx072d7c1098af8577";
             string secret = System.Configuration.ConfigurationManager.AppSettings["secret"].ToString(); //; "67cc96a576ea08739dfef2c5a18d4172";

             _oauth = new OAuthManage(appid, secret, "", Server,Request);  
        }
        //string appid = "wx072d7c1098af8577";
        //string secret = "67cc96a576ea08739dfef2c5a18d4172";
        //string redirect_url = "配置域名下的回调地址";  
        //
        // GET: /WeChat/
      //  public HttpServerUtilityBase MyServer = null;
        public ActionResult Index()
        {
            string a = Request.Params["code"];

            return View();
        }
        /// <summary>  
        /// 授权登录  
        /// </summary>  
        /// <returns></returns>  
        public ActionResult AuthLogin()
        {
            _oauth.MyRequest = Request;
            _oauth.MyServer = Server;
            _oauth.redirect_uri = "http://mywechat.imwork.net/wechat/OAuthHandle";  
            string u = _oauth.GetCodeUrl();
            ViewBag.url = u;
            Response.Redirect(ViewBag.url);
            return View("index");
        }
        /// <summary>  
        /// 回调处理  
        /// </summary>  
        /// <returns></returns>  
        public ActionResult OAuthHandle()
        {
            string result = "";
            //注册事件处理  
            _oauth.MyRequest = Request;
            _oauth.MyServer = Server;
            _oauth.OnError = (e) =>
            {
                string msg = "";
                Exception inner = e;
                while (inner != null)
                {
                    msg += inner.Message;
                    inner = inner.InnerException;
                }
                result = msg;
                //LogOperate.Write(msg);
            };
            _oauth.OnGetTokenSuccess = (token) =>
            {
                result += "<br/>";
                result += token.ToString();
            };
            _oauth.OnGetUserInfoSuccess = (user) =>
            {
                result += "<br/>";
                result += user.ToString();
            };
            //第二步  
            _oauth.GetAccess_Token();
            //第三步  
            _oauth.GetUserInfo();
            //显示结果  
            ViewBag.msg = result;

            return View("index");
        }  

        //public void ProcessRequest(HttpContext param_context)
        //{
        //    string postString = string.Empty;
        //    if (HttpContext.Current.Request.HttpMethod.ToUpper() == "POST")
        //    {
        //        using (Stream stream = HttpContext.Current.Request.InputStream)
        //        {
        //            Byte[] postBytes = new Byte[stream.Length];
        //            stream.Read(postBytes, 0, (Int32)stream.Length);
        //            postString = Encoding.UTF8.GetString(postBytes);
        //            Handle(postString);
        //        }
        //    }
        //}

        ///// <summary>
        ///// 处理信息并应答
        ///// </summary>
        //private void Handle(string postStr)
        //{
        //    messageHelp help = new messageHelp();
        //    string responseContent = help.ReturnMessage(postStr);

        //    HttpContext.Current.Response.ContentEncoding = Encoding.UTF8;
        //    HttpContext.Current.Response.Write(responseContent);
        //}

        //GetPage("https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=access_token");

        //public string GetPage(string posturl)
        //{
        //    Stream instream = null;
        //    StreamReader sr = null;
        //    HttpWebResponse response = null;
        //    HttpWebRequest request = null;
        //    Encoding encoding = Encoding.UTF8;
        //    // 准备请求...
        //    try
        //    {
        //        // 设置参数
        //        request = WebRequest.Create(posturl) as HttpWebRequest;
        //        CookieContainer cookieContainer = new CookieContainer();
        //        request.CookieContainer = cookieContainer;
        //        request.AllowAutoRedirect = true;
        //        request.Method = "GET";
        //        request.ContentType = "application/x-www-form-urlencoded";
        //        //发送请求并获取相应回应数据
        //        response = request.GetResponse() as HttpWebResponse;
        //        //直到request.GetResponse()程序才开始向目标网页发送Post请求
        //        instream = response.GetResponseStream();
        //        sr = new StreamReader(instream, encoding);
        //        //返回结果网页（html）代码
        //        string content = sr.ReadToEnd();
        //        string err = string.Empty;
        //        Response.Write(content);
        //        return content;
        //    }
        //    catch (Exception ex)
        //    {
        //        string err = ex.Message;
        //        return string.Empty;
        //    }
        //}

        public string ReturnMessage(string postStr)
        {
            // postStr =postStr.Replace("<xml>", "<xml version=\"1.0\" encoding=\"GB2312\">");
            string responseContent = "";
            XmlDocument xmldoc = new XmlDocument();
            // xmldoc.Load( postStr );



            xmldoc.Load(new System.IO.MemoryStream(System.Text.Encoding.GetEncoding("UTF-8").GetBytes(postStr)));
            XmlNode MsgType = xmldoc.SelectSingleNode("/xml/MsgType");
            if (MsgType != null)
            {
                switch (MsgType.InnerText)
                {
                    case "event":
                        responseContent = EventHandle(xmldoc);//事件处理
                        break;
                    case "text":
                        responseContent = TextHandle(xmldoc);//接受文本消息处理
                        break;
                    case "image":
                        responseContent = ImageHandle(xmldoc);//接受文本消息处理 PicUrl 
                        break;
                    case "voice":
                        responseContent = TextHandle(xmldoc);//接受文本消息处理 MediaId  
                        break;
                    case "video":
                        responseContent = TextHandle(xmldoc);//接受文本消息处理 MediaId  ,ThumbMediaId  
                        break;
                    case "location":
                        responseContent = TextHandle(xmldoc);//接受文本消息处理 Location_X 地理位置纬度,Location_Y 地理位置经度, Scale 地图缩放大小, Label 地理位置信息
                        break;
                    case "link":
                        responseContent = TextHandle(xmldoc);//接受文本消息处理 Title 图文消息标题, Description 图文消息描述, Url 点击图文消息跳转链接
                        break;
                    default:
                        break;
                }
            }
            return responseContent;
        }


        public string CreateQR(int UserID)
        {
            string filepath;

            filepath = System.Web.Hosting.HostingEnvironment.MapPath("/");
            //if (MyServer == null)
            //    filepath = Server.MapPath("/");
            //else
            //    filepath = MyServer.MapPath("/");
            filepath = filepath + "\\wechat\\UserData\\";
            if (!System.IO.Directory.Exists(filepath))
            {
                System.IO.Directory.CreateDirectory(filepath);

            }
                filepath = filepath + "\\qr" + UserID.ToString() + ".png";
            if (!System.IO.File.Exists(filepath))
            {

                string u = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=" + GetAccessToken();
                //     url = String.Format("{0}?access_token={1}&{2}", url, AccessToken, parms)

                string b64 = System.Convert.ToBase64String(Encoding.UTF8.GetBytes(UserID.ToString()));

                string j = "{\"action_name\": \"QR_LIMIT_STR_SCENE\", \"action_info\": {\"scene\": {\"scene_str\": \"" + b64 + "\"}}}";


                JObject r = PostPage(u, j);


                string QR = "https://mp.weixin.qq.com/cgi-bin/showqrcode?access_token=" + GetAccessToken() + "&ticket=" + r["ticket"].ToString();


                System.Net.WebClient w = new System.Net.WebClient();
                //  Dim p As String = path + "workdir\images\" + userid.ToString + ".jpg"

                w.DownloadFile(QR, filepath);
            }

            return "/wechat/UserData/qr" + UserID.ToString() + ".png";
        }



        //事件
        public string EventHandle(XmlDocument xmldoc)
        {
            string responseContent = "";
            XmlNode Event = xmldoc.SelectSingleNode("/xml/Event");
            XmlNode EventKey = xmldoc.SelectSingleNode("/xml/EventKey");
            XmlNode ToUserName = xmldoc.SelectSingleNode("/xml/ToUserName");
            XmlNode FromUserName = xmldoc.SelectSingleNode("/xml/FromUserName");
            if (Event != null)
            {


                JObject data = new JObject();


                ProcInfo pi = new ProcInfo();

                if (Event.InnerText.Equals("subscribe"))
                {
                    if (EventKey.InnerText != "")
                    {
                        var b = System.Convert.FromBase64String(EventKey.InnerText.Replace("qrscene_", ""));
                        string b64 = System.Text.Encoding.UTF8.GetString(b);
                        data["key"] = b64;
                    }
                    else
                        data["key"] = "";

                    pi.ProcedureName = "vdp_wechat_subscribe";

                }
                if (Event.InnerText.Equals("unsubscribe"))
                {
                    //  data["event"] = EventKey.InnerText;

                    //var b = System.Convert.FromBase64String(EventKey.InnerText);
                    //string b64 = System.Text.Encoding.UTF8.GetString(b);

                    //data["key"] = b64; 
                    pi.ProcedureName = "vdp_wechat_unsubscribe";
                }

                if (Event.InnerText.Equals("SCAN"))
                {

                    var b = System.Convert.FromBase64String(EventKey.InnerText);
                    string b64 = System.Text.Encoding.UTF8.GetString(b);

                    data["key"] = b64;
                    pi.ProcedureName = "vdp_wechat_scan";

                    //Ticket
                }
                if (Event.InnerText.Equals("scancode_push"))
                {
                    data["event"] = EventKey.InnerText;
                }

                //菜单单击事件
                if (Event.InnerText.Equals("CLICK"))
                {
                    data["event"] = EventKey.InnerText;

                    pi.ProcedureName = "vdp_wechat_event_click";

                }//菜单单击事件
                if (Event.InnerText.Equals("VIEW"))
                {
                    data["event"] = EventKey.InnerText;

                    pi.ProcedureName = "vdp_wechat_event_view";

                }

                data["from_user_name"] = FromUserName.InnerText;
                data["to_user_name"] = ToUserName.InnerText;
                pi.Type = "proc";
                pi.ConnStr = "app";
                DataSet ds = RunProcedureDataSet(data, pi);

                responseContent = ProcessResult(ds, xmldoc);

            }
            return responseContent;
        }

        public string ProcessResult(DataSet ds, XmlDocument xmldoc)
        {

            string responseContent = "";
            XmlNode ToUserName = xmldoc.SelectSingleNode("/xml/ToUserName");
            XmlNode FromUserName = xmldoc.SelectSingleNode("/xml/FromUserName");
            if (ds.Tables.Count == 1)
            {
                responseContent = string.Format(ReplyType.Message_Text,
                   FromUserName.InnerText,
                   ToUserName.InnerText,
                   DateTime.Now.Ticks,
                   ds.Tables[0].Rows[0]["text"]);
            }
            else
            {
                string tmpestr = "";
                foreach (DataRow dr in ds.Tables[1].Rows)
                {
                    tmpestr += string.Format(ReplyType.Message_News_Item, dr["Title"], dr["Description"],
                     dr["PicUrl"],
                     dr["Url"]);

                }
                responseContent = string.Format(ReplyType.Message_News_Main,
                   FromUserName.InnerText,
                   ToUserName.InnerText,
                   DateTime.Now.Ticks,
                   ds.Tables[1].Rows.Count, tmpestr);

            }
            return responseContent;
        }

        public string ImageHandle(XmlDocument xmldoc)
        {
            string responseContent = "";
            XmlNode ToUserName = xmldoc.SelectSingleNode("/xml/ToUserName");
            XmlNode FromUserName = xmldoc.SelectSingleNode("/xml/FromUserName");
            XmlNode MediaId = xmldoc.SelectSingleNode("/xml/MediaId");
            XmlNode PicUrl = xmldoc.SelectSingleNode("/xml/PicUrl"); 

            JObject data = new JObject();
            string path = "\\wechat\\images\\" + FromUserName.InnerText + "\\";
            string imagepath =path  + DateTime.Now.Ticks.ToString() + ".png";
            data["MediaId"] = MediaId.InnerText;
            data["PicUrl"] = PicUrl.InnerText;
            data["LocalPicUrl"] = imagepath.Replace("\\","/");
            data["from_user_name"] = FromUserName.InnerText;
            data["to_user_name"] = ToUserName.InnerText;
            ProcInfo pi = new ProcInfo();
            pi.ProcedureName = "vdp_wechat_image";
            pi.Type = "proc";
            pi.ConnStr = "app";
            DataSet ds = RunProcedureDataSet(data, pi);

            responseContent = ProcessResult(ds, xmldoc);



            System.Net.WebClient w = new System.Net.WebClient();
            //  Dim p As String = path + "workdir\images\" + userid.ToString + ".jpg"


            string filepath = System.Web.Hosting.HostingEnvironment.MapPath("/"); 
            if (!System.IO.Directory.Exists(filepath + path))
            {
                System.IO.Directory.CreateDirectory(filepath + path);

            }

            filepath = filepath + imagepath;
                w.DownloadFile(PicUrl.InnerText, filepath);

            return responseContent;
        }
        //接受文本消息
        public string TextHandle(XmlDocument xmldoc)
        {
            string responseContent = "";
            XmlNode ToUserName = xmldoc.SelectSingleNode("/xml/ToUserName");
            XmlNode FromUserName = xmldoc.SelectSingleNode("/xml/FromUserName");
            XmlNode Content = xmldoc.SelectSingleNode("/xml/Content");
            string ContentText = "";
            if (Content != null)
                ContentText = Content.InnerText;
            else
                ContentText = xmldoc.InnerText.ToString(); ;

            JObject data = new JObject();

            data["content"] = ContentText;
            data["from_user_name"] = FromUserName.InnerText;
            data["to_user_name"] = ToUserName.InnerText;
            ProcInfo pi = new ProcInfo();
            pi.ProcedureName = "vdp_wechat_content";
            pi.Type = "proc";
            pi.ConnStr = "app";
            DataSet ds = RunProcedureDataSet(data, pi);

            responseContent = ProcessResult(ds, xmldoc);

            return responseContent;
        }



        //成为开发者url测试，返回echoStr
        [HttpGet]
        [ActionName("process")]
        public void process()
        {
            string token = "填写的token";
            if (string.IsNullOrEmpty(token))
            {
                return;
            }

            string echoString = Request.QueryString["echoStr"];
            string signature = Request.QueryString["signature"];
            string timestamp = Request.QueryString["timestamp"];
            string nonce = Request.QueryString["nonce"];

            if (!string.IsNullOrEmpty(echoString))
            {
                Response.Write(echoString);
                Response.End();
            }
        }
        public string token()
        {
            string token = GetAccessToken();
           
            return token;
        }
        [HttpPost]
        [ActionName("process")]
        public void process2()
        {

            using (Stream stream = Request.InputStream)
            {
                Byte[] postBytes = new Byte[stream.Length];
                stream.Read(postBytes, 0, (Int32)stream.Length);
                string postString = Encoding.UTF8.GetString(postBytes);
                Handle(postString);
            }
        }

        private void Handle(string postStr)
        {
            string responseContent = ReturnMessage(postStr);

            Response.ContentEncoding = Encoding.UTF8;
            Response.Write(responseContent);
        }

        protected void createMenu(object sender, EventArgs e)
        {
            FileStream fs1 = new FileStream(Server.MapPath(".") + "\\menu.txt", FileMode.Open);
            StreamReader sr = new StreamReader(fs1, Encoding.GetEncoding("GBK"));
            string menu = sr.ReadToEnd();
            sr.Close();
            fs1.Close();
            PostPage("https://api.weixin.qq.com/cgi-bin/menu/create?access_token=" + GetAccessToken(), menu);
        }


        public JObject RetriveMenu()
        {

            string u = "https://api.weixin.qq.com/cgi-bin/menu/get?access_token=" + GetAccessToken();
            return PostPage(u, "");
        }
        public JObject RetriveJoinedOpenID(string NextOpenID)
        {

            string u = "https://api.weixin.qq.com/cgi-bin/user/get?access_token=" + GetAccessToken();
            return PostPage(u, "next_openid=" + NextOpenID);
        }


        public JObject RetriveOpenIDDetail(string NextOpenID)
        {
            string u = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + GetAccessToken();
            return PostPage(u, "openid=" + NextOpenID);
        }
        public JObject PostTextMessageToUser(string OpenID, string Msg)
        {
            string url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + GetAccessToken();
            // string j = string.Format(" {{    \"touser\": \"{0}\",     \"msgtype\": \"text\",     \"text\": {{        \"content\": \"{1}\"    }}}}", OpenID, Msg);
            string j = makeTextCustomMessage(OpenID, Msg);
            return PostPage(url, j);
        }
        public static String makeTextCustomMessage(String openId, String content)
        {
            content.Replace("\"", "\\\"");
            String jsonMsg = "{{\"touser\":\"{0}\",\"msgtype\":\"text\",\"text\":{{\"content\":\"{1}\"}}}}";
            return String.Format(jsonMsg, openId, content);

        }

        /** 
         * 组装图片客服消息 
         *  
         * @param openId 消息发送对象 
         * @param mediaId 媒体文件id 
         * @return 
         */
        public static String makeImageCustomMessage(String openId, String mediaId)
        {
            String jsonMsg = "{\"touser\":\"%s\",\"msgtype\":\"image\",\"image\":{\"media_id\":\"%s\"}}";
            return String.Format(jsonMsg, openId, mediaId);
        }

        /** 
         * 组装语音客服消息 
         *  
         * @param openId 消息发送对象 
         * @param mediaId 媒体文件id 
         * @return 
         */
        public static String makeVoiceCustomMessage(String openId, String mediaId)
        {
            String jsonMsg = "{\"touser\":\"%s\",\"msgtype\":\"voice\",\"voice\":{\"media_id\":\"%s\"}}";
            return String.Format(jsonMsg, openId, mediaId);
        }

        /** 
         * 组装视频客服消息 
         *  
         * @param openId 消息发送对象 
         * @param mediaId 媒体文件id 
         * @param thumbMediaId 视频消息缩略图的媒体id 
         * @return 
         */
        public static String makeVideoCustomMessage(String openId, String mediaId, String thumbMediaId)
        {
            String jsonMsg = "{\"touser\":\"%s\",\"msgtype\":\"video\",\"video\":{\"media_id\":\"%s\",\"thumb_media_id\":\"%s\"}}";
            return String.Format(jsonMsg, openId, mediaId, thumbMediaId);
        }

        /** 
         * 组装音乐客服消息 
         *  
         * @param openId 消息发送对象 
         * @param music 音乐对象 
         * @return 
         */
        //public static String makeMusicCustomMessage(String openId, Music music)
        //{
        //    String jsonMsg = "{\"touser\":\"%s\",\"msgtype\":\"music\",\"music\":%s}";
        //    jsonMsg = String.Format(jsonMsg, openId, JSONObject.fromObject(music).toString());
        //    // 参数名称替换 @20140125  
        //    jsonMsg = jsonMsg.replace("musicUrl", "musicurl");
        //    jsonMsg = jsonMsg.replace("HQMusicUrl", "hqmusicurl");
        //    jsonMsg = jsonMsg.replace("thumbMediaId", "thumb_media_id");
        //    return jsonMsg;
        //}

        /** 
         * 组装图文客服消息 
         *  
         * @param openId 消息发送对象 
         * @param articleList 图文消息列表 
         * @return 
         */
        //public static String makeNewsCustomMessage(String openId, List<Article> articleList)
        //{
        //    String jsonMsg = "{\"touser\":\"%s\",\"msgtype\":\"news\",\"news\":{\"articles\":%s}}";
        //    jsonMsg = String.Format(jsonMsg, openId, JSONArray.fromObject(articleList).toString().replaceAll("\"", "\\\""));
        //    // 将jsonMsg中的picUrl替换为picurl  
        //    jsonMsg = jsonMsg.Replace("picUrl", "picurl");
        //    return jsonMsg;
        //}  

        public JObject GetUserOpenID(string AppID, string Secret, string Code)
        {
            string u = string.Format("https://api.weixin.qq.com/sns/oauth2/access_token?appid={0}&secret={1}&code={2}&grant_type=authorization_code", AppID, Secret, Code);
            //   LogException.Debug("Debug", u)
            JObject p = PostPage(u, "");// SendRequest(New Uri(u), Nothing, "text/html; charset=utf-8", "GET");

            return p;
        }

        public JObject PostPage(string posturl, string postData)
        {
            Stream outstream = null;
            Stream instream = null;
            StreamReader sr = null;
            HttpWebResponse response = null;
            HttpWebRequest request = null;
            Encoding encoding = Encoding.UTF8;
            byte[] data = encoding.GetBytes(postData);
            // 准备请求...
            try
            {

                // 设置参数
                request = WebRequest.Create(posturl) as HttpWebRequest;
                CookieContainer cookieContainer = new CookieContainer();
                request.CookieContainer = cookieContainer;
                request.AllowAutoRedirect = true;
                request.Method = "POST";
                request.ContentType = "application/x-www-form-urlencoded";
                request.ContentLength = data.Length;
                outstream = request.GetRequestStream();
                outstream.Write(data, 0, data.Length);
                outstream.Close();
                //发送请求并获取相应回应数据
                response = request.GetResponse() as HttpWebResponse;
                //直到request.GetResponse()程序才开始向目标网页发送Post请求
                instream = response.GetResponseStream();
                sr = new StreamReader(instream, encoding);
                //返回结果网页（html）代码
                string content = sr.ReadToEnd();
                string err = string.Empty;
                //  Response.Write(content);
                JObject p;
                p = (JObject)(JsonConvert.DeserializeObject(content));
                return p;
            }
            catch (Exception ex)
            {
                string err = ex.Message;
                return null;
            }
        }


        public static Access_token GetAccessTokenFromWX()
        {

            string appid = System.Configuration.ConfigurationManager.AppSettings["appid"].ToString(); //; "wx072d7c1098af8577";
            string secret = System.Configuration.ConfigurationManager.AppSettings["secret"].ToString(); //; "67cc96a576ea08739dfef2c5a18d4172";
            string strUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appid + "&secret=" + secret;
            Access_token mode = new Access_token();

            HttpWebRequest req = (HttpWebRequest)HttpWebRequest.Create(strUrl);

            req.Method = "GET";
            using (WebResponse wr = req.GetResponse())
            {
                HttpWebResponse myResponse = (HttpWebResponse)req.GetResponse();

                StreamReader reader = new StreamReader(myResponse.GetResponseStream(), Encoding.UTF8);

                string content = reader.ReadToEnd();
                //Response.Write(content);  
                //在这里对Access_token 赋值  
                Access_token token = new Access_token();
                token = JSBase.JsonHelper.ParseFromJson<Access_token>(content);
                mode.access_token = token.access_token;
                mode.expires_in = token.expires_in;
            }
            return mode;
        }

        public string GetAccessToken()
        {

            string Token = string.Empty;
            DateTime YouXRQ;
            // 读取XML文件中的数据，并显示出来 ，注意文件路径  
            string filepath;// = Server.MapPath("XMLFile.xml");

           filepath = System.Web.Hosting.HostingEnvironment.MapPath("/");
            //if (MyServer == null)
            //    filepath = Server.MapPath("/");
            //else
            //    filepath = MyServer.MapPath("/");
            filepath = filepath + "\\wechat\\XMLFile.xml";

            if (System.IO.File.Exists(filepath))
            {
                StreamReader str = new StreamReader(filepath, System.Text.Encoding.UTF8);
                XmlDocument xml = new XmlDocument();
                xml.Load(str);
                str.Close();
                str.Dispose();
                Token = xml.SelectSingleNode("xml").SelectSingleNode("Access_Token").InnerText;
                YouXRQ = Convert.ToDateTime(xml.SelectSingleNode("xml").SelectSingleNode("Access_YouXRQ").InnerText);

                if (DateTime.Now > YouXRQ)
                {
                    DateTime _youxrq = DateTime.Now;
                    Access_token mode = GetAccessTokenFromWX();
                    xml.SelectSingleNode("xml").SelectSingleNode("Access_Token").InnerText = mode.access_token;
                    _youxrq = _youxrq.AddSeconds(int.Parse(mode.expires_in));
                    xml.SelectSingleNode("xml").SelectSingleNode("Access_YouXRQ").InnerText = _youxrq.ToString();
                    xml.Save(filepath);
                    Token = mode.access_token;
                }

            }
            else
            {
                if (!System.IO.Directory.Exists(filepath.Substring(0, filepath.LastIndexOf("\\"))))
                {
                    System.IO.Directory.CreateDirectory(filepath.Substring(0, filepath.LastIndexOf("\\")));

                }
                XmlDocument xml = new XmlDocument();
                DateTime _youxrq = DateTime.Now;
                Access_token mode = GetAccessTokenFromWX();

                XmlElement x = xml.CreateElement("xml");
                xml.AppendChild(x);

                XmlElement Access_Token = xml.CreateElement("Access_Token");
                Access_Token.InnerText = mode.access_token;
                x.AppendChild(Access_Token);
                XmlElement Access_YouXRQ = xml.CreateElement("Access_YouXRQ");
                _youxrq = _youxrq.AddSeconds(int.Parse(mode.expires_in));
                Access_YouXRQ.InnerText = _youxrq.ToString();
                x.AppendChild(Access_YouXRQ);

                //xml.SelectSingleNode("xml").SelectSingleNode("Access_Token").InnerText = mode.access_token;
                //xml.SelectSingleNode("xml").SelectSingleNode("Access_YouXRQ").InnerText = _youxrq.ToString();
                xml.Save(filepath);
                Token = mode.access_token;
            }
            return Token;
        }
















    }

    public class Access_token
    {
        public Access_token()
        {
            //  
            //TODO: 在此处添加构造函数逻辑  
            //  
        }
        string _access_token;
        string _expires_in;

        /// <summary>  
        /// 获取到的凭证   
        /// </summary>  
        public string access_token
        {
            get { return _access_token; }
            set { _access_token = value; }
        }

        /// <summary>  
        /// 凭证有效时间，单位：秒  
        /// </summary>  
        public string expires_in
        {
            get { return _expires_in; }
            set { _expires_in = value; }
        }
    }
    //回复类型
    public class ReplyType
    {
        /// <summary>
        /// 普通文本消息
        /// </summary>
        public static string Message_Text
        {
            get
            {
                return @"<xml>
                            <ToUserName><![CDATA[{0}]]></ToUserName>
                            <FromUserName><![CDATA[{1}]]></FromUserName>
                            <CreateTime>{2}</CreateTime>
                            <MsgType><![CDATA[text]]></MsgType>
                            <Content><![CDATA[{3}]]></Content>
                            </xml>";
            }
        }
        /// <summary>
        /// 图文消息主体
        /// </summary>
        public static string Message_News_Main
        {
            get
            {
                return @"<xml>
                            <ToUserName><![CDATA[{0}]]></ToUserName>
                            <FromUserName><![CDATA[{1}]]></FromUserName>
                            <CreateTime>{2}</CreateTime>
                            <MsgType><![CDATA[news]]></MsgType>
                            <ArticleCount>{3}</ArticleCount>
                            <Articles>
                            {4}
                            </Articles>
                            </xml> ";
            }
        }
        /// <summary>
        /// 图文消息项
        /// </summary>
        public static string Message_News_Item
        {
            get
            {
                return @"<item>
                            <Title><![CDATA[{0}]]></Title> 
                            <Description><![CDATA[{1}]]></Description>
                            <PicUrl><![CDATA[{2}]]></PicUrl>
                            <Url><![CDATA[{3}]]></Url>
                            </item>";
            }
        }






    }

    //Dim w2 As WeiXinMP = dbt.GetWeiXinMP(gMPID)
    //                Dim u1 As String = "http://" + w.QRUrl + "/action/Setup/" + tmps
    //                u1 = Server.UrlEncode(u1)
    //                Dim u As String = String.Format("https://open.weixin.qq.com/connect/oauth2/authorize?appid={0}&redirect_uri={1}&response_type=code&scope=snsapi_base&state=123#wechat_redirect", w2.AppId, u1)
    //                Response.Redirect(u)


    //    string appid = "wx145b4a8fd07b24e8";  
    //string appsecrect = "fe6951dcb99772411c42f724b1336065";  
    //string redirect_url = "配置域名下的回调地址";  
    //OAuthManage _oauth = null;  
    ///// <summary>  
    /////控制器构造函数  
    ///// </summary>  
    //public UserController()  
    //{  
    //    _oauth = new OAuthManage(appid, appsecrect, redirect_url);  
    //}  
    ///// <summary>  
    ///// 授权登录  
    ///// </summary>  
    ///// <returns></returns>  
    //public ActionResult AuthLogin()  
    //{  
    //    ViewBag.url = _oauth.GetCodeUrl();  
    //    return View();  
    //}  
    ///// <summary>  
    ///// 回调处理  
    ///// </summary>  
    ///// <returns></returns>  
    //public ActionResult OAuthHandle()  
    //{  
    //    string result = "";  
    //    //注册事件处理  
    //    _oauth.OnError = (e) =>  
    //    {  
    //        string msg = "";  
    //        Exception inner = e;  
    //        while (inner != null)  
    //        {  
    //            msg += inner.Message;  
    //            inner = inner.InnerException;  
    //        }  
    //        result = msg;  
    //        LogOperate.Write(msg);  
    //    };  
    //    _oauth.OnGetTokenSuccess = (token) =>  
    //    {  
    //        result += "<br/>";  
    //        result += token.ToJsonString();  
    //    };  
    //    _oauth.OnGetUserInfoSuccess = (user) =>  
    //    {  
    //        result += "<br/>";  
    //        result += user.ToJsonString();  
    //    };  
    //    //第二步  
    //    _oauth.GetAccess_Token();  
    //    //第三步  
    //    _oauth.GetUserInfo();  
    //    //显示结果  
    //    ViewBag.msg = result;  
    //    return View();  
    //}  

    public class OAuthManage
    {


        #region 基本信息定义
        /// <summary>  
        /// 公众号的唯一标识  
        /// </summary>  
        private string appid;
        /// <summary>  
        /// 公众号的appsecret  
        /// </summary>  
        private string secret;
        /// <summary>  
        /// 回调url地址  
        /// </summary>  
        /// <summary>  
        /// 获取微信用户基本信息使用snsapi_userinfo模式  
        /// 如果使用静默授权，无法获取用户基本信息但可以获取到openid  
        /// </summary>  
        private string scope;
        public  HttpServerUtilityBase MyServer;
        public HttpRequestBase MyRequest;
        public string redirect_uri;
        public OAuthManage(string appid, string appsecret, string redirect_uri, HttpServerUtilityBase pServer,
            HttpRequestBase pRequest, bool IsUserInfo = true)
        {
            this.appid = appid;
            this.secret = appsecret;
            this.redirect_uri = redirect_uri;
            this.scope = IsUserInfo ? "snsapi_userinfo" : "snsapi_base";

            this.MyServer = pServer;
            this.MyRequest = pRequest;

        }
        #endregion

        #region 请求过程信息
        /// <summary>  
        /// 第一步获取到的Code 值  
        /// </summary>  
        public string Code { get; set; }
        /// <summary>  
        /// 第二步获取到的access_token及相关数据  
        /// </summary>  
        public OAuthAccess_Token TokenData = null;
        #endregion

        #region 事件定义
        /// <summary>  
        /// 当处理出现异常时，触发  
        /// </summary>  
        public Action<Exception> OnError = null;
        /// <summary>  
        /// 当获取AccessToken成功是触发  
        /// </summary>  
        public Action<OAuthAccess_Token> OnGetTokenSuccess = null;
        /// <summary>  
        /// 当获取用户信息成功时触发  
        /// </summary>  
        public Action<OAuthUser> OnGetUserInfoSuccess = null;
        #endregion

        #region 第二步,回调处理
        /// <summary>  
        /// 第二步，通过code换取网页授权access_token  
        /// </summary>  
        public void GetAccess_Token()
        {
            try
            {
                //1.处理跳转  
                this.Code = MyRequest.Params["code"];// Request.GetString("code");
                if (string.IsNullOrEmpty(this.Code))
                    throw new Exception("获取code参数失败或用户禁止授权获取基本信息");
                //1.发送获取access_token请求  
                string url = GetAccess_TokenUrl();
                string result = GetPage(url);

                //2.解析相应结果  
                TokenData = JsonConvert.DeserializeObject<OAuthAccess_Token>(result);
                if (TokenData == null)
                    throw new Exception("反序列化结果失败，返回内容为：" + result);
                //3.获取成功  
                if (OnGetTokenSuccess != null)
                    OnGetTokenSuccess(TokenData);
            }
            catch (Exception ex)
            {
                Error("第二步，通过code换取网页授权access_token异常", ex);
            }
        }
        /// <summary>  
        /// 刷新当前access_token  
        /// </summary>  
        public OAuthAccess_Token RefreshAccess_Token()
        {
            try
            {
                //1.发送请求  
                string url = GetReferesh_TokenUrl();
                string result = GetPage(url);
                //2.解析结果  
                OAuthAccess_Token token = JsonConvert.DeserializeObject<OAuthAccess_Token>(result);
                if (token == null)
                    throw new Exception("反序列化结果失败，返回内容：" + result);
                return token;
            }
            catch (Exception ex)
            {
                Error("刷新当前access_token失败", ex);
                return null;
            }
        }
        #endregion

        #region 第三步，获取用户基本信息
        /// <summary>  
        /// 第三步，获取基本信息  
        /// </summary>  
        public void GetUserInfo()
        {
            try
            {
                //1.发送get请求  
                string url = GetUserInfoUrl();
                string result = GetPage(url);
                //2.解析结果  
                OAuthUser user = JsonConvert.DeserializeObject<OAuthUser>(result);
                if (user == null)
                    throw new Exception("反序列化结果失败，返回内容：" + result);
                //3.获取成功  
                if (OnGetUserInfoSuccess != null)
                    OnGetUserInfoSuccess(user);
            }
            catch (Exception ex)
            {
                Error("第三步、获取用户基本信息异常", ex);
            }
        }

        public static
            string GetPage(string posturl)
        {
            Stream instream = null;
            StreamReader sr = null;
            HttpWebResponse response = null;
            HttpWebRequest request = null;
            Encoding encoding = Encoding.UTF8;
            // 准备请求...
            try
            {
                // 设置参数
                request = WebRequest.Create(posturl) as HttpWebRequest;
                CookieContainer cookieContainer = new CookieContainer();
                request.CookieContainer = cookieContainer;
                request.AllowAutoRedirect = true;
                request.Method = "GET";
                request.ContentType = "application/x-www-form-urlencoded";
                //发送请求并获取相应回应数据
                response = request.GetResponse() as HttpWebResponse;
                //直到request.GetResponse()程序才开始向目标网页发送Post请求
                instream = response.GetResponseStream();
                sr = new StreamReader(instream, encoding);
                //返回结果网页（html）代码
                string content = sr.ReadToEnd();
                string err = string.Empty;
                return content;
            }
            catch (Exception ex)
            {
                string err = ex.Message;
                return string.Empty;
            }
        }
        #endregion

        #region 静态方法
        //<summary>  
        //验证授权凭证是否有效  
        //</summary>  
        //<param name="access_token">access_token</param>  
        //<param name="openid">用户针对当前公众号的openid</param>  
        //<returns></returns>  
        public static bool CheckWebAccess_Token(string access_token, string openid)
        {
            try
            {
                string url = string.Format("https://api.weixin.qq.com/sns/auth?access_token={0}&openid={1}",
             access_token,
             openid);
                string result = GetPage(url);
                JObject obj = JObject.Parse(result);
                int errcode = (int)obj["errcode"];
                return errcode == 0;
            }
            catch (Exception ex)
            {
                throw new Exception("，" + ex.Message);
            }
        }
        #endregion

        #region 获取请求连接
        /// <summary>  
        /// 获取Code的url 地址  
        /// </summary>  
        /// <returns></returns>  
        public string GetCodeUrl()
        {
            string url = string.Format("https://open.weixin.qq.com/connect/oauth2/authorize?appid={0}&redirect_uri={1}&response_type=code&scope={2}&state=STATE#wechat_redirect",
                this.appid,
                MyServer.UrlEncode(this.redirect_uri),
                this.scope);
            return url;
        }
        /// <summary>  
        /// 获取access_token的url地址  
        /// </summary>  
        /// <returns></returns>  
        private string GetAccess_TokenUrl()
        {
            string url = string.Format("https://api.weixin.qq.com/sns/oauth2/access_token?appid={0}&secret={1}&code={2}&grant_type=authorization_code",
                this.appid,
                this.secret,
                this.Code);
            return url;
        }
        /// <summary>  
        /// 获取刷新AccessToke的地址  
        /// </summary>  
        /// <returns></returns>  
        private string GetReferesh_TokenUrl()
        {
            string url = string.Format("https://api.weixin.qq.com/sns/oauth2/refresh_token?appid={0}&grant_type=refresh_token&refresh_token={1}",
                this.appid,
                this.TokenData.refresh_token
                );
            return url;
        }
        /// <summary>  
        /// 获取用户基本信息地址  
        /// </summary>  
        /// <returns></returns>  
        private string GetUserInfoUrl()
        {
            string url = string.Format("https://api.weixin.qq.com/sns/userinfo?access_token={0}&openid={1}&lang=zh_CN",
                this.TokenData.access_token,
                this.TokenData.openid);
            return url;
        }
        #endregion
        private void Error(string msg, Exception inner)
        {
            if (this.OnError != null)
            {
                this.OnError(new Exception(msg, inner));
            }
        }



    }
    /// <summary>  
    /// 授权之后获取用户基本信息  
    /// </summary>  
    public class OAuthUser
    {
        public string openid { get; set; }
        public string nickname { get; set; }
        public int sex { get; set; }
        public string province { get; set; }
        public string city { get; set; }
        public string country { get; set; }
        public string headimgurl { get; set; }
        /// <summary>  
        /// 用户特权信息，json 数组  
        /// </summary>  
        public JArray privilege { get; set; }
        public string unionid { get; set; }
    }
    /// <summary>  
    /// 获取Access_Token或者刷新返回的数据对象  
    /// </summary>  
    public class OAuthAccess_Token
    {
        public string access_token { get; set; }
        public int expires_in { get; set; }
        public string refresh_token { get; set; }
        /// <summary>  
        /// 用户针对当前公众号的唯一标识  
        /// 关注后会产生，返回公众号下页面也会产生  
        /// </summary>  
        public string openid { get; set; }
        public string scope { get; set; }
        /// <summary>  
        /// 当前用户的unionid，只有在用户将公众号绑定到微信开放平台帐号后  
        /// </summary>  
        public string unionid { get; set; }
    }  
}
