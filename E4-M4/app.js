/*
  Simulación de Funciones de API
  Estas funciones simulan llamadas a una red. No las modifiques.
*/

// API para obtener datos de un usuario
const obtenerUsuario = (id, callback) => {
  // Simula una demora aleatoria entre 0.5 y 1.5 segundos
  const demora = Math.random() * 1000 + 500;
  setTimeout(() => {
    // Simula un posible error
    if (!id) {
      callback("Error: ID de usuario no proporcionado.", null);
      return;
    }
    console.log(`Buscando usuario con ID: ${id}...`);
    const usuario = { id: id, nombre: "John Doe", email: "john.doe@example.com" };
    callback(null, usuario);
  }, demora);
};

// API para obtener los posts de un usuario
const obtenerPosts = (userId, callback) => {
  const demora = Math.random() * 1000 + 500;
  setTimeout(() => {
    if (!userId) {
      callback("Error: ID de usuario no proporcionado para buscar posts.", null);
      return;
    }
    console.log(`Buscando posts del usuario con ID: ${userId}...`);
    const posts = [
      { id: 101, titulo: "Mi primer post", contenido: "..." },
      { id: 102, titulo: "Mi segundo post", contenido: "..." },
    ];
    callback(null, posts);
  }, demora);
};

// API para obtener los comentarios de un post
const obtenerComentarios = (postId, callback) => {
  const demora = Math.random() * 1000 + 500;
  setTimeout(() => {
    if (!postId) {
      callback("Error: ID de post no proporcionado para buscar comentarios.", null);
      return;
    }
    console.log(`Buscando comentarios del post con ID: ${postId}...`);
    const comentarios = [
      { id: 1, texto: "¡Excelente post!" },
      { id: 2, texto: "Muy informativo, gracias." },
    ];
    callback(null, comentarios);
  }, demora);
};

// =====================================================
// Parte 1: Solución con Callbacks (Callback Hell)
// =====================================================
console.log("===== PARTE 1: CALLBACK HELL =====");

obtenerUsuario(1, (errorUsuario, usuario) => {
  if (errorUsuario) {
    console.error(errorUsuario);
    return;
  }

  obtenerPosts(usuario.id, (errorPosts, posts) => {
    if (errorPosts) {
      console.error(errorPosts);
      return;
    }

    obtenerComentarios(posts[0].id, (errorComentarios, comentarios) => {
      if (errorComentarios) {
        console.error(errorComentarios);
        return;
      }

      console.log("Comentarios obtenidos (Callbacks):", comentarios);
    });
  });
});

// =====================================================
// Parte 2: Refactorización a Promesas
// =====================================================

const obtenerUsuarioPromesa = (id) => {
  return new Promise((resolve, reject) => {
    const demora = Math.random() * 1000 + 500;
    setTimeout(() => {
      if (!id) {
        reject("Error: ID de usuario no proporcionado.");
        return;
      }
      console.log(`Buscando usuario con ID: ${id}...`);
      const usuario = { id: id, nombre: "John Doe", email: "john.doe@example.com" };
      resolve(usuario);
    }, demora);
  });
};

const obtenerPostsPromesa = (userId) => {
  return new Promise((resolve, reject) => {
    const demora = Math.random() * 1000 + 500;
    setTimeout(() => {
      if (!userId) {
        reject("Error: ID de usuario no proporcionado para buscar posts.");
        return;
      }
      console.log(`Buscando posts del usuario con ID: ${userId}...`);
      const posts = [
        { id: 101, titulo: "Mi primer post", contenido: "..." },
        { id: 102, titulo: "Mi segundo post", contenido: "..." },
      ];
      resolve(posts);
    }, demora);
  });
};

const obtenerComentariosPromesa = (postId) => {
  return new Promise((resolve, reject) => {
    const demora = Math.random() * 1000 + 500;
    setTimeout(() => {
      if (!postId) {
        reject("Error: ID de post no proporcionado para buscar comentarios.");
        return;
      }
      console.log(`Buscando comentarios del post con ID: ${postId}...`);
      const comentarios = [
        { id: 1, texto: "¡Excelente post!" },
        { id: 2, texto: "Muy informativo, gracias." },
      ];
      resolve(comentarios);
    }, demora);
  });
};

console.log("===== PARTE 2: PROMESAS =====");

obtenerUsuarioPromesa(1)
  .then((usuario) => {
    return obtenerPostsPromesa(usuario.id);
  })
  .then((posts) => {
    return obtenerComentariosPromesa(posts[0].id);
  })
  .then((comentarios) => {
    console.log("Comentarios obtenidos (Promesas):", comentarios);
  })
  .catch((error) => {
    console.error("Error en Promesas:", error);
  });

// =====================================================
// Parte 3: Solución con Async/Await
// =====================================================

console.log("===== PARTE 3: ASYNC/AWAIT =====");

const mostrarPerfilDeUsuario = async () => {
  try {
    const usuario = await obtenerUsuarioPromesa(1);
    const posts = await obtenerPostsPromesa(usuario.id);
    const comentarios = await obtenerComentariosPromesa(posts[0].id);

    console.log("Comentarios obtenidos (Async/Await):", comentarios);
  } catch (error) {
    console.error("Error en Async/Await:", error);
  }
};

mostrarPerfilDeUsuario();