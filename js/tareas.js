class Tarea {
  constructor(texto, categoria = "General", prioridad = "Media", fechaVencimiento = null) {
    this.id = Date.now() + Math.floor(Math.random() * 1000)
    this.texto = texto
    this.categoria = categoria
    this.prioridad = prioridad
    this.fechaVencimiento = fechaVencimiento
    this.completada = false
  }

  toggle() {
    this.completada = !this.completada
  }
}

function guardarEnStorage(tareas) {
  localStorage.setItem("tareas", JSON.stringify(tareas))
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
  }).showToast()
}

function revisarPodio(tareas) {
  return new Promise((resolve, reject) => {
    const completas = tareas.filter(t => t.completada).length
    if (completas !== tareas.length || tareas.length === 0) return reject()
    setTimeout(() => resolve("¡Felicitaciones! Completaste todas tus tareas 🏆"), 800)
  })
}
