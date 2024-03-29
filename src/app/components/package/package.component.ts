import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  ViewChild,
  Renderer2,
  OnChanges,
} from "@angular/core"
import { Package } from "src/app/models/package.model"
import {
  ColorGeneratorService,
  ColorPalette,
} from "src/app/services/color-generator.service"

@Component({
  selector: "app-package",
  providers: [ColorGeneratorService],
  styles: ["* { transition: all .5s }"],
  template: `
    <div class="flex flex-col justify-center items-center">
      <div
        #h1wrapper
        [class.-mb-6]="!minify"
        class="w-12 h-12 relative z-10 flex justify-center items-center text-3xl rounded-md shadow-lg"
      >
        <h1 #h1>🧳</h1>
      </div>
      <ul
        #ul
        *ngIf="!minify"
        class="relative z-0 rounded-md pt-7 pb-1 px-2 text-center w-32 h-auto shadow-lg font-medium"
      >
        <li class="flex justify-between">
          <span>💵</span
          ><span class="flex items-center text-black text-sm">{{
            pkg.billType | currency : "BRL"
          }}</span>
        </li>
        <li class="flex justify-between">
          <span>🔢</span
          ><span class="flex items-center text-black text-sm">{{
            pkg.billQuantity
          }}</span>
        </li>
        <li class="flex justify-between">
          <span class="pl-[0.1rem]">💰</span
          ><span class="flex items-center text-black text-sm">{{
            pkg.billQuantity * pkg.billType | currency : "BRL"
          }}</span>
        </li>
      </ul>
    </div>
  `,
})
export class PackageComponent implements AfterViewInit, OnChanges {
  @ViewChild("ul") ul!: ElementRef
  @ViewChild("h1") h1!: ElementRef
  @ViewChild("h1wrapper") h1wrapper!: ElementRef
  @Input("package") pkg!: Package
  @Input() minify: boolean = true

  palette!: ColorPalette

  iconFilter!: string

  constructor(private renderer: Renderer2, private cg: ColorGeneratorService) {}

  ngOnChanges(): void {
    this.palette = this.cg.generateColorPalette(this.pkg.color)
    this.iconFilter = this.cg.correctIconColor(this.pkg.color)
    this.ngAfterViewInit()
  }

  ngAfterViewInit(): void {
    // add random background color
    try {
      if (!this.minify) {
        this.renderer.setStyle(
          this.ul.nativeElement,
          "background-color",
          this.palette[200]
        )
      }
      this.renderer.setStyle(
        this.h1wrapper.nativeElement,
        "background-color",
        this.palette[500]
      )
      this.renderer.setStyle(this.h1.nativeElement, "filter", this.iconFilter)
    } catch {}
  }
}
