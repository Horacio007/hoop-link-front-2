export const CatalogoConstants = {
  CARGANDO_CATALOGO_INDIVIDUAL: (catalogo:string) => `Cargando catálogo de ${catalogo}...`,
  CARGANDO_CATALOGO_MULTIPLE: (catalogo:string, cargado:number, total:number) => `Cargando catálogo de ${catalogo}... (${cargado} de ${total})`,
}
