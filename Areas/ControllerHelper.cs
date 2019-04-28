using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Web;
using JTS.Utils;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;


namespace JSBase.Areas
{
    public class ControllerHelper
    {

        public static dynamic GetIndexUrls(string areas, string controller, object extend = null)
        {
            var expando = (IDictionary<string, object>)new ExpandoObject();
            expando["list"] = string.Format("/{0}/{1}/GetList", areas, controller);
            expando["pagelist"] = string.Format("/{0}/{1}/GetPageList", areas, controller);
            expando["add"] = string.Format("/{0}/{1}/Add", areas, controller);
            expando["edit"] = string.Format("/{0}/{1}/Edit", areas, controller);
            expando["delete"] = string.Format("/{0}/{1}/Delete", areas, controller);
            if (extend != null)
                EachHelper.EachObjectProperty(extend, (i, name, value) => { expando[name] = value; });

            return expando;
        }


        public static string CreateJsonData_ForDataGrid(int total, object rows, object footer)
        {
            Dictionary<string, object> dicData = new Dictionary<string, object>();
            dicData.Add("total", total);
            dicData.Add("rows", rows);
            if (footer != null)
            {
                dicData.Add("footer", footer);
            }
            string jsonResultString = Newtonsoft.Json.JsonConvert.SerializeObject(dicData, Formatting.Indented, DefaultTimeConverter);
            return jsonResultString;
            /*
             var footer = new[]
            {
                new {  SL = list.Sum(p => p.SL), JE = list.Sum(p => p.JE), GGMC = "合计" }
            };
             */
        }

        /// <summary>
        /// 获取json序列化是日期格式方式。
        /// </summary>
        public static IsoDateTimeConverter DefaultTimeConverter
        {
            get
            {
                return new IsoDateTimeConverter()
                {
                    DateTimeFormat = "yyyy-MM-dd HH:mm:ss",
                    DateTimeStyles = System.Globalization.DateTimeStyles.AllowInnerWhite
                };
            }
        }
    }
}