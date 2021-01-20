$(document).ready(function() { 
    $('input[type="checkbox"]').click(function() { 

        var checked = $("input[type=checkbox]:checked").length;

        if(!checked) {
            alert("Debes seleccionar al menos una de las dos opciones.");
            return false;
        }else{
            var inputValue = $(this).attr("value"); 
            $("." + inputValue).toggle(); 
        }
        
    }); 
}); 