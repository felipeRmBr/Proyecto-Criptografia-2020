var descifrar_check_state = 1;
var verificar_check_state = 1;
var cifrar_check_state = 1;
var firmar_check_state = 1;

$(document).ready(function() { 
    $('input[type="checkbox"]').click(function() { 

        let checked = $("input[type=checkbox]:checked").length;

        let signature_box = document.getElementById('signature_box');


        if(!checked) {
            alert("Debes seleccionar al menos una de las dos opciones.");
            return false;
        }else{
            var inputValue = $(this).attr("value"); 
            $("." + inputValue).toggle(); 

            if(inputValue=='CIFRAR_CHECK'){
                cifrar_check_state=cifrar_check_state*-1;
                console.log('cifrar_check: ', firmar_check_state)
            }
            
            if(inputValue=='FIRMAR_CHECK'){
                firmar_check_state=firmar_check_state*-1;
                console.log('firmar_check: ', firmar_check_state)
            }

            if(inputValue=='DESCIFRAR_CHECK'){
                descifrar_check_state=descifrar_check_state*-1;
                console.log('descifrar_check: ',descifrar_check_state)
            }

            if(inputValue=='VERIFICAR_CHECK'){
                verificar_check_state=verificar_check_state*-1;
                console.log('verificar_check: ',verificar_check_state)
            }


            if(verificar_check_state==1 && descifrar_check_state==-1){
                signature_box.style.display = 'block';
            }

            if(descifrar_check_state==-1){
                /*Cargar archivo cifrado*/
                $('#label_archivo_2 strong').text('archivo en claro');
                signature_box.style.display = 'block';
            }else if(descifrar_check_state==1){
                if(verificar_check_state==1){
                    /*Cargar archivo en claro*/
                    $('#label_archivo_2 strong').text('archivo conjunto (.enc+sign)');
                    signature_box.style.display = 'none';
                }else if(verificar_check_state==-1){
                    $('#label_archivo_2 strong').text('archivo cifrado (.enc)');
                }
                
            }



        }
    }); 
}); 

