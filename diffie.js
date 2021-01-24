var iniciar_option = document.getElementById('iniciar_diffie_option');
var continuar_option = document.getElementById('continuar_diffie_option');

var continue_option1 = document.getElementById('share_file_option');
var continue_option2 = document.getElementById('dh2_file_option');

var descargar_inicio = document.getElementById('descargar_inicio');
var aceptar_inicio = document.getElementById('aceptar_inicio');
var aceptar_inicio_2 = document.getElementById('aceptar_inicio_2');

//boton en pantalla 4
var continuar_DH_1 = document.getElementById('continuar_DH_1');
var continuar_DH_2 = document.getElementById('continuar_DH_2');

var diffie_s1 = document.getElementById('diffie_s1');
var diffie_s2 = document.getElementById('diffie_s2');
var diffie_s2_2 = document.getElementById('diffie_s2_2');
var diffie_s3 = document.getElementById('diffie_s3');
var diffie_s4 = document.getElementById('diffie_s4');
var diffie_s5 = document.getElementById('diffie_s5');
var diffie_s5_2 = document.getElementById('diffie_s5_2');

var caller = 'UNDEFINED'

iniciar_option.addEventListener('click', showScreen2);
continuar_option.addEventListener('click', showScreen3);

continue_option1.addEventListener('click', showScreen4);
continue_option2.addEventListener('click', showScreen5);

continuar_DH_1.addEventListener('click', computeSharedSecret);
continuar_DH_2.addEventListener('click', computeSharedSecret);

descargar_inicio.addEventListener('click', startProgram);
aceptar_inicio.addEventListener('click', showScreen1);
aceptar_inicio_2.addEventListener('click', showScreen1);

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
    //inicializa el valor del exponete
    initializeExponent();
    caller = 'B'
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

function showScreenSucces(){
    hideAllScreens();
    diffie_s5_2.style.display='block'
}


function hideAllScreens(){
    diffie_s1.style.display='none';
    diffie_s2.style.display='none';
    diffie_s2_2.style.display='none'
    diffie_s3.style.display='none';
    diffie_s4.style.display='none';
    diffie_s5.style.display='none';  
    diffie_s5_2.style.display='none'; 
}


/*********************ARRANCAR DIFFIE**********************/
var bits_base = 64;
var bits_modulo = 64;

var base_dh_str;
var modulo_dh_str;
var exponent_dh_str;
var remote_public_result_str;

var public_A_dh_str;
var public_B_dh_str;

function initializeExponent(){
  forge.prime.generateProbablePrime(20, function(err, num) {
    exponent_dh_str = num.toString(10)
    console.log('exponente listo', exponent_dh_str); 
    state_exponent = 1;
  });
}


function startProgram(){
  console.log('Hello iam alive')

  var state_base = 0;
  var state_modulo = 0;
  var state_exponent = 0;
  var download_done = false

  forge.prime.generateProbablePrime(bits_base, function(err, num) {
    base_dh_str = num.toString(10);
    console.log('base ', base_dh_str);
    state_base = 1;

    if(download_done==false && state_base==1 && state_modulo==1 && state_exponent==1){
        download_done = true
        executePhase2();
    }
  });

  forge.prime.generateProbablePrime(bits_modulo, function(err, num) {
    modulo_dh_str = num.toString(10);
    console.log('modulo ', modulo_dh_str);
    state_modulo = 1;

    if(download_done==false && state_base==1 && state_modulo==1 && state_exponent==1){
        download_done = true
        executePhase2();
    }
  });

  forge.prime.generateProbablePrime(20, function(err, num) {
    exponent_dh_str = num.toString(10)
    console.log('exponente', exponent_dh_str); 
    state_exponent = 1;

    if(download_done==false && state_base==1 && state_modulo==1 && state_exponent==1){
        download_done = true
        executePhase2();
    }
  });

}

function executePhase2(){
    console.log('VARIABLES LISTAS, PREPARANDO DESCARGA')

    base_dh = bigInt(base_dh_str);
    modulo_dh = bigInt(modulo_dh_str)

    exponent_dh = bigInt(exponent_dh_str); 

    var public_A = base_dh.modPow(exponent_dh, modulo_dh);
    public_A_dh_str = public_A.toString(10);

    console.log('public_A', public_A_dh_str); 

    descargar();

    showScreen2_2();
}

function descargar(){
  console.log('Descargando archivos')

  var element_1 = document.createElement('a');
  var share_str = base_dh_str + 'SEPARATOR_TAG' + modulo_dh_str + 'SEPARATOR_TAG' + public_A_dh_str;

  element_1.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(share_str));
  element_1.setAttribute('download', 'diffie_hellman.share.txt');

  element_1.style.display = 'none';
  document.body.appendChild(element_1);

  element_1.click();
  document.body.removeChild(element_1);

  var element_2 = document.createElement('a');

  element_2.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(exponent_dh_str));
  element_2.setAttribute('download', 'diffie_hellman.keep.txt');

  element_2.style.display = 'none';
  document.body.appendChild(element_2);

  element_2.click();
  document.body.removeChild(element_2);

}

function computeSharedSecret(){
  /*
  var base = forge.prime.generateProbablePrime(bits_base);
  var modulo = forge.prime.generateProbablePrime(bits_modulo);

  var priv_alice = forge.prime.generateProbablePrime(20);
  var priv_bob = forge.prime.generateProbablePrime(20); */

  base_dh = bigInt(base_dh_str);
  modulo_dh = bigInt(modulo_dh_str)

  exponent_dh = bigInt(exponent_dh_str);

  remote_pulic_result = bigInt(remote_public_result_str);
  console.log('this is the RmotePublicResult', remote_public_result_str);

  var shared_secret = remote_pulic_result.modPow(exponent_dh, modulo_dh); 
  

  console.log('shared_secret: ', shared_secret);

  var key = shared_secret.toString(16).slice(0, 16);
  console.log('shared_key: ', key);

  downloadTextFile(key, 'shared_secret.key.txt');

  if(caller=='B'){
    //generate and download public_B 

    console.log('Calculando Public B (LocalPublicResult)')

    /*
    var local_public_result = base_dh.modPow(exponent_dh, modulo_dh);
    local_public_result_str = local_public_result.toString(10);

    console.log('public_B', local_public_result_str); 
    */

    local_public_result_str = computeLocalPublicResult(base_dh, exponent_dh, modulo_dh);

    dh_variables_str = base_dh_str + 'SEPARATOR_TAG' + modulo_dh_str + 'SEPARATOR_TAG' + local_public_result_str;

    downloadTextFile(dh_variables_str, 'diffie_hellman.dh2.txt');
  }

  showScreenSucces()
}

function computeLocalPublicResult(base, exponente, modulo){
    var local_public_result = base_dh.modPow(exponent_dh, modulo_dh);
    local_public_result_str = local_public_result.toString(10);
    return local_public_result_str
}

function downloadTextFile(text, file_name){
  console.log('Descargando clave compartida')

  var element_1 = document.createElement('a');

  element_1.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element_1.setAttribute('download', file_name);

  element_1.style.display = 'none';
  document.body.appendChild(element_1);

  element_1.click();
  document.body.removeChild(element_1);
}