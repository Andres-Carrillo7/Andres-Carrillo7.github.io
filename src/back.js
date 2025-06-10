document.addEventListener("DOMContentLoaded", function () {
    const btnAtras = document.getElementById("btnAtras");
    if (btnAtras) {
        btnAtras.addEventListener("click", function () {
            window.history.back();
        });
    }
});