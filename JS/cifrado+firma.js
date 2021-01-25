var plain_text;  // base64 formar

// PARA FIRMA Y VERIFICACIÓN
var modulus_hex;
var private_exp_hex;
var public_exp_hex;
var public_RSA_key;
var private_RSA_key;

var decryptedText;
var file_name;

if(APARTADO==1){
    var ejecutar_1 = document.getElementById('ejecutar_button_1');
    ejecutar_1.addEventListener('click', executeActions_1);
}else if(APARTADO==2){
    var ejecutar_2 = document.getElementById('ejecutar_button_2');
    ejecutar_2.addEventListener('click', executeActions_2);
}

function executeActions_1(){
    if(firmar_check_state==1 && cifrar_check_state==-1){
        console.log('FIRMANDO EL DOCUMENTO');
        signDocumet();
    }else if(firmar_check_state==-1 && cifrar_check_state==1){
        console.log('CIFRANDO EL DOCUMENTO');
    }else if(firmar_check_state==1 && cifrar_check_state==1){
        console.log('FIRMANDO Y CIFRANDO');
        signDocumet();
    }
}

function executeActions_2(){
    if(verificar_check_state==1 && descifrar_check_state==-1){
        console.log('VERIFICANDO EL DOCUMENTO');
        verifySignature();
    }else if(verificar_check_state==-1 && descifrar_check_state==1){
        console.log('DESCIFRANDO EL DOCUMENTO');
    }else if(verificar_check_state==1 && descifrar_check_state==1){
        console.log('VERIFICANDO Y DESCIFRANDO');
        verifySignature();
    }
}

function signDocumet(){
    var modulus = bigInt(modulus_hex, 16);
    var priv_exp = bigInt(private_exp_hex, 16);

    console.log('APLICANDO SHA1')
    var buf = forge.util.createBuffer(plain_text, 'utf8');

    var md = forge.md.sha1.create();
    md.update(buf);

    var md_base16 = md.digest().toHex();

    /*
    m_base16 = m_base16.slice(0,10);
    console.log('This is m slice:', m_base16);
    */

    var m = bigInt(md_base16, 16);
    m = m.mod(modulus)

    console.log('This is modulus : ', modulus);
    console.log('This is priv_exp: ', priv_exp);
    console.log('This is m: ', m);

    console.log('GENERANDO BLOQUE DE FIRMA')

    var signature = m.modPow(priv_exp, modulus);
    console.log('This is signature: ', signature.toString(16));

    downloadTextFile(signature.toString(16), 'file_signature.txt')
}

function verifySignature(){
    var modulus = bigInt(modulus_hex, 16);
    var public_exp = bigInt(public_exp_hex, 16);
    var signature = bigInt(signature_hex, 16);

    console.log('APLICANDO sha1')
    var buf = forge.util.createBuffer(plain_text, 'utf8');

    var hasher = forge.md.sha1.create();
    hasher.update(buf);

    var md_hex = hasher.digest().toHex();

    var md = bigInt(md_hex, 16);
    md = md.mod(modulus)

    console.log('This is modulus : ', modulus);
    console.log('This is public_exp : ', public_exp);
    console.log('This is md: ', md);
    console.log('This is signature: ', signature)

    console.log('VERIFICACION')

    var verify = signature.modPow(public_exp, modulus);
    console.log('This is verify: ', verify)

    if(verify.equals(md)){
        console.log('EUREKA. VERIFICACION COMPLETA');
    }else{
        console.log('CRAPS!!, ALGO SALIO MAL');
    }
}