/*=========================================================
  _____      _          ____                 
 |_   _|   _| |_ __ _  |  _ \  ___   ___ ___ 
   | || | | | __/ _` | | | | |/ _ \ / __/ __|
   | || |_| | || (_| | | |_| | (_) | (__\__ \
   |_| \__,_|\__\__,_| |____/ \___/ \___|___/
                                             
=========================================================*/
//Using any application service

application.service(" <insert service name here> ").invokeOperation(
          " <insert service operation here> ", { <header function - nothing here> }, <json variable here, always as a string> ,
          function(result) { //This is the default function that runs if the query is succesful, if there is a result.

          },
          function(error) { //The second function will always run if there is an error.

            // the service returns 403 (Not Authorised) if credentials are wrong
            tuta.util.alert("Error " + error.httpStatusCode, error.errmsg);

          }
        );


//Storing information locally:

//Creates a new item, "user", in the store. (Can be named anything)
//User is the key/ID, and contains a JSON structure as a value
kony.store.setItem(" <itemname> ", JSON.stringify( <Json Variable here> ));