class Tarea {
  constructor(texto) {
    this.id = Date.now();
    this.texto = texto;
    this.completada = false;
  }

  toggleCompletado() {
    this.completada = !this.completada;
  }
}

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

const form = document.getElementById("formTarea");
const input = document.getElementById("inputTarea");
const lista = document.getElementById("listaTareas");
const btnVaciar = document.getElementById("vaciar");

function guardarEnStorage() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function renderizarTareas() {
  lista.innerHTML = "";

  if (tareas.length === 0) {
    lista.innerHTML = "<li>No hay tareas por el momento.</li>";
    return;
  }

  tareas.forEach((tarea) => {
    const li = document.createElement("li");
    li.className = tarea.completada ? "completada" : "";
    li.innerHTML = `
      ${tarea.texto}
      <button onclick="marcarCompletada(${tarea.id})">✓</button>
    `;
    lista.appendChild(li);
  });
}

function agregarTarea(texto) {
  if (!texto.trim()) {
    alert("Por favor escribí una tarea válida.");
    return;
  }
  const nueva = new Tarea(texto.trim());
  tareas.push(nueva);
  guardarEnStorage();
  renderizarTareas();
}

function marcarCompletada(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (tarea) tarea.toggleCompletado();
  guardarEnStorage();
  renderizarTareas();
}

function vaciarLista() {
  if (confirm("¿Estás seguro de que querés vaciar la lista?")) {
    tareas = [];
    guardarEnStorage();
    renderizarTareas();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  agregarTarea(input.value);
  input.value = "";
});

btnVaciar.addEventListener("click", vaciarLista);

// Mostrar tareas al cargar
renderizarTareas();
