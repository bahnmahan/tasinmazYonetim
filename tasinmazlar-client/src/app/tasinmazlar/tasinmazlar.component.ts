import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EstatepostService } from '../services/estatepost.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { Rotate } from 'ol/control/Rotate';
import * as alertifyjs from 'alertifyjs';


import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';


import TileWMS from 'ol/source/TileWMS';


import { Modify, Snap, Draw } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import MousePosition from 'ol/control/MousePosition';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { createStringXY } from 'ol/coordinate';

interface City {
  cityid: number;
  cityname: string;
}

interface Town {
  districtid: number;
  ilcename: string;
  cityid: number;
}

interface Neighborhood {
  mahalleid: number;
  mahalleadi: string;
  districtid: number;
}

@Component({
  selector: 'app-tasinmazlar',
  templateUrl: './tasinmazlar.component.html',
  styleUrls: ['./tasinmazlar.component.css']
})
export class TasinmazlarComponent implements OnInit {
  map: Map;
  koordinat: string;
  countryLayer: TileLayer;
  cityLayer: TileLayer;
  districtLayer: TileLayer;
  countryChecked: boolean = false;
  cityChecked: boolean = false;
  districtChecked: boolean = false;
  cities: City[] = [];
  towns: Town[] = [];
  neighborhoods: Neighborhood[] = [];
  selectedCityId: number;
  selectedTownId: number;
  estateForm: FormGroup;
  estates = [];
  selectedEstates: any[] = [];
  pagedEstates = [];
  pageSize = 10;
  pageSizeOptions = [];
  pageIndex = 0;

  constructor(
    private http: HttpClient,
    private estateService: EstatepostService,
    private formBuilder: FormBuilder
  ) { this.onPageChange(); }

  ngOnInit() {
    this.getEstates();
    this.initForm();
    this.fetchCities();
    this.initializeMap();
  }

  onPageChange(event?: PageEvent) {
    if (event) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
    }
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedEstates = this.estates.slice(startIndex, endIndex);
  }

  initForm(): void {
    this.estateForm = this.formBuilder.group({
      estateil: ['', Validators.required],
      estateilce: ['', Validators.required],
      estatemahalle: ['', Validators.required],
      estateada: ['', Validators.required],
      estateparsel: ['', Validators.required],
      estatenitelik: ['', Validators.required],
      estateadres: ['', Validators.required],
      estatecoords: ['', Validators.required],
    });
  }

  initializeMap(): void {
    const raster = new TileLayer({
      source: new OSM()
    });
    const vector = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 0, 0, 0.25)'
        }),
        stroke: new Stroke({
          color: 'red',
          width: 8
        }),
        image: new CircleStyle({
          radius: 4,
          stroke: new Stroke({ color: 'blue', width: 2 }),
          fill: new Fill({
            color: 'green'
          })
        })
      })
    });

    this.map = new Map({
      target: 'map',
      layers: [raster, vector],
      view: new View({
        center: fromLonLat([-99, 40]),
        zoom: 6,
      }),
    });

    this.map.addControl(new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;'
    }));


    const modify = new Modify({ source: vector.getSource() });
    this.map.addInteraction(modify);

    let draw, snap;
    const typeSelect = document.getElementById('type') as HTMLSelectElement;

    const addInteractions = () => {
      draw = new Draw({
        source: vector.getSource(),
        type: typeSelect.value
      });
      this.map.addInteraction(draw);
      snap = new Snap({ source: vector.getSource() });
      this.map.addInteraction(snap);
    };

    typeSelect.onchange = () => {
      this.map.removeInteraction(draw);
      this.map.removeInteraction(snap);
      addInteractions();
    };

    addInteractions();

    this.map.addControl(new Rotate({
      className: "ol-rotate",
      autoHide: false,
    }));

  }





  goToLocation(coordsString: string): void {
    const coordsArray = coordsString.split(',').map(Number);
    const view = this.map.getView();

    const flyTo = (location, done) => {
      const duration = 2000;
      let parts = 2;
      let called = false;

      const callback = (complete) => {
        --parts;
        if (called) {
          return;
        }
        if (parts === 0 || !complete) {
          called = true;
          done(complete);
        }
      };

      view.animate({
        center: fromLonLat(coordsArray),
        duration: duration
      }, callback);
      view.animate({
        zoom: 6,
        duration: duration / 5
      }, {
        zoom: 18,
        duration: duration / 5
      }, callback);
    };

    flyTo(coordsArray, function () { });
  }




  toggleLayers() {
    if (this.countryChecked) {
      this.addCountryLayer();
    } else {
      this.removeCountryLayer();
    }

    if (this.cityChecked) {
      this.addCityLayer();
    } else {
      this.removeCityLayer();
    }

    if (this.districtChecked) {
      this.addDistrictLayer();
    } else {
      this.removeDistrictLayer();
    }
  }

  addCountryLayer() {
    if (!this.countryLayer) {
      this.countryLayer = new TileLayer({
        source: new TileWMS({
          url: 'http://localhost:8080/geoserver/openlayersegitim/wms',
          params: {
            'LAYERS': 'openlayersegitim:cb_2018_us_county_5m',
            'TILED': false
          },
          serverType: 'geoserver',
          visible: true
        })
      });
      this.map.addLayer(this.countryLayer);
    }
  }

  removeCountryLayer() {
    if (this.countryLayer) {
      this.map.removeLayer(this.countryLayer);
      this.countryLayer = null;
    }
  }

  addCityLayer() {
    if (!this.cityLayer) {
      this.cityLayer = new TileLayer({
        source: new TileWMS({
          url: 'http://localhost:8080/geoserver/openlayersegitim/wms',
          params: {
            'LAYERS': 'openlayeregitim:cb_2018_us_state_5m',
            'TILED': true
          },
          serverType: 'geoserver',
          visible: true
        })
      });
      this.map.addLayer(this.cityLayer);
    }
  }

  removeCityLayer() {
    if (this.cityLayer) {
      this.map.removeLayer(this.cityLayer);
      this.cityLayer = null;
    }
  }

  addDistrictLayer() {
    if (!this.districtLayer) {
      this.districtLayer = new TileLayer({
        source: new TileWMS({
          url: 'http://localhost:8080/geoserver/nivyork/wms',
          params: {
            'LAYERS': 'nivyork:nyc_buildings',
            'TILED': true
          },
          serverType: 'geoserver',
          visible: true
        })
      });
      this.map.addLayer(this.districtLayer);
    }
  }

  removeDistrictLayer() {
    if (this.districtLayer) {
      this.map.removeLayer(this.districtLayer);
      this.districtLayer = null;
    }
  }

  fetchCities(): void {
    this.http.get<City[]>('http://localhost:42390/api/cities').subscribe(
      cities => {
        this.cities = cities;
      },
      error => {
        console.error('Şehirler alınırken bir hata oluştu:', error);
      }
    );
  }

  fetchTowns(cityid: number): void {
    this.http.get<Town[]>(`http://localhost:42390/api/towns?cityid=${cityid}`).subscribe(
      towns => {
        this.towns = towns;
      },
      error => {
        console.error('İlçeler alınırken bir hata oluştu:', error);
      }
    );
  }

  fetchNeighborhoods(districtid: number): void {
    this.http.get<Neighborhood[]>(`http://localhost:42390/api/neighborhood?districtid=${districtid}`).subscribe(
      neighborhoods => {
        this.neighborhoods = neighborhoods;
      },
      error => {
        console.error('Mahalleler alınırken bir hata oluştu:', error);
      }
    );
  }

  onCityChange(cityName: string): void {
    const selectedCity = this.cities.find(city => city.cityname === cityName);
    if (selectedCity) {
      this.selectedCityId = selectedCity.cityid;
      this.selectedTownId = null;
      this.fetchTowns(this.selectedCityId);
      this.estateForm.get('estateilce').setValue('');
      this.estateForm.get('estatemahalle').setValue('');
    }
  }

  onTownChange(townName: string): void {
    const selectedTown = this.towns.find(town => town.ilcename === townName);
    if (selectedTown) {
      this.selectedTownId = selectedTown.districtid;
      this.fetchNeighborhoods(selectedTown.districtid);
      this.estateForm.get('estatemahalle').setValue('');
    }
  }

  postData() {
    if (this.estateForm.valid) {
      this.estateService.addEstate(this.estateForm.value).subscribe(
        response => {
          console.log('İstek başarıyla tamamlandı', response);
          window.location.reload();
        },
        error => {
          console.log('İstek gönderilirken bir hata oluştu', error);
          alert('Sunucu ile bağlantı kurulamıyor, lütfen tekrar deneyiniz!');
        }
      );
    }
  }

  getEstates() {
    this.http.get<any>('http://localhost:42390/api/estates').subscribe(
      response => {
        this.estates = response;
        this.onPageChange();
      },
      error => {
        console.error('Taşınmazlar alınırken bir hata oluştu:', error);
      }
    );
  }

  toggleCheckbox(event: any, estate: any) {
    estate.selected = event.target.checked;
    if (estate.selected) {
      this.selectedEstates.push(estate);
    } else {
      this.selectedEstates = this.selectedEstates.filter(selected => selected !== estate);
    }
  }

  removeSelectedEstates() {
    if (this.selectedEstates.length === 0) {
      alertifyjs.error('Lütfen silmek için en az 1 seçim yapınız!').set('basic', true);
      return;
    }

    if (confirm('Seçilen taşınmazları silmek istediğinizden emin misiniz?')) {
      this.selectedEstates.forEach(estate => {
        this.http.delete(`http://localhost:42390/api/estates/${estate.estateId}`).subscribe(
          response => {
            this.estates = this.estates.filter((item: any) => item !== estate);
            window.location.reload();
          },
          error => {
            console.error('Taşınmaz silinirken bir hata oluştu:', error);
          }
        );
      });
    }
  }

  closeNewEstateModal() {
    const modal = document.getElementById('postModal');
    modal.style.display = 'none';
    window.location.reload();
  }

  getuserRole() {
    this.http.get('http://localhost:42390/api/userrole').subscribe(data => {
      // Kullanıcı rolü işleme kodu
    });
  }
}
