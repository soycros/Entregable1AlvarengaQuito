class Tarea {
  constructor(texto) {
    this.id = Date.now();
    this.texto = texto;
    this.completada = false;
  }

  toggle() {
    this.completada = !this.completada;
  }
}

// Obtener del storage si existe
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

const form = document.getElementById("formTarea");
const input = document.getElementById("inputTarea");
const lista = document.getElementById("listaTareas");
const btnVaciar = document.getElementById("vaciar");
const btnCargarApi = document.getElementById("cargarDesdeApi");

function guardarEnStorage() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function mostrarToast(texto, color = "#198754") {
  Toastify({
    text: texto,
    duration: 2500,
    gravity: "top",
    position: "center",
    style: {
      background: color,
    }
  }).showToast();
}

function renderizarTareas() {
  lista.innerHTML = "";
  if (tareas.length === 0) {
    lista.innerHTML = "<li>No hay tareas por ahora 😴</li>";
    return;
  }

  tareas.forEach(t => {
    const li = document.createElement("li");
    li.className = t.completada ? "completada" : "";
    li.innerHTML = `
      ${t.texto}
      <button onclick="marcar(${t.id})">✓</button>
    `;
    lista.appendChild(li);
  });
}

function agregarTarea(texto) {
  if (!texto.trim()) {
    mostrarToast("La tarea no puede estar vacía", "#dc3545");
    return;
  }

  const nueva = new Tarea(texto.trim());
  tareas.push(nueva);
  guardarEnStorage();
  renderizarTareas();
  mostrarToast("Tarea agregada con éxito");
}

function marcar(id) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.toggle();
    guardarEnStorage();
    renderizarTareas();
    mostrarToast("Tarea actualizada 👍");
  }
}

function vaciarTareas() {
  Swal.fire({
    title: '¿Vaciar toda la lista?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Vaciar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      tareas = [];
      guardarEnStorage();
      renderizarTareas();
      mostrarToast("Lista vaciada 🗑️", "#ffc107");
    }
  });
}

async function cargarDesdeAPI() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=3");
    const data = await res.json();
    data.forEach(t => tareas.push(new Tarea(t.title)));
    guardarEnStorage();
    renderizarTareas();
    mostrarToast("Tareas cargadas desde API 🌐");
  } catch (err) {
    console.error(err);
    Swal.fire("Error", "No se pudo cargar la API 😢", "error");
  }
}

// Eventos
form.addEventListener("submit", (e) => {
  e.preventDefault();
  agregarTarea(input.value);
  input.value = "";
});

btnVaciar.addEventListener("click", vaciarTareas);
btnCargarApi.addEventListener("click", cargarDesdeAPI);

// Inicialización
renderizarTareas();
