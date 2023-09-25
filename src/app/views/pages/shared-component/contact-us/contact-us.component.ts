import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { serialize } from "chartist";
import { ToastrService } from "ngx-toastr";
import { MinisiteService } from "../../../../../provider/minisite/minisite.service";

@Component({
  selector: "kt-contact-us",
  templateUrl: "./contact-us.component.html",
  styleUrls: ["./contact-us.component.scss"],
})
export class ContactUsComponent implements OnInit {
  form: FormGroup;
  @Input() user:any

  constructor(public fb: FormBuilder,
    private minisite: MinisiteService,
  private toastr:ToastrService) { }

  ngOnInit() {
    this.initForm();
    console.log(this.user);
    
  }
  initForm() {
    this.form = this.fb.group({
      email: [""],
      phone: [""],
      message: [""],
      name: [""],
      address: [""],
    });
  }

 async submit() {
   let f = this.form.controls;
   debugger
    if (!f.name.value|| !(f.email.value||f.phone.value)) {
      this.toastr.error('Please Enter the Contact Details')
      return
    } else {
      let options:any ={}
      options = this.form.value;
      options.memberId = this.user.id;
      try {
        let res:any = await this.minisite.sendEmailToUser(options);
        if (res.message == 'success') {
          this.toastr.success("Email sent successfully")
          this.form.reset();
        }
        else {
        this.toastr.success(res.message)
        }
      }
      catch (err) {
        console.log(err);
        this.toastr.error(err)
      }
    }
  }
}
