import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent implements OnInit {
  @Input() title: string = "";
  @Input() message: string = "";
  @Input() popupType: string = "";
  @Output() inputValueChange = new EventEmitter<string>();
  @Output() passwordValueChange = new EventEmitter<string>();
  @Output() hasReturnValues = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  isArduous: boolean = false;   // If true, clicking outside the modal will not close it

  sendButtonVisible: boolean = false;
  @Input() sendButtonText: string = "Send";

  closeButtonVisible: boolean = false;
  @Input() closeButtonText: string = "Close";

  inputVisible: boolean = false;
  @Input() inputLabel: string = "Input:";
  inputText: string = "Enter text here";
  inputValue: string = "";

  passwordVisible: boolean = false;
  @Input() passwordLabel: string = "Password:";
  passwordText: string = "Enter password here";
  passwordValue: string = "";

  ngOnInit(): void {
    switch (this.popupType) {
      case 'info':
        this.closeButtonVisible = true;
        break;
      case 'yesno':
        this.sendButtonText = "Yes";
        this.sendButtonVisible = true;
        this.closeButtonText = "No";
        this.closeButtonVisible = true;
        break;
      case 'input':
        this.inputVisible = true;
        this.sendButtonVisible = true;
        this.closeButtonVisible = true;
        break;
      case 'password':
        this.inputVisible = true;
        this.passwordVisible = true;
        this.sendButtonVisible = true;
        this.closeButtonVisible = true;
        this.isArduous = true;
        break;

    }
    
    
    // Get modal element
    const modal = document.getElementById('myModal') as HTMLElement;
    const btn = document.getElementById('openModalBtn') as HTMLElement;

    // Show modal when button is clicked
    if (btn) {
      btn.onclick = () => {
        if (modal) {
          modal.style.display = 'block';
        }
      };
    }

    // Close modal when clicking outside modal content
    window.onclick = (event) => {
      if (event.target === modal && !this.isArduous) {
        if (modal) {
          modal.style.display = 'none';
        }
        this.closed.emit();
      }
    };
  }

  returnValues(): void {
    var hasReturnValues = false;
    if (this.inputVisible){
      this.inputValueChange.emit(this.inputValue);
      hasReturnValues = true;
    }
    if (this.passwordVisible){
      this.passwordValueChange.emit(this.passwordValue);
      hasReturnValues = true;
    }

    if (hasReturnValues) {
      this.hasReturnValues.emit(hasReturnValues)
    }

    this.closeModal();
  }

  closeModal(): void {
    const modal = document.getElementById('myModal') as HTMLElement;
    if (modal) {
      modal.style.display = 'none';
    }
    this.closed.emit();
  }

  isSendButtonVisible(): boolean {
    return this.sendButtonVisible;
  }

  isCloseButtonVisible(): boolean {
    return this.closeButtonVisible;
  }

  isInputVisible(): boolean {
    return this.inputVisible;
  }

  isPasswordVisible(): boolean {
    return this.passwordVisible;
  }
}
