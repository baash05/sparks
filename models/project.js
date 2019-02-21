class Project {
  constructor(id, name){
    this.name = name;
    this.id = id || new Date().getTime();
  }
  static all(callback){
    fetchAll('projects', callback)
  }
  save(){
    saveRecord('projects', id, name)
  }
  set name(value){ this._name = value;}
  get name(){ return this._name }
}