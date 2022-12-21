import { UIFeedbackService } from "./../../services/uifeedback.service"
import { OperationService } from "./../../operation.service"
import {
  Component,
  ElementRef,
  OnChanges,
  Renderer2,
  ViewChild,
} from "@angular/core"
import { Operation } from "src/app/models/operation.model"
import { Observable } from "rxjs"

@Component({
  selector: "app-operations-table",
  templateUrl: "./operations-table.component.html",
  styles: ["ul::-webkit-scrollbar{display: none;}"],
  providers: [OperationService],
})
export class OperationsTableComponent implements OnChanges {
  operations$: Observable<Operation[]> = this.operationService.findAll()

  showAddForm = false

  @ViewChild("addOperationButton") button!: ElementRef
  @ViewChild("operationsUl") operationsUl!: ElementRef

  constructor(
    private operationService: OperationService,
    private renderer: Renderer2
  ) {}

  ngOnChanges(): void {}

  setFeedback(loading: boolean) {
    let btn = this.button.nativeElement as HTMLElement

    if (loading) {
      this.renderer.setAttribute(btn, "disabled", "")
    } else {
      this.renderer.removeAttribute(btn, "disabled", "")
    }
  }

  // it hides|shows all other app-operation that are not in focus.
  toggleDetail(show: boolean, id: number) {
    let displayProp = show ? "none" : "flex"

    let allOperations = document.querySelectorAll("app-operation")

    allOperations.forEach((op) => {
      // if the id is different from the parameter id, put display none|block
      if (Number(op.getAttribute("id")) != id) {
        let _op = op as HTMLElement
        _op.style.display = displayProp
      }
    })

    show
      ? this.renderer.addClass(this.operationsUl.nativeElement, "h-full")
      : this.renderer.removeClass(this.operationsUl.nativeElement, "h-full")
  }

  toggleAddOperationView() {
    if (!this.showAddForm) {
      document.getElementById("endDarkGradient")!.style.display = "none"
      document.getElementById("operationsTable")!.style.display = "none"

      document.getElementById(
        "addOperationButton"
      )!.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`

      this.showAddForm = true
    } else {
      this.operations$ = this.operationService.findAll()

      document.getElementById("endDarkGradient")!.style.display = "initial"
      document.getElementById("operationsTable")!.style.display = "initial"

      document.getElementById(
        "addOperationButton"
      )!.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" /></svg>`

      this.showAddForm = false
    }
  }
}
