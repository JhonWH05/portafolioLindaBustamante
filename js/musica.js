/* Música de fondo para todo el portafolio: music/Morning Café Jazz.mp3
   Se repite sola al terminar. Los navegadores no dejan sonar audio hasta que
   la persona toca la página, así que arranca con el primer clic/toque o con el botón 🎵. */
(function () {
    var ARCHIVO = "music/Morning%20Caf%C3%A9%20Jazz.mp3";
    var KEY_PAUSA = "musicaPausada";
    var KEY_TIEMPO = "musicaTiempo";

    function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
    function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }

    var audio = new Audio(ARCHIVO);
    audio.loop = true;          // se repite al terminar
    audio.volume = 0.6;
    audio.preload = "auto";

    // Seguir más o menos donde iba al cambiar de página
    var inicio = parseFloat(leer(KEY_TIEMPO) || "0") || 0;
    audio.addEventListener("loadedmetadata", function () {
        if (inicio > 0 && inicio < audio.duration) audio.currentTime = inicio;
    });
    setInterval(function () {
        if (!audio.paused) guardar(KEY_TIEMPO, String(Math.floor(audio.currentTime)));
    }, 2000);

    // Botón flotante
    var boton = document.createElement("button");
    boton.type = "button";
    boton.setAttribute("aria-label", "Activar o pausar la música de fondo");
    boton.style.cssText = "position:fixed;right:18px;bottom:18px;z-index:9999;width:52px;height:52px;" +
        "border-radius:50%;border:none;background:#2b6cb0;color:#fff;font-size:24px;cursor:pointer;" +
        "box-shadow:0 3px 10px rgba(0,0,0,.3);";

    function pintar() {
        var sonando = !audio.paused;
        boton.innerHTML = sonando ? "&#10074;&#10074;" : "&#127925;";
        boton.title = sonando ? "Pausar música" : "Reproducir música";
    }
    audio.addEventListener("play", pintar);
    audio.addEventListener("pause", pintar);

    function reproducir() {
        var p = audio.play();
        if (p && p.catch) p.catch(function () { /* el navegador espera un clic */ });
    }

    boton.addEventListener("click", function (ev) {
        ev.stopPropagation();
        if (audio.paused) { guardar(KEY_PAUSA, "0"); reproducir(); }
        else { audio.pause(); guardar(KEY_PAUSA, "1"); }
    });

    // Primer toque en cualquier parte: arranca la música (si no la pausaron antes)
    function primerToque() {
        document.removeEventListener("click", primerToque, true);
        document.removeEventListener("touchstart", primerToque, true);
        document.removeEventListener("keydown", primerToque, true);
        if (leer(KEY_PAUSA) !== "1" && audio.paused) reproducir();
    }
    document.addEventListener("click", primerToque, true);
    document.addEventListener("touchstart", primerToque, true);
    document.addEventListener("keydown", primerToque, true);

    function iniciar() {
        document.body.appendChild(boton);
        pintar();
        if (leer(KEY_PAUSA) !== "1") reproducir();   // por si el navegador sí permite empezar solo
    }
    if (document.body) iniciar(); else document.addEventListener("DOMContentLoaded", iniciar);
})();
