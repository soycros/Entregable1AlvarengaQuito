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

let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

const form = document.getElementById("formTarea");
const input = document.getElementById("inputTarea");
const lista = document.getElementById("listaTareas");
const btnVaciar = document.getElementById("vaciar");
const btnCargarApi = document.getElementById("cargarDesdeApi");

function guardarEnStorage() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

function mostrarToast(texto, color = "#38bdf8") {
  Toastify({
    text: texto,
    duration: 3000,
    gravity: "top",
    position: "center",
    style: {
      background: color,
      borderRadius: "12px",
      fontWeight: "600"
    }
  }).showToast();
}

function revisarPodio() {
  return new Promise((resolve, reject) => {
    const completas = tareas.filter(t => t.completada).length;
    if (completas !== tareas.length || tareas.length === 0) {
      return reject("Todavía hay tareas pendientes 🕓");
    }
    setTimeout(() => {
      resolve("🏆 ¡Felicitaciones! Completaste todas tus tareas 🎯");
    }, 1000);
  });
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

  // ⚡ Verificar podio al actualizar lista
  revisarPodio()
    .then(msg => mostrarToast(msg, "#22c55e"))
    .catch(() => {}); // No mostramos nada si hay pendientes
}

function agregarTarea(texto) {
  if (!texto.trim()) {
    mostrarToast("La tarea no puede estar vacía", "#ef4444");
    return;
  }

  const nueva = new Tarea(texto.trim());
  tareas.push(nueva);
  guardarEnStorage();
  renderizarTareas();
  mostrarToast("Tarea agregada con éxito ✅", "#22c55e");
}

function marcar(id) {
  const tarea = tareas.find(t => t.id === id);
  if (tarea) {
    tarea.toggle();
    guardarEnStorage();
    renderizarTareas();
    mostrarToast("Tarea actualizada 👍", "#0ea5e9");
  }
}

function vaciarTareas() {
  Swal.fire({
    title: '¿Vaciar toda la lista?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, vaciar',
    cancelButtonText: 'Cancelar',
    background: "#1e293b",
    color: "#f1f5f9"
  }).then((result) => {
    if (result.isConfirmed) {
      tareas = [];
      guardarEnStorage();
      renderizarTareas();
      mostrarToast("Lista vaciada 🗑️", "#f59e0b");
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
    Swal.fire({
      title: "Error",
      text: "No se pudo cargar la API 😢",
      icon: "error",
      background: "#1e293b",
      color: "#f1f5f9"
    });
  }
}

// 🎯 Eventos
form.addEventListener("submit", (e) => {
  e.preventDefault();
  agregarTarea(input.value);
  input.value = "";
});

btnVaciar.addEventListener("click", vaciarTareas);
btnCargarApi.addEventListener("click", cargarDesdeAPI);

// 🧠 Iniciar app
renderizarTareas();
