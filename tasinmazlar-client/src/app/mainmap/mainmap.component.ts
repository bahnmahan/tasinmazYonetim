
import Map from 'ol/Map';
import View from 'ol/View';
import OlGeomPoint from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import MousePosition from 'ol/control/MousePosition';
import { Component, OnInit } from '@angular/core';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Modify, Snap, Draw } from 'ol/interaction';
import { createStringXY } from 'ol/coordinate';

@Component({
  selector: 'app-mainmap',
  templateUrl: './mainmap.component.html',
  styleUrls: ['./mainmap.component.css']
})
export class MainmapComponent implements OnInit {
  map: Map;
  koordinat: string;

  constructor() { }

  ngOnInit(){
    this.initializeMap();
  }

  zoomToLocation(coords: string) {
    const coordinates = coords.split(',').map(coord => parseFloat(coord.trim()));
    const point = new OlGeomPoint(fromLonLat(coordinates));
    this.map.getView().fit(point.getExtent(), {
      duration: 1500,
      maxZoom: 18,
    });
  }
  

  initializeMap(): void {
    var raster = new TileLayer({
      source: new OSM()
    });
    var source = new VectorSource();
    var vector = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(102, 255, 145, 0.52)'
        }),
        stroke: new Stroke({
          color: '#383e42',
          width: 2
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#00ff9d'
          })
        })
      })
    });

    this.map = new Map({
      layers: [raster, vector],
      target: 'map',
      view: new View({
        center: fromLonLat([36, 39]),
        zoom: 6
      })
    });

    var modify = new Modify({ source: source });
    this.map.addInteraction(modify);

    var draw, snap;
    var typeSelect = document.getElementById('type') as HTMLSelectElement;

    const addInteractions = () => {
      draw = new Draw({
        source: source,
        type: typeSelect.value
      });
      this.map.addInteraction(draw);
      snap = new Snap({ source: source });
      this.map.addInteraction(snap);
    }

    typeSelect.onchange = () => {
      this.map.removeInteraction(draw);
      this.map.removeInteraction(snap);
      addInteractions();
    };

    addInteractions();

    // Koordinatları göster
    this.map.addControl(new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;'
    }));
  }
}
