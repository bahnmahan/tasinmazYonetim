import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TasinmazlarComponent } from './tasinmazlar/tasinmazlar.component';
import { KullanicilarComponent } from './kullanicilar/kullanicilar.component';
import { LoglarComponent } from './loglar/loglar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/authguard.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AdminguardService } from './services/adminguard.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { MainmapComponent } from './mainmap/mainmap.component';
import { GeojsondenemeComponent } from './geojsondeneme/geojsondeneme.component';


@NgModule({
  declarations: [
    AppComponent,
    TasinmazlarComponent,
    KullanicilarComponent,
    LoglarComponent,
    NavbarComponent,
    LoginComponent,
    MainmapComponent,
    GeojsondenemeComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatPaginatorModule
  ],
  providers: [{provide: JWT_OPTIONS, useValue: JWT_OPTIONS},JwtHelperService,AuthGuard, AdminguardService,],
  bootstrap: [AppComponent]
})
export class AppModule { }
