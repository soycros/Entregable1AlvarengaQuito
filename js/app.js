let tareas = JSON.parse(localStorage.getItem("tareas")) || []
let apiCargada = false
let jsonCargado = false

const form = document.getElementById("formTarea")
const inputTexto = document.getElementById("inputTarea")
const inputDescripcion = document.getElementById("inputDescripcion")
const selectCategoria = document.getElementById("selectCategoria")
const selectPrioridad = document.getElementById("selectPrioridad")
const inputFecha = document.getElementById("inputFecha")
const contenedorLista = document.getElementById("listaTareas")
const btnVaciar = document.getElementById("vaciar")
const btnCargarApi = document.getElementById("cargarDesdeApi")
const btnCargarLocal = document.getElementById("cargarDesdeJSON")

function renderizarTareas() {
  contenedorLista.innerHTML = ""

  if (tareas.length === 0) {
    contenedorLista.innerHTML = "<li>No hay tareas por ahora 😴</li>"
    return
  }

  tareas.forEach(tarea => {
    const item = document.createElement("li")
    item.className = tarea.completada ? "completada tarea-completada" : ""
    item.setAttribute("data-id", tarea.id)

    item.innerHTML = `
      <div class="info-tarea">
        <strong>${tarea.texto}</strong>
        <p>${tarea.descripcion || ""}</p>
        <span class="categoria">Categoría: ${tarea.categoria}</span>
        <span class="prioridad">Prioridad: ${tarea.prioridad}</span>
        ${tarea.fechaVencimiento ? `<span class="fecha">Vence: ${tarea.fechaVencimiento}</span>` : ""}
      </div>
      <div class="acciones-tarea">
        <button data-id="${tarea.id}" class="btn-marcar">✓</button>
        <button data-id="${tarea.id}" class="btn-editar">✏️</button>
        <button data-id="${tarea.id}" class="btn-borrar">🗑️</button>
      </div>
    `
    contenedorLista.appendChild(item)
  })

  document.querySelectorAll(".btn-marcar").forEach(boton =>
    boton.addEventListener("click", () => {
      const id = parseInt(boton.dataset.id)
      marcarTarea(id)
    })
  )

  document.querySelectorAll(".btn-borrar").forEach(boton =>
    boton.addEventListener("click", () => {
      const id = parseInt(boton.dataset.id)
      tareas = tareas.filter(t => t.id !== id)
      guardarEnStorage(tareas)
      renderizarTareas()
      mostrarToast("Tarea eliminada 🗑️", "#f87171")
    })
  )

  document.querySelectorAll(".btn-editar").forEach(boton =>
    boton.addEventListener("click", async () => {
      const id = parseInt(boton.dataset.id)
      const tareaSeleccionada = tareas.find(t => t.id === id)
      if (!tareaSeleccionada) return

      const { value: nuevoTexto } = await Swal.fire({
        title: "Editar tarea",
        input: "text",
        inputValue: tareaSeleccionada.texto,
        background: "#1e293b",
        color: "#f1f5f9",
        showCancelButton: true
      })

      if (nuevoTexto && nuevoTexto.trim() !== "") {
        tareaSeleccionada.texto = nuevoTexto.trim()
        guardarEnStorage(tareas)
        renderizarTareas()
        mostrarToast("Tarea editada ✏️", "#4ade80")
      }
    })
  )

  revisarPodio(tareas)
    .then(msg => mostrarToast(msg, "#22c55e"))
    .catch(() => {})
}

function agregarTarea(texto, descripcion, categoria, prioridad, fechaVencimiento) {
  const camposFaltantes = []
  if (!texto.trim()) camposFaltantes.push("el texto")
  if (!categoria) camposFaltantes.push("la categoría")
  if (!prioridad) camposFaltantes.push("la prioridad")

  if (camposFaltantes.length > 0) {
    Swal.fire({
      icon: "warning",
      title: "Falta completar",
      text: `Completá ${camposFaltantes.join(", ")} antes de agregar la tarea.`,
      background: "#1e293b",
      color: "#f1f5f9"
    })
    return
  }

  const tareaDuplicada = tareas.some(t => t.texto === texto.trim())
  if (tareaDuplicada) {
    Swal.fire("Ya existe una tarea con ese título.")
    return
  }

  const nuevaTarea = new Tarea(texto.trim(), categoria, prioridad, fechaVencimiento || null)
  nuevaTarea.descripcion = descripcion.trim() || ""
  tareas.push(nuevaTarea)
  guardarEnStorage(tareas)
  renderizarTareas()
  mostrarToast("Tarea agregada ✅", "#22c55e")
}

function marcarTarea(id) {
  const tarea = tareas.find(t => t.id === id)
  if (tarea) {
    tarea.toggle()
    guardarEnStorage(tareas)
    renderizarTareas()
    mostrarToast("Tarea actualizada", "#0ea5e9")

    const tareaDiv = document.querySelector(`[data-id='${id}']`)
    tareaDiv.classList.toggle("tarea-completada", tarea.completada)
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
  }).then((resultado) => {
    if (resultado.isConfirmed) {
      tareas = []
      guardarEnStorage(tareas)
      renderizarTareas()
      mostrarToast("Lista vaciada 🧹", "#f59e0b")
    }
  })
}

async function cargarDesdeAPI() {
  if (apiCargada) {
    mostrarToast("Las tareas ya fueron cargadas desde la API 🔁", "#f87171")
    return
  }

  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
    const datos = await respuesta.json()
    datos.forEach(t => tareas.push(new Tarea(t.title)))
    apiCargada = true
    guardarEnStorage(tareas)
    renderizarTareas()
    mostrarToast("Tareas cargadas desde API ✅")
  } catch (error) {
    Swal.fire({
      title: "Error",
      text: "No se pudo cargar la API",
      icon: "error",
      background: "#1e293b",
      color: "#f1f5f9"
    })
  }
}


async function cargarDesdeJSON() {
  if (jsonCargado) {
    mostrarToast("Las tareas ya fueron cargadas desde JSON 📄", "#f87171")
    return
  }

  try {
    const respuesta = await fetch("./data/tareas.json")
    const datos = await respuesta.json()
    datos.forEach(t =>
      tareas.push(new Tarea(t.texto, t.categoria, t.prioridad, t.fechaVencimiento))
    )
    jsonCargado = true
    guardarEnStorage(tareas)
    renderizarTareas()
    mostrarToast("Tareas cargadas desde JSON ✅")
  } catch (error) {
    mostrarToast("Error al cargar JSON ❌", "#ef4444")
  }
}


flatpickr("#inputFecha", {
  dateFormat: "Y-m-d",
  minDate: "today"
})

form.addEventListener("submit", (evento) => {
  evento.preventDefault()

  const texto = inputTexto.value
  const descripcion = inputDescripcion.value
  const categoria = selectCategoria.value
  const prioridad = selectPrioridad.value
  const fecha = inputFecha.value

  agregarTarea(texto, descripcion, categoria, prioridad, fecha)

  inputTexto.value = ""
  inputDescripcion.value = ""
  inputFecha.value = ""
  selectCategoria.selectedIndex = 0
  selectPrioridad.selectedIndex = 0
})

btnVaciar.addEventListener("click", vaciarTareas)
btnCargarApi.addEventListener("click", cargarDesdeAPI)
btnCargarLocal.addEventListener("click", cargarDesdeJSON)

renderizarTareas()
