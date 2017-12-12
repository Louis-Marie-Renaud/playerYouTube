        var player;
        var nbFavoris;

        function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
              height: '360',
              width: '640',
              videoId: 'M7lc1UVf-VE',
            });
        }

        //afffichage de l'historique et de la liste des favoris à l'ouverture de la page (voir body.onlaoad dans le html)
        function historiqueEtFavoris(){
            //stockage d'un tableau de String représentant l'historique
            var histo = accesLS('historique');
            //Si histo n'est pas null le web storage est supporté
            if(histo!=null) {
                for(var i= 0; i < histo.length; i++){
                    if(histo[i]!="" && !document.getElementById(histo[i]+"hist")){
                        //création pour chaque élément du tableau d'un élément d'une liste dans le html
                        var newLink = document.createElement('li');
                        newLink.id = histo[i]+"hist";
                        //insertion du nouvel élément dans le html
                        document.getElementById('liens').appendChild(newLink);
                        document.getElementById(histo[i]+"hist").innerHTML = histo[i];
                        //élément cliquable pour revoir la vidéo
                        document.getElementById(histo[i]+"hist").onclick = function(){
                            player.loadVideoById(this.innerHTML);
                        };
                    }
                }
            }
            //réinération de l'étape précédente pour les favoris
            var fav = accesLS('favoris');
            if(fav!=null) {
                for(var i= 0; i < fav.length; i++) {
                    if(fav[i]!="" && !document.getElementById(fav[i]+"fav")){
                        var newLink = document.createElement('li');
                        newLink.id = fav[i]+"fav";
                        document.getElementById('favoris').appendChild(newLink);
                        document.getElementById(fav[i]+"fav").innerHTML = fav[i];
                        document.getElementById(fav[i]+"fav").onclick = function(){
                            player.loadVideoById(this.innerHTML);
                        };
                    }
                }
                nbFavoris = fav.length;
                document.getElementById("compteur").innerHTML = nbFavoris;
            }
        }

        //Accéder à un élément du web storage
        function accesLS(arg){
            if(typeof localStorage!='undefined') {
                // Récupération de la valeur dans web storage
                var elem = localStorage.getItem(arg);
                // Vérification de la présence de l'élément
                if(elem!=null) {
                    // Si oui, on convertit la chaîne de caractères qui fut stockée en tableau
                    elem = elem.split(',');
                } else {
                    //Sinon on créé un nouveau tableau
                    elem = new Array();
                }
                return elem;
            } else {
                alert("localStorage n'est pas supporté");
                return null;
            }
        }

        //Afficher / Masquer les favoris
        $(".tohide").hide();
        $(".btn-group-lg").on("click", function() {
            var target = $(this).data("target");
            if(target!==undefined) {
                $(target).toggle();
                $(this).toggleClass("active",$(target).is(":visible"));
            }
        });

        // Charger une video
        $('#lire').on('click', function () {
            var url = document.getElementById("lien").value;
            //Si le lien entré en input correspond à l'URL de la vidéo, on ne garde que l'ID
            if(url.slice(0,32)==="https://www.youtube.com/watch?v=")
                url = url.slice(32);
            player.loadVideoById(url);
            var histo = accesLS('historique');
            if(histo!=null) {
                if(document.getElementById("lien").value!=""){
                    //la dernière vidéo à être chargée est ajoutée au début de l'historique
                    histo.unshift(url);
                    //convertion de l'historique en chaîne de caractères
                    var val = histo.toString();
                    //stockage de la chaîne de caractère dans le web storage avec la clé 'historique'
                    localStorage.setItem('historique', val);
                    //création du nouvel élément dans la liste de l'historique
                    var newLink = document.createElement('li');
                    newLink.id = histo[0]+"hist";
                    //élément cliquable pour voir à nouveau la vidéo
                    newLink.onclick = function(){
                        player.loadVideoById(histo[0]);
                    };
                    //insertion de cet élément dans le html au début de l'historique
                    document.getElementById('liens').insertBefore(newLink, document.getElementById(histo[1]+"hist"));
                    document.getElementById(histo[0]+"hist").innerHTML = histo[0];
                }
            }
        });


        //ajout d'une vidéo aux favoris
        $('#ajoutFavoris').on('click', function (){
            var fav = accesLS('favoris');
            if(fav!=null) {
                //Pas de doublons dans les favoris
                if(player.getVideoUrl().slice(32)!="" && !document.getElementById(player.getVideoUrl().slice(32)+"fav")){
                    //on récupère l'ID de la vidéo
                    var newFav = player.getVideoUrl().slice(32);
                    //stockage des favoris avec nouvel élément (idem historique)
                    fav.unshift(newFav);
                    var val = fav.toString();
                    localStorage.setItem('favoris', val);
                    //création d'un nouvel élément dans la liste des favoris
                    var newLink = document.createElement('li');
                    newLink.id = fav[0]+"fav";
                    newLink.onclick = function(){
                        player.loadVideoById(fav[0]);
                    };
                    //insertion de cet élément dans le html au début des favoris
                    document.getElementById('favoris').insertBefore(newLink, document.getElementById(fav[1]+"fav"));
                    document.getElementById(fav[0]+"fav").innerHTML = fav[0];
                    //incrémentation et nouvel affichage du nombre de favoris
                    nbFavoris++;
                    document.getElementById("compteur").innerHTML = nbFavoris;
                }
            }
        });
