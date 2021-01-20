
// feature detection for drag&drop upload
var isAdvancedUpload = true

// applying the effect for every form
var forms = document.querySelectorAll( '.box' );

Array.prototype.forEach.call( forms, function( form )
{
    var input        = form.querySelector( 'input[type="file"]' ),
        label        = form.querySelector( 'label' ),
        errorMsg     = form.querySelector( '.box__error span' ),
        restart      = form.querySelectorAll( '.box__restart' ),
        droppedFiles = false,
        showFiles    = function( files )
        {
            /*Muestra el nombre del archivo cargado*/
            label.textContent = files.length > 1 ? ( input.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', files.length ) : files[ 0 ].name;
        };

    //Muestra los archivos cargados
    input.addEventListener( 'change', function( e )
    {
        showFiles( e.target.files );
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

