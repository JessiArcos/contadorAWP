// Empezamos a registar nuestro service worker

//Definir el arreglo CACHE_ELEMENTS contodas las rutas de los archivos a guardar en el cache
const CACHE_ELEMENTS = [
    "./", 
    "https://unpkg.com/react@17/umd/react.development.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.development.js", 
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./style.css",
    "./components/Contador.js"
]

//Definimos el nombre del Cache
const CACHE_NAME = "v1_cache_contador_react";

/**
 * Hay 3 procesos para que se lleve correctamente el proceso de service
 */

/**
 * Trabajando con el primer evento del service worker llamado install, 
 * el cual es la primera parte del ciclo de vida de un service worker, que es cuando se registra se 
 * instala y lo que va a hacer al instalarse es chacear todas las rutas para que ahora el service worker
 * me provea de toda esa información y ya no tenga que estar haciendo peticiones a internet a cada rato
 */
//Primer evento en el cilo de visa
self.addEventListener("install", (e) => { //evento
    e.waitUntil(//espera a que pase esto
        caches.open(CACHE_NAME).then((cache) => {
            cache
                .addAll(CACHE_ELEMENTS)
                .then(() => {
                    self.skipWaiting();
                })
                .catch(console.log);
        })

    );

});
//Trabajando con el siguiente evento del service worker llamado activate,
// en el que se define que hacer cuando se activa el service worker.
//El método keys devuelve todas las llaves en caso de que tengamos mas de un cache instalado.
//Segundo evento
self.addEventListener("activate", (e) => {
    const cacheWhitelist = [CACHE_NAME];
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(cacheNames.map(cacheName => {
                return (
                    cacheWhitelist.indexOf(cacheName) === -1 && caches.delete(cacheName)
                );
            }))
        })
        //Una vez que ya se activo todo mi caché y ya se está utilizando hay que reclamarlo
        .then(() => self.clients.claim())
    );
});

//Trabajando con el siguiente evento del service worker llamado fetch, 
//es el evento que se va a disparar cada que nosotros abramos el sitio, 
//por ejemplo, lo que va a hacer buscará una nueva versión de nuestros archivos en cache, 
//y va a retornar las respuestas que tengan el caché activado. En caso de que se vaya a 
//crear una nueva habra que hacer la petición y respondernos una nueva cosa.

self.addEventListener("fetch", (e) => {
    //Lo que haremos es comparar si es que ya existe el contenido de la ruta en el cache y si no lo agregamos al cache.
    e.respondWith(
        caches.match(e.request).then((res) => {
            if(res) {
                return res;
            }
            return fetch(e.request);
        })
    );
});