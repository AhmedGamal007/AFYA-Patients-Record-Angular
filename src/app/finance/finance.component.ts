import { Component, OnInit } from '@angular/core';
import { Patient } from '../model/patient';
import { ProductService } from '../service/patient.service';
import { Router } from '@angular/router';
import { FinanceService } from '../service/finance.service';
import { Finance } from '../model/finance';

@Component({
  selector: 'app-finance',
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit{
  finances:Finance[] = [];
  yearsFound:number[];
  dateFilter:string[]= [];
  totalAmount;
  paidAmount;
  leftAmount;
  constructor(private financeService:FinanceService,private router:Router){

  }
  ngOnInit(): void {
    let table = document.getElementById('recordsTable');
    let loading = document.getElementById('loading');
    let stats = document.getElementById('stats');
    loading.style.visibility = 'visible';
    table.style.visibility = 'hidden';
    stats.style.visibility = 'hidden';
    this.financeService.getYears().subscribe(
      response=>{
        this.yearsFound = response;
        this.yearsFound.shift();
        console.log(this.yearsFound);
      }
    )
    this.financeService.getStatistics().subscribe(
      response=>{
        this.totalAmount=response.total;
        this.paidAmount = response.paid;
        this.leftAmount = response.left;
        console.log(response)
      }
    )

    this.financeService.getAllFinance().subscribe(
      response=>{
        console.log(response);
        this.finances = response;
        $(document).ready(function () {
          // Setup - add a text input to each footer cell
          $('#recordsTable tfoot th').each(function () {
              var title = $(this).text();
              if(title != "Action")
              if(title != "Total Money")
              if(title != "Paid")
              if(title != "Left")
              $(this).html('<input type="text" id="Search ' + title + '"  placeholder="Search ' + title + '" class="col-12" />');
          });

          // DataTable
          var table = $('#recordsTable').DataTable({
            "autoWidth":false,
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
      stats.style.visibility = 'visible';
      });
  }
  // finance
  totalChange(id){
    document.getElementById(id+"button").removeAttribute("disabled");
    let total = document.getElementById(id+"total") as HTMLInputElement;
    let paid = document.getElementById(id+"paid") as HTMLInputElement;
    let left = document.getElementById(id+"left") as HTMLInputElement;
    if(paid.value.length == 0) paid.valueAsNumber = 0;
    if(left.value.length == 0) left.valueAsNumber = 0;
    left.valueAsNumber = total.valueAsNumber - paid.valueAsNumber;

  }
  paidChange(id){
    document.getElementById(id+"button").removeAttribute("disabled");
    let total = document.getElementById(id+"total") as HTMLInputElement;
    let paid = document.getElementById(id+"paid") as HTMLInputElement;
    let left = document.getElementById(id+"left") as HTMLInputElement;
    if(total.value.length == 0) total.valueAsNumber = 0;
    if(left.value.length == 0) left.valueAsNumber = 0;
    left.valueAsNumber = total.valueAsNumber - paid.valueAsNumber;
  }
  leftChange(id){
    document.getElementById(id+"button").removeAttribute("disabled");
    let total = document.getElementById(id+"total") as HTMLInputElement;
    let paid = document.getElementById(id+"paid") as HTMLInputElement;
    let left = document.getElementById(id+"left") as HTMLInputElement;
  }
  saveFinance(finance:Finance){
    let total = document.getElementById(finance.financeId+"total") as HTMLInputElement;
    let paid = document.getElementById(finance.financeId+"paid") as HTMLInputElement;
    let left = document.getElementById(finance.financeId+"left") as HTMLInputElement;
    if(total.valueAsNumber != (paid.valueAsNumber + left.valueAsNumber)) return;
    finance.total = total.valueAsNumber;
    finance.paid = paid.valueAsNumber;
    finance.left = left.valueAsNumber;
    this.financeService.saveFinance(finance).subscribe((response)=>{
      console.log(response);
      document.getElementById(finance.financeId+"button").setAttribute("disabled","true");
      this.financeService.getStatistics().subscribe(
        response=>{
          this.totalAmount=response.total;
          this.paidAmount = response.paid;
          this.leftAmount = response.left;
          console.log(response)
        }
      )
    });
  }
  filterDate(){
    if((<HTMLInputElement> document.getElementById('filterYear')).value.length == 0)
    {
      this.dateFilter[0]=null;
    }
    else{
      this.dateFilter[0]=(<HTMLInputElement> document.getElementById('filterYear')).value
    }
    if((<HTMLInputElement> document.getElementById('filterMonth')).value.length == 0)
    {
      this.dateFilter[1]=null;
    }
    else{
      this.dateFilter[1]=(<HTMLInputElement> document.getElementById('filterMonth')).value
    }
    this.financeService.getFilteredStats(this.dateFilter).subscribe(response=>{
      this.totalAmount=response.total;
      this.paidAmount = response.paid;
      this.leftAmount = response.left;
      console.log(response);
    })
  }
}
