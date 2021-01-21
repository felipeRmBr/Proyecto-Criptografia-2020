var btn = document.getElementById('clickMe');
var loader = document.getElementById('loader_container');
var files = document.getElementById('files_container');

var loader_state = -1;
var files_state = 1;

btn.addEventListener('click', toggleDivs);

function toggleDivs(){
    loader_state=loader_state*-1;
    files_state= files_state*-1;

    if(loader_state == 1){
        loader.style.display='block';
    }
    else{
        loader.style.display='none';
    }

    if(files_state == 1){
        files.style.display='block';
    }
    else{
        files.style.display='none';
    }


    //alert("The button has been clicked!");
}