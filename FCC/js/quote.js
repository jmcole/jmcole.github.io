function getQuote() {

  $(document).ready(function(){
      $("button").click(function(){
          $.get("https://quote-api.gomix.me/pull/1", function(data){
              alert("Data: " + data);
              
              console.log(data[0].body);
          });
      });
  });

}
