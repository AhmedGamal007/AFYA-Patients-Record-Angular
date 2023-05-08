import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from 'src/app/model/patient';
import { ProductService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-add.patient',
  templateUrl: './add.patient.component.html',
  styleUrls: ['./add.patient.component.css']
})
export class AddPatientComponent implements OnInit{
  duplicate:String[]=[];
  lastId:number;
  mode="";
  patientDTO: FormGroup;
  event: any;
  patients: Patient[] = [];
  imageId:String;
  constructor(private router:Router,private formBuilder:FormBuilder,private patientService:ProductService){
  }

;


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.patientService.getAllPatients().subscribe(
      response=>{
        console.log(response)
        this.patients = response;
        this.lastId=(this.patients[this.patients.length-1].id + 1);
        console.log("SS"+this.getLastId());
        this.imageId=(this.getLastId()+"x");
        console.log(this.imageId);
      });
    console.log("I am working");

    this.patientDTO=this.formBuilder.group({
      name: new FormControl(null,[Validators.required]),
      passportPath: new FormControl(null,[Validators.required]),
      arriveDate: new FormControl(null,[Validators.required]),
      leaveDate: new FormControl(null,[Validators.required]),
      hospitalName: new FormControl(null,[Validators.required]),
      hospitalNumber: new FormControl(null,[Validators.required]),
      typeOfDisease: new FormControl(null,[Validators.required]),
      examinationDate: new FormControl(null,[Validators.required]),
      patientNumber: new FormControl(null,[Validators.required]),
      submissionDate: new FormControl(null,[Validators.required]),
      note: new FormControl(null,[Validators.required]),
      status: new FormControl(null,[Validators.required]),
    });

    // this.patientDTO.patchValue({
    //   name: "adsd"
    // })
      //  this.patientDTO.patchValue({
    //    arriveDate: "2010-10-10"
    //  })


    // console.log(document.getElementById("hospitalNameDataList"));


  }
  setConcatId(dataListOption:String,id:number):string{
    return dataListOption+""+id;
  }
  // check(){
  //   console.log("sssssssssssssWWWWss")
  //   console.log(this.patients);
  //   for (let i = 0; i < this.patients.length; i++) {
  //     this.duplicate.push(this.patients[i].hospitalName);
      // for (let j = 0; j < this.duplicate.length; j++) {
      //   if(this.patients[i].hospitalName == this.duplicate[j]){
      //     console.log("asdadasd")

      //     document.getElementById(this.duplicate[j]+""+i).remove();
      //   }
      // }

  //   }
  //   console.log(this.duplicate)
  // }

  getLastId(){

    return this.lastId;
  }

  submit(){
    console.log(this.patientDTO.getRawValue());
    this.patientService.addPatient(this.patientDTO.getRawValue()).subscribe(res=>{
      console.log(res);
      alert("Record Added Sucessfully");
      window.location.reload();
    });
  }
  setEvent(event:any):void {
    this.event=event;
  }

 addImage(){
    console.log(this.event.target.files.length);
    if(this.event.target.files.length > 0){
    const file= this.event.target.files[0];
    console.log(file);
    const formdata = new FormData();
    formdata.append('image',file,this.imageId+file.name)

     this.patientService.uploadImage(formdata).subscribe(res => {

      },
      err=>{
        return
      });
      this.patientDTO.patchValue({
        passportPath: this.imageId+file.name
      })
      this.submit();
    }
  }
  status(){
    if (this.patientDTO.getRawValue().status == "Pending") {
      return "bg-secondary";
    } else if(this.patientDTO.getRawValue().status=="Completed"){
      return "bg-success";
    }else{
      return null;
    }
  }
  test(){
    console.log(this.patientDTO.getRawValue().note);
  }
}
