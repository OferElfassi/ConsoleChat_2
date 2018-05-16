module.exports = Menu

function Menu () {
  this.currentUserPaths = {}
  this.currentUserSinglePath = []
}
/*

displayUserList (usersRef)
displayUserProfile (userRef)
indentTree (parsedTree)
showPaths (pathsObj)
getMessage - UI

pathArrToString (pathArr, rawResultsRef)
space (spaceNum, sign)
*/


//getMessage hold messages to be printed on the console.
Menu.prototype.getMessage = {

  showOptions: '                             chat Options\n' +
  '________________________________________________________________________\n' +
  '1.  | Add new user \t\t\t\t\t\t\t2.  | Add new group \n' +
  '3.  | Show user list\t\t\t\t\t\t4.  | Show group tree \n' +
  '5.  | Add user to group\t\t\t\t\t\t6.  | Delete user from group \n' +
  '7.  | Change user age\t\t\t\t\t\t8.  | Change user password \n' +
  '9.  | Delete group\t\t\t\t\t\t\t10. | Delete user\n' +
  '11. | Search group\t\t\t\t\t\t\t12. | Show user details \n' +
  '13. | Flat\t\t\t\t\t\t\t\t\t14. | Show options \n' +
  '15. | Enter \'exit\' anytime to quit\n\n',

  userNotEXiSt: 'Cant find provided username\n',
  userNotExistInGroup: 'cant find provided username in this group list\n',
  groupNotEXiSt: 'Cant find provided group name, try again\n',
  userExist: 'This username already exist, Please try again\n',
  userExistInGroup: 'This username is already member of this group.\n' +
  'Try other group or enter \'back\' to see input options\n',
  groupExist: 'This group name already exist, Please try again\n',
  userCreated: 'User created successfully for ',
  groupCreated: 'Group created successfully\n',
  userAdded: ' is now member of ',
  welcomeMessage: '                      Welcome to Console Chat \u0002 \n',
  haveNoGroups: 'This user d\'ont have any groups , try other user ',
  enterUserName: 'Enter username\n',
  enterNewUserName: 'Enter new username\n',
  enterPassword: 'Enter password\n',
  enterNewPassword: 'Enter ew password\n',
  passwordChanged: 'Password changed to ',
  enterAge: 'Enter age\n',
  AgeChanged: 'Age changed to',
  enterNewAge: 'Enter new age\n',
  notNumber: 'Please enter number for age\n',
  noInput: 'Cant receive empty value, Try again\n',
  enterGroup: 'Enter group name\n',
  exitMsg: 'Bye Bye\n',
  unknownInput: 'Unknown input, please try again\n',
  deleted: ' deleted successfully\n',
  chooseWhere: 'choose where would you like to add new group.\n' +
  ' Enter full path separated wth comma\'s (\'PARENT,GROUP_1,GROUP_2,....\')\n',
  pathNotExist: 'Path not exist, try again\n',
  wentwrong: 'Something went wrong, try again\n',
  chooseWhereToDelete: 'Choose the desired group path number to delete',
  enterDstGroup: 'Enter destination group name\n',
  chooseWhereToDeleteUser: 'Choose the desired group path number to resign from\n',
  chooseWhereToAdd: 'Choose the desired group path number to sign the user to\n',
  userDeletedFromGroup: 'User deleted from group\n',
  userHaveNoGroups: 'Not member of any group, try another user\n',
  chooseFlat: 'Enter group to flat from\n',
  choosePath: 'Choose the desired path number\n',
  flated: 'Flated successfully '
}

Menu.prototype.displayUserList = function (usersRef) {
  return usersRef.showUserList().join('\n')
}

Menu.prototype.displayUserProfile = function (userRef) {
  let result = ''
  let messageArr = userRef.getProfile()
  result = 'username - ' + messageArr[0] + '\n' +
    'Age - ' + messageArr[1] + '\n' +
    'Password - ' + messageArr[2]
  return result
}

Menu.prototype.indentTree = function (parsedTree) {
  let messageArr = []
  let treeLength = parsedTree.length - 1
  for (let index = treeLength; index >= 0; index--) {
    if (parsedTree[index].isLeaf && parsedTree[index].endpointSubs > 0) {
      messageArr[treeLength - index] = parsedTree[index].level + space(parsedTree[index].level, '-')
        + parsedTree[index].item + '  ' + parsedTree[index].endpointSubs + '\n' +
        space(parsedTree[index].level, ' ') + parsedTree[index].users.join(space(parsedTree[index].level, ' ')
          + '\n' + space(parsedTree[index].level, ' '))
    }
    else {
      messageArr[treeLength - index] = parsedTree[index].level + space(parsedTree[index].level, '-')
        + parsedTree[index].item + '  ' + parsedTree[index].endpointSubs
    }
  }
  messageArr.unshift('Level   Group   Users\n______________________\n')
  return messageArr.join(' \n')
}

Menu.prototype.showPaths = function (pathsObj) {
  let messageArr = []
  let fullPath = ''
  this.currentUserPaths = {}
  let numOfPaths = Object.keys(pathsObj).length
  for (let pathIndex in pathsObj) {
    fullPath = pathArrToString(pathsObj[pathIndex], this.currentUserSinglePath)
    if (fullPath) {
      let pathNum = Object.keys(this.currentUserPaths).length + 1
      this.currentUserPaths[pathNum] = this.currentUserSinglePath.slice()
      this.currentUserSinglePath = []
      messageArr.push(pathIndex + ')' + fullPath)
    }
  }
  return messageArr.join(' \n')
}

function pathArrToString (pathArr, rawResultsRef) {
  let result = 'PARENT'
  let pathStr = ''
  rawResultsRef.push(result)
  let arrLength = pathArr.length
  for (let index = 0; index < arrLength; index++) {
    if (pathArr[index].item !== null) {
      pathStr = pathArr[index].item
      rawResultsRef.push(pathStr)
      result = result + ' ' + (space(1, '==>') + pathStr)

    }
  }
  return result
}

function space (spaceNum, sign) {
  return sign.repeat(spaceNum * 3)
}