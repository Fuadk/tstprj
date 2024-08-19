import { Directive, OnInit, OnDestroy } from '@angular/core';
import { DataBindingDirective, GridComponent } from '@progress/kendo-angular-grid';
import { starServices } from 'starlib';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[ordersBinding]'
})
export class OrdersBindingDirective extends DataBindingDirective implements OnInit, OnDestroy {
    private serviceSubscription: Subscription;

    constructor(public starServices: starServices, grid: GridComponent) {
        super(grid);
    }

       public ngAfterViewInit() {
    this.starServices.setRTL();
   }
  public ngOnInit(): void {
        this.serviceSubscription = this.starServices.subscribe((result) => {
            //let RetData = JSON.parse(JSON.stringify(result))
            /*if (result != null)
            {
                //if (this.paramConfig.DEBUG_FLAG) console.log (JSON.stringify(result.data[0].data));
                //result = {data: result.data[0].data};
                result = {data: result.data[0].data,
                total: parseInt(result.data[0].data.length, 10)}
                if (this.paramConfig.DEBUG_FLAG) console.log (JSON.stringify(result));
            }
            //if (this.paramConfig.DEBUG_FLAG) console.log (result);*/
            this.grid.loading = false;
            this.grid.data = result;
            this.notifyDataChange();
            
        });

        super.ngOnInit();

        this.rebind();
    }

    public ngOnDestroy(): void {
        if (this.serviceSubscription) {
            this.serviceSubscription.unsubscribe();
        }

        super.ngOnDestroy();
    }

    public rebind(): void {
        //this.grid.loading = true;

        this.starServices.query(this.state);
    }
}
