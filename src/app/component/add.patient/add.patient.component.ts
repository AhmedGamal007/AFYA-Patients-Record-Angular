import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee} from 'src/app/model/employee';
import { Patient } from 'src/app/model/patient';
import { EmployeeService } from 'src/app/service/employee.service';
import { ProductService } from 'src/app/service/patient.service';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-add.patient',
  templateUrl: './add.patient.component.html',
  styleUrls: ['./add.patient.component.css']
})
export class AddPatientComponent implements OnInit{
  duplicate:String[]=[];
  lastId:number;
  base64="";
  patientDTO: FormGroup;
  event: any;
  currentEmployee:Employee = new Employee();
  patients: Patient[] = [];
  employees: Employee[] = [];
  imageId:String;
  constructor(private router:Router,private formBuilder:FormBuilder,private patientService:ProductService,private employeeService:EmployeeService){
  }

;


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.employeeService.getAllEmployees().subscribe(response=>{
      console.log(response)
      this.employees = response
    })
    this.patientService.getAllPatients().subscribe(
      response=>{
        console.log(response)
        this.patients = response;
        this.lastId=(this.patients[this.patients.length-1].id + 1);
        console.log("SS"+this.getLastId());
        this.imageId=(this.getLastId()+"x");
        console.log(this.imageId);
      });

      console.log((new Date()).getUTCMonth().toString().length)
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
      submissionDate: new FormControl({value: new Date().toJSON().slice(0,10),disabled:true},Validators.required),
      note: new FormControl(null,[Validators.required]),
      status: new FormControl({value:"Choose..",disabled:false},[Validators.required]),
      sentBy: new FormControl({value:null,disabled:true},[Validators.required])
    });


  }
  setConcatId(dataListOption:String,id:number):string{
    return dataListOption+""+id;
  }
  setEmployeeId(employee:Employee){
    var listEmployee = document.getElementById(employee.employeeName) as HTMLInputElement;
      listEmployee.setAttribute("data-seed",""+employee.id)
  }
  removeFromList() {
     var listOption = document.getElementById("sentByState") as HTMLInputElement;
    var def = document.getElementById("sentByDefault") as HTMLInputElement;
     var textField = document.getElementById("selectText") as HTMLInputElement;
    if (listOption.value == def.value || listOption.value == "Other...") {
        alert("Choose An Option Before Deleting.")
        return;
    }
    else{
      let empId= +(document.getElementById(listOption.value) as HTMLInputElement).getAttribute("data-seed");


       this.employeeService.removeEmployee(empId).subscribe(response=>{

        alert("Employee Deleteded");
        window.location.reload();
       })

    }

  }
  addToList() {
    var listText = (<HTMLInputElement>document.getElementById("sentByText"));
    var listOption = (<HTMLInputElement>document.getElementById("sentByState"));
    if(listText.value.length == 0 ){
      alert("Enter Employee Name First");
      return
    }
    this.currentEmployee.employeeName=listText.value
    this.currentEmployee.id=null;
    this.employeeService.addEmployee(this.currentEmployee).subscribe(response=>{

    })
    listOption.innerHTML+= "<option>"+listText.value+"</option>";
    listOption.value = listText.value;

    this.listRedirect();
  }
  listRedirect(){
    var listOption = (<HTMLInputElement>document.getElementById("sentByState"));
    var listText = (<HTMLInputElement>document.getElementById("sentByText"));
    if(listOption.value == "Other..."){
      $("#addEmployeeButton").removeAttr("hidden");
      listText.removeAttribute("disabled")
      return false;
    }else{
      $("#addEmployeeButton").attr("hidden","true");
      listText.setAttribute("disabled","true");
      if(listOption.value == "Choose.."){
      listText.value = "";
    }else{
      listText.value = listOption.value;
    }
    return true;
    }

}
  setCurrentEmployee(employee:Employee){
    console.log(employee)
    this.currentEmployee = employee;
  }
  getLastId(){

    return this.lastId;
  }

  submit(){

   this.patientService.addPatient(this.patientDTO.getRawValue()).subscribe(res=>{
      if(this.patientDTO.getRawValue().status=="Completed"){
        this.patientService.addToFinance(res.id).subscribe(res=>{})
      }
      alert("Record Added Sucessfully");
      window.location.reload();
    });
  }
  setEvent(event:any):void {
    this.event=event;
    console.log(this.patientDTO.getRawValue())
  }
  //Converting Image to 64 Base Code
  addImageBase64(){
    if(this.event == null || this.event.target.files.length == 0){
      this.submit()
      return;
    }
    const target= this.event.target as HTMLInputElement;
    const file: File =(target.files as FileList)[0];
    this.convertToBase64(file);

  }
  convertToBase64(file:File){
    const observable = new Observable((subscriber: Subscriber<any>)=>{
      this.readFile(file,subscriber)
    })
    observable.subscribe((d)=>{
      this.patientDTO.patchValue({
        passportPath: d,
      })
      this.submit();
    })
  }
  readFile(file: File, subscriber : Subscriber<any>){
    const filereader = new FileReader();
    filereader.readAsDataURL(file);
    filereader.onload = () => {
      subscriber.next(filereader.result);
      subscriber.complete();
    }
    filereader.onerror = () => {
      subscriber.error()
      subscriber.complete()
    }
  }
//  addImage(){

//     if(this.event.target.files.length > 0){
//     const file= this.event.target.files[0];
//     console.log(file);
//     const formdata = new FormData();
//     formdata.append('image',file,this.imageId+file.name)

//      this.patientService.uploadImage(formdata).subscribe(res => {

//       },
//       err=>{
//         return
//       });
//       this.patientDTO.patchValue({
//         passportPath: this.imageId+file.name
//       })
//       this.submit();
//     }
//   }
  status(){
    if (this.patientDTO.getRawValue().status == "Pending") {
      return "bg-secondary";
    } else if(this.patientDTO.getRawValue().status=="Completed"){
      return "bg-success";
    }else{
      return null;
    }
  }

}
