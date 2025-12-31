import { MatPaginatorIntl } from '@angular/material/paginator';

const customRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 de ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  // Si se supera el número total de elementos, se usa el total
  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} de ${length}`;
};

export function CustomPaginatorIntl(itemsPerPageLabel: string) {
  const paginatorIntl = new MatPaginatorIntl();

  // 1. Etiqueta para la selección de tamaño de página
  paginatorIntl.itemsPerPageLabel = itemsPerPageLabel;

  // 2. Tooltip y etiqueta de botón 'Página Anterior'
  paginatorIntl.previousPageLabel = 'Anterior';

  // 3. Tooltip y etiqueta de botón 'Página Siguiente'
  paginatorIntl.nextPageLabel = 'Siguiente';

  // 4. Etiqueta del rango (ej. 1 - 5 de 100)
  paginatorIntl.getRangeLabel = customRangeLabel;

  return paginatorIntl;
}
