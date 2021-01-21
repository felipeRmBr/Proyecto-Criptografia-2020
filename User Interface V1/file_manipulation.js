
var reader; //GLOBAL File Reader object for demo purpose only
var plain_text;  // base64 formar
var simmetric_key;
var public_key;
var decryptedText;
var file_name;

// feature detection for drag&drop upload
var isAdvancedUpload = true

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
        label        = form.querySelector( 'label' ),
        errorMsg     = form.querySelector( '.box__error span' ),
        restart      = form.querySelectorAll( '.box__restart' ),
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

                reader.onload = function (e) {
                    if(file_class=='plain_file'){
                        plain_text = e.target.result;  //base64 formar
                        //console.log(cadena_original)
                        //output = e.target.result.split(',')[1];
                        //output = cadena_original;
                        displayContents('COMPLETE!!');

                        console.log('Cadena original');
                    }

                    if(file_class=='simmetric_key'){
                        simmetric_key = e.target.result;  //base64 formar
                        //console.log(cadena_original)
                        //output = e.target.result.split(',')[1];
                        //output = cadena_original;
                        displayContents(simmetric_key);

                        console.log('Simmetric key');
                    }

                    if(file_class=='public_key'){
                        public_key = e.target.result;  //base64 formar
                        //console.log(cadena_original)
                        //output = e.target.result.split(',')[1];
                        //output = cadena_original;
                        displayContents(public_key);

                        console.log('Public Key');
                    }
                    //var element = document.getElementById('main'); 
                    //element.innerHTML = cadena_original; //display output in DOM
                };//end onload()

                reader.onprogress = function(data) {
                    if (data.lengthComputable) {                                            
                        var progress = parseInt( ((data.loaded / data.total) * 100), 10 );
                        console.log(progress);
                    }
                };

                reader.readAsDataURL(fileSelection.files[0]);

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

    
    form.classList.add( 'has-advanced-upload' ); // letting the CSS part to know drag&drop is supported by the browser  

    form.classList.add( 'has-advanced-upload' ); // letting the CSS part to know drag&drop is supported by the browser

    [ 'drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop' ].forEach( function( event )
    {
        form.addEventListener( event, function( e )
        {
            // preventing the unwanted behaviours
            e.preventDefault();
            e.stopPropagation();
        });
    });
    
    [ 'dragover', 'dragenter' ].forEach( function( event )
    {
        form.addEventListener( event, function()
        {
            form.classList.add( 'is-dragover' );
        });
    });
    
    [ 'dragleave', 'dragend', 'drop' ].forEach( function( event )
    {
        form.addEventListener( event, function()
        {
            form.classList.remove( 'is-dragover' );
        });
    });
    
    form.addEventListener( 'drop', function( e )
    {
        droppedFiles = e.dataTransfer.files; // the files that were dropped
        showFiles( droppedFiles );

    });

});

function displayContents(txt) {
    var element = document.getElementById('main'); 
    element.innerHTML = txt; //display output in DOM
}  

