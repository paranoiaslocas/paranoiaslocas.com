var x = window.matchMedia("(max-width: 640px)")

if (x.matches) {
  function w3_open() {
    // document.getElementById("main").style.marginLeft = "25%";
    document.getElementById("sidenav").style.width = "100%";
    document.getElementById("sidenav").style.display = "block";
    // document.getElementById("openNav").style.display = 'none';
  }
  function w3_close() {
    // document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("sidenav").style.display = "none";
    // document.getElementById("openNav").style.display = "inline-block";
  }
} else {

  function w3_open() {
      // document.getElementById("main").style.marginLeft = "25%";
      document.getElementById("sidenav").style.width = "100%";
      document.getElementById("sidenav").style.display = "block";
      // document.getElementById("openNav").style.display = 'none';
    }
    function w3_close() {
      // document.getElementById("main").style.marginLeft = "0%";
      document.getElementById("sidenav").style.display = "none";
      // document.getElementById("openNav").style.display = "inline-block";
    }
}