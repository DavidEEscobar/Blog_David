document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(elems, {
        coverTrigger: false,
        alignment: 'right'
    });

    // Obtener el estado del usuario actual desde el servidor
    fetch('/current-user')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Usuario no autenticado');
            }
        })
        .then(data => {
            // Si el usuario está autenticado
            const initial = data.username.charAt(0).toUpperCase();
            document.getElementById('user-initial').textContent = initial;
            document.getElementById('login-link').style.display = 'none';
            document.getElementById('register-link').style.display = 'none';
            document.getElementById('logout-link').style.display = 'block';
        })
        .catch(error => {
            console.error('Error al obtener el usuario actual:', error);
            // Si no hay usuario autenticado, mostrar opciones de login y registro
            document.getElementById('logout-link').style.display = 'none';
            document.getElementById('login-link').style.display = 'block';
            document.getElementById('register-link').style.display = 'block';
        });

    // Manejar el cierre de sesión
    document.getElementById('logout').addEventListener('click', function() {
        fetch('/logout', { method: 'POST' })
            .then(() => {
                // Recargar la página o redirigir
                window.location.reload();
            })
            .catch(error => {
                console.error('Error al cerrar sesión:', error);
            });
    });
});
