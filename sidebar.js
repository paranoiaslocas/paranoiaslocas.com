
function w3_open() {
    // document.getElementById("main").style.marginLeft = "25%";
    var user = firebase.auth().currentUser;

    update_sound_list_user(user)
    document.getElementById("sidenav").style.width = "100%";
    document.getElementById("sidenav").style.display = "block";
    // document.getElementById("openNav").style.display = 'none';
  }
  function w3_close() {
    // document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("sidenav").style.display = "none";
    // document.getElementById("openNav").style.display = "inline-block";
  }