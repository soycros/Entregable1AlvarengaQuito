// Array para guardar tareas
let tareas = [];

// Función para agregar una nueva tarea
function agregarTarea() {
  const tarea = prompt("Escribí una nueva tarea:");
  if (tarea) {
    tareas.push({ texto: tarea, completada: false });
    alert(`Tarea agregada:\n"${tarea}"`);
  } else {
    alert("No se ingresó ninguna tarea.");
  }
}

// Función para mostrar tareas
function mostrarTareas() {
  if (tareas.length === 0) {
    alert("No hay tareas por mostrar.");
    return;
  }

  let lista = "TUS TAREAS:\n";
  tareas.forEach((t, i) => {
    lista += `${i + 1}. ${t.texto} [${t.completada ? "✓" : "X"}]\n`;
  });

  alert(lista);
}

// Función para marcar tarea como completada
function completarTarea() {
  mostrarTareas();
  const indice = parseInt(prompt("¿Qué número de tarea querés marcar como completada?"));

  if (!isNaN(indice) && tareas[indice - 1]) {
    tareas[indice - 1].completada = true;
    alert(`Tarea "${tareas[indice - 1].texto}" marcada como completada.`);
  } else {
    alert("Número inválido.");
  }
}

// Menú principal con ciclo
function iniciarSimulador() {
  let seguir = true;

  while (seguir) {
    const opcion = prompt(
      "¿Qué querés hacer?\n1. Agregar tarea\n2. Ver tareas\n3. Completar tarea\n4. Salir"
    );

    switch (opcion) {
      case "1":
        agregarTarea();
        break;
      case "2":
        mostrarTareas();
        break;
      case "3":
        completarTarea();
        break;
      case "4":
        seguir = false;
        alert("¡Hasta la proxima!");
        break;
      default:
        alert("Opción no válida.");
    }

    if (seguir) {
      seguir = confirm("¿Queres hacer otra acción?");
    }
  }
}

// Iniciar el simulador (ejecución automática al abrir consola)
iniciarSimulador();
