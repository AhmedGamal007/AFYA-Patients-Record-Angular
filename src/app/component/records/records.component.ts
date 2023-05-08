import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from 'src/app/model/patient';
import { ProductService } from 'src/app/service/patient.service';
declare var $:JQueryStatic;

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})

export class RecordsComponent implements OnInit {


  patients:Patient[] = [];
  constructor(private productService:ProductService,private router:Router){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.productService.getAllPatients().subscribe(
      response=>{
        this.patients = response;
        console.log(this.patients);

        $(document).ready(function () {
          console.log("Hello");
          $('#recordsTable').DataTable({
            lengthMenu: [
              [10, 25, 50, -1],
              [10, 25, 50, 'All'],
          ],
        });
        });
      });

  }

  viewPassport(imagePath:String){
    alert(imagePath);
  }

  viewStatus(status:String){
    if (status == "Pending") {
      return false;
    }
    else if(status == "Completed"){
      return true;
    }
    return null;
  }
  viewModalButton(id:number){
    document.getElementById("modalButton"+id).setAttribute("data-bs-target","#passportModal"+id);
    console.log(this.router.events);
  }
  viewNoteButton(id:number){
    document.getElementById("noteButton"+id).setAttribute("data-bs-target", "#noteModal"+id);
  }
  deletePatient(id:number){
    if(confirm("Are You Sure You Want To Delete This Record?")){
      this.productService.deletePatient(id).subscribe(res=>{
        console.log(res);
        alert("Patient Deleted Sucessfully");
        window.location.reload();
      },
      err=>{

      })
    }else{

    }
  }
}
