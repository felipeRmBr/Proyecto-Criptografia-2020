var iniciar_option = document.getElementById('iniciar_diffie_option');
var continuar_option = document.getElementById('continuar_diffie_option');

var continue_option1 = document.getElementById('share_file_option');
var continue_option2 = document.getElementById('dh2_file_option');

var descargar_inicio = document.getElementById('descargar_inicio');
var aceptar_inicio = document.getElementById('aceptar_inicio');

var diffie_s1 = document.getElementById('diffie_s1');
var diffie_s2 = document.getElementById('diffie_s2');
var diffie_s3 = document.getElementById('diffie_s3');

iniciar_option.addEventListener('click', showScreen2);
continuar_option.addEventListener('click', showScreen3);

continue_option1.addEventListener('click', showScreen4);
continue_option2.addEventListener('click', showScreen5);

descargar_inicio.addEventListener('click', startProgram);
aceptar_inicio.addEventListener('click', showScreen1);

function showScreen1(){
    hideAllScreens();
    diffie_s1.style.display='block';
}

function showScreen2(){
    hideAllScreens();
    diffie_s2.style.display='block';
}

function showScreen3(){
    hideAllScreens();
    diffie_s3.style.display='block';
}

function showScreen4(){
    hideAllScreens();
    diffie_s4.style.display='block';
}

function showScreen5(){
    hideAllScreens();
    diffie_s5.style.display='block';
}

function showScreen2_2(){
    hideAllScreens();
    diffie_s2_2.style.display='block'
}

function hideAllScreens(){
    diffie_s1.style.display='none';
    diffie_s2.style.display='none';
    diffie_s2_2.style.display='none'
    diffie_s3.style.display='none';
    diffie_s4.style.display='none';
    diffie_s5.style.display='none';  
}


/*********************ARRANCAR DIFFIE**********************/
var bits_base = 64;
var bits_modulo = 64;

var base_str;
var modulo_str;
var exponent_str;
var public_A_str;

var state_base = 0;
var state_modulo = 0;
var state_exponent = 0;


function startProgram(){
  console.log('Hello iam alive')
  var download_done = false

  forge.prime.generateProbablePrime(bits_base, function(err, num) {
    base_str = num.toString(10);
    console.log('base ', base_str);
    state_base = 1;

    if(download_done==false && state_base==1 && state_modulo==1 && state_exponent==1){
        download_done = true
        executePhase2();
    }
  });

  forge.prime.generateProbablePrime(bits_modulo, function(err, num) {
    modulo_str = num.toString(10);
    console.log('modulo ', modulo_str);
    state_modulo = 1;

    if(download_done==false && state_base==1 && state_modulo==1 && state_exponent==1){
        download_done = true
        executePhase2();
    }
  });

  forge.prime.generateProbablePrime(20, function(err, num) {
    exponent_str = num.toString(10)
    console.log('exponente', exponent_str); 
    state_exponent = 1;

    if(download_done==false && state_base==1 && state_modulo==1 && state_exponent==1){
        download_done = true
        executePhase2();
    }
  });

}

function executePhase2(){
    console.log('VARIABLES LISTAS, PREPARANDO DESCARGA')

    base = bigInt(base_str);
    modulo = bigInt(modulo_str)

    priv_exponent = bigInt(exponent_str); 

    var public_A = base.modPow(exponent_str, modulo);
    public_A_str = public_A.toString();

    console.log('public_A', public_A_str); 

    descargar();

    showScreen2_2();
}

function descargar(){
  console.log('Descargando archivos')

  var element_1 = document.createElement('a');
  var share_str = base_str + 'SEPARATOR_TAG' + modulo_str + 'SEPARATOR_TAG' + public_A_str;

  element_1.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(share_str));
  element_1.setAttribute('download', 'diffie_hellman.share.txt');

  element_1.style.display = 'none';
  document.body.appendChild(element_1);

  element_1.click();
  document.body.removeChild(element_1);

  var element_2 = document.createElement('a');

  element_2.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(exponent_str));
  element_2.setAttribute('download', 'diffie_hellman.keep.txt');

  element_2.style.display = 'none';
  document.body.appendChild(element_2);

  element_2.click();
  document.body.removeChild(element_2);

}