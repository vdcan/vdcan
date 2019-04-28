
/*
//------------------------------------------------------------------------------ 
//       时间： 2018-03-26
//       作者： fdsaf   
//			  
//       文件： search_pie.cshtml 页面文件 
//       文件： search_pie.js JS文件
//------------------------------------------------------------------------------ 
*/
 

 
 




/*

 $('#TPL_pie').combobox({
                url: km.urls["pie_list"],
                valueField: 'id',
                textField: 'text',
                width: 130,
                editable: false,
                onBeforeLoad: function(param){param._t=com.settings.timestamp();
					 
            });

*/
 
$(function () {
    Load_echart_pie_pie();
})
function Load_echart_pie_pie(){	  
	
		jsonObject={_t: com.settings.timestamp(),
					};
 	
com.ajax({

            type: 'POST', url: km.model.urls["test_list"], data: jsonObject, success: function (result) { 
            	  var name = [];
        for (var i = 0; i < result.length; i++) {
            name.push(result[i].name);
        }
	    
				if ($('#echart_pie_pie').length ){ 
		
			    var theme = {
			        color: [
                        '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
                        '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
			        ]
			    }
			  var echartPieCollapse = echarts.init(document.getElementById('echart_pie_pie'),theme);
			  
			  echartPieCollapse.setOption({
				tooltip: {
				  trigger: 'item',
				  formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
				  x: 'center',
				  y: 'bottom',
				  data: name
				},
				toolbox: {
				  show: true,
				  feature: {
				/*	magicType: {
					  show: true,
					  type: ['pie', 'funnel']
					},
					restore: {
					  show: true,
					  title: "Restore"
					},
					saveAsImage: {
					  show: true,
					  title: "Save Image"
					}*/
				  }
				},
				calculable: true,
				series: [{
				  name: '饼子图',
				  type: 'pie',
				  radius: [25, 90],
				  center: ['50%', 170],
				  roseType: 'area',
				  x: '50%',
				  max: 40,
				  sort: 'ascending',
				  data:  result
				}]
			  });

			}  
            }
    });
    
		
		}
 

