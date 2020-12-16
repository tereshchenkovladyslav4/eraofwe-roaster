// AUTHOR : Vijaysimhareddy
// PAGE DESCRIPTION : This page contains all API calls for SEWN-Roaster Roles and User Management.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import {environment} from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoasterserviceService {
  //API call URL's
  private url = environment.apiURL+"/ro/api";
  private deleteUrl = environment.apiURL+"/ro/deleteapi";
  private putUrl = environment.apiURL+"/ro/putapi";
  private fileuploadUrl = environment.apiURL+"/ro/filesfolders" ;
  private putfileuploadUrl = environment.apiURL+"/ro/putfilesfolders" ;
  private encryptionKey = 'sewen_secrete_key';
  private uploadBrandsUrl =  environment.apiURL+'/ro/uploadBrands';

  // private url = "https://qa-fed-api.sewnstaging.com/ro/api";
  // private deleteUrl = "https://qa-fed-api.sewnstaging.com/ro/deleteapi";
  // private putUrl = "https://qa-fed-api.sewnstaging.com/ro/putapi";

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  //API Function Name : Role List
  //API Description: This API calls helps to get all roles to the user.

  getRoles(id: any) {
    var data = {};
    data['api_call'] = "/ro/" + id + "/roles";
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.url, data);
  };

  //API Function Name : Delete Role
  //API Description: This API calls helps to delete the role.

  deleteRoles(roaster_id: any, id: any) {
    var data = {};
    console.log(this.deleteUrl);
    data['api_call'] = "/ro/" + roaster_id + "/roles/" + id;
    data['token'] = this.cookieService.get('Auth');
    console.log(data);
    return this.http.post(this.deleteUrl, data);
  }

  //API Function Name : Roaster User Data
  //API Description: This API calls helps to get the all Roaster user data.

  getRoasterUsers(id: any) {
    var data = {};
    data['api_call'] = "/ro/" + id + "/users";
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.url, data);
  }

  //API Function Name : Create Role
  //API Description: This API calls helps to create a role to the user.

  createRole(body: any) {
    var data = {};
    data['api_call'] = "/ro/" + body.id + "/roles";
    data['token'] = this.cookieService.get('Auth');
    data['data'] = {
      "name": body.name
    };
    return this.http.post(this.url, data);
  };

  //API Function Name : roaster permissions
  //API Description: This API calls helps to get the  permissions of the particular Roaster.

  getRoasterPermissions(id: any) {
    var data = {};
    data['api_call'] = "/ro/" + id + "/permissions";
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.url, data);
  }

  //API Function Name : Role Name
  //API Description: This API calls helps to get the Role name of the Selected role.

  getRoasterRoleName(id: any, roaster_id: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/roles/" + id;
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.url, data);
  }

  //API Function Name : Update Role
  //API Description: This API calls helps to Update role name.

  updateRoasterRoleName(body: any, roaster_id: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/roles/" + body.roleId;
    data['token'] = this.cookieService.get('Auth');
    data['method'] = "PUT";
    data['data'] = {
      'name': body.name
    }
    return this.http.post(this.url, data);
  }

  //API Function Name : Role permissions
  //API Description: This API calls helps to get all permissions.

  getRolePermissions(roaster_id: any, roleid: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/roles/" + roleid + "/permissions";
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.url, data);
  }

  //API Function Name : Assign Role Permissions
  //API Description: This API calls helps to assign role permissions to the user

  assignRolePermissions(body: any, roleId: any, roaster_id: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/roles/" + roleId + "/permissions";
    data['token'] = this.cookieService.get('Auth');
    data['data'] = body;
    return this.http.post(this.url, data);
  }

  //API Function Name : Get User Roles
  //API Description: This API calls helps to get the roles of the selected user.

  getUserBasedRoles(roaster_id: any, user_id: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/users/" + user_id + "/roles";
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.url, data);
  }

  //API Function Name : delete user
  //API Description: This API calls helps to delete the selected user.

  deleteRoasterUser(roaster_id: any, user_id: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/users/" + user_id;
    data['token'] = this.cookieService.get('Auth');
    data['method'] = "DELETE";
    return this.http.post(this.url, data);
  }

  //API Function Name : Assign Role
  //API Description: This API calls helps to assign new role to the selected user.

  assignUserBasedUserRoles(roaster_id: any, role_id: any, user_id: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/users/" + user_id + "/roles/" + role_id;
    data['token'] = this.cookieService.get('Auth');
    data['method'] = "POST";
    return this.http.post(this.url, data);
  }

  //API Function Name : Delete user role
  //API Description: This API calls helps to delete the role of the selected user

  deleteRoasterUserRole(roaster_id: any, role_id: any, user_id: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/users/" + user_id + "/roles/" + role_id;
    data['token'] = this.cookieService.get('Auth');
    data['method'] = "DELETE";
    return this.http.post(this.url, data);
  }


  //API Function Name : Enable Admin User
  //API Description: This API calls helps to Enable the selected user.

  enableAdminUser(roaster_id: any, enableUserId: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/users/" + enableUserId + "/enable";
    data['method'] = "PUT";
    data['token'] = this.cookieService.get('Auth');
    return this.http.put(this.putUrl, data);
  }

  //API Function Name : Disable Admin User
  //API Description: This API calls helps to Disable the selected user.

  disableAdminUsers(roaster_id: any, disableUserId: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/users/" + disableUserId + "/disable";
    data['method'] = "PUT";
    data['token'] = this.cookieService.get('Auth');
    return this.http.put(this.putUrl, data);
  }

  //API Function Name : Get Contacts
  //API Description: This API calls helps to get the contacts of the Roaster.

  getRoasterContacts(roaster_id: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/users/top-contacts";
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.url, data);
  }

    //API Function Name : Add Contacts
  //API Description: This API calls helps to add contacts of the Roaster.

  addRoasterContacts(roaster_id: any,body:any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/users/top-contacts";
    data['method'] = "POST";
    data['token'] = this.cookieService.get('Auth');
    data['data'] = body;
    return this.http.post(this.url, data);
  }
  
    //API Function Name : Delete Contacts
  //API Description: This API calls helps to add contacts of the Roaster.

  deleteRoasterContacts(roaster_id: any,contact_id:any){
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/users/top-contacts/"+contact_id;
    // data['method'] = "DELETE";
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.deleteUrl, data);
  }
  
    //API Function Name : Get Brands
  //API Description: This API calls helps to get the Brands of the Roaster.

  getRoasterBrands(roaster_id: any):Observable<any> {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/brands";
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.url, data);
  }

  addRoasterBrand(data: any):Observable<any> {
    return this.http.post(this.uploadBrandsUrl, data);
  }

  getRoasterReviews(roaster_id: any):Observable<any> {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/your-reviews";
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.url, data);
  }

     //API Function Name : Get Brands
  //API Description: This API calls helps to create the folder .

  createFolder(roaster_id: any,body : any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/file-manager/folders";
    data['token'] = this.cookieService.get('Auth');
    data['method'] = "POST";
    data['data'] = body;
    return this.http.post(this.url, data);
  }

     //API Function Name : Get Files/Folders
  //API Description: This API calls helps to get the files/folders.

  getFilesandFolders(roaster_id: any,parentId : any) {
    
    let params = new HttpParams();
    params = params.append('file_module', 'File-Share');
    params = params.append('parent_id', parentId)
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/file-manager/my-files?" + params;
    // data['params'] = params;
    data['token'] = this.cookieService.get('Auth');
    //  const params = new HttpParams().append( 'file_module', fileModule )
    
    return this.http.post(this.url, data);
  }

    //API Function Name : Delete Folder
  //API Description: This API calls helps to delete the Folder.

  deleteFolder(roaster_id: any, id: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/file-manager/folders/" + id;
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.deleteUrl, data);
  }

     //API Function Name : Delete File
  //API Description: This API calls helps to delete the File.

  deleteFile(roaster_id: any, id: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/file-manager/files/" + id;
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.deleteUrl, data);
  }

       //API Function Name : Get Shared Files/Folders
  //API Description: This API calls helps to get the shared files/folders.

  getSharedFilesandFolders(roaster_id: any) {
    
    let params = new HttpParams();
    params = params.append('file_module', 'File-Share');
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/file-manager/shared?" + params;
    // data['params'] = params;
    data['token'] = this.cookieService.get('Auth');
    //  const params = new HttpParams().append( 'file_module', fileModule )
    
    return this.http.post(this.url, data);
  }

       //API Function Name : Get Pinned Files/Folders
  //API Description: This API calls helps to get the pinned files/folders.

  getPinnedFilesandFolders(roaster_id: any) {
    
    let params = new HttpParams();
    params = params.append('file_module', 'File-Share');
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/file-manager/pinned?" + params;
    // data['params'] = params;
    data['token'] = this.cookieService.get('Auth');
    //  const params = new HttpParams().append( 'file_module', fileModule )
    
    return this.http.post(this.url, data);
  }


      //API Function Name : Pin File/Folder
  //API Description: This API calls helps to Pin the File/Folder.

  pinFileorFolder(roaster_id: any,id:any) {
    var data = {};
    data['api_call'] =   "/ro/" + roaster_id + "/file-manager/" + id + "/pin";
    data['method'] = "PUT";
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.url, data);
  }


       //API Function Name : Unpin File/Folder
  //API Description: This API calls helps to unpin the File/Folder.

  unpinFileorFolder(roaster_id: any, id: any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/file-manager/" + id + "/pin";
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.deleteUrl, data);
  }

       //API Function Name : Rename the Details of the  Folder
  //API Description: This API calls helps to rename the details of the folder.

  updateFolderDetails(roaster_id: any,id:any,body:any) {
    var data = {};
    data['api_call'] =   "/ro/" + roaster_id + "/file-manager/folders/"+ id;
    data['method'] = "PUT";
    data['token'] = this.cookieService.get('Auth');
    data['data'] = body;
    return this.http.post(this.url, data);
  }

   //API Function Name : Get Folder Details
  //API Description: This API calls helps to get the folder details.

  getFolderDetails(roaster_id: any,id:any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/file-manager/folders/"+id;
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.url, data);
  }


   //API Function Name : Get Files Details
  //API Description: This API calls helps to get the files details.

  getFileDetails(roaster_id: any,id:any) {
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/file-manager/files/"+id;
    data['token'] = this.cookieService.get('Auth');
    return this.http.post(this.url, data);
  }

    // API Function Name : Upload Files API.
  // API Description   : This API call helps to upload the Files.
  uploadFiles(formData: any) {
    var httpOptions = {
      headers: new HttpHeaders({ Accept: "application/json" })
    };
    return this.http.post(this.fileuploadUrl, formData, httpOptions);
  }

     // API Function Name : update Files API.
  // API Description   : This API call helps to update the Files.
  updateFiles(formData: any) {
    var httpOptions = {
      headers: new HttpHeaders({ Accept: "application/json" })
    };
    return this.http.post(this.putfileuploadUrl, formData, httpOptions);
  }

  
   //API Function Name : Get Video files
  //API Description: This API calls helps to get the video files.
  getVideos(roaster_id: any,parentId : any) {
    
    let params = new HttpParams();
    params = params.append('file_module', 'File-Share');
    params = params.append('type_in','VIDEO');
    params = params.append('parent_id', parentId)
    var data = {};
    data['api_call'] = "/ro/" + roaster_id + "/file-manager/my-files?" + params;
    // data['params'] = params;
    data['token'] = this.cookieService.get('Auth');
    //  const params = new HttpParams().append( 'file_module', fileModule )
    console.log(data);
    return this.http.post(this.url, data);
  }

    //API Function Name : Share File/Folder
	//API Description: This API calls helps to share the file/folder to the user.

	shareFolder(roaster_id: any,file_id : any,body : any) {
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/file-manager/"+file_id+"/share";
		data['token'] = this.cookieService.get('Auth');
		data['method'] = "POST";
		data['data'] = body;
		return this.http.post(this.url, data);
	}

  
	//API Function Name : Get Agreements 
	//API Description: This API calls helps to get the agreements .
	getAgreements(roaster_id: any,customer_type : any) {
		
		// let params = new HttpParams();
		// params = params.append('file_module', 'File-Share');
		// params = params.append('type_in','VIDEO');
		// params = params.append('parent_id', parentId)
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/" + customer_type + "/agreements";
		// data['params'] = params;
		data['token'] = this.cookieService.get('Auth');
		//  const params = new HttpParams().append( 'file_module', fileModule )
		console.log(data);
		return this.http.post(this.url, data);
	}


	//API Function Name : Upload Agreements 
	//API Description: This API calls helps to upload the agreements .
	uploadAgreements(roaster_id: any,customer_type : any, body : any) {
		// let params = new HttpParams();
		// params = params.append('file_module', 'File-Share');
		// params = params.append('type_in','VIDEO');
		// params = params.append('parent_id', parentId)
		var data = {};
		data['api_call'] = "/ro/" + roaster_id +"/"+ customer_type + "/agreements";
		// data['params'] = params;
		data['token'] = this.cookieService.get('Auth');
		data['data'] = body;
		//  const params = new HttpParams().append( 'file_module', fileModule )
		console.log(data);
		return this.http.post(this.url, data);
	}

  
    //API Function Name : Update Agreements 
	//API Description: This API calls helps to update the agreements.

	getAgreementValue(roaster_id: any,customer_type:any,id:any) {
		var data = {};
		data['api_call'] =   "/ro/" + roaster_id + "/" + customer_type + "/agreements/"+ id;
		data['method'] = "GET";
		data['token'] = this.cookieService.get('Auth');
		return this.http.post(this.url, data);
	}


    //API Function Name : Update Agreements 
	//API Description: This API calls helps to update the agreements.

	updateAgreements(roaster_id: any,customer_type:any,id:any,body:any) {
		var data = {};
		data['api_call'] =   "/ro/" + roaster_id + "/" + customer_type + "/agreements/"+ id;
		data['method'] = "PUT";
		data['token'] = this.cookieService.get('Auth');
		data['data'] = body;
		return this.http.post(this.url, data);
	}
	//API Function Name : Delete Agreement
	//API Description: This API calls helps to Delete the Agreement.

	deleteAgreement(roaster_id: any, customer_type : any, id: any) {
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/" + customer_type + "/agreements/"+ id;
		data['token'] = this.cookieService.get('Auth');
		return this.http.post(this.deleteUrl, data);
	}

  
	//API Function Name : Get Users List
	//API Description: This API calls helps to get the Users List.
	getUsersList(typeValue : any) {
		
		let params = new HttpParams();
		// params = params.append('file_module', 'File-Share');
		// params = params.append('type_in','VIDEO');
		params = params.append('query', typeValue);
		var data = {};
		data['api_call'] = "/users/user-list?" + params ;
		// data['params'] = params;
		data['token'] = this.cookieService.get('Auth');
		//  const params = new HttpParams().append( 'file_module', fileModule )
		// console.log(data);
		return this.http.post(this.url, data);
	}


	//API Function Name : Get shared users list
	//API Description: This API calls helps to get the shared users list.
	getSharedUserList(roasterId : any, fileId : any){
		var data = {};
		data['api_call'] = "/ro/" + roasterId + "/file-manager/" + fileId + "/shared-users";
		data['token'] = this.cookieService.get('Auth');
		data['method'] = "GET";
		return this.http.post(this.url,data);

	}

    //API Function Name : UnShare File/Folder
  	//API Description: This API calls helps to unshare the file/folder to the user.

	unShareFolder(roaster_id: any,file_id : any,body : any) {
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/file-manager/"+file_id+"/unshare";
		data['token'] = this.cookieService.get('Auth');
		data['method'] = "POST";
		data['data'] = body;
		return this.http.post(this.url, data);
	}

	//API Function Name : Update permissions of the File/Folder
	//API Description: This API calls helps to update permissions of the File/Folder.

	updatePermissions(roaster_id: any,file_id:any,body:any) {
		var data = {};
		data['api_call'] =   "/ro/" + roaster_id + "/file-manager/"+ file_id + "/permission";
		data['method'] = "PUT";
		data['token'] = this.cookieService.get('Auth');
		data['data'] = body;
		return this.http.post(this.url, data);
	}

	getMicroRoasters(roaster_id: any) {
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/micro-roasters";
		// data['params'] = params;
		data['token'] = this.cookieService.get('Auth');
		//  const params = new HttpParams().append( 'file_module', fileModule )
		// console.log(data);
		return this.http.post(this.url, data);
	} 
	getMicroRoastersHoreca(roaster_id: any) {
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/hrc";
		// data['params'] = params;
		data['token'] = this.cookieService.get('Auth');
		//  const params = new HttpParams().append( 'file_module', fileModule )
		// console.log(data);
		return this.http.post(this.url, data);
	} 
  
	getMicroRoastersList(roaster_id: any) {
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/micro-roasters";
		// data['params'] = params;
		data['token'] = this.cookieService.get('Auth');
		//  const params = new HttpParams().append( 'file_module', fileModule )
		// console.log(data);
		return this.http.post(this.url, data);
	}

	getRoastingProfile(roaster_id: any) {
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/roasting-profile";
		// data['params'] = params;
		data['token'] = this.cookieService.get('Auth');
		//  const params = new HttpParams().append( 'file_module', fileModule )
		console.log(data);
		return this.http.post(this.url, data); 
	} 
	getRoasterCoffeeBatchs(roaster_id: any) {
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/roasted-batches";
		// data['params'] = params;
		data['token'] = this.cookieService.get('Auth');
		//  const params = new HttpParams().append( 'file_module', fileModule )
		console.log(data);
		return this.http.post(this.url, data);
	} 
	getSelectOrderListTable(roaster_id: any) {
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/roasted-batches";
		// data['params'] = params;
		data['token'] = this.cookieService.get('Auth');
		//  const params = new HttpParams().append( 'file_module', fileModule )
		console.log(data);
		return this.http.post(this.url, data);
	} 
	getSelectProductDetails(roaster_id: any) {
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/products";
		data['token'] = this.cookieService.get('Auth');
		return this.http.post(this.url, data);
	} 

	getEstateOrders(roaster_id: any) {
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/orders";
		data['token'] = this.cookieService.get('Auth');
		return this.http.post(this.url, data);
	} 
	getRaisedTicketData(roaster_id: any) {
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/disputes";
		data['token'] = this.cookieService.get('Auth');
		return this.http.post(this.url, data);
	} 
	// getEstateSelectAnOrderTableData(roaster_id: any) {
	//   var data = {};
	//   data['api_call'] = "/ro/" + roaster_id + "/orders";
	//   data['token'] = this.cookieService.get('Auth');
	//   return this.http.post(this.url, data);
	// } 
	encryptData(data) {
		try {
		return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
		} catch (e) {
		console.log(e);
		}
	}
	decryptData(data) {
		try {
		const bytes = CryptoJS.AES.decrypt(data, this.encryptionKey);
		console.log(bytes);
		if (bytes.toString()) {
			return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		}
		return data;
		} catch (e) {
		console.log(e);
		}
	}
	navigate(href, newTab) {
		const a = document.createElement('a');
		a.href = href;
		if (newTab) {
		a.setAttribute('target', '_blank');
		}
		a.click();
		a.remove();
	}
	getMicroRoasterStimulatedLogin(id: any, roasterId: any) {
		const data = {};
		data['api_call'] = "/ro/" + roasterId + "/micro-roasters/" + id + "/support-login";
		data['method'] = 'POST';
		data['token'] = this.cookieService.get('Auth');
		return this.http.post(this.url, data);
	}
	getHorecaStimulatedLogin(id: any, roasterId: any) {
		const data = {};
		data['api_call'] = "/ro/" + roasterId + "/hrc/" + id + "/support-login";
		data['method'] = 'POST';
		data['token'] = this.cookieService.get('Auth');
		return this.http.post(this.url, data);
	}

	getLoggedinUserRoles(roaster_id : any){
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/users/roles";
		data['token'] = this.cookieService.get('Auth');
		data['method'] = "GET";
		return this.http.post(this.url, data);
	}
	placeOrder(roaster_id : any,harvest_id : any,body : any){
		const data = {};
		data['api_call'] = `/ro/${roaster_id}/availability/${harvest_id}/gc`;
		data['method'] = 'POST';
		data['data'] = body;
		data['token'] = this.cookieService.get('Auth');
		return this.http.post(this.url, data);
	}
	getHorecaTable(roaster_id: any,hrc_id) {
		var data = {};
		data['api_call'] = `/ro/${roaster_id}/hrc/${hrc_id}/partners`;
		data['token'] = this.cookieService.get('Auth');
		data['method'] = "GET";
		return this.http.post(this.url, data);
	} 
	getMrOrders(roaster_id:any){
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/mr-orders";
		data['token'] = this.cookieService.get('Auth');
		return this.http.post(this.url, data);
	}
	getMrAvailabilityRequests(roaster_id:any){
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/availability-requests";
		data['token'] = this.cookieService.get('Auth');
		return this.http.post(this.url, data);
  }
  getViewOrderDetails(roaster_id:any,order_id:any){
		var data = {};
		data['api_call'] = "/ro/" + roaster_id + "/orders/"+order_id;
		data['token'] = this.cookieService.get('Auth');
		return this.http.post(this.url, data);
	}
  deleteRoastedCoffeeBatch(roaster_id : any, batch_id : any){
    var data = {};
		data['api_call'] = `/ro/${roaster_id}/roasted-batches/${batch_id}`;
		data['token'] = this.cookieService.get('Auth');
		return this.http.post(this.deleteUrl, data);
  }

}

