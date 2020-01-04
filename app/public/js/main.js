function openCity(evt, partyName) {
    // Declare all variables
    var i, tabcontent, tablinks;
    //
    
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(partyName).style.display = "block";
    document.getElementById('hash_value').innerHTML = sessionStorage.getItem("hash_display");
    evt.currentTarget.className += " active";

        
}

function onLoad() {

    // Get the element with id="defaultOpen" and click on it
    document.getElementById("provider1").click();

}