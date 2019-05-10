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
    public class WSMonitorController : ApiController
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
            ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);

            //await Task.Run(() =>
            //{
            //    //等待查询, 发返回信息
            //    while (true)
            //    {
            //        receive();

            //        Thread.Sleep(200);
            //        //    Console.WriteLine("Task启动执行匿名方法");

            //    }
            //});

            //主动发信息
            while (true)
            {
                //  WebSocketReceiveResult result = await socket.ReceiveAsync(buffer, CancellationToken.None);
                if (socket.State == WebSocketState.Open)
                {
                    //string userMessage = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);
                    // userMessage = "You sent: " + userMessage + " at " + DateTime.Now.ToLongTimeString();
                  //  var keys = MonitorData.changed_data.Keys; 
                        //foreach (var k in MonitorData.node_detail.Keys)
                        //{
                        //    //   MonitorData.changed_data.Remove(k);
                        //    if (MonitorData.node_detail[k].update_flag )
                        //    {
                        //    MonitorData.node_detail[k].update_flag = false;
                        //        NodeData n = MonitorData.node_detail[k];
                        //        string tmpstr = new JsonNetResult(n).ToString();


                        //        buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(tmpstr));
                        //        await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                        //        Thread.Sleep(20);
                        //      //  break;

                        //    }

                        //} 


  //foreach (var k in MonitorData.changed_data.Keys)
  //                      {
  //                          //   MonitorData.changed_data.Remove(k);
  //                          if (MonitorData.changed_data[k] )
  //                          {
  //                              MonitorData.changed_data[k] = false;
  //                              NodeData n = MonitorData.node_detail[k];
  //                              string tmpstr = new JsonNetResult(n).ToString();
  //                              buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(tmpstr));
  //                              await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
  //                              Thread.Sleep(20);
  //                              break;

  //                          }

  //                      } 

                  //  Thread.Sleep(20);
                }
                else
                {
                    break;
                }

            }
        }

        async Task receive()
        {
                ArraySegment<byte> buffer = new ArraySegment<byte>(new byte[1024]);
            if (rec_flag == false)
            {
                rec_flag = true;

                WebSocketReceiveResult result = await socket.ReceiveAsync(buffer, CancellationToken.None);
                string userMessage = Encoding.UTF8.GetString(buffer.Array, 0, result.Count);

                //if (userMessage.StartsWith("dl"))
                //{
                //    ProcInfo pi = new ProcInfo("usp_device_list");
                //    pi.ConnStr = "app";

                // DataTable dt =    bc.ListDTVD(new JObject(), pi);
                //    userMessage = new JsonNetResult(dt).ToString();

                //}

                //if (userMessage.StartsWith("al"))
                //{
                //    ProcInfo pi = new ProcInfo("usp_agent_list");
                //    pi.ConnStr = "app";

                //    DataTable dt = bc.ListDTVD(new JObject(), pi);
                //    userMessage = new JsonNetResult(dt).ToString();

                //}


                // buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(userMessage + DateTime.Now.ToLongTimeString()));
                buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(userMessage));
                await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);


                //sb.Append(userMessage);
                //userMessage = "You sent: " + userMessage + " at " + DateTime.Now.ToLongTimeString();

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
