
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

// ------------------------------------------------------------------------------------------------------


function read_and_print_list() {
    // Create a reference under which you want to list
    var storageRef = firebase.storage().ref('sounds');
    // Now we get the references of these images
    var signout_button = document.createElement("a");
    signout_button.innerHTML = '<b>Tancar sessió</b>';
    document.getElementById("sidenav").appendChild(signout_button);

    signout_button.classList.add("w3-bar-item");
    signout_button.classList.add("w3-button");
    signout_button.classList.add("w3-red");
    signout_button.classList.add("w3-border");
    signout_button.classList.add("w3-center");
    signout_button.classList.add("w3-hover-pale-red");


    for (let i = 0; i < 3; i++) {
        var space_ = document.createElement("a");

        document.getElementById("sidenav").appendChild(space_);
    
        space_.classList.add("w3-bar-item");
        space_.classList.add("w3-button");
        space_.classList.add("w3-white");
        space_.classList.add("w3-hover-white");
    
    }

    var list_ = document.createElement("a");
    list_.innerHTML = '<b>Llista - audios</b>';
    document.getElementById("sidenav").appendChild(list_);

    list_.classList.add("w3-bar-item");
    list_.classList.add("w3-button");
    list_.classList.add("w3-white");
    list_.classList.add("w3-hover-white");
    list_.classList.add("w3-center");

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
                var soundRef = firebase.storage().ref("sounds/"+audio_name+'.ogg')
                promises_audio.push(soundRef.getDownloadURL())
                //Then we search the audio in the storage by name, ie, each name musct be unique.

            })
            Promise.all(promises_audio).then(values => {
                values.forEach(function (value, i){
                    var div_gap = document.createElement('div');
                    div_gap.className = "gap-example";
                    var source = document.createElement('source');
                    var sound      = document.createElement('audio');
                    source.type= 'audio/ogg';
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
            audio_container_div = document.createElement('div')
            audio_container_div.setAttribute('id',audio_name)
            audio_container_div.appendChild(para_title)
            soundRef.getDownloadURL()
            .then(function (url){
                // sound.id       = 'audio-player';
                // sound.controls = 'controls';
                // sound.src      = url;
                // sound.style    = "width:35em";
                // sound.type     = 'audio/mpeg';
                // sound.preload  = 'none';
                // document.getElementById('audio_container').appendChild(sound);
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

 function isiOS() {
    return [
          'iPad Simulator',
          'iPhone Simulator',
          'iPod Simulator',
          'iPad',
          'iPhone',
          'iPod'
        ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  }

  if (isiOS()) {
    // iOS does not support "canplay" event
    this.player.addEventListener('loadedmetadata', this.hideLoadingIndicator.bind(self)); // iOS does not let "volume" property to be set programmatically

    this.audioPlayer.querySelector('.volume').style.display = 'none';
    this.audioPlayer.querySelector('.controls').style.marginRight = '0';
  }

// 2. fer la logica per triar basada en el ranking i si hi ha mes dun. Si nhi ha mes dun posar mes tags daudio. 

// storageRef.listAll().then(function(result) { // AIXO VA FORA PERQUE ES PER LLISTA I EN COMPTES DE LLISTA A DE SER UN SOL AUDIO

//     result.items.forEach(function(sound) { 
//         sound.getDownloadURL() // AIXO ESTA BE
//         .then((url) => 
//         console.log(url) // AIXO ES LO Q SHA DENVIAR AL AUDIO TAG.
//         )
//     })
// })

