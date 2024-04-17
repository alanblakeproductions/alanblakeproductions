import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LambdaService } from './../service/lambda.service';

declare var UIkit:any;

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
    LambdaService,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.less'
})
export class ContactComponent {

  model = {
    name: null,
    email: null,
    comments: null,
  }

  state: string = "primary";
  message: string | undefined;
  result: any | undefined = {};

  constructor(private lambdaService: LambdaService) {
  }

  onSubmit() {
    this.message = "";
    this.state = "";

    this.lambdaService
      .contact(this.model)
      .subscribe((data: any) => {
        this.message = "Thank you for your message, " + this.model.name + ".";
        this.state = "success";
        this.result = data;
      },
      error => {
        console.log("Error while submitting contact form");
        console.log(error);
        this.message = "Sorry! This message could not be sent.";
        this.state = "error";
      }
    );
  }
}
