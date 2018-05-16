module.exports = (function () {

  function Group () {

    /*
     addSubGroup (groupname)
     addSubUser (userObj)
     detachGroup ()
     addUsers (usersObj)
     deleteSubEntity (nameSTR)
     haveChildren ()
     haveSubGroups ()
     getUsers ()
     containGroup (groupname)
     containUser (user)

     shiftToOthers (originalGroup)
     */

  }

  Group.prototype.addSubGroup = function (groupname) {
    if (!this.haveChildren()) {
      this[groupname] = new Group()
      return true
    }
    else if (this.haveSubGroups()) {
      return this.containGroup(groupname) ? false : !!(this[groupname] = new Group())
    }
    else {
      shiftToOthers(this)
      this[groupname] = new Group()
      return true
    }
  }

  Group.prototype.addSubUser = function (userObj) {
    if (!this.haveSubGroups()) {
      if (this.containUser(userObj)) {
        return false
      }
      this[userObj.username] = userObj
      return true
    }

    if (this.containGroup('Others')) {
      return this['Others'].containUser(userObj) ? false :
        !!(this.Others[userObj.username] = userObj)

    }
    else {

      return false
    }

  }

  Group.prototype.detachGroup = function () {
    let childrenCount = Object.keys(this).length
    let childrenNames = Object.keys(this)
    for (let index = 0; index < childrenCount; index++) {
      delete  this[childrenNames[index]]
    }
  }

  Group.prototype.addUsers = function (usersObj) {
    Object.assign(this, usersObj)
  }

  Group.prototype.deleteSubEntity = function (nameSTR) {
    return this.hasOwnProperty(nameSTR) ? delete this [nameSTR] : false
  }

  Group.prototype.haveChildren = function () {
    return !(Object.keys(this).length === 0)
  }

  Group.prototype.haveSubGroups = function () {
    let propsArr = Object.keys(this)
    return propsArr.length > 0 ? (this[propsArr[0]] instanceof Group) : false
  }

  Group.prototype.getUsers = function () {
    let keys = Object.keys(this)
    if (this.haveChildren() && this[keys[0]].hasOwnProperty('username')) {
      return Object.keys(this)
    }
    return []
  }

  Group.prototype.containGroup = function (groupname) {
    return (this.hasOwnProperty(groupname))
  }

  Group.prototype.containUser = function (user) {
    return user === undefined ? false : (this.hasOwnProperty(user.username))
  }

  function shiftToOthers (originalGroup) {
    let keysArr = Object.keys(originalGroup)
    let keysArrLength = Object.keys(originalGroup).length
    var temp = new Group()

    let currentUser = {}
    for (let index = 0; index < keysArrLength; index++) {
      currentUser = originalGroup[keysArr[index]]
      temp [currentUser.username] = currentUser
      delete  originalGroup [currentUser.username]
    }
    originalGroup['Others'] = temp
  }

  return Group

})()