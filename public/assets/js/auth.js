

var status=0;
function slideDown(){
    if(status%2!=0){
        $(".collapsible-body").slideUp();
        status ++;
    }else{
        $(".collapsible-body").slideDown();
        status ++;
    }	
    if(status == 10){
        status = 0;
    }
    
}