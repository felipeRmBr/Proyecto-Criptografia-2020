var btn = document.getElementById('boton_cifrar');
var loader = document.getElementById('loader_container');
var loader_legend = document.getElementById('loader_legend');
var files = document.getElementById('files_container');

var loader_state = -1;
var files_state = 1;

btn.addEventListener('click', toggleDivs);

function toggleDivs(){
    loader_state=loader_state*-1;
    files_state= files_state*-1;

    if(loader_state == 1){
        loader.style.display='block';
        loader_legend.style.display='block';
    }
    else{
        loader.style.display='none';
        loader_legend.style.display='none';
    }

    if(files_state == 1){
        files.style.display='block';
    }
    else{
        files.style.display='none';
    }

    //alert("The button has been clicked!");
}