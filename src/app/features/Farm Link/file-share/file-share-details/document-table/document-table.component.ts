// AUTHOR : Vijaysimhareddy
// PAGE DESCRIPTION : This page contains functions of  Documents files.

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {DashboardserviceService} from 'src/services/dashboard/dashboardservice.service';
import { RoasterserviceService } from 'src/services/roasters/roasterservice.service';
import { ToastrService } from 'ngx-toastr';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FileShareService } from '../../file-share.service';
import { FileShareDetailsService } from '../file-share-details.service';
import { PlyrModule } from 'ngx-plyr';
import * as Plyr from 'plyr';
declare var $ :any;

import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { GlobalsService } from 'src/services/globals.service';

@Component({
  selector: 'app-document-table',
  templateUrl: './document-table.component.html',
  styleUrls: ['./document-table.component.css']
})
export class DocumentTableComponent implements OnInit {
 
	showDateRange: any;

	public mainData: any[];
  roasterId: string;
  folderId: string;
  parentId: string;
  rangeDates: any;
  modalRef: BsModalRef;
  folderItemId: any;
  folderName: any;
  folderDescription: any;
  folderNameError: string;
  descriptionError: string;
  file_name: any;
  file_id: any;
  file_description: any;
  file_url: any;
  fileName: string;
  fileNameError: string;
  fileDescription: string;
  filedescriptionError: string;
  fileNameValue: any;
  files: any;
  fileEvent: any;
  url: any;
  typedValue: any;
  usersList: any;
  selectedOption: any;
  company_id: any;
  user_id_value: any;
  company_type: any;
  sharedUserslists: any = [];
  sharedUsers: any;
  shareFileId: any;
  share_permission: any;
  documentTable:any=0;

  resetButtonValue : any = "Share";
  
  selectedValue: string;
  appLanguage?: any;
  constructor(public router: Router,
		public cookieService: CookieService,
    public dashboard: DashboardserviceService,
    public roasterService : RoasterserviceService,
    public toastrService : ToastrService,
    public route : ActivatedRoute,
    private modalService: BsModalService,
    public fileService : FileShareService,
    public filedetailsService : FileShareDetailsService,
    public globals: GlobalsService

    ) {
      this.folderNameError = '';
      this.descriptionError = '';
      this.roasterId = this.cookieService.get('roaster_id');
     
			// this.mainData = 
			// 	[{ 
			// 		name: "SEWN Guidelines",
			// 		lastopened: "24/09/2019  3:06 pm", 
			// 		type: "FOLDER"
			// 	},
			// 	{ name: 'SEWN Sales & Concept prese..',  lastopened: '01/03/2020  1:00pm', type: 'FOLDER'},
			// 	{ name: 'SEWN service offerings', lastopened: '01/05/2020  4:00pm',  type: 'DOCUMENT'},
			// 	{ name: 'Löfbergs - Brand assets', lastopened: '24/01/2020  11:05pm', type: 'CSV'},
			// 	{ name: 'What is coffee?',  lastopened: '17/03/2020  7:17am', type: 'MP4'}
			
      // ];
      this.route.queryParams.subscribe(params => {
        this.filedetailsService.parentId = params['folderId'];
        console.log(this.filedetailsService.parentId);
        this.filedetailsService.getFilesandFolders();

      });
      
    
		 }
 // Function Name : Open Modal
  // Description: This function helps to get the Id


     ngOnInit(): void {
      //Auth checking
      if (this.cookieService.get("Auth") == "") {
        this.router.navigate(["/auth/login"]);
      }
       // this.filedetailsService.parentId = decodeURIComponent(this.route.snapshot.queryParams['folderId']);
      //   this.filedetailsService.parentId = this.filedetailsService.folderId;
      //  console.log(this.filedetailsService.parentId)
     
      this.appLanguage = this.globals.languageJson;
    }
   

    openModal(template: TemplateRef<any>,id: any) {
      this.modalRef = this.modalService.show(template);
      this.roasterService.getFolderDetails(this.roasterId,id).subscribe(data =>{
        if(data['success']==true){
          console.log(data)
          this.folderItemId = data['result'].id;
          this.folderName = data['result'].name;
          this.folderDescription = data['result'].description;
          console.log(this.folderName)
        }
      })
    
  
    }
    openFileModal(template: TemplateRef<any>,itemId:any) {
      this.modalRef = this.modalService.show(template);
      this.roasterService.getFileDetails(this.roasterId,itemId).subscribe(
        data => {
          if(data['success']==true){
            this.file_name = data['result'].name;
            this.file_id = data['result'].id;
            this.file_description = data['result'].description;
            this.file_url = data['result'].url;
            this.fileNameValue = data['result'].name;
            
          }
        }
      )
  
    }

      // Open Popup
  popupPrivew(item) {
    var PrivewPopup = $('.priview-popup-fileshare')
    var SetImg = PrivewPopup.find('.img')
    var url = item.url;
    console.log(url)
    SetImg.attr('src', url)
    PrivewPopup.addClass('active');
    document.body.classList.add('popup-open');

    setTimeout(function () {
      PrivewPopup.find('.priview-popup-fileshare__img').addClass('active')
    }, 50);
  }

  // Close Popup
  popupClose() {
    var PrivewPopup = $('.priview-popup-fileshare')
    PrivewPopup.removeClass('active');
    document.body.classList.remove('popup-open');
    PrivewPopup.find('.priview-popup-fileshare__img').removeClass('active')
  }

  openVideoModal(template: TemplateRef<any>,item:any){
    this.modalRef = this.modalService.show(template);
    this.url=item.url;
    const player = new Plyr('#player');
    $('.popup-video').parents('.modal-content').addClass('video-content')

    // $('.popup-video').parents('.modal-content').css({
    //   "padding":"0px !important"
    // })
    // $('.popup-video').parents('.modal-body').css({
    //   "margin-top":"0 !important"
    // })

  }
  closePopup(){
    this.modalRef.hide();
  }
  toggleVideo(event: any) {
    // this.videoplayer.nativeElement.play();
    event.toElement.play();

}

downloadFile(item: any) { 
  if (confirm("Please confirm! you want to download?") == true) {
  const a = document.createElement("a"); 
  a.href = item.url ;
  a.download = item.name;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a); 
}
}

openShareModal(shareTemplate : TemplateRef<any>,item : any){
  this.shareFileId = item.id;
this.modalRef = this.modalService.show(shareTemplate);
this.sharedUsersLists();
}

sharedUsersLists(){
console.info(this.shareFileId)
this.roasterService.getSharedUserList(this.roasterId,this.shareFileId).subscribe(
  response => {
    if(response['success'] == true){
      console.log(response)
      this.sharedUserslists = response['result'];
      this.sharedUsers = this.sharedUserslists.length;
      
    }else{
      this.toastrService.error("Error while getting the shared users");
    }
  }
)
}


onSelect(event: TypeaheadMatch): void {
this.selectedOption = event.item;
console.log(this.selectedOption.id);
this.user_id_value = this.selectedOption.id;
this.company_id = this.selectedOption.organization_id;
this.company_type = this.selectedOption.organization_type;
}

getUsersList(e :any){
this.typedValue = e.target.value; 
if(this.typedValue.length > 4){
this.roasterService.getUsersList(this.typedValue).subscribe(
  data => {
    if(data['success']==true){
      this.usersList = data['result'];
    }else{
      this.toastrService.error("Error while fetching users list");
    }
  }
)
}
}

  // Function Name : CheckAll
  // Description: This function helps to check all roles of the role list.
  checkAll(ev: any) {
    this.filedetailsService.mainData.forEach(x => x.state = ev.target.checked)
  }

  // Function Name : IsAllchecked
  // Description: This function helps to check single role.
  isAllChecked() {
    // return this.mainData.every(_ => _.state);
  }


  
  // getFilesandFolders(){
  //   console.log(this.parentId)
  //   this.roasterService.getFilesandFolders(this.roasterId,this.parentId).subscribe(
  //     result => {
  //       console.log(result);
  //       if(result['success']==true){
  //         this.mainData = result['result'];
  //       }else{
  //         this.toastrService.error("Error while getting the Files and Folders");
  //       }
  //     }
  //   )
  // }


  deleteFolder(id:any){
    if (confirm("Please confirm! you want to delete?") == true) {
    this.roasterService.deleteFolder(this.roasterId,id).subscribe(
      data => {
        if(data['success']==true){
          this.toastrService.success("The Selected folder is deleted successfully");
          setTimeout(() => {
            this.filedetailsService.getFilesandFolders();
            }, 2000);
        }
        else{
          this.toastrService.error("Error while deleting the Folder");
        }
      }
    )
    }
  }
  deleteFile(id:any){
    if (confirm("Please confirm! you want to delete?") == true) {
    this.roasterService.deleteFile(this.roasterId,id).subscribe(
      data => {
        if(data['success']==true){
          this.toastrService.success("The Selected file is deleted successfully");
          setTimeout(() => {
          this.filedetailsService.getFilesandFolders();
          }, 2000);
        }
        else{
          this.toastrService.error("Error while deleting the File");
        }
      }
    )
    }
  }

  reUploadFile(event:any){
    this.files = event.target.files;
    this.fileEvent = this.files;
    console.log(this.fileEvent);
    this.fileNameValue = this.files[0].name;

  }

  UpdateFolder(){
    console.log(this.folderItemId)
    if (
      this.folderName == "" ||
      this.folderName == null ||
      this.folderName == undefined
    ) {
      this.folderNameError = "Please enter your Folder name";
      document.getElementById("updatefolder_name").style.border =
        "1px solid #D50000 ";
      setTimeout(() => {
        this.folderNameError = "";
      }, 3000);
    } 
    else if (
      this.folderDescription == "" ||
      this.folderDescription == null ||
      this.folderDescription == undefined
    ) {
      this.descriptionError = "Please enter your Description";
      document.getElementById("updatefolder_descr").style.border = "1px solid #D50000 ";
      setTimeout(() => {
        this.descriptionError = "";
      }, 3000);
    } 
    else{
      var data = {
        "name": this.folderName,
        "description": this.folderDescription
      }
      
      this.roasterService.updateFolderDetails(this.roasterId,this.folderItemId,data).subscribe(
        result=>{
          if(result['success']==true){
            this.modalRef.hide();
            this.toastrService.success("Folder details updated sucessfully");
            setTimeout(()=>{
              this.filedetailsService.getFilesandFolders();
            },2000);

        }
        else{
          this.toastrService.error("Error while updating details");
        }
      }
      )
    }
  }

  // shareDetails(size: any){
  //   this.folderId = size.id;
  //   console.log(this.folderId)
  //   let navigationExtras: NavigationExtras = {
  //     queryParams: {
  //       "folderId": encodeURIComponent(this.folderId),
  //     }
      
  //   }

  //   this.router.navigate(['/features/file-share-details'], navigationExtras);
  //   location.reload()
  // } 

  
  updateFile(){
    // if (
    //   this.fileName == "" ||
    //   this.fileName == null ||
    //   this.fileName == undefined
    // ) {
    //   this.fileNameError = "Please enter your password";
    //   document.getElementById("updatefile_name").style.border =
    //     "1px solid #D50000 ";
    //   setTimeout(() => {
    //     this.fileNameError = "";
    //   }, 3000);
    // } 
    // else if (
    //   this.fileDescription == "" ||
    //   this.fileDescription == null ||
    //   this.fileDescription == undefined
    // ) {
    //   this.filedescriptionError = "Please enter your password";
    //   document.getElementById("updatefile_descr").style.border = "1px solid #D50000 ";
    //   setTimeout(() => {
    //     this.filedescriptionError = "";
    //   }, 3000);
    // } 
    // else{
     
      let fileList: FileList = this.fileEvent;
      console.log(fileList)
       if(fileList == undefined || fileList == null ){
          // let formData: FormData = new FormData();
          // // formData.append("file", file, file.name);
          // formData.append("name", this.file_name);
          // formData.append("description",this.file_description)
          // this.roasterId = this.cookieService.get("roaster_id");
          // formData.append(
          //   "api_call",
          //   "/ro/" + this.roasterId + "/file-manager/files/" + this.file_id 
          // );
          // formData.append("token", this.cookieService.get("Auth"));
          // this.roasterService.updateFiles(formData).subscribe(
          //   result=>{
          //     if(result['success']==true){
          //       this.toastrService.success("The File has been updated successfully");
          //       this.getFilesandFolders();
          //       this.modalRef.hide();
          //     }else{
          //       this.toastrService.error("Error while updating the file details");
          //       this.modalRef.hide();
          //     }
          //   }
          // )
          this.toastrService.error("Please upload the file to update the file details");
        }
        else if (fileList.length > 0) {
          let file: File = fileList[0];
          let formData: FormData = new FormData();
          formData.append("file", file, file.name);
          formData.append("name", this.file_name);
          formData.append("description",this.file_description)
          this.roasterId = this.cookieService.get("roaster_id");
          formData.append(
            "api_call",
            "/ro/" + this.roasterId + "/file-manager/files/" + this.file_id 
          );
          formData.append("token", this.cookieService.get("Auth"));
          this.roasterService.updateFiles(formData).subscribe(
            result=>{
              if(result['success']==true){
                this.toastrService.success("The File has been updated successfully");
                this.filedetailsService.getFilesandFolders();
                this.modalRef.hide();
              }else{
                this.toastrService.error("Error while updating the file details");
                this.modalRef.hide();
              }
            }
          )
          }
     
    }
  // }

  shareFileAndFolder(){
    this.resetButtonValue = "Sharing";
    var file_id = this.shareFileId;
    var share_permission = document.getElementById('share_permission').innerHTML;
    if(share_permission == "Can view"){
      this.share_permission = "VIEW";
    }else if(share_permission == "Can edit"){
      this.share_permission = "EDIT";
    }
    var shareData = {
      "user_id" : this.user_id_value,
      "permission" : this.share_permission,
      "company_type" : this.company_type,
      "company_id" : this.company_id
    }
    console.log(shareData)
    this.roasterService.shareFolder(this.roasterId,file_id,shareData).subscribe(
      res => {
        if(res['success']==true){
          this.resetButtonValue = "Share";
          this.sharedUsersLists();
          this.toastrService.success("The folder has been shared to the User sucessfully!")
        }
        else{
          this.resetButtonValue = "Share";
          this.toastrService.error("Error while sharing the folder to the user!");
        }
      
      })
  }

  removeAccess(item : any){
   
    if (confirm("Please confirm! you want to remove access?") == true) {
    
    var fileId = this.shareFileId;
    var unShareData = {
      'user_id' : item.user_id,
      'company_type' : item.company_type,
      'company_id' : item.company_id
    }
    this.roasterService.unShareFolder(this.roasterId, fileId,unShareData).subscribe(
      data =>{
        if(data['success'] == true){
          this.sharedUsersLists();
          this.toastrService.success("Share access has been removed successfully.")
        }else{
          this.toastrService.error("Error while removing the access to the user");
        }
      }
    )
  }
}


changePermissions(term : any, item : any){
  var permission = term;
  var fileId = this.shareFileId;
  var shareData = {
    "user_id": item.user_id,
    "permission": permission,
    "company_type": item.company_type,
    "company_id": item.company_id
  }
  this.roasterService.updatePermissions(this.roasterId,fileId,shareData).subscribe(
    data => {
      console.log(data)
      if(data['success'] == true){
        // this.sharedUsersLists();
        this.toastrService.success("Permission has been updated successfully.")
      }else{
        this.toastrService.error("Error while changing the Share permissions");
      }
    }
  )
}


}
