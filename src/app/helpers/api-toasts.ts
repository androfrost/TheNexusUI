import { catchError, Observable, tap, throwError } from "rxjs";
import { ToastService } from "../services/toast.service";

export class ApiToasts {
  static toastService: ToastService;
  
  constructor(private toastService: ToastService) {}

  public mapTest<T extends Record<string, any>>(
    addT: Observable<T>,
    tableIdName: string,
    tableName: string,
    title: string
  ): Observable<T> {
    return addT.pipe(
      tap(result => {
        if (result && result[tableIdName] > 0) {
          this.toastService.zoneRun(`Added ${tableName} ${title} successfully`, "success");
        } else {
          this.toastService.zoneRun(`Failed to add ${tableName}`, "error");
        }
      }),
      catchError(error => {
        this.toastService.zoneRun(`Failed to add ${tableName}`, "error");
        return throwError(() => error);
      })
    );
  }
}