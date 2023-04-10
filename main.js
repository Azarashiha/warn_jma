//https://docs.mapbox.com/mapbox-gl-js/example/add-image/
mapboxgl.accessToken = 'pk.eyJ1IjoiYXphcmFzaGkiLCJhIjoiY2t0YmdibXczMXZwbzJubzBnZHI4Ym4zMCJ9.1C3RNiQqSioL1NkDSFE5Xg';
    
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/azarashi/cleiljshs001f01nv27qq5mn4',
    center: [139.6670516, 35.3811673],//仮数値
    zoom: 4,//仮数値
    //pitch: 70,
    //bounds:addpoint(),
    customAttribution: ['<a href="https://www.jma.go.jp/jma/index.html">気象情報:©︎気象庁</a>','<a href="https://twitter.com/nyaonearthquake?s=21">編集:©︎nyaonearthquake</a>']
});

// コントロール関係表示
map.addControl(new mapboxgl.NavigationControl());

var url = 'https://www.jma.go.jp/bosai/warning/data/warning/map.json';

fetch(url)
  .then(function(response) {
    if (!response.ok) {
      throw new Error('HTTP error, status = ' + response.status);
    }
    return response.json();
  })
  .then(function(data) {
    map.on('load', function() {
      map.addSource('pbf-source',{
        type: 'vector',
        tiles: ['https://azarashiha.github.io/v_city/{z}/{x}/{y}.pbf'],//https://weatherbox.github.io/warning-area-vt/city/{z}/{x}/{y}.pbf
        promoteId:'regioncode'
      });
      map.addSource('pref-source',{
        type: 'vector',
        tiles: ['https://azarashiha.github.io/v_pref/{z}/{x}/{y}.pbf'],//https://weatherbox.github.io/warning-area-vt/city/{z}/{x}/{y}.pbf
        
      });
      
      
      for (const item of data) {
        for (const areaType of item.areaTypes) {
          for (const area of areaType.areas) {
            var c=area.code
            var a=area
            //console.log(area.code);
            for(const codenum of area.warnings)
              var cn=codenum.code
              
              
              map.setFeatureState(
                {
                    'source':'pbf-source',
                    'sourceLayer':'city',
                    'id': c,
                },
                {
                    'class':cn,
                    'data':a
                }
            )
            
          }
        }
      }
      
     
      
      
      map.addLayer({
        id:'w-layer',
        type:'fill',
        source:'pbf-source',
        'source-layer': 'city',
        paint:{
          'fill-color':[
            'match',
            ['feature-state','class'],
            '02',//暴風雪警報
            'rgba(255 ,0 ,0,0.8)',
            '03',//大雨警報
            'rgba(255 ,0 ,0,0.8)',
            '04',//洪水警報
            'rgba(255 ,0 ,0,0.8)',
            '05',//暴風警報
            'rgba(255 ,0 ,0,0.8)',
            '06',//大雪警報
            'rgba(255 ,0 ,0,0.8)',
            '07',//波浪警報
            'rgba(255 ,0 ,0,0.8)',
            '08',//高潮警報
            'rgba(255 ,0 ,0,0.8)',
            //-----------
            '10',//大雨注意報
            'rgba(252,186,3,0.8)',
            '12',//大雪注意報
            'rgba(252,186,3,0.8)',
            '13',//風雪注意報
            'rgba(252,186,3,0.8)',
            '14',//雷注意報
            'rgba(252,186,3,0.8)',
            '15',//強風注意報
            'rgba(252,186,3,0.8)',
            '16',//波浪注意報
            'rgba(252,186,3,0.8)',
            '17',//融雪注意報
            'rgba(252,186,3,0.8)',
            '18',//洪水注意報
            'rgba(252,186,3,0.8)',
            '19',//高潮注意報
            'rgba(252,186,3,0.8)',
            '20',//濃霧注意報
            'rgba(252,186,3,0.8)',
            '21',//乾燥注意報
            'rgba(252,186,3,0.8)',
            '22',//なだれ注意報
            'rgba(252,186,3,0.8)',
            '23',//低温注意報
            'rgba(252,186,3,0.8)',
            '24',//霜注意報
            'rgba(252,186,3,0.8)',
            '25',//着氷注意報
            'rgba(252,186,3,0.8)',
            '26',//着雪注意報
            'rgba(252,186,3,0.8)',
            '27',//その他の注意報
            'rgba(252,186,3,0.8)',
            //==========
            '32',//暴風雪特別警報
            'rgba(155,5,255,0.8)',
            '33',//大雨特別警報
            'rgba(155,5,255,0.8)',
            '35',//暴風特別警報
            'rgba(155,5,255,0.8)',
            '36',//大雪特別警報
            'rgba(155,5,255,0.8)',
            '37',//波浪特別警報
            'rgba(155,5,255,0.8)',
            '38',//高潮特別警報
            'rgba(155,5,255,0.8)',
            // 終了
            'rgba(97,97,97,0.2)',

          ],
          'fill-opacity': 0.9,
          'fill-outline-color': 'rgba(82,82,82, 0.8)'//'rgba(200, 100, 240, 1)'
        }
      })
      map.addLayer({
        'id': 'line-layer',
        'type': 'line',
        'source': 'pref-source',
        'source-layer': 'pref',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#333333',
          'line-width': 1
        }
      });

      map.on("click", "w-layer", function (e) {//mousemove
        map.getCanvas().style.cursor = "pointer";
        var district =map.queryRenderedFeatures(e.point, {
          layers: ["w-layer"],
        
        });
        
        var props = district[0].properties;
        var coden = district[0].state.data.warnings
        


        console.log(district[0])
        var content = "<b>" + "基礎データ" + "</b>" + "<br>";
        content += "CITY_NO.: " + props.regioncode + "<br>";
        content += "NAME: " + props.name + "<br>";
        content += "<b>" + "警報・注意報No." + "</b>" + "<br>";
        for (let i =0;i<coden.length;i++){
          if(coden[i].code=="02"){
            content += "暴風雪警報"+ "</br>";
          }
          if(coden[i].code=="03"){
            content += "大雨警報"+ "</br>";
          }
          if(coden[i].code=="04"){
            content += "洪水警報"+  "</br>"
          }
          if(coden[i].code=="05"){
            content += "暴風警報"+  "</br>"
          }
          if(coden[i].code=="06"){
            content += "大雪警報"+  "</br>"
          }
          if(coden[i].code=="07"){
            content += "波浪警報"+  "</br>"
          }
          if(coden[i].code=="00"){
            content += "高潮警報"+  "</br>"
          }
          //--------------------------
          if(coden[i].code=="10"){
            content += "大雨注意報"+  "</br>"
          }
          if(coden[i].code=="12"){
            content += "大雪注意報"+  "</br>"
          }
          if(coden[i].code=="13"){
            content += "風雪注意報"+  "</br>"
          }
          if(coden[i].code=="14"){
            content += "雷注意報"+  "</br>"
          }
          if(coden[i].code=="15"){
            content += "強風注意報"+  "</br>"
          }
          if(coden[i].code=="16"){
            content += "波浪注意報"+  "</br>"
          }
          if(coden[i].code=="17"){
            content += "融雪注意報"+  "</br>"
          }
          if(coden[i].code=="18"){
            content += "洪水注意報"+  "</br>"
          }
          if(coden[i].code=="19"){
            content += "高潮注意報"+  "</br>"
          }
          if(coden[i].code=="20"){
            content += "濃霧注意報"+  "</br>"
          }
          if(coden[i].code=="21"){
            content += "乾燥注意報"+  "</br>"
          }
          if(coden[i].code=="22"){
            content += "なだれ注意報"+  "</br>"
          }
          if(coden[i].code=="23"){
            content += "低温注意報"+  "</br>"
          }
          if(coden[i].code=="24"){
            content += "霜注意報"+  "</br>"
          }
          if(coden[i].code=="25"){
            content += "着氷注意報"+  "</br>"
          }
          if(coden[i].code=="26"){
            content += "着雪注意報"+  "</br>"
          }
          if(coden[i].code=="27"){
            content += "その他の注意報"+  "</br>"
          }
          //===========================
          if(coden[i].code=="32"){
            content += "暴風雪特別警報"+  "</br>"
          }
          if(coden[i].code=="33"){
            content += "大雨特別警報"+  "</br>"
          }
          if(coden[i].code=="35"){
            content += "暴風特別警報"+  "</br>"
          }
          if(coden[i].code=="36"){
            content += "大雪特別警報"+  "</br>"
          }
          if(coden[i].code=="37"){
            content += "波浪特別警報"+  "</br>"
          }
          if(coden[i].code=="38"){
            content += "高潮特別警報"+  "</br>"
          }
          if(coden[i].status=="発表警報・注意報はなし"){
            content += "発表警報・注意報はなし"+  "</br>"
          }

          //content +=coden[i].code + ",";
        }
        
        //popup.setLngLat(e.lngLat).setHTML(content).addTo(map);
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(content)
          .addTo(map);

      })
      



      
    });
  })
  .catch(function(error) {
    console.log('There has been a problem with your fetch operation: ', error.message);
  });