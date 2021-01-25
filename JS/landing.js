const SEPARATOR_CONST = '   /******/   ';
var public_exp_hex = '10001';

// screens
var landing_main_screen = document.getElementById('landing_main_screen');
var landing_screen_2 = document.getElementById('landing_screen_2');
var landing_success_screen = document.getElementById('landing_success_screen');

// Buttons and calls to action
var continuar_landing = document.getElementById('continuar_landing');
var generar_claves_action = document.getElementById('generar_claves'); 
var aceptar_landing = document.getElementById('aceptar_landing'); 

continuar_landing.addEventListener('click', showScreen2);
generar_claves_action.addEventListener('click', do_genrsa);
aceptar_landing.addEventListener('click', goToMainApp);

function hideAllScreens(){
    landing_main_screen.style.display='none';
    landing_screen_2.style.display='none';
    landing_success_screen.style.display='none';
}

function showScreen1(){
    hideAllScreens();
    diffie_s1.style.display='block';
}

function showScreen2(){
    hideAllScreens();
    landing_screen_2.style.display='block';
    document.body.style.background = '#e5edf1';
}

function showSuccessScreen(){
    hideAllScreens();
    landing_success_screen.style.display = 'block';

}

function goToMainApp(){
    window.location.href="cifrar.html";
}

function do_genrsa() {

  console.log("Generating RSA Key...");
  var before = new Date();
  var rsa = new RSAKey();

  rsa.generate(128, public_exp_hex);

  var modulus_hex = rsa.n.toString(16);
  var private_exp_hex = rsa.d.toString(16);
  
  console.log('modulus: ', modulus_hex);
  console.log('priv_exp: ', private_exp_hex)

  var after = new Date();
  console.log("Key Generation Time: " + (after - before) + "ms");

  var private_key_str = modulus_hex + SEPARATOR_CONST + private_exp_hex;
  var public_key_str = modulus_hex + SEPARATOR_CONST + public_exp_hex;

  downloadTextFile(private_key_str, 'private_key.txt');
  downloadTextFile(public_key_str, 'public_key.txt');

  showSuccessScreen();
}

function downloadTextFile(text, file_name){
  console.log('ARCHIVOS')

  var element_1 = document.createElement('a');

  element_1.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element_1.setAttribute('download', file_name);

  element_1.style.display = 'none';
  document.body.appendChild(element_1);

  element_1.click();
  document.body.removeChild(element_1);
}
