
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

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

document.body.style.backgroundImage = 'radial-gradient(circle, '+getRandomColor()+' 0%, '+getRandomColor()+' 18%, '+getRandomColor()+' 36%, '+getRandomColor()+' 52%, '+getRandomColor()+' 67%, '+getRandomColor()+' 100%)';

function checkForm(){
    var email = document.getElementById("email");
    var password = document.getElementById("pass");

    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then((userCredential) => {
        document.getElementById("sidenav").style.display = "none";
        window.location.reload();

     })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error)

        if (error.code == 'auth/user-not-found'){
            firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
            .then((userCredential) => {
                const user = userCredential.user;
                firebase.firestore().collection('users').doc(user.uid).set({
                    list_listened_audios: []
                }).then(function(){
                    document.getElementById("sidenav").style.display = "none";
                    window.location.reload();
                })
                

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error)
                document.getElementById('errorText').innerHTML = error.message
            });
        } else {
            document.getElementById('errorText').innerHTML = error.message

        }
    });
    
}

function signOut(){
    firebase.auth().signOut().then(function() {
        document.getElementById("sidenav").style.display = "none";
        console.log('Signed Out');
        window.location.reload()
      }, function(error) {
        console.error('Sign Out Error', error);
      });
}

function read_and_print_list() {
    // Create a reference under which you want to list
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

}

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
    var soundRef = await firebase.storage().ref("sounds/"+audio_name+'.mp3')
    try {
        const url = await soundRef.getDownloadURL();
        urlArray.push(url);
        if (!url) throw new Error("it broke");
  
        return urlArray
    } catch (err) {
      console.error(err);
    }
};


function update_sound_list_user(user) {
    console.log('hola')
    firebase.firestore().collection('users').doc(user.uid).get().then((doc) => {
        if (doc.exists) {
            var array_listened_audios = doc.data().list_listened_audios;

            firebase.firestore().collection("sounds_db").get().then(snapshot => { 
                snapshot.docs.forEach(doc => {

                    var node = document.createElement("a");
                    node.innerHTML = doc.data().name;
                    node.classList.add("w3-bar-item");
                    node.classList.add("w3-button");
                    if (array_listened_audios.includes(doc.data().name)) {
                        node.classList.add("w3-light-green");
                    }else {
                        node.classList.add("w3-light-gray");
                    }
                    node.classList.add("w3-border");
                    document.getElementById("sidenav").appendChild(node);
                });
            });
        }
    });
}

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

            // document.addEventListener("click", function (e) {
            //     e.preventDefault();
            //     party.sparkles(e, {
            //         count: party.variation.range(10, 40),
	        //         speed: party.variation.range(50, 200),
            //     });
            // });

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
            var user = firebase.auth().currentUser;
            if (!(user == null)) {
                firebase.firestore().collection('users').doc(user.uid).get().then((doc) => {
                    if (doc.exists) {
                        var array_listened_audios = doc.data().list_listened_audios;
                        if (!array_listened_audios.includes(audios_names[0])){ //IF NOT INCLUDED IN LISTENED SINO POSA ELS DOS!
                            audios_names.forEach(function (value, i) {
                                array_listened_audios.push(value);
                                firebase.firestore().collection('users').doc(user.uid).set({
                                    list_listened_audios: array_listened_audios
                                }).then(function(){
                                    console.log('done')
                                })
                            })
                        }
                        update_sound_list_user(user)
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                });
            }

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
            audio_name = randomSound.name.replace(/_/g,' ')
            var soundRef = firebase.storage().ref("sounds/"+randomSound.name+'.mp3') //Then we search the audio in the storage by name, ie, each name musct be unique.
            var title = document.createTextNode((randomSound.name.replace(/_/g,' ')))
            para_title = document.getElementById('name');
            para_title.appendChild(title)

            soundRef.getDownloadURL().then((url_sound) => {
                var div_gap = document.createElement('div');
                div_gap.className = "gap-example";
                var source = document.createElement('source');
                var sound      = document.createElement('audio');
                source.type= 'audio/mpeg';
                source.src= url_sound;
                sound.appendChild(source)
                div_gap.appendChild(sound);
                document.getElementById('audio_container').appendChild(div_gap);
                GreenAudioPlayer.init({
                    selector: '.gap-example', // inits Green Audio Player on each audio container that has class "player"
                    stopOthersOnPlay: true
                });
            });
            
            var user = firebase.auth().currentUser;
            if (!(user == null)) {
                firebase.firestore().collection('users').doc(user.uid).get().then((doc) => {
                    if (doc.exists) {
                        var array_listened_audios = doc.data().list_listened_audios;
                        if (!array_listened_audios.includes(audio_name)){ //IF NOT INCLUDED IN LISTENED SINO POSA ELS DOS!
                            array_listened_audios.push(audio_name);
                            firebase.firestore().collection('users').doc(user.uid).set({
                                list_listened_audios: array_listened_audios
                            }).then(function(){
                                console.log('done')
                            })
                        }
                        update_sound_list_user(user)
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                });
            }
        }
        
               
    })
    sound.load()
                                                      
    }) 

 }
 
 read_and_print_list();
 getProfilesOptions();

