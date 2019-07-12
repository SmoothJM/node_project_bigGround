window.onload = function(){
    var del = document.getElementById('del');
    del.onclick = function(){
        var type = confirm("Are you sure?");
		if(type){
            location.href="doDelete/_id/="+did+"&dflag="+dflag;
            //doDelete/_id/<%=items[i]._id%>
		}
    };
};