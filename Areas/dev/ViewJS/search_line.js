
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-27
//       作者： fdsaf   
//			  
//       文件： search_line.cshtml 页面文件 
//       文件： search_line.js JS文件
//------------------------------------------------------------------------------ 
*/
 

 
 

 
$(function () {
    Load_echart_line();
})
function Load_echart_line(){	  
	
		jsonObject={_t: com.settings.timestamp(),
					};
 	
com.ajax({

            type: 'POST', url: km.model.urls["test_list2"], data: jsonObject, success: function (result) { 
            	 
            var name = [];
            for (var i = 0; i < result.length; i++) {
                if (!IsInArray(name, result[i].name))
                    name.push(result[i].name);
            } 
            var xAxis = [];
            for (var i = 0; i < result.length; i++) {
                if (!IsInArray(xAxis, result[i].xAxis))
                    xAxis.push(result[i].xAxis);
            }
            var series = [];
            var sData = {};
            var pName = "";
            for (var i = 0; i < result.length; i++) { 
                if (pName != result[i].name) {
                            sData = {

                                name: result[i].name,
                                type: 'line',
                                smooth: false,
                                itemStyle: {
                                    normal: {
                                        areaStyle: {
                                            type: 'default'
                                        }
                                    }
                                },
                                data: []

                            }
                            //if (i == 0)
                            //    sData.type = 'line';
                            series.push(sData)
                       } 
                            pName = result[i].name;
                    sData.data.push(result[i].data); 
            } 
            if ($('#echart_line').length) { 
                var theme = {
                    color: [
                        '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
                        '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
                    ]
                }
                var echartLine = echarts.init(document.getElementById('echart_line'), theme);

                echartLine.setOption({
                    title: {
                        text: '线图',
                        subtext: 'line'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        x: 220,
                        y: 40,
                        data: name
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {
                                show: true,
                                title: {
                                    line: 'Line',
                                    bar: 'Bar',
                                    stack: 'Stack',
                                    tiled: 'Tiled'
                                },
                                type: ['line', 'bar', 'stack', 'tiled']
                            },
                            restore: {
                                show: true,
                                title: "Restore"
                            },
                            saveAsImage: {
                                show: true,
                                title: "Save Image"
                            }
                        }
                    },
                    calculable: true,
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: xAxis
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: series 
                });

            }
        }
    });
}
 

