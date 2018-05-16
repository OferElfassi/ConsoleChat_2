module.exports = (function () {

  function User (username, password, age) {
    this.username = username
    this.password = password
    this.age = age
    /*
    changePassword (newPassword)
    changeAge (newAge)
    getProfile ()
     */
  }

  function Users () {
    this.rawUserList = {}
    /*
    newUser (username, password, age)
    deleteUser (username)
    userExist (username)
    showUserList ()
     */
  }

  User.prototype.changePassword = function (newPassword) {
    this.password = newPassword
    return true
  }
  User.prototype.changeAge = function (newAge) {
    this.age = newAge
    return true
  }

  User.prototype.getProfile = function () {
    return [this.username, this.age, this.password]
  }


  Users.prototype.showUserList = function () {
    return Object.keys(this.rawUserList)
  }

  Users.prototype.deleteUser = function (username) {
    delete  this.rawUserList[username]
  }

  Users.prototype.userExist = function (username) {
    return (this.rawUserList.hasOwnProperty(username))
  }

  // public method
  Users.prototype.newUser = function (username, password, age) {
    if (this.rawUserList.hasOwnProperty(username)) {
      return false
    }
    this.rawUserList[username] = new User(username, password, age)
    return true
  }

  return Users
})()