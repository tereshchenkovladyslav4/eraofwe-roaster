import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/services/globals.service';
import { UserserviceService } from 'src/services/users/userservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-default-setting',
  templateUrl: './default-setting.component.html',
  styleUrls: ['./default-setting.component.css']
})
export class DefaultSettingComponent implements OnInit {

  date1: Date;
  appLanguage?: any;
	coffeeDetailsActive:any = 0;

  constructor(public globals: GlobalsService , 
              private userService : UserserviceService,
              private toastrService : ToastrService,
              ) { }

  ngOnInit(): void {
    this.language();

    $("body").on("change", ".custom-label__inputs", function () {
      var $this = $(this);
  
      if ($this.is(':checked')) {
          $this.parents('.custom-label').addClass('active');
          var totalChecked = $('.roastery-tags__checkboxes').find('.custom-label.active').length;
          console.log(totalChecked)
  
          if (totalChecked == 5) {
              $('.roastery-tags__checkboxes').find('.custom-label').find('.custom-label__inputs').prop('disabled', true);
              $('.roastery-tags__checkboxes').find('.custom-label.active').find('.custom-label__inputs').prop('disabled', false);
          }
      }
  
      else {
          $this.parents('.custom-label').removeClass('active');
          $('.roastery-tags__checkboxes').find('.custom-label').find('.custom-label__inputs').prop('disabled', false);
          $('.roastery-tags__checkboxes').find('.custom-label.active').find('.custom-label__inputs').prop('disabled', false);
      }
  });

  }

  language(){
    this.appLanguage = this.globals.languageJson;
    this.coffeeDetailsActive++;
  }

}