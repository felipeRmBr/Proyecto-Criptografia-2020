var SEPARATOR_CONST = '/******/';
var PUBLIC_EXP_HEX = '10001';
var ID_TAG = '#123456789#'; // se utiliza para reconocer cuando una llave privada se desencripto correctamente

var doc_content;  // base64 formar

// PARA FIRMA Y VERIFICACIÓN
var modulus_hex;
var private_exp_hex;
var public_exp_hex;
var public_RSA_key;
var private_RSA_key;

var decryptedText;
var file_name;

function executeActions_1(){
    if(firmar_check_state==1 && cifrar_check_state==-1){
        console.log('FIRMANDO EL DOCUMENTO');

        let password = psw_input.value;
        if(decryptPrivKey(encr_priv_key_hex, password)){
            signDocumet(doc_content);
        }

    }else if(firmar_check_state==-1 && cifrar_check_state==1){
        console.log('CIFRANDO EL DOCUMENTO');

        var key = fromHexStrToArray(simmetric_key_hex);
        console.log('This is the key: ', key);

        let encrypted_hex = doCipher(doc_content, key, 'base64'); //input in format base64

        let substrings = full_file_name.split('.');
        let file_name = substrings[0];
        let file_extension = substrings[1];

        downloadTextFile(encrypted_hex, full_file_name + '.enc')

    }else if(firmar_check_state==1 && cifrar_check_state==1){
        console.log('FIRMANDO Y CIFRANDO');

        let password = psw_input.value;
        if(decryptPrivKey(encr_priv_key_hex, password)){
            // firmamos el documento original
            signDocumet(doc_content);
        }else{
            alert('Password incorrecto. Vuelve a intentarlo.')
        }

        var key = fromHexStrToArray(simmetric_key_hex);
        console.log('This is the simmetric key: ', key);

        let encrypted_hex = doCipher(doc_content, key, 'base64'); //input in format base64

        let substrings = full_file_name.split('.');
        let file_name = substrings[0];
        let file_extension = substrings[1];

        downloadTextFile(encrypted_hex, full_file_name + '.enc')
    }
}

function executeActions_2(){
    if(verificar_check_state==1 && descifrar_check_state==-1){
        console.log('VERIFICANDO EL DOCUMENTO');
        verifySignature(signature_hex, doc_content);
    }else if(verificar_check_state==-1 && descifrar_check_state==1){
        console.log('DESCIFRANDO EL DOCUMENTO');

        var key = fromHexStrToArray(simmetric_key_hex);
        console.log('This is the key: ', key);

        var decrypted_doc = doDecipher(doc_content, key, 'base64') //output in format base64

        let substrings = full_file_name.split('.');
        let file_name = substrings[0];
        let file_extension = substrings[1];

        console.log(decrypted_doc)
        downloadDecryptedDoc(decrypted_doc, file_name + '.recovered.' + file_extension);

    }else if(verificar_check_state==1 && descifrar_check_state==1){
        console.log('VERIFICANDO Y DESCIFRANDO');

        var key = fromHexStrToArray(simmetric_key_hex);
        console.log('This is the key: ', key);

        var decrypted_doc = doDecipher(doc_content, key, 'base64') //output in format base64

        verifySignature(signature_hex, decrypted_doc);

        let substrings = full_file_name.split('.');
        let file_name = substrings[0];
        let file_extension = substrings[1];

        downloadDecryptedDoc(decrypted_doc, file_name + '.recovered.' + file_extension);
    }
}

function decryptPrivKey(encr_priv_key_hex, password){
      // get a 16 bytes key using password as a seed
      let md_hex = doHashing(password);
      let key_hex = md_hex.slice(0,16);

      let key = fromHexStrToArray(key_hex);

      console.log('This is key hex :', key_hex);
      console.log('This is key array :', key);

      decrypted_priv_key = doDecipher(encr_priv_key_hex, key, 'base64'); //output in format base64

      console.log('this is decrypted priv_key: ', decrypted_priv_key);

      let substrings = decrypted_priv_key.split(SEPARATOR_CONST);
      console.log(substrings[0]);

      if(substrings[0]==ID_TAG){
        console.log('valid private_key', ); 

        modulus_hex = substrings[1];
        private_exp_hex = substrings[2];

        return true;
      }else{
        console.log('invalid private_key');
        return false; 
      }

}

function doCipher(plain_text, key, input_format) {
    /*
    key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    console.log('This is the new key: ', key);
    */

    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));

    if(input_format=='base64'){
        var textBytes = aesjs.utils.utf8.toBytes(plain_text);
    }else if(input_format=='hex'){
        var textBytes = aesjs.utils.hex.toBytes(plain_text);
    }

    var encryptedBytes = aesCtr.encrypt(textBytes);
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    //console.log(encryptedHex);

    return encryptedHex;
} 

function doDecipher(encrypted_hex, key, output_format) {
    // When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes(encrypted_hex);

    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);

    // Convert our bytes back into text
    if(output_format=='base64'){
        var decrypted = aesjs.utils.utf8.fromBytes(decryptedBytes);
    }else if(output_format=='hex'){
        var decrypted = aesjs.utils.hex.fromBytes(decryptedBytes);
    }
    

    return decrypted;
} 

function signDocumet(plain_text){
    var modulus = bigInt(modulus_hex, 16);
    var priv_exp = bigInt(private_exp_hex, 16);

    console.log('This is modulus : ', modulus);
    console.log('This is priv_exp: ', priv_exp);

    console.log('APLICANDO SHA1')
    var buf = forge.util.createBuffer(plain_text, 'utf8');

    var hasher = forge.md.sha1.create();
    hasher.update(buf);

    var md_hex = hasher.digest().toHex();

    var md = bigInt(md_hex, 16);
    md = md.mod(modulus)

    console.log('This is md: ', md);

    console.log('GENERANDO BLOQUE DE FIRMA')

    var signature = md.modPow(priv_exp, modulus);
    console.log('This is signature_hx: ', signature);
    console.log('This is signature_hx: ', signature.toString(16));

    let file_name = full_file_name.split('.')[0];
    downloadTextFile(signature.toString(16), file_name + '.sign.txt')
}


function verifySignature(signature_hex, plain_text){
    var modulus = bigInt(modulus_hex, 16);
    var public_exp = bigInt(public_exp_hex, 16);
    var signature = bigInt(signature_hex, 16);

    console.log('This is modulus : ', modulus);
    console.log('This is public_exp : ', public_exp);
    console.log('This is signature: ', signature)

    console.log('APLICANDO SHA1')
    var buf = forge.util.createBuffer(plain_text, 'utf8');

    var hasher = forge.md.sha1.create();
    hasher.update(buf);

    var md_hex = hasher.digest().toHex();

    var md = bigInt(md_hex, 16);
    md = md.mod(modulus)

    console.log('This is md: ', md);

    console.log('VERIFICANDO')

    var verify = signature.modPow(public_exp, modulus);
    console.log('This is verify: ', verify)

    if(verify.equals(md)){
        console.log('EUREKA. VERIFICACION COMPLETA');
    }else{
        console.log('CRAPS!!, ALGO SALIO MAL');
    }
}

function doHashing(plain_text){
    console.log('APLICANDO SHA1')
    var buf = forge.util.createBuffer(plain_text, 'utf8');

    var md = forge.md.sha1.create();
    md.update(buf);

    var md_hex = md.digest().toHex();

    return md_hex
}

function fromHexStrToArray(hex_string){
    var hex_chars = "0123456789abcdef";
    var my_array = [];

    for(i=0; i<hex_string.length;i++){
        my_array.push(hex_chars.indexOf(hex_string[i]));
    }

    return my_array;
}
