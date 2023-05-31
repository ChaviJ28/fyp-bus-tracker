import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
  @ViewChild('tab', { static: true }) tabElementRef!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    const tabs = this.tabElementRef.nativeElement.querySelectorAll('.tab');
    tabs.forEach((clickedTab: Element) => {
      this.renderer.listen(clickedTab, 'click', () => {
        tabs.forEach((tab: any) => {
          this.renderer.removeClass(tab, 'active');
        });
        this.renderer.addClass(clickedTab, 'active');
        // const clickedTabBGColor = getComputedStyle(clickedTab).getPropertyValue('color');
        // this.renderer.setStyle(document.body, 'background', clickedTabBGColor);
      });
    });
  }
}
