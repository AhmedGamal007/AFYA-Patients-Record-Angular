import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Employee } from 'src/app/model/employee';
import { Patient } from 'src/app/model/patient';
import { EmployeeService } from 'src/app/service/employee.service';
import { ProductService } from 'src/app/service/patient.service';

@Component({
  selector: 'app-edit.patient',
  templateUrl: './edit.patient.component.html',
  styleUrls: ['./edit.patient.component.css']
})
export class EditPatientComponent implements OnInit{

  patientDTO: FormGroup;
  event: any;
  currentPatient = new Patient();
  patients: Patient[]=[];
  employees: Employee[]=[];
  constructor(private router:Router,private formBuilder:FormBuilder,private patientService:ProductService,private route: ActivatedRoute
    ,private employeeService:EmployeeService){

  }
  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe(response=>{
      this.employees = response
    })

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
      submissionDate: new FormControl({value: null,disabled:true},[Validators.required]),
      note: new FormControl(null,[Validators.required]),
      status: new FormControl(null,[Validators.required]),
      sentBy: new FormControl(null,[Validators.required])
    });


    this.route.paramMap.subscribe((params: ParamMap) => {

      if (params.get('id')) {

        this.patientService.getPatient(+params.get('id'))
          .subscribe(response => {
            this.currentPatient = response;
            console.log(this.currentPatient);
            this.patientDTO.setValue({
              name: this.currentPatient.name,
              passportPath: this.currentPatient.passportPath,
              arriveDate: this.currentPatient.arriveDate,
              leaveDate: this.currentPatient.leaveDate,
              hospitalName: this.currentPatient.hospitalName,
              hospitalNumber: this.currentPatient.hospitalNumber,
              typeOfDisease: this.currentPatient.typeOfDisease,
              examinationDate: this.currentPatient.examinationDate,
              patientNumber: this.currentPatient.patientNumber,
              submissionDate: this.currentPatient.submissionDate,
              note: this.currentPatient.note,
              status: this.currentPatient.status,
              sentBy: this.currentPatient.sentBy,
            })
          })
      }
    })


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
  addImage(){
    const file= this.event.target.files[0];
    console.log(file);
    const formdata = new FormData();
    formdata.append('image',file,this.currentPatient.id+"x"+file.name)

     this.patientService.uploadImage(formdata).subscribe(res => {

      },
      err=>{
        return;
      });
      this.patientDTO.patchValue({
        passportPath: this.currentPatient.id+"x"+file.name
      })


  }
  setEvent(event:any):void {
    this.event=event;
  }
  
  submit(){
      if(this.event != null && this.event.target.files.length>0){
        this.addImage()
      }

    this.patientService.editPatient(this.currentPatient.id, this.patientDTO.getRawValue()).subscribe(res=>{
      console.log(res);
      alert("Record Edited Sucessfully");
      window.location.reload();
    });
  }
}
