//自定义版权信息
var mapAttr =
    'Map data &copy; <a href="https://xiaozhuanlan.com/webgis/">《ocean工作室》</a> contributors, ' +
    '<a href="http://ocean.com/">ocean</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

//mapbox 地图服务URL
var mapboxUrl =
    'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

// 地图中心点，武汉
var centerPoint = [30.59276, 114.30525];

// 定义两个图层，影像图层和街道图层（这里是用了mapbox地图服务）
//定义图层时把版权信息直接传入
var satellite = L.tileLayer(mapboxUrl, {
        id: 'mapbox.satellite',
        attribution: mapAttr
    });
var  streets = L.tileLayer(mapboxUrl, {
        id: 'mapbox.streets',
        attribution: mapAttr
    });

//插件把 定义了多个国内的瓦片图层，我们只需要通过提供的方法访问到相应的图层即可
//从插件代码可以看出 需要传入 providerName.mapName.mapType 从插件代码中查找所需要的值
var geoq = L.tileLayer.chinaProvider('Geoq.Normal.Gray', {
    maxZoom: 18,
    minZoom: 5
});
var gaode = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
    maxZoom: 18,
    minZoom: 5
});
var tianditu = L.tileLayer.chinaProvider('TianDiTu.Terrain.Map', {
    maxZoom: 18,
    minZoom: 5
});
var google = L.tileLayer.chinaProvider('Google.Satellite.Map', {
    maxZoom: 18,
    minZoom: 5
});
var osm = L.tileLayer.chinaProvider('OSM.Normal.Map', {
    maxZoom: 18,
    minZoom: 5
});

// 创建地图
var map = L.map('map', {
  center: centerPoint,
  zoom: 5,
  minZoom: 1,
  maxZoom: 16,
  attribution: mapAttr,
  layers: [satellite, streets,geoq,gaode,tianditu,google,osm]
});
// 通过layer control来实现图层切换UI
// https://leafletjs.com/examples/layers-control/
var baseLayers = {
    智图Geoq:geoq,
    高德地图:gaode,
    天地图:tianditu,
    Google地图:google,
    OSM地图:osm,
    Mapbox影像图: satellite,
    Mapbox街道图: streets
};

L.control.layers(baseLayers).addTo(map);

// 获取数据
$.get('./data/data.json', function(result) {
  console.log(result);
  drawFootPoint(result.rows);
});

// marker icon
// 图标icon介绍两个网站可以下载:www.iconfont.cn 和 www.easyicon.net
var footIcon = L.icon({
  iconUrl: './foot.png',
  iconSize: [28, 28],
  iconAnchor: [10, 10]
});

/* 根据坐标点数据绘制Marker——弹窗 */
function drawFootPoint(data) {
  for (var i = 0; i < data.length; i++) {
    var p = data[i];
    // 注意marker接受参数格式 [纬度，经度]
    var point = [p.latitude - 0, p.longitude - 0];
    L.marker(point, { icon: footIcon })
      .addTo(map)
      // 每个marker动态获取remark等信息，绑定弹窗
      .bindPopup(
        '<h3>' +
          p['city'] +
          '</h3>' +
          p['date'] +
          '<br>' +
          p['remark'] +
          '<br>' +
          generatePicHtml(p.imgs)
      );
  }
}

/**
 * veiwerjs预览大图
 */
function viewPic() {
  var galley = document.getElementById('galley');
  var viewer = new Viewer(galley, {
    url: 'data-original',
    hidden: function() {
      viewer.destroy();
    }
  });
  viewer.show();
}

/**
 * 动态拼接html字符串
 * @param {string} cityName 城市名称
 * @param {*} imgs 足迹点数据中的imgs数组
 */
function generatePicHtml(imgs) {
  imgs = imgs || [];
  // 动态拼接html字符串
  var _html = '<div id="galley"><ul class="pictures"  onclick="viewPic()">';
  // 循环图片数组，动态拼接项目的相对地址url
  for (var i = 0; i < imgs.length; i++) {
    var url = './data/pictures/' + imgs[i];
    var display = 'style="display:inline-block"';
    // 这里
    if (i > 5) {
      display = 'style="display:none"';
    }
    _html +=
      '<li ' +
      display +
      '><img data-original="' +
      url +
      '" src="' +
      url +
      '" alt="图片预览"></li>';
  }
  _html += '</ul></div></div>';

  return _html;
}

