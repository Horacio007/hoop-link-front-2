export function removeClass(name:string) {
  const pasados = document.getElementsByClassName(name);
  if (pasados.length > 0) {
    for (let index = 0; index < pasados.length; index++) {
      pasados[index].classList.remove(name);
    }
  }
}
