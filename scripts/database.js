var appName = 'sparks'; //changing this version will invalidate the cached app shell
const version = 1;

console.log("DATABASE LOADING")

//DATABASE WORK
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"}; // This line should only be needed if it is needed to support the object's constants for older browsers
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
if (!window.indexedDB) {
  window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

var db;
var request = indexedDB.open(appName, version);
request.onerror = function(event) {
  alert("Why didn't you allow my web app to use IndexedDB?!");
};

request.onsuccess = function(event) {
  db = event.target.result;
  db.onversionchange = function(e) {
    // Close immediately to allow the upgrade requested by another instance to proceed.
    console.log("DATABASE PENDING UPDATE")
    alert('A database upgrade is taking place. Please close the app for a moment.')
    db.close();
    db = null;
    return
  };
  console.log("DATABASE OPENED")
};

request.onupgradeneeded = function(event) {
  console.log("DATABASE UPGRADING")
  var objectStore = event.target.result.createObjectStore("projects");
  objectStore.transaction.oncomplete = function(event) {
    db = event.target.result
    console.log("PROJECTS UPGRADED")
  };

  var objectStore = event.target.result.createObjectStore("parts");
  objectStore.transaction.oncomplete = function(event) {
    db = event.target.result
    console.log("PARTS UPGRADED")
  };
};

request.onblocked = function(e) {
  console.log("DATABASE UPDATE REQUEST BLOCKED BY MANY APPS")
};

function deleteRecord(tableName,  id, callback) {
  var transaction = db.transaction(tableName, "readwrite")

  transaction.oncomplete = function(event) {
    console.log("DELETE COMPLETE " + (event.target.error || 'success') )
    if(callback) callback();
  };

  transaction.onerror = function(event){ alert("could not read " + id)}
  var table = transaction.objectStore(tableName);
  var request = table.delete(id);
  request.onsuccess = function(event) {
    console.log("DELETED RECORD " + tableName + ': ' + id )
  };
};

function saveRecord(tableName, id, json, callback){
  if(db == undefined){
    console.log("DATABASE NOT OPENED")
    return;
  }
  var transaction = db.transaction(tableName, "readwrite")
  transaction.oncomplete = function(event) {
    console.log("WRITE COMPLETE " + (event.target.error || 'success') )
    if(callback) callback();
  };
  var table = transaction.objectStore(tableName);
  var request = table.get(id);

  request.onerror = function(event) {
    table.add(json, id).onsuccess = function(event) {
      console.log("CREATED RECORD " + tableName + ': ' + id )
    };
  };

  request.onsuccess = function(event) {
    if(json != event.currentTarget.result){
      table.put(json, id).onsuccess = function(event) {
        console.log("UPDATED RECORD " + tableName + ': ' + id )
      };
    }else{
      callback = null;
    }
  };
}


function readRecord(tableName, id, callback){
  if(db !== undefined){
    var transaction = db.transaction(tableName, "readwrite")
    var table = transaction.objectStore(tableName);
    var request = table.get(id);

    request.onsuccess = function(event) {
      var data = event.currentTarget.result
      if(callback) callback({id: id,  text: data});
    }
    request.onerror = function(event){ alert("could not read " + id)}
  }
}


function fetchAll(tableName, callback) {
  try {
      if(db !== undefined){
        var transaction = db.transaction(tableName, "readwrite")
        var table = transaction.objectStore(tableName);
        var request = table.openCursor();
        var records = [];
        request.onsuccess = function(evt) {
          var cursor = evt.target.result;
          if (cursor) {
            records[records.length] = {id: cursor.key,  text: cursor.value};
            cursor.continue();
          } else{
            if(callback) callback(records); //we are past the last record
          }
        };
      }
  }
  catch(e){
     console.log(e);
  }
}