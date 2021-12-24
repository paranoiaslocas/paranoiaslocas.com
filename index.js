
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyC9ywBn89ortsSgLMDbmZT-zfION0BjJWY",
    authDomain: "paranoias-9d040.firebaseapp.com",
    projectId: "paranoias-9d040",
    storageBucket: "paranoias-9d040.appspot.com",
    messagingSenderId: "116458569045",
    appId: "1:116458569045:web:44a20cb5849615036dc3dc",
    measurementId: "G-EQGCC4F20R"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
// firebase.auth();

// ------------------------------------------------------------------------------------------------------

function checkForm(){
    var email = document.getElementById("email");
    var password = document.getElementById("pass");

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
        
        const user = userCredential.user;
        window.location.reload();

     })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        document.getElementById('errorText').innerHTML = error.message
        if (error.code == 'auth/user-not-found'){
            firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                window.location.reload();

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                document.getElementById('errorText').innerHTML = error.message
            });
        }
    });
    
}

function signOut(){
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
        window.location.reload()
      }, function(error) {
        console.error('Sign Out Error', error);
      });
}

function read_and_print_list() {
    // Create a reference under which you want to list
    var storageRef = firebase.storage().ref('sounds');
    // Now we get the references of these images
    var signout_button = document.createElement("a");
    

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            document.getElementById('username').innerHTML = 'Hola '+user.email;
            signout_button.innerHTML = '<b> tancar sessió</b>';
            signout_button.setAttribute('class', 'w3-bar-item w3-button w3-red w3-border w3-center w3-hover-pale-red')
            signout_button.setAttribute('onclick',"signOut()");
            signout_button.setAttribute('id',"signout");


        } else {
            
            // var label = document.createElement("H4");
            // var t = document.createTextNode("Registrat o inicia sessió per tenir un seguiment dels àudios que has escoltat.");
            // label.appendChild(t);

            var label2 = document.createElement("strong");
            var t2 = document.createTextNode("No s'envia correu de confirmació. Assegura't que cada vegada poses el mateix email i contrasenya, si no perdràs el seguiment.");
            label2.appendChild(t2);

            var f = document.createElement("form");
            f.setAttribute('name',"myform");
            f.setAttribute('action',"javascript:checkForm()");
            f.setAttribute('id', "inputForm")

            var email = document.createElement("input"); 
            email.setAttribute('type',"email");
            email.setAttribute('name',"email");
            email.setAttribute('id',"email");
            email.setAttribute('placeholder',"Email");

            var pass = document.createElement("input"); 
            pass.setAttribute('type',"password");
            pass.setAttribute('name',"pass");
            pass.setAttribute('id',"pass");
            pass.setAttribute('placeholder',"Contrasenya");

            var errorPlace = document.createElement("strong"); 
            var errorText = document.createTextNode("");
            errorPlace.setAttribute('id',"errorText");
            errorPlace.style.color = 'rgb(166, 2, 26)';
            errorPlace.appendChild(errorText);

            var s = document.createElement("input"); //input element, Submit button
            s.setAttribute('type',"submit");
            s.setAttribute('value',"Registra't / Inicia sessió");
            s.setAttribute('class','example_c')
            
            // f.appendChild(label)
            f.appendChild(label2)
            f.appendChild(email);
            f.appendChild(pass);
            f.appendChild(errorPlace)
            f.appendChild(s);

            //and some more input elements here
            //and dont forget to add a submit button

            var iDiv = document.createElement('div');
            iDiv.id = 'form_div';
            iDiv.className = 'form_div';
            iDiv.style = 'position:relative'
            document.getElementById("sidenav").appendChild(iDiv);

            iDiv.appendChild(f);
            
        }
    })
    document.getElementById("sidenav").appendChild(signout_button);

    // var list_ = document.createElement("a");
    // document.getElementById("sidenav").appendChild(list_);

    // list_.classList.add("w3-bar-item");
    // list_.classList.add("w3-button");
    // list_.classList.add("w3-white");
    // list_.classList.add("w3-hover-white");
    // list_.classList.add("w3-center");

    storageRef.listAll().then(function(result) {
        result.items.forEach(function(imageRef) {
            // And finally display them
            var node = document.createElement("a");
            var filename = (imageRef._delegate._location.path_).split('sounds/')[1];
            node.innerHTML = filename;
            // var textnode = document.createTextNode(filename);
            // node.appendChild(textnode);
            node.classList.add("w3-bar-item");
            node.classList.add("w3-button");
            node.classList.add("w3-light-gray");
            node.classList.add("w3-border");
            document.getElementById("sidenav").appendChild(node);
        });
        

    }).catch(function(error) {
        // Handle any errors
    });
}
read_and_print_list();

function capitalize_Words(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function getRandomValueFromSoundArray(array_s) {
    const randomElement = array_s[Math.floor(Math.random() * array_s.length)];
    return randomElement
}

async function get_downl(audio_name){
    urlArray = []
    var soundRef = await firebase.storage().ref("sounds/"+audio_name+'.ogg')
    console.log(soundRef)
    try {
        const url = await soundRef.getDownloadURL();
        urlArray.push(url);
        if (!url) throw new Error("it broke");
  
        return urlArray
    } catch (err) {
      console.error(err);
    }
};

function getProfilesOptions() {
    var sound = document.createElement('audio');
    return new Promise(resolve => {
        firebase.firestore().collection("sounds_db").get().then(snapshot => { // Database is stored in a collection
            //from here we retrieve the data and randombly retrieve one of the elements.
        const array_sounds = []
        snapshot.docs.forEach(doc => {
            array_sounds.push({ id: doc.id, name: doc.data().name, pair: doc.data().pair, ranking: doc.data().ranking})
        });
        resolve(array_sounds)
        randomSound = getRandomValueFromSoundArray(array_sounds)
        
        // ADD GOOD QUALITY CONTENT EFFECTS
        
        if (randomSound.ranking >= 5) {
            var end = Date.now() + (15 * 1000);

            // ADD TEXT
            var sub_title = document.createTextNode('AUDIO PREMIUM\nlvl: '+randomSound.ranking.toString()+'/5!')
            para_title = document.getElementById('sub_name');
            bold = document.createElement('strong');
            bold.appendChild(sub_title)
            para_title = para_title.appendChild(bold);

            //CHANGE BODY

            // document.getElementsByTagName("body")[0].style.background = "radial-gradient(600px at 50% 50% , #fff 20%, #eb987c 100%)";


            // ADD CONFFETY go Buckeyes!
            var colors = ['#bb0000', '#ffffff'];

            (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
            }());

            document.addEventListener("click", function (e) {
                e.preventDefault();
                party.sparkles(e, {
                    count: party.variation.range(10, 40),
	                speed: party.variation.range(50, 200),
                });
            });

        }

        // ADD GOOD QUALITY CONTENT EFFECTS
        
        // Here we need to include some login to print more than one audio tag if the audio have "pair". 
        // Ie, if we retrieve the audio number 2 from a miniblock of audio we should get the first one and print them in ascent order.
        
        clean_name = randomSound.name.replace(/[0-9]/g, '').replace(/_/g, ' ');
        let array_name = array_sounds.map(obj => obj.name.replace(/_/g, ' '));
        
        if (randomSound.pair > 0) {
            audios_names = []
            const startsWithN = array_name.filter((soundName) => soundName.startsWith(clean_name));
            startsWithN.forEach(function (value, i) {
                audio_name = clean_name.replace(/ /g, '_')+(i+1)
                audios_names.push(audio_name)
                
            });
            var title = document.createTextNode((audios_names[0].replace(/_/g,' ')))
            para_title = document.getElementById('name');
            para_title = para_title.appendChild(title)

            var ii
            for (ii = 1; ii < audios_names.length; ii++) {
                var title = ' & '+(audios_names[ii].replace(/_/g,' '))
                para_title = document.getElementById('name');

                para_title.textContent += title;
            }
            promises_audio = []
            audios_names.forEach(function (value, i){
                audio_name = clean_name.replace(/ /g, '_')+(i+1)
                var soundRef = firebase.storage().ref("sounds/"+audio_name+'.mp3')
                console.log(soundRef)
                promises_audio.push(soundRef.getDownloadURL())
                //Then we search the audio in the storage by name, ie, each name musct be unique.

            })
            // Promise.all(promises_audio).then(values => {
            //     values.forEach(function (value, i){
            //         var source = document.createElement('source');
            //         var sound      = document.createElement('audio');
            //         source.type = 'audio/ogg';
            //         source.src = value;
            //         sound.id       = 'audio-player';
            //         sound.controls = 'controls';
            //         sound.type     = 'audio/ogg';
            //         sound.preload  = 'auto';
            //         sound.appendChild(source)                    
            //         document.getElementById('audio_container').appendChild(sound);

                    // document.getElementById('audio_container').appendChild(div_gap);
                    // div_gap.className = "gap-example";
                    // var source = document.createElement('source');
                    // var sound      = document.createElement('audio');
                    // source.type= 'audio/ogg';
                    // source.src= value;
                    // sound.appendChild(source)
                    // div_gap.appendChild(sound);
            //         // document.getElementById('audio_container').appendChild(div_gap);
            //     })
            // });
            Promise.all(promises_audio).then(values => {
                values.forEach(function (value, i){
                    var div_gap = document.createElement('div');
                    div_gap.className = "gap-example";
                    var source = document.createElement('source');
                    var sound      = document.createElement('audio');
                    source.type= 'audio/mpeg';
                    source.src= value;
                    sound.appendChild(source)
                    div_gap.appendChild(sound);
                    document.getElementById('audio_container').appendChild(div_gap);
                });
                GreenAudioPlayer.init({
                    selector: '.gap-example', // inits Green Audio Player on each audio container that has class "player"
                    stopOthersOnPlay: true
                });
            });

        }
        else {
            // audio_name = randomSound.name.replace(/_/g,' ')
            // var soundRef = firebase.storage().ref("sounds/"+randomSound.name+'.mp3') //Then we search the audio in the storage by name, ie, each name musct be unique.
            // var title = document.createTextNode((randomSound.name.replace(/_/g,' ')))
            // para_title = document.getElementById('name');
            // para_title.appendChild(title)
            // audio_container_div = document.createElement('div')
            // audio_container_div.setAttribute('id',audio_name)
            // audio_container_div.appendChild(para_title)
            // var source = document.createElement('source');
            // var sound      = document.createElement('audio');
            // source.type = 'audio/mpeg';
            // source.src = soundRef;
            // sound.id       = 'audio-player';
            // sound.controls = 'controls';
            // sound.type     = 'audio/ogg';
            // sound.preload  = 'auto';
            // sound.appendChild(source)                    
            // audio_container_div.appendChild(sound);
            audio_name = randomSound.name.replace(/_/g,' ')
            var soundRef = firebase.storage().ref("sounds/"+randomSound.name+'.mp3') //Then we search the audio in the storage by name, ie, each name musct be unique.
            var title = document.createTextNode((randomSound.name.replace(/_/g,' ')))
            para_title = document.getElementById('name');
            para_title.appendChild(title)
            audio_container_div = document.createElement('div')
            audio_container_div.setAttribute('id',audio_name)
            audio_container_div.appendChild(para_title)
            soundRef.getDownloadURL()
            .then(function (url){
                sound.id       = 'audio-player';
                sound.controls = 'controls';
                sound.src      = url;
                sound.style    = "width:35em";
                sound.type     = 'audio/mpeg';
                sound.preload  = 'none';
                document.getElementById('audio_container').appendChild(sound);
                var div_gap = document.createElement('div');
                div_gap.className = "gap-example";
                var source = document.createElement('source');
                var sound      = document.createElement('audio');
                source.type= 'audio/ogg';
                source.src= url;
                sound.appendChild(source)
                div_gap.appendChild(sound);
                document.getElementById('audio_container').appendChild(div_gap);

                GreenAudioPlayer.init({
                    selector: '.gap-example', // inits Green Audio Player on each audio container that has class "player"
                    stopOthersOnPlay: true
                });
            }) 
            document.getElementById('audio_container').appendChild(audio_container_div);


        }
               
    })
    sound.load()
                                                      
    }) 

 }
 getProfilesOptions()



// 2. fer la logica per triar basada en el ranking i si hi ha mes dun. Si nhi ha mes dun posar mes tags daudio. 

// storageRef.listAll().then(function(result) { // AIXO VA FORA PERQUE ES PER LLISTA I EN COMPTES DE LLISTA A DE SER UN SOL AUDIO

//     result.items.forEach(function(sound) { 
//         sound.getDownloadURL() // AIXO ESTA BE
//         .then((url) => 
//         console.log(url) // AIXO ES LO Q SHA DENVIAR AL AUDIO TAG.
//         )
//     })
// })

