import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { UserProfileService } from "../../../../../provider/user-profile/user-profile.service";


@Component({
  selector: 'kt-annoucement-list',
  templateUrl: './annoucement-list.component.html',
  styleUrls: ['./annoucement-list.component.scss']
})
export class AnnoucementListComponent implements OnInit {
  @Input() isSuperAdmin:any=false
  constructor(
    private toastr: ToastrService,
    private service:UserProfileService,
    private cd:ChangeDetectorRef
  ) { }

  allAnnoncement:any=[]

  ngOnInit() {
    this.getDetails()
  }

  async getDetails(){
    let res:any=await this.service.getAnnoucement();
    console.log(res);
    this.allAnnoncement=res
    this.cd.detectChanges();
    
  }

  getImage(value) {
    if (value) {
      return this.service.getImageUrl(value, "GetAnnouncementDownload");
    } else {
      return "../../../../../assets/images/noimage.png";
    }
  }

  async delete(item){
    Swal.fire({
      title: "Are you sure to delete !",
      text: "Would you like to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continue",
      cancelButtonText: "Cancel",
    }).then(async (result: any) => {
      if (result && result.value) {
        let res:any=await this.service.deleteAnnoucement(item.annoucementId);
        console.log(res);
        if(res&&res.message=='Success'){
          this.toastr.success('Annoucement Deleted Successfully');
    this.getDetails()

        }
      } else {
        return;
      }
    });
   
    
  }

}
