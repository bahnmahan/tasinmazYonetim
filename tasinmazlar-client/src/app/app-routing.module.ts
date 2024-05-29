import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TasinmazlarComponent } from './tasinmazlar/tasinmazlar.component';
import { KullanicilarComponent } from './kullanicilar/kullanicilar.component';
import { LoglarComponent } from './loglar/loglar.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/authguard.service';
import { AdminguardService } from './services/adminguard.service';
import { MainmapComponent } from './mainmap/mainmap.component';
import { GeojsondenemeComponent } from './geojsondeneme/geojsondeneme.component';

const routes: Routes = [
  { path:'', redirectTo:'login', pathMatch: 'full' },
  { path:'login', component: LoginComponent},
  { path:'tasinmazlar', component: TasinmazlarComponent, canActivate:[AuthGuard]},
  { path:'kullanicilar', component: KullanicilarComponent, canActivate:[AdminguardService]},
  { path:'loglar', component:LoglarComponent, canActivate:[AdminguardService]},
  { path: 'mainmap', component:MainmapComponent, canActivate:[AuthGuard]},
  { path: 'geo', component: GeojsondenemeComponent }

]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 

