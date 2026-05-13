import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastComponent } from '../toast/toast.component';
import { Toast, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="toast-container">
      <app-toast
        *ngFor="let toast of toasts"
        [toast]="toast">
      </app-toast>
    </div>
  `,
  styleUrls: ['./toast-container.component.css']
})
export class ToastContainerComponent {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.getToasts().subscribe(t => this.toasts = t);
  }
}
