const Groups = require('../models/groups')
const Users = require('../models/users')
const AnalyzeDS = require('./analyzeDS')
const Menu = require('../views/menu')
module.exports = Controller

const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

let analyzer = new AnalyzeDS
let groups = new Groups
let users = new Users
let menu = new Menu

let currentSession = {
  username: '',
  password: '',
  age: '',
  groupname: '',
  tempData: '',
  currentUser: {}
}

function Controller () {

  /*
  createNewUser ()
  createNewGroup ()
  deleteGroup ()
  deleteUser ()
  addUserToGroup ()
  deleteUserFromGroup ()
  changeUserPassword ()
  changeUserAge ()
  groupSearch ()
  flat ()
  getUserProfile ()
  showUsers ()
  showTree ()
  showOptions ()
  leaveStay (indicator)
   */





}

Controller.prototype.start = function () {
  console.log(menu.getMessage.welcomeMessage)
  rl.question(menu.getMessage.showOptions, processInput)
}

function processIO (message, func) {

  rl.question(message, func)
}

function processInput (input) {
  switch (input) {
    case '1' :

      createNewUser()
      break
    case '2' :
      createNewGroup()
      break
    case '3' :
      showUsers()
      processIO(' ', processInput)
      break
    case '4' :
      showTree()
      processIO(' ', processInput)
      break
    case '5' :
      addUserToGroup()
      break
    case '6' :
      deleteUserFromGroup()
      break
    case '7' :
      changeUserAge()
      break
    case '8' :
      changeUserPassword()
      break
    case '9' :
      deleteGroup()
      break
    case '10':
      deleteUser()
      break
    case '11':
      groupSearch()
      break
    case '12':
      getUserProfile()
      break
    case '13':
      flat()
      break
    case '14':
      showOptions()
      break
    case '15':
      exitChat()
      break
    default :
      // if (!!input)
      processIO(menu.getMessage.unknownInput, processInput)
  }

}




function createNewUser () {
  processIO(menu.getMessage.enterUserName, getUsername)

  function getUsername (value) {
    leaveStay(value)
    currentSession.username = value
    if (value === '') {// empty input
      processIO(menu.getMessage.unknownInput, getUsername)
      return
    }
    else if (users.userExist(value)) {  // user already exist
      processIO(menu.getMessage.userExist + '\n' + menu.getMessage.enterUserName, getUsername)
      return
    }

    processIO(menu.getMessage.enterPassword, getPassword)
  }

  function getPassword (value) {
    leaveStay(value)
    currentSession.password = value
    if (value === '') { // empty input
      processIO(menu.getMessage.unknownInput, getPassword)
      return
    }
    processIO(menu.getMessage.enterAge, getAge)
  }

  function getAge (value) {
    leaveStay(value)
    currentSession.age = value
    if (value === '') { // empty input
      processIO(menu.getMessage.unknownInput, getAge)
      return
    }
    if (isNaN(Number(value))) { // not number
      processIO(menu.getMessage.notNumber, getAge)
      return
    }

    if (users.newUser(currentSession.username, currentSession.password, currentSession.age) === true) {
      console.log(menu.getMessage.userCreated + currentSession.username + "\n")
      processIO(' ', processInput)
    }

  }
}

function createNewGroup () {
  processIO(menu.getMessage.enterGroup, getGroupName)

  function getGroupName (value) {
    leaveStay(value)
    currentSession.groupname = value
    if (value === '') {
      processIO(menu.getMessage.unknownInput, getGroupName)
    }
    else if (value) {
      console.log(menu.indentTree(analyzer.getTree(groups.parentGroup))) // show tree
      processIO(menu.getMessage.chooseWhere, chooseWhere)

      function chooseWhere (value) {
        if (value === '') {
          processIO(menu.getMessage.unknownInput, chooseWhere)
        }
        else if (value) {

          if (!groups.isAgroup(value.split(','))) {
            processIO(menu.getMessage.pathNotExist, chooseWhere)
          }
          else if (value) {
            if (groups.addGroupByPath(value.split(','), currentSession.groupname)) {
              showTree()
              processIO(menu.getMessage.groupCreated, processInput)
            }
            else {
              processIO(menu.getMessage.wentwrong, chooseWhere)
            }

          }
        }
      }
    }

  }
}

function deleteGroup () {
  processIO(menu.getMessage.enterGroup, checkGroup)

  function checkGroup (value) {
    leaveStay(value)
    currentSession.groupname = value
    if (value === '') {
      processIO(menu.getMessage.unknownInput, checkGroup)
    }
    else if (value) {

      if (!menu.showPaths(analyzer.getPaths(groups.parentGroup, value))) {
        processIO(menu.getMessage.groupNotEXiSt, deleteGroup)
      }
      else {
        console.log(menu.showPaths(analyzer.results.allPaths))
        processIO(menu.getMessage.chooseWhereToDelete, chooseGroup)

        function chooseGroup (value) {
          if (Number(value) && Number(value) > 0 && Number(value) <= Object.keys(menu.currentUserPaths).length) {
            menu.currentUserPaths[Number(value)].pop()
            if (!groups.deleteGroupByPath(menu.currentUserPaths[Number(value)], currentSession.groupname)) {
              processIO(menu.getMessage.wentwrong, chooseGroup)
            }
            else {
              showTree()
              processIO(currentSession.groupname + menu.getMessage.deleted, processInput)
            }
          }
          else {
            processIO(menu.getMessage.unknownInput, chooseGroup)
          }
        }

      }

    }

  }
}

function deleteUser () {
  processIO(menu.getMessage.enterUserName, checkUsername)

  function checkUsername (value) {
    leaveStay(value)
    currentSession.username = value
    if (value === '') {
      processIO(menu.getMessage.unknownInput, checkUsername)
    }
    else if (!users.userExist(value)) {
      processIO(menu.getMessage.userNotEXiSt + '\n' + menu.getMessage.enterUserName, checkUsername)
    }
    else {

      analyzer.resignFromAllGroups(groups.parentGroup, value)
      users.deleteUser(value)

      processIO(currentSession.username + menu.getMessage.deleted, processInput)

    }

  }
}

function addUserToGroup () {
  processIO(menu.getMessage.enterUserName, getUsername)

  function getUsername (value) {
    leaveStay(value)
    currentSession.username = value
    if (value === '') {
      processIO(menu.getMessage.unknownInput, getUsername)
    }
    else if (!users.userExist(value)) {
      processIO(menu.getMessage.userNotEXiSt, getUsername)
    }
    else {
      processIO(menu.getMessage.enterDstGroup, groupNameInput)
    }
  }

  function groupNameInput (value) {
    leaveStay(value)
    if (value === '') {
      processIO(menu.getMessage.unknownInput, groupNameInput)
    }
    else if (value) {
      currentSession.groupname = value
      if (!menu.showPaths(analyzer.getPaths(groups.parentGroup, value))) {
        processIO(menu.getMessage.groupNotEXiSt, groupNameInput)
      }
      else {
        console.log(menu.showPaths(analyzer.results.allPaths))
        processIO(menu.getMessage.chooseWhereToAdd, chooseGroup)

        function chooseGroup (value) {
          if (Number(value) && Number(value) > 0 && Number(value) <= Object.keys(menu.currentUserPaths).length) {
            if (groups.addUserByPath(menu.currentUserPaths[Number(value)], users.rawUserList[currentSession.username])) {
              showTree()
              processIO(menu.getMessage.userAdded + currentSession.groupname + "\n", processInput)//////////////////////////////////////////////////////////////

            }
            else {
              console.log(menu.showPaths(analyzer.results.allPaths))
              processIO(menu.getMessage.wentwrong, chooseGroup)
            }
            // groups.deleteGroupByPath(menu.currentUserPaths[value])//deleted

          }
          else {
            processIO(menu.getMessage.unknownInput, chooseGroup)
          }
        }

      }
    }

  }

}

function deleteUserFromGroup () {
  processIO(menu.getMessage.enterUserName, getUsername)

  function getUsername (value) {
    leaveStay(value)
    currentSession.username = value
    if (value === '') {
      processIO(menu.getMessage.unknownInput, getUsername)
    }
    else if (!users.userExist(value)) {
      processIO(menu.getMessage.userNotEXiSt, getUsername)
    }
    else if (users.userExist(value)) {
      if ((!menu.showPaths(analyzer.allUserGroups(groups.parentGroup, currentSession.username))))
        processIO(menu.getMessage.haveNoGroups, getUsername)
      else {
        console.log(menu.showPaths(analyzer.results.allPaths))
        processIO(menu.getMessage.chooseWhereToDeleteUser, chooseGroup)
      }
    }
  }

  function chooseGroup (value) {
    if (Number(value) && Number(value) > 0 && Number(value) <= Object.keys(menu.currentUserPaths).length) {
      if (groups.deleteUserByPath(menu.currentUserPaths[Number(value)], currentSession.username)) {
        processIO(menu.getMessage.userDeletedFromGroup, processInput)//////////////////////////////////////////////
      }
      else {
        console.log(menu.showPaths(analyzer.results.allPaths))
        processIO(menu.getMessage.wentwrong, chooseGroup)
      }
      // groups.deleteGroupByPath(menu.currentUserPaths[value])//deleted

    }
    else {
      processIO(menu.getMessage.unknownInput, chooseGroup)
    }
  }

}

function changeUserPassword () {
  processIO(menu.getMessage.enterUserName, getUsername)

  function getUsername (value) {
    leaveStay(value)

    if (value === '') {
      processIO(menu.getMessage.unknownInput, getUsername)
    }
    else if (!users.userExist(value)) {
      processIO(menu.getMessage.userNotEXiSt, getUsername)
    }
    else {
      currentSession.currentUser = users.rawUserList[value]
      processIO(menu.getMessage.enterNewPassword, getNewPassword)

      function getNewPassword (value) {
        leaveStay(value)
        if (value === '') {
          processIO(menu.getMessage.noInput, getNewPassword)
        }
        currentSession.currentUser.changePassword(value)
        processIO(menu.getMessage.passwordChanged + value + '\n', processInput)
      }

    }
  }

}

function changeUserAge () {
  processIO(menu.getMessage.enterUserName, getUsername)

  function getUsername (value) {
    leaveStay(value)

    if (value === '') {
      processIO(menu.getMessage.unknownInput, getUsername)
    }
    else if (!users.userExist(value)) {
      processIO(menu.getMessage.userNotEXiSt, getUsername)
    }
    else {
      currentSession.currentUser = users.rawUserList[value]
      processIO(menu.getMessage.enterNewAge, getAge)

      function getAge (value) {
        leaveStay(value)
        if (value === '') {
          processIO(menu.getMessage.noInput, getAge)
        }
        else if (isNaN(Number(value))) {
          processIO(menu.getMessage.notNumber, getAge)
        }
        currentSession.currentUser.changeAge(value)
        processIO(menu.getMessage.AgeChanged + value + '\n', processInput)
      }

    }
  }

}

function groupSearch () {
  processIO(menu.getMessage.enterGroup, checkGroup)

  function checkGroup (value) {
    leaveStay(value)
    currentSession.groupname = value
    if (value === '') {
      processIO(menu.getMessage.unknownInput, checkGroup)
    }
    else if (value) {

      if (!menu.showPaths(analyzer.getPaths(groups.parentGroup, value))) {
        processIO(menu.getMessage.groupNotEXiSt, checkGroup)
      }
      else {
        console.log(menu.showPaths(analyzer.results.allPaths))
        processIO('\n', processInput)

      }
    }
  }
}

function flat () {

  processIO(menu.getMessage.chooseFlat, checkGroup)

  function checkGroup (value) {
    leaveStay(value)
    currentSession.groupname = value
    if (value === '') {
      processIO(menu.getMessage.unknownInput, checkGroup)
    }
    else if (value) {
      if (!menu.showPaths(analyzer.getPaths(groups.parentGroup, value))) {
        processIO(menu.getMessage.groupNotEXiSt, deleteGroup)
      }
      else {
        console.log(menu.showPaths(analyzer.results.allPaths))
        processIO(menu.getMessage.choosePath, chooseGroup)
      }

      function chooseGroup (value) {
        leaveStay(value)
        if (Number(value) && Number(value) > 0 && Number(value) <= Object.keys(menu.currentUserPaths).length) {
          analyzer.flatTree(groups.parsePathArr(menu.currentUserPaths[value]))
          console.log(menu.indentTree(analyzer.getTree(groups.parentGroup)))
          processIO(menu.getMessage.flated, processInput)
        }
        else {
          console.log(menu.showPaths(analyzer.results.allPaths))
          processIO(menu.getMessage.unknownInput, chooseGroup)
        }
      }
    }
  }

}

function getUserProfile () {
  processIO(menu.getMessage.enterUserName, getUsername)

  function getUsername (value) {
    leaveStay(value)
    if (value === '') {
      processIO(menu.getMessage.unknownInput, getUsername)
    }
    else if (!users.userExist(value)) {
      processIO(menu.getMessage.userNotEXiSt, getUsername)
    }
    else if (users.userExist(value)) {
      currentSession.username = value
      console.log(menu.displayUserProfile(users.rawUserList[currentSession.username]))
      console.log(menu.showPaths(analyzer.allUserGroups(groups.parentGroup, currentSession.username)))
      //menu.showPaths(analyzer.allUserGroups(groupsCtrl.parentGroup,"ofer"))
      processIO(' ', processInput)
    }
  }

}



// check whether the user choose to exit or go back to options screen
function leaveStay (indicator) {
  if (indicator === 'exit') {
    exitChat()
  }
  else if (indicator === 'back') {
    showOptions()
  }
}

function showOptions () {
  processIO(menu.getMessage.showOptions, processInput)
}

// exitChat exit chat app.
function exitChat () {
  process.exit(1)
}

function showUsers () {
  console.log(menu.displayUserList(users))
}

function showTree () {
  console.log(menu.indentTree(analyzer.getTree(groups.parentGroup)))
}





