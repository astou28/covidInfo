import { Country } from './../../dataModel/Country.model';
import { GetApiService } from './../get-api.service';
import { Donnee } from './../donnee';
import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  sort = 'cases';
  table: any = [];
  country: string;
  countrySize: any;
  countriesSize: any;
  totalCases: number;
  totalDeaths: number;
  totalRecovered: number;
  totalUnderTreatments: number;
  totalCriticals: number;
  totalStables: number;
  totalTodayCases: number;
  totalTodayDeaths: number;
  totalTodayRecovered: number;
  map;

  constructor(private GetApiService: GetApiService) {}

  ngAfterViewInit(): void {
    this.apiCall();
    this.apiContries();
    this.createMap();
  }
  createMap(){
    const carte = {
      lat: 14.693425,
      lng: -17.447938,
    };


    const zoomLevel = 12;

    this.map = L.map('mapid',{
      center: [carte.lat, carte.lng],
      zoom:zoomLevel
    });
    const mainLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        minZoom: 12,
        maxZoom: 17,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
      );
      mainLayer.addTo(this.map);

  }
  apiContries() {
    this.GetApiService.apiCallCountrie().subscribe((data) => {
      this.table = data;
    });
  }
  // apiCall
  apiCall = () => {
    this.GetApiService.apiCallBySort(this.sort).subscribe(
      (data) => {
        this.countrySize = data;
        this.totalCases = this.totalNumber('cases');
        this.totalDeaths = this.totalNumber('deaths');
        this.totalRecovered = this.totalNumber('recovered');
        this.totalUnderTreatments = this.totalNumber('active');
        this.totalCriticals = this.totalNumber('critical');
        this.totalStables = this.totalUnderTreatments - this.totalCriticals;
        this.totalTodayCases = this.totalNumber('TodayCases');
        this.totalTodayDeaths = this.totalNumber('TodayDeaths');
        this.totalTodayRecovered = this.totalNumber('todayRecovered');
      },
      (err) => {
        alert('erreur');
      }
    );
  };

  totalNumber = (index: string, array = this.countrySize): number => {
    let total = 0;
    for (const elmt of array) {
      total += elmt[index];
    }
    return total;
  };
  Search() {
    if (this.country != '') {
      this.table = this.table.filter((res) => {
        return res.country
          .toLocaleLowerCase()
          .match(this.country.toLocaleLowerCase());
      });
    } else if (this.country == '') {
      this.ngAfterViewInit();
    }
  }
}
