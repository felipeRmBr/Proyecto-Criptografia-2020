var SEPARATOR_CONST = '/******/';
var PUBLIC_EXP_HEX = '10001';
var ID_TAG = '#123456789#'; 

function goToRegister(){
    window.location.href="registro_2.html";
}

function goToMainApp(){
    window.location.href="cifrar.html";
}

function hideAllScreens(){
    register_main_screen.style.display='none';
    register_success_screen.style.display='none';
}

function showSuccessScreen(){
    hideAllScreens();
    register_success_screen.style.display = 'block';
}

function showScreen2(){
    hideAllScreens();
    landing_screen_2.style.display='block';
    document.body.style.background = '#e5edf1';
}

function do_genrsa() {

  let nickname = document.getElementById('nickname').value;
  let password  = document.getElementById('psw').value; 

  if(nickname && password){
    if(password.length >= 8){
      // Generate RSA keys
        console.log("Generating RSA Key...");
        var before = new Date();
        var rsa = new RSAKey();

        rsa.generate(128, PUBLIC_EXP_HEX);

        var modulus_hex = rsa.n.toString(16);
        var private_exp_hex = rsa.d.toString(16);
        
        console.log('modulus: ', modulus_hex);
        console.log('priv_exp: ', private_exp_hex);

        var after = new Date();
        console.log("Key Generation Time: " + (after - before) + "ms");

        var private_key_str = ID_TAG + SEPARATOR_CONST + modulus_hex + SEPARATOR_CONST + private_exp_hex;
        var public_key_str = modulus_hex + SEPARATOR_CONST + PUBLIC_EXP_HEX;

      // encrypt private_key using password
        // get a 16 bytes key using password as a seed
        let md_hex = doHashing(password);
        let key_hex = md_hex.slice(0,16);

        let key = fromHexStrToArray(key_hex);

        encr_priv_key_hex = doCipher(private_key_str, key, 'base64');

      downloadTextFile(encr_priv_key_hex, nickname + '.key.priv');
      downloadTextFile(public_key_str, nickname + '.key.publ');

      showSuccessScreen();

    }else{
      alert('El password debe contener al menos 8 caracteres')

    }

  }else{
    alert('Para continuar debes llenar ambos campos del formulario.')

  }
  

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
