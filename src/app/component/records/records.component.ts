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
    let table = document.getElementById('recordsTable');
    let loading = document.getElementById('loading');
    loading.style.visibility = 'visible';
    table.style.visibility = 'hidden';


    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.productService.getAllPatients().subscribe(
      response=>{
        this.patients = response;
        $(document).ready(function () {
          // Setup - add a text input to each footer cell
          $('#recordsTable tfoot th').each(function () {
              var title = $(this).text();
              if(title != "Passport")
              if(title != "Note")
              if(title != "Action")
              $(this).html('<input type="text" id="Search ' + title + '"  placeholder="Search ' + title + '" class="col-12" />');
          });

          // DataTable
          var table = $('#recordsTable').DataTable({
            "autoWidth":false,
            'columnDefs': [{
              "targets": [2,11,14],
              "orderable": false
          }],
              initComplete: function () {
                  // Apply the search
                  this.api()
                      .columns()
                      .every(function () {
                          var that = this;

                          $('input', this.footer()).on('keyup change clear', function () {
                            let x = document.getElementById(""+$(this).attr("placeholder")) as HTMLInputElement

                              if (that.search() !== x.value) {
                                  that.search(x.value).draw();
                              }
                          });
                      });
              },
          });
      });
      table.style.visibility = 'visible';
      loading.style.visibility = 'hidden';
      });

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
