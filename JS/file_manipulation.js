const SEPARATOR_CONST = '   /******/   '

var plain_text;  // base64 formar

// PARA FIRMA Y VERIFICACIÓN
var modulus_hex;
var private_exp_hex;
var public_exp_hex;
var public_RSA_key;
var private_RSA_key;
var signature_hex;

var simmetric_key;
var decryptedText;
var file_name;

var input_file_box = document.getElementById('checks');

// feature detection for drag&drop upload
var isAdvancedUpload = true;

// applying the effect for every form
var forms = document.querySelectorAll( '.box' );

// Check API SUPPORT
function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
        console.log('reader created')
        return true; 
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
}

Array.prototype.forEach.call( forms, function( form )
{
    var input        = form.querySelector( 'input[type="file"]' ),
        box_input    = form.querySelector( '.box__input' ),
        label        = form.querySelector( 'label' ),
        errorMsg     = form.querySelector( '.box__error span' ),
        progress     = form.querySelector('.percent'),
        //restart      = form.querySelectorAll( '.box__input' ),
        droppedFiles = false,
        file_class = form.getAttribute('file_class'),
        reader = new FileReader(),
        showFiles    = function(files)
        {
            /*Muestra el nombre del archivo cargado*/
            label.textContent = files.length > 1 ? ( input.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', files.length ) : files[ 0 ].name;
        },

        // Cargar archivo
        readSelectedFile = function(fileSelection) 
        {
            console.log('runnig read_selected_file()')
            var output = ""; //placeholder for text output
            if(fileSelection.files && fileSelection.files[0]) {  

                //reader = new FileReader();
                reader.onloadstart = function(e) {
                    if(file_class=='main_file'){
                        //input_file_box.style.diplay = 'none';
                        //document.getElementById('box_input_div').style.diplay = 'none';
                        document.getElementById('box_input_div').className="hide"
                        //document.getElementById('box_input_div').style.visibility = 'hidden';
                        document.getElementById('progress_bar').className ='loading';
                    }
                };

                reader.onprogress = function(evt) {
                    if(file_class=='main_file'){
                        // evt is an ProgressEvent.
                        if (evt.lengthComputable) {
                            var percentLoaded = Math.round((evt.loaded / evt.total) * 80);
                            // Increase the progress bar length.
                            if (percentLoaded < 100) {
                                setTimeout(function(){}, 1000)
                                progress.style.width = percentLoaded + '%';
                                progress.textContent = percentLoaded + '%';
                            }
                        }
                    }

                }

                reader.onload = function (e) {

                    if(file_class=='main_file'){
                        plain_text = e.target.result;  //base64 formar
                        //console.log(cadena_original)
                        //output = e.target.result.split(',')[1];
                        //output = cadena_original;

                        progress.style.width = '100%';
                        progress.textContent = '100%';
                        
                        setTimeout(function(){ 
                            document.getElementById('progress_bar').className='hide';
                            document.getElementById('box_input_div').className="box__input"; }, 1000);

                        //displayContents('COMPLETE!!');

                        console.log('Cadena original');


                    }else if(file_class=='simmetric_key'){
                        simmetric_key = e.target.result;  //base64 formar
                        //console.log(cadena_original)
                        //output = e.target.result.split(',')[1];
                        //output = cadena_original;
                        displayContents(simmetric_key);

                        console.log('Simmetric key');


                    }else if(file_class=='signature_file'){
                        signature_hex = e.target.result;

                        console.log('Bloque de firma recuperado: ', signature_hex);


                    }else if(file_class=='private_key'){
                        var private_RSA_key = e.target.result;  //base64 formar
                        let substrings = private_RSA_key.split(SEPARATOR_CONST);

                        modulus_hex = substrings[0];
                        private_exp_hex = substrings[1];

                        console.log('modulo recuperado: ', modulus_hex);
                        console.log('exponente privado recuperado: ', private_exp_hex);


                    }else if(file_class=='public_key'){
                        var private_RSA_key = e.target.result;  //base64 formar
                        let substrings = private_RSA_key.split(SEPARATOR_CONST);

                        modulus_hex = substrings[0];
                        public_exp_hex = substrings[1];

                        console.log('modulo recuperado: ', modulus_hex);
                        console.log('exponente publico recuperado: ', public_exp_hex);


                    }else if(file_class=='dh_public_variables'){
                        //console.log('estoy entrando a un if incorrecto!!!')
                        var dh_share_str = e.target.result;  //base64 formar
                        let substrings = dh_share_str.split('SEPARATOR_TAG');

                        base_dh_str =  substrings[0];
                        modulo_dh_str = substrings[1];
                        remote_public_result_str = substrings[2];

                        console.log('base  recuperada ', base_dh_str);
                        console.log('modulo  recuperado ', modulo_dh_str);
                        console.log('public_Result recuperado ', remote_public_result_str);


                    }else if(file_class=='dh_private_exponent'){
                        exponent_dh_str = e.target.result;  //base64 formar
                        console.log('exponente recuperado: ', exponent_dh_str);

                    }

                };//end onload() 
                
                
                if(file_class=='main_file'){
                    reader.readAsDataURL(fileSelection.files[0]);   
                }else{
                    reader.readAsText(fileSelection.files[0]);
                }
                

                file_name = fileSelection.files[0].name;
                //file_extension = file_name.split('.')[1];
            }
            else { //this is where you could fallback to Java Applet, Flash or similar
                console.log('No se leyo ningún archivo')
                return false;

            }       
            return true;
        };   

    //Muestra los archivos cargados
    input.addEventListener( 'change', function( element )
    {
        readSelectedFile(element.target);
        showFiles(element.target.files);
    });

    form.classList.add( 'has-advanced-upload' ); 

});

function downloadTextFile(text, file_name){
  console.log('DESCARGANDO ARCHIVO DE TEXTO')

  var element_1 = document.createElement('a');

  element_1.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element_1.setAttribute('download', file_name);

  element_1.style.display = 'none';
  document.body.appendChild(element_1);

  element_1.click();
  document.body.removeChild(element_1);
}

function displayContents(txt) {
    var element = document.getElementById('main'); 
    element.innerHTML = txt; //display output in DOM
}  