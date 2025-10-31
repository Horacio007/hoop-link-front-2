import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Importaciones de Ionic
import { IonHeader, IonToolbar, IonButtons, IonButton, IonSearchbar, IonList, IonContent, IonItem, IonTitle } from '@ionic/angular/standalone';
import { ICatalogo } from 'src/app/shared/interfaces/catalogo/catalogo.interface';

@Component({
  selector: 'app-select-list-search',
  templateUrl: './select-list-search.component.html',
  styleUrls: ['./select-list-search.component.scss'], // ¡Necesitarás actualizar el CSS!
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonList,
    IonSearchbar,
    IonTitle,
    IonToolbar,
  ],
})
export class SelectListSearchComponent implements OnInit {

  @Input() items: ICatalogo[] = [];
  // 🛑 CAMBIO CLAVE 1: selectedItem ahora es un string (ID de la selección única)
  @Input() selectedItem: string | undefined;
  @Input() title = 'Select Item';

  @Output() selectionCancel = new EventEmitter<void>();
  // 🛑 CAMBIO CLAVE 2: Emitir un solo string
  @Output() selectionChange = new EventEmitter<string | undefined>();

  filteredItems: ICatalogo[] = [];
  // 🛑 CAMBIO CLAVE 3: Almacenar el valor seleccionado de trabajo
  workingSelectedValue: string | undefined;

  ngOnInit() {
    this.filteredItems = [...this.items];
    this.workingSelectedValue = this.selectedItem;
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    // 🛑 Emitir el valor único
    this.selectionChange.emit(this.workingSelectedValue);
    // this.selectionCancel.emit();
  }

  searchbarInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.filterList(inputElement.value);
  }

  filterList(searchQuery: string | undefined) {
    if (searchQuery === undefined || searchQuery.trim() === '') {
      this.filteredItems = [...this.items];
    } else {
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((item) => item.nombre.toLowerCase().includes(normalizedQuery));
    }
  }

  // 🛑 CAMBIO CLAVE 4: Función para determinar si el ítem está seleccionado
  isSelected(itemId: string): boolean {
    return this.workingSelectedValue === itemId;
  }

  // 🛑 CAMBIO CLAVE 5: Función que maneja la selección al hacer clic en el ítem
  selectItem(itemId: string) {
    // Si el ítem ya estaba seleccionado, lo deseleccionamos (opcional, pero útil)
    if (this.workingSelectedValue === itemId) {
      this.workingSelectedValue = undefined;
    } else {
      // Si es un ítem nuevo, lo seleccionamos
      this.workingSelectedValue = itemId;
    }
  }
}
