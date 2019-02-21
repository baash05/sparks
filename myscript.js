

function addUl(parent){
  var ul = parent.getElementsByTagName('ul')[0];
  if(ul) parent.removeChild(ul);

  ul = document.createElement('ul')
  ul.id = "menu_ul"
  parent.appendChild(ul)

  return ul
}


function newLabel(id, click, classNames, forName){
  var label = document.createElement('label')
  if(classNames && classNames.length > 0) label.className = classNames;
  label.setAttribute("onclick", click);
  label.setAttribute("id", id);
  return label;
}

function loadMenu(records){
  const menu = document.getElementById('menu')
  while (menu.lastChild) { menu.removeChild(menu.lastChild);}
  const ul = addUl(menu)

  var label = newLabel(null , "hideMenu('show_menu'); newNote();", 'menu_item' ,
                      'edit_scene');
                      label.style = "padding: 5px 0; margin: 5px 0;"
    label.innerHTML = '🤪<span  style="white-space: nowrap;">NEW NOTE</span>'
    ul.appendChild(label)

  records.forEach(function(record) {

    var label = newLabel(record.id ,
                  "hideMenu('show_menu'); readRecord("+record.id+", displayRecord)", 'menu_item',
                  'edit_scene')
    label.style = "padding: 5px 0; margin: 5px 0;"

    label.innerHTML = ' 📄<span id="record_' +record.id+ '" style="white-space: nowrap;">'+truncateStr(record.text)+ '</span>'
    var li = document.createElement('li')
    li.appendChild(label)
    ul.appendChild(li)
  });
}

function truncateStr(str) {
  var length = 25;
  var ending = ' ...';
  if (str.length > length) {
    return str.substring(0, 22) + ending;
  } else {
    return str;
  }
};

function hideMenu(id){
  if(window.innerWidth > 600) return; //don't hide menu when user clicks
  var elm = document.getElementById(id)
  if(elm) elm.checked = false
}

function newNote(){
  displayRecord({id: new Date().getTime(), text: ""})
}

function displayRecord(record){
  document.getElementById('id_field').value = record.id
  document.getElementById('text_field').value = record.text
}

function saveNote(){
  var id = document.getElementById('id_field').value
  id = parseInt(id)
  const text = document.getElementById('text_field').value
  if(text.length > 0){
    saveRecord(id, text, afterSave)
  } else {
    deleteRecord(id, function(){afterSave(); newNote();})
  }
}

function afterSave(){
  setTimeout(function(){ fetchAll(loadMenu) }, 0);
}
