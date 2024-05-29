import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import WFS from 'ol/format/WFS';  // WFS formatını import edin
import GML from 'ol/format/GML';  // GML formatını import edin
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';

@Component({
  selector: 'app-geojsondeneme',
  templateUrl: './geojsondeneme.component.html',
  styleUrls: ['./geojsondeneme.component.css']
})
export class GeojsondenemeComponent implements OnInit {
  map: Map;
  vectorSource: VectorSource;
  koordinat: string;

  constructor() { }

  ngOnInit() {
    this.vectorSource = new VectorSource();

    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: 5,
          fill: new Fill({color: 'red'}),
          stroke: new Stroke({color: 'black', width: 1})
        })
      })
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        projection: 'EPSG:4326',
        center: [15, 15],
        zoom: 4
      })
    });

    this.map.addControl(new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;'
    }));
    

    this.map.on('singleclick', (event) => {
      const coordinate = event.coordinate;
      this.addPoint(coordinate);
    });
  }

  

  addPoint(coordinate) {
    const pointFeature = new Feature({
      geometry: new Point(coordinate)
    });
    this.vectorSource.addFeature(pointFeature);
    this.savePointToGeoServer(pointFeature);
  }

  savePointToGeoServer(pointFeature) {
    const formatWFS = new WFS();
    const formatGML = new GML({
      featureNS: 'maintrmap', // Namespace URL
      featureType: 'drawings',
      featurePrefix: 'maintrmap',
      srsName: 'EPSG:4326',
      geometryName: 'geom'  // Veritabanınızdaki geometri kolonunun adına göre ayarlayın
    });

    const node = formatWFS.writeTransaction([pointFeature], null, null, formatGML);
    const s = new XMLSerializer();
    const str = s.serializeToString(node);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/geoserver/maintrmap/ows?service=WFS&version=1.0.0&request=Transaction&typeName=maintrmap:drawings', true);
    xhr.setRequestHeader('Content-Type', 'text/xml');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa('admin:mawkaw92ofk3l')); // Kullanıcı adı ve şifre burada belirtilmeli
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('Response:', xhr.responseText);
      } else {
        console.error('Request failed with status:', xhr.status);
      }
    };
    xhr.onerror = function() {
      console.error('Request failed');
    };
    xhr.send(str);
}
  
  // savePointToGeoServer(pointFeature) {
  //   const formatWFS = new WFS();
  //   const formatGML = new GML({
  //     featureNS: 'maintrmap', // Namespace URL'inizi buraya giriniz
  //     featureType: 'cizimler',
  //     featurePrefix: 'maintrmap',
  //     srsName: 'EPSG:4326',
  //     geometryName: 'thegeom'
  //   });
  
  //   const node = formatWFS.writeTransaction([pointFeature], null, null, formatGML);
  //   const s = new XMLSerializer();
  //   const str = s.serializeToString(node);
  
  //   const xhr = new XMLHttpRequest();
  //   xhr.open('POST', 'http://localhost:8080/geoserver/maintrmap/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=maintrmap%3Acizimler&maxFeatures=50&outputFormat=application%2Fjson', true);
  //   xhr.setRequestHeader('Content-Type', 'text/xml');
  //   xhr.setRequestHeader('Authorization', 'Basic ' + btoa('admin:mawkaw92ofk3l'));
  //   xhr.onload = function() {
  //     if (xhr.status >= 200 && xhr.status < 300) {
  //       console.log('Response:', xhr.responseText);
  //     } else {
  //       console.error('Request failed with status:', xhr.status);
  //     }
  //   };
  //   xhr.onerror = function() {
  //     console.error('Request failed');
  //   };
  //   xhr.send(str);
  // }
}
