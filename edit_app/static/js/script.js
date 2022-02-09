let formulaire = document.getElementById('formulaire');
let cordon = document.getElementById('cordon');
let temps = document.getElementById('temps');
let cor = document.getElementById('cor');
/*let xa,ya;
cor.addEventListener('click',()=>{

});
function coordin(pos){
    let crd = pos.coords;

    let latitude = crd.latitude;
    let longitude = crd.longitude;

    xa.value = longitude.toFixed(2);
    ya.value = latitude.toFixed(2);
}
navigator.geolocation.getCurrentPosition(coordin);*/
let quitter = document.getElementById('quitter');
quitter.addEventListener('click',()=>{
    donnees.style.visibility = 'hidden';
    formulaire.style.visibility = 'hidden';
});

let donnees = document.getElementById('donnees');
var xhttp = new XMLHttpRequest();//variable pour la requette ajax
var map, datasource, client, popup, searchInput, resultsPanel, searchInputLength, centerMapOnResults, GeolocationControl;

        //The minimum number of characters needed in the search input before a search is performed.
        var minSearchInputLength = 3;

        //The number of ms between key strokes to wait before performing a search.
        var keyStrokeDelay = 150;

        function GetMap() {
            //Initialize a map instance.
            map = new atlas.Map('myMap', {
                center: [27.488278799080632, -11.66630221877412/*xa,ya*/],
                zoom: 14,
                view: 'Auto',

                //Add authentication details for connecting to Azure Maps.
                authOptions: {
                    /*Use Azure Active Directory authentication.
                    authType: 'anonymous',
                    clientId: '04ec075f-3827-4aed-9975-d56301a2d663', //Your Azure Active Directory client id for accessing your Azure Maps account.
                    getToken: function (resolve, reject, map) {
                        //URL to your authentication service that retrieves an Azure Active Directory Token.
                        var tokenServiceUrl = "https://azuremapscodesamples.azurewebsites.net/Common/TokenService.ashx";

                        fetch(tokenServiceUrl).then(r => r.text()).then(token => resolve(token));
                    }*/

                    //Alternatively, use an Azure Maps key. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
                    authType: 'subscriptionKey',
                    subscriptionKey: 'FgyvV1ZWnNQm1t0tsDD5KhBPqEg3CKiicCVkBYtDaPA'
                }
            });

            //Wait until the map resources are ready.
            map.events.add('ready', function () {
                    //Add the geolocation control to the map
                
                var dataSource = new atlas.source.DataSource();
                map.sources.add(dataSource);
                var point = new atlas.Shape(new atlas.data.Point([-122.33, 47.64]));
                //Add the symbol to the data source.
                dataSource.add([point]);
                //Gets co-ordinates of clicked location
                map.events.add('click', function(e){
                //Update the position of the point feature to where the user clicked on the map.
                point.setCoordinates(e.position);
                let coordonnee = e.position;//c'est ici que tout commence
                cordon.value = coordonnee;
                formulaire.addEventListener('submit',(x)=>{
                    x.preventDefault();
                    donnees.style.visibility = 'hidden';
                    formulaire.style.visibility = 'hidden';
                    console.log(coordonnee);
                    /*xhttp.open("GET",/*mes ton url petit*//*url() , true);
                    /*xhttp.send(coordonnee);*/

                    coordonnee = '';
                });
                donnees.style.visibility = 'visible';
                formulaire.style.visibility = 'visible';
                });
                //Create a symbol layer using the data source and add it to the map
                map.layers.add(new atlas.layer.SymbolLayer(dataSource, null));
            });
            //Store a reference to the Search Info Panel.
            resultsPanel = document.getElementById("results-panel");

            //Add key up event to the search box. 
            searchInput = document.getElementById("search-input");
            searchInput.addEventListener("keyup", searchInputKeyup);
            //Create a popup which we can reuse for each result.
            popup = new atlas.Popup();

             //Wait until the map resources are ready.
            map.events.add('ready', function () {
                //Pass multiple controls into the map using an array.
                map.controls.add([
                //Add the geolocation control to the map.
                new atlas.control.ZoomControl(),
                new atlas.control.CompassControl(),
                new atlas.control.PitchControl(),
                new atlas.control.StyleControl(),

                ], {
                position: "top-right"
                });
                
            //Wait until the map resources are ready.
                //Create a data source and add it to the map.
                datasource = new atlas.source.DataSource();
                map.sources.add(datasource);

                //Add a layer for rendering the results.
                var searchLayer = new atlas.layer.SymbolLayer(datasource, null, {
                    iconOptions: {
                        image: 'pin-round-darkblue',
                        anchor: 'center',
                        allowOverlap: true
                    }
                });
                map.layers.add(searchLayer);

                //Add a click event to the search layer and show a popup when a result is clicked.
                map.events.add("click", searchLayer, function (e) {
                    //Make sure the event occurred on a shape feature.
                    if (e.shapes && e.shapes.length > 0) {
                        showPopup(e.shapes[0]);
                    }
                });
                map.controls.add([
                    //Optional. Add the map style control so we can see how the custom control reacts.
                    new atlas.control.StyleControl(),

                    //Add the geolocation control to the map.
                    new atlas.control.GeolocationControl({
                        style: 'auto'
                    })
                ], {
                    position: 'top-left'
                });
            });
            /*map.events.add('ready', function () {

                map.controls.add([
                    //Optional. Add the map style control so we can see how the custom control reacts.
                    new atlas.control.StyleControl(),

                    //Add the geolocation control to the map.
                    new atlas.control.GeolocationControl({
                        style: 'auto'
                    })
                ], {
                    position: 'top-left'
                });
            });*/
        }
        function searchInputKeyup(e) {
            centerMapOnResults = false;
            if (searchInput.value.length >= minSearchInputLength) {
                if (e.keyCode === 13) {
                    centerMapOnResults = true;
                }
                //Wait 100ms and see if the input length is unchanged before performing a search. 
                //This will reduce the number of queries being made on each character typed.
                setTimeout(function () {
                    if (searchInputLength == searchInput.value.length) {
                        search();
                    }
                }, keyStrokeDelay);
            } else {
                resultsPanel.innerHTML = '';
            }
            searchInputLength = searchInput.value.length;
        }
        function search() {
            //Remove any previous results from the map.
            datasource.clear();
            popup.close();
            resultsPanel.innerHTML = '';

            //Use MapControlCredential to share authentication between a map control and the service module.
            var pipeline = atlas.service.MapsURL.newPipeline(new atlas.service.MapControlCredential(map));

            //Construct the SearchURL object
            var searchURL = new atlas.service.SearchURL(pipeline);

            var query = document.getElementById("search-input").value;
            searchURL.searchPOI(atlas.service.Aborter.timeout(10000), query, {
                lon: map.getCamera().center[0],
                lat: map.getCamera().center[1],
                maxFuzzyLevel: 4,
                view: 'Auto'
            }).then((results) => {

                //Extract GeoJSON feature collection from the response and add it to the datasource
                var data = results.geojson.getFeatures();
                datasource.add(data);

                if (centerMapOnResults) {
                    map.setCamera({
                        bounds: data.bbox
                    });
                }
                console.log(data);
                //Create the HTML for the results list.
                var html = [];
                for (var i = 0; i < data.features.length; i++) {
                    var r = data.features[i];
                    html.push('<li onclick="itemClicked(\'', r.id, '\')" onmouseover="itemHovered(\'', r.id, '\')">')
                    html.push('<div class="title">');
                    if (r.properties.poi && r.properties.poi.name) {
                        html.push(r.properties.poi.name);
                    } else {
                        html.push(r.properties.address.freeformAddress);
                    }
                    html.push('</div><div class="info">', r.properties.type, ': ', r.properties.address.freeformAddress, '</div>');
                    if (r.properties.poi) {
                        if (r.properties.phone) {
                            html.push('<div class="info">phone: ', r.properties.poi.phone, '</div>');
                        }
                        if (r.properties.poi.url) {
                            html.push('<div class="info"><a href="http://', r.properties.poi.url, '">http://', r.properties.poi.url, '</a></div>');
                        }
                    }
                    html.push('</li>');
                    resultsPanel.innerHTML = html.join('');
                }

            });
        }
        function itemHovered(id) {
            //Show a popup when hovering an item in the result list.
            var shape = datasource.getShapeById(id);
            showPopup(shape);
        }
        function itemClicked(id) {
            //Center the map over the clicked item from the result list.
            var shape = datasource.getShapeById(id);
            map.setCamera({
                center: shape.getCoordinates(),
                zoom: 17
            });
        }
        function showPopup(shape) {
            var properties = shape.getProperties();
            //Create the HTML content of the POI to show in the popup.
            var html = ['<div class="poi-box">'];
            //Add a title section for the popup.
            html.push('<div class="poi-title-box"><b>');

            if (properties.poi && properties.poi.name) {
                html.push(properties.poi.name);
            } else {
                html.push(properties.address.freeformAddress);
            }
            html.push('</b></div>');
            //Create a container for the body of the content of the popup.
            html.push('<div class="poi-content-box">');
            html.push('<div class="info location">', properties.address.freeformAddress, '</div>');
            if (properties.poi) {
                if (properties.poi.phone) {
                    html.push('<div class="info phone">', properties.phone, '</div>');
                }
                if (properties.poi.url) {
                    html.push('<div><a class="info website" href="http://', properties.poi.url, '">http://', properties.poi.url, '</a></div>');
                }
            }
            html.push('</div></div>');
            popup.setOptions({
                position: shape.getCoordinates(),
                content: html.join('')
            });
            popup.open(map);
        }

let bd = document.querySelector('body');//pour ajouter des elements aux dom par le body
let ecran = document.getElementById('ecran');//tout le contenue du main
let un = document.querySelector('.un');
let deux = document.querySelector('.deux');
let trois = document.querySelector('.trois');//les trois bandes du menu
let haut = document.querySelector('header');//barre de navigation
let bouton = document.getElementById('bouton');//bouton du menu
bouton.addEventListener('click', ()=>{
    ecran.style.zIndex = 80;
    un.style.transform = 'rotate(35deg)';
    trois.style.transform = 'rotate(-35deg)';
    deux.style.opacity = '0%';
    let menu = document.querySelector('.menu');
    menu.style.left = '50%';
    let retour = document.createElement('div')
    retour.setAttribute('class','retour');
    bd.appendChild(retour);
    retour.style.zIndex = 1000;
    retour.addEventListener('click',()=>{
        un.style.transform = 'rotate(0deg)';
        trois.style.transform = 'rotate(0deg)';
        deux.style.opacity = '100%';
        retour.remove();
        menu.style.left = '1000vh';
        ecran.style.zIndex = 20;
    },false);
    ecran.addEventListener('click',()=>{/*click sur le main */
        un.style.transform = 'rotate(0deg)';
        trois.style.transform = 'rotate(0deg)';
        deux.style.opacity = '100%';
        retour.remove();
        menu.style.left = '1000vh';
        ecran.style.zIndex = 20;
    })
},false);
let retour = document.createElement('div');//faire disparaitre le menu
let recherche = document.getElementById('searchI');
let saisit = document.getElementById('search-input')

let entete = document.querySelector('header');
entete.style.background = 'rgb(255,255,255)';
let paragraphe = document.querySelector('.text');//premier texte sous le mode claire et sombre
let paragraphe2 = document.querySelector('.txt');//deuxieme texte sous le mode claire et sombre
paragraphe.style.color = 'rgb(10,10,10)';
paragraphe2.style.color = 'rgb(10,10,10)';
let titre = document.querySelector('.titre');//titre 
let sombre = document.getElementById('sombre');//bouton sombre
let claire = document.getElementById('claire');//bouton claire
sombre.addEventListener('click',()=>{
    bd.style.background = 'rgb(50,50,50)';
    entete.style.background = 'rgb(50,50,50)';
    titre.style.color = 'rgb(250,250,250)';
    un.style.background = 'rgb(250,250,250)';
    deux.style.background = 'rgb(250,250,250)';
    trois.style.background = 'rgb(250,250,250)';
    paragraphe.style.color = 'rgb(240,240,240)';
    paragraphe2.style.color = 'rgb(240,240,240)';
    dangerIcone.style.filter = 'invert(100%)';
    recherche.style.background = 'rgb(10,10,10)';
    saisit.style.background = 'rgb(10,10,10)';
});//mode sombre
claire.addEventListener('click',()=>{
    bd.style.background = 'rgb(255,255,255)';
    entete.style.background = 'rgb(255,255,255)';
    titre.style.color = 'rgb(80,80,80)';
    un.style.background = 'rgb(80,80,80)';
    deux.style.background = 'rgb(80,80,80)';
    trois.style.background = 'rgb(80,80,80)';
    paragraphe.style.color = 'rgb(10,10,10)';
    paragraphe2.style.color = 'rgb(10,10,10)';
    dangerIcone.style.filter = 'invert(0%)';
    recherche.style.backgroundColor = 'rgb(255,255,255)';
    saisit.style.background = 'rgb(255,255,255)';
});//mode claire
function proche(){
    alert('envoie position au personnes a proximite');//provisoir
}
function proximite(){
    let amis  = [];
    alert('proches et connaissances'+amis);//provisoir
}
let danger = document.getElementById('danger');
let dangerIcone = document.getElementById('dangerIcone');
danger.addEventListener('click',()=>{
    proche();
    proximite();
    /*position actuell envoie a personne les plus proches*/
    /*proche au courent */
},false);
