import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;
  constructor(private elRef: ElementRef) { }
  // @HostListener('click') toggleOpen(){
  //   this.isOpen = !this.isOpen;
  // }
  
  // to change flag isOpen when click anywhere on screen
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
   // console.log(event);
   // console.log(event.target);
   // console.log(this.elRef.nativeElement.contains(event.target));
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? true : false;
  }

}
