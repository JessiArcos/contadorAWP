/**
 * Se valida si en el objeto navigator sino se registra
 */
if ("serviceWorker" in navigator){
    //Registramos el servidor worker
    navigator.serviceWorker.register("./sw.js");
}