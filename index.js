
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
        
        if (randomSound.ranking == 5) {
            
            var confettiSettings = { target: 'my-canvas' };
            var confetti = new ConfettiGenerator(confettiSettings);
            confetti.render();

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
            var title = document.createTextNode(capitalize_Words(audios_names[0].replace(/_/g,' ')))
            para_title = document.getElementById('name');
            para_title = para_title.appendChild(title)

            var ii
            for (ii = 1; ii < audios_names.length; ii++) {
                var title = ' & '+capitalize_Words(audios_names[ii].replace(/_/g,' '))
                para_title = document.getElementById('name');

                para_title.textContent += title;
            }
            //TODO: NO estan ordenats!
            promises_audio = []
            audios_names.forEach(function (value, i){
                audio_name = clean_name.replace(/ /g, '_')+(i+1)
                var soundRef = firebase.storage().ref("sounds/"+audio_name+'.ogg')
                promises_audio.push(soundRef.getDownloadURL())
                //Then we search the audio in the storage by name, ie, each name musct be unique.

                // console.log(uploadImage)
                // get_downl(audio_name).then((audioURL) => console.log(audioURL))
                


                // return new Promise((resolve, reject) => {
                //     const promises = soundRef.getDownloadURL()
                //     console.log(promises)
                //     = Promise.all(promises)
                // })
                
                // audios_url.push(url)
                // .then(function (url){
                //     var sound      = document.createElement('audio');
                //     sound.id       = 'audio-player';
                //     sound.controls = 'controls';
                //     sound.src      = url;
                //     sound.type     = 'audio/ogg';
                //     // document.getElementById('audio_container').appendChild(sound);
                
                
            })
            Promise.all(promises_audio).then(values => {
                
                values.forEach(function (value, i){
                    var sound      = document.createElement('audio');
                    sound.id       = 'audio-player';
                    sound.controls = 'controls';
                    sound.src      = value;
                    sound.type     = 'audio/ogg';
                    document.getElementById('audio_container').appendChild(sound);
                });
            });

        }
        else {
            audio_name = randomSound.name.replace(/_/g,' ')
            var soundRef = firebase.storage().ref("sounds/"+randomSound.name+'.ogg') //Then we search the audio in the storage by name, ie, each name musct be unique.
            var title = document.createTextNode(capitalize_Words(randomSound.name.replace(/_/g,' ')))
            para_title = document.getElementById('name');
            para_title.appendChild(title)
            audio_container_div = document.createElement('div')
            audio_container_div.setAttribute('id',audio_name)
            audio_container_div.appendChild(para_title)
            soundRef.getDownloadURL()
            .then(function (url){
                var sound      = document.createElement('audio');
                sound.id       = 'audio-player';
                sound.controls = 'controls';
                sound.src      = url;
                sound.type     = 'audio/ogg';
                document.getElementById('audio_container').appendChild(sound);
            }) 
            
            document.getElementById('audio_container').appendChild(audio_container_div);
        }
               
       })                                                          
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

