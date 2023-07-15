import { Component, OnInit } from '@angular/core';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-accounts-settings',
  templateUrl: './accounts-settings.component.html',
  styles: [
  ]
})
export class AccountsSettingsComponent implements OnInit {

  constructor(private settingService:SettingService){}

  ngOnInit(): void {
    this.settingService.checkCurrentTheme();
  }

  changeTheme(theme:string){
    
    this.settingService.changeTheme(theme);


  }


}
