

import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { starServices } from 'starlib';


//import { AlertService, AuthenticationService } from '../../../_services';

@Component({
  selector: 'app-adm-login',
  templateUrl: './adm-login.component.html',
  styleUrls: ['./adm-login.component.css']
})

export class AdmLoginComponent implements OnInit {
    
    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    private Body =[];
    public usern: string = "";
    public passw: string = "";

    

    @Output() loginCompleted: EventEmitter<any> = new EventEmitter();
    constructor(
        public starServices: starServices,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
      //  private authenticationService: AuthenticationService,
       // private alertService: AlertService
    ) {
        // redirect to home if already logged in
        /*if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }*/
    }

    ngOnInit() {
        this.starServices.hideNoValidLicense();
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f():any { return this.loginForm.controls; }
    private addToBody(NewVal){
        this.Body.push(NewVal);
    }

    onSubmit(usern: string, passw: string) {

        this.submitted = true;

        // stop here if form is invalid
        /*if (this.loginForm.invalid) {
            return;
        }*/

        this.loading = true;
        
        this.starServices.login(this,usern, passw);
        
  
        this.submitted = true;
        this.loading = false;
    
        /*this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                 //   this.alertService.success(this.f.username.value);
                  this.router.navigate(['/invoices']);
                         },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
                */
    }
}
