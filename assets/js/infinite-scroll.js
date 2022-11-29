function htmlDecode (input)
{
    var decodearea = document.getElementById("htmldecodebox");
    if(!decodearea)
    {
        var decodearea = document.createElement('textarea');
        decodearea.id = "htmldecodebox";
        decodearea.setAttribute("style", "display:none;");
        document.body.appendChild(decodearea);
    }
    decodearea.innerHTML = input;
    return decodearea.childNodes.length === 0 ? "" : decodearea.childNodes[0].nodeValue; 
}

function getDistFromBottom () {
    var scrollPosition = window.pageYOffset;
    var windowSize     = window.innerHeight;
    var bodyHeight     = document.body.offsetHeight;
  
    return Math.max(bodyHeight - (scrollPosition + windowSize), 0);
}

var isFetching = false;

function getpage(pageUrl, succcessCallback, failCallback)
{
    if(pageUrl && !isFetching)
    {
        isFetching = true;
        $.ajax({
            url: pageUrl,
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Failed to retrieve page " + nextpage);
                isFetching = false;
                failCallback("connectionerror");
                //console.log("error " + textStatus);
                //console.log("incoming Text " + jqXHR.responseText);
            },
            dataType: 'json',
            async: true
        }).done(function(page){
            isFetching = false;
            succcessCallback(page);
        });
    }
    else
    {
        return null;
    }
}