const CACHE_NAME = "minha-rotina-v5";

const ARQUIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon.png"
];


// ==========================================
// INSTALAÇÃO
// ==========================================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(ARQUIVOS);

            })

    );

    self.skipWaiting();

});


// ==========================================
// ATIVAÇÃO
// ==========================================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(chaves => {

                return Promise.all(

                    chaves
                        .filter(chave => chave !== CACHE_NAME)
                        .map(chave => caches.delete(chave))

                );

            })

    );

    self.clients.claim();

});


// ==========================================
// REQUISIÇÕES
// ==========================================

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        fetch(event.request)
            .then(resposta => {

                return caches.open(CACHE_NAME)
                    .then(cache => {

                        cache.put(event.request, resposta.clone());

                        return resposta;

                    });

            })
            .catch(() => {

                return caches.match(event.request)
                    .then(resposta => {

                        if (resposta) {
                            return resposta;
                        }

                        // Se for uma navegação e estiver offline,
                        // abre o index.html salvo no cache.

                        if (event.request.mode === "navigate") {

                            return caches.match("./index.html");

                        }

                    });

            })

    );

});
