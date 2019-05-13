using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Http;
using System.Web.WebSockets;
using System.Net.WebSockets;
using System.Net.Http;
using System.Net;
using System.Threading;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

using Newtonsoft.Json.Linq;
using System.Data;

using System.Data.SqlClient;
using JSBase.App_Start;


namespace JSBase.Controllers
{


    public class WSController : ApiController
    {
        //
        // GET: /WS/
        public HttpResponseMessage Get()
        {
            if (HttpContext.Current.IsWebSocketRequest)
            {
                HttpContext.Current.AcceptWebSocketRequest(ProcessWSChat);
            }
            return new HttpResponseMessage(HttpStatusCode.SwitchingProtocols);
        }

        static StringBuilder sb = new StringBuilder();
        //private async Task ProcessWSChat(AspNetWebSocketContext arg)
        //{
        //    WebSocket socket = arg.WebSocket;
        //    while (true)
        //    {
        //        ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);
        //        WebSocketReceiveResult result = await socket.ReceiveAsync(buffer, CancellationToken.None);
        //        if (socket.State == WebSocketState.Open)
        //        {
        //            string message = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);
        //            sb.Append(message);
        //            string returnMessage = "You send :" + sb.ToString() + ". at" + DateTime.Now.ToLongTimeString();
        //            buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(returnMessage));
        //            await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
        //        }
        //        else
        //        {
        //            break;
        //        }
        //    }
        //}


        BaseController bc = new BaseController();

        WebSocket socket;
        //   static StringBuilder sb = new StringBuilder();
        bool rec_flag = false;


        private async Task ProcessWSChat(AspNetWebSocketContext context)
        {
            socket = context.WebSocket;
            // ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);

            await Task.Run(() =>
            {
                //等待查询, 发返回信息
                while (true)
                {
                    receive();

                    Thread.Sleep(200);
                    //    Console.WriteLine("Task启动执行匿名方法");

                }
            });

            //主动发信息
            //while (true)
            //{
            //    //  WebSocketReceiveResult result = await socket.ReceiveAsync(buffer, CancellationToken.None);
            //    if (socket.State == WebSocketState.Open)
            //    {
            //        //string userMessage = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);
            //        // userMessage = "You sent: " + userMessage + " at " + DateTime.Now.ToLongTimeString();

            //        buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(sb.ToString() + DateTime.Now.ToLongTimeString()));
            //        await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
            //        Thread.Sleep(200);
            //    }
            //    else
            //    {
            //        break;
            //    }

            //}
        }
        int gcCounter = 0;

        async Task receive()
        {
            ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);

            if (rec_flag == false)
            {
                rec_flag = true;
                try
                {
                    WebSocketReceiveResult result = await socket.ReceiveAsync(buffer, CancellationToken.None);
                    string userMessage = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);
                    string r = "";
                    string command = userMessage;
                    string returnStr = "";
                    r = userMessage;
                    //if (command.StartsWith("dl"))
                    //{
                    //    ProcInfo pi = new ProcInfo("usp_device_list");
                    //    pi.ConnStr = "app";

                    // DataTable dt =    bc.ListDTVD(new JObject(), pi);
                    //    r = new JsonNetResult(dt).ToString();

                    //    command = "dl";
                    //}

                    //if (command.StartsWith("al"))
                    //{
                    //    ProcInfo pi = new ProcInfo("usp_agent_list");
                    //    pi.ConnStr = "app";

                    //    DataTable dt = bc.ListDTVD(new JObject(), pi);
                    //    r = new JsonNetResult(dt).ToString();
                    //    command = "al";

                    //}
                    //if (command.StartsWith("R"))
                    //{
                    //    ProcInfo pi = new ProcInfo("usp_request_setup");
                    //    pi.ConnStr = "app";
                    //    JObject data = new JObject();
                    //    data["command"] = command.Substring(2);
                    //    DataTable dt = bc.ListDTVD(data, pi);
                    //    r = new JsonNetResult(dt).ToString();
                    //    Console.Out.WriteLine(r);


                    //    ////R,004,03,0002,003,100,0002
                    //    string[] astr = command.Split(',');
                    //    string k1 = "Agent" + astr[3];
                    //    NodeData nd;
                    //    //if (!MonitorData.changed_data.ContainsKey(k1))

                    //    //    MonitorData.changed_data.Add(k1, true);
                    //    //else
                    //    //{
                    //    //    MonitorData.changed_data[k1] = true;
                    //    //}
                    //    nd = MonitorData.node_detail[k1];
                    //    nd.receive_data_counter++;
                    //    nd.counter_second_tmp++;
                    //    string k2 = "Node" + astr[6];
                    //    //if (!MonitorData.changed_data.ContainsKey(k2))
                    //    //    MonitorData.changed_data.Add(k2, true);
                    //    //else
                    //    //    MonitorData.changed_data[k2] = true;

                    //    nd = MonitorData.node_detail[k2];
                    //    nd.receive_data_counter++;
                    //    nd.update_flag = true;
                    //    nd.counter_second_tmp++;

                    //    command = "R";

                    //}
                    //if (command.StartsWith("V"))
                    //{
                    //    ProcInfo pi = new ProcInfo("usp_value_send");
                    //    pi.ConnStr = "app";

                    //    JObject data = new JObject();
                    //    data["command"] = command.Substring(2);

                    //    DataTable dt = bc.ListDTVD(data, pi);
                    //    r = new JsonNetResult(dt).ToString();

                    //    ////V,004,03,0002,190,003,100,0002
                    //    string[] astr = command.Split(',');
                    //    string k1 = "Agent" + astr[3];
                    //    NodeData nd;
                    //    //if (!MonitorData.changed_data.ContainsKey(k1))

                    //    //    MonitorData.changed_data.Add(k1, true);
                    //    //else
                    //    //{
                    //    //    MonitorData.changed_data[k1] = true;
                    //    //}

                    //    nd = MonitorData.node_detail[k1];
                    //    nd.receive_data_counter++;
                    //    nd.update_flag = true;
                    //    nd.counter_second_tmp++;

                    //    string k2 = "Node" + astr[7];
                    //    //if (!MonitorData.changed_data.ContainsKey(k2))
                    //    //    MonitorData.changed_data.Add(k2, true);
                    //    //else
                    //    //    MonitorData.changed_data[k2] = true;

                    //    nd = MonitorData.node_detail[k2];
                    //    nd.receive_data_counter++;
                    //    nd.update_flag = true;
                    //    nd.counter_second_tmp++;

                    //    command = "V";

                    //}


                    returnStr = "[{\"_command\":\"" + command + "\",\"id\":\"0\"}," + r.Substring(1) + ":";// + HttpContext.Current.Session["user_id"].ToString();// +":"+bc.CurrentUser.RealName;
                    // buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(userMessage + DateTime.Now.ToLongTimeString()));
                    buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(returnStr));
                    await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);


                    //sb.Append(userMessage);
                    //userMessage = "You sent: " + userMessage + " at " + DateTime.Now.ToLongTimeString();
                    if (gcCounter > 10)
                    {
                        GC.Collect();

                        gcCounter = 0;
                    }
                    gcCounter++;


                }
                catch (Exception e)
                {
                    Console.Out.WriteLine(e.ToString());

                }
                rec_flag = false;
            }
        }



        //        private async Task ProcessWSChat(AspNetWebSocketContext context)
        //        {
        //            socket = context.WebSocket;
        //            ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);

        //            await Task.Run(() =>
        //             {
        //                 while (true)
        //                 {
        //                     receive();

        //                     Thread.Sleep(200);
        //                 //    Console.WriteLine("Task启动执行匿名方法");

        //                 }
        //             });

        //            while (true)
        //            {


        //                //  WebSocketReceiveResult result = await socket.ReceiveAsync(buffer, CancellationToken.None);
        //                if (socket.State == WebSocketState.Open)
        //                {
        //                    //string userMessage = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);
        //                    // userMessage = "You sent: " + userMessage + " at " + DateTime.Now.ToLongTimeString();

        //                    buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(sb.ToString() + DateTime.Now.ToLongTimeString()));
        //                    await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
        //                    Thread.Sleep(200);
        //                }
        //                else
        //                {
        //                    break;
        //                }

        //            }
        //        }

        //        async Task receive()
        //        {
        //            if (rec_flag == false)
        //            {
        //                rec_flag = true;
        //                ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);

        //                WebSocketReceiveResult result = await socket.ReceiveAsync(buffer, CancellationToken.None);
        //                string userMessage = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);

        //                if(userMessage.StartsWith("dl"))
        //                { 
        //}
        //                sb.Append(userMessage);
        //                userMessage = "You sent: " + userMessage + " at " + DateTime.Now.ToLongTimeString();

        //                rec_flag = false;
        //            }
        //        }


    }
}
