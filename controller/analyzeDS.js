module.exports = AnalizeDS

function AnalizeDS () {

  this.values = {
    targetUserName: '',
    targetGroupName: '',
    wasleaf: false
  }

  this.results = {
    singlePath: [],
    userPaths: [],
    allPaths: {},
    wholeTreeInfo: [],
    pathList: [],
    targetUserGroups: {}
  }
  this.tempData = {
    foundFlag: false,
    currentLevel: 0,
    pastLevel: 0,
    currentPath: [],
    mergedPath: [],
    currentUserAmount: 0,
    pastUserAmount: 0,
    pastTreeLevel: 0,
    formerParent: {},
    userContainer: {}
  }

  /*
  PathItem (item, level, numOfEntities, isleaf, users)

  zeroResults ()
  zeroTempData ()
  getPaths (container, entityName)
  resignFromAllGroups (container, username)
  getTree (container)
  flatTree (flatFrom)
  allUserGroups (container, username)

  scanDSB (parentGroup, level, analyzer, callback)                  -  Forward tree scan

  getUserGroups (parentGroup, item, level, analyzer, isLeaf, username)
  searchGroup (parentGroup, item, level, analyzer, isLeaf, username)

  scanDSF (parentGroup, level, analyzer, callback)                   - Backward tree scan

  resignFromAll (parentGroup, item, level, analyzer, isLeaf, username)
  builedTree (parentGroup, item, level, analyzer, isLeaf, username)
  flat (parentGroup, item, level, analyzer, isLeaf, username)

   */

}

function PathItem (item, level, numOfEntities, isleaf, users) {
  this.item = item
  this.level = level
  this.endpointSubs = numOfEntities || 0
  this.isLeaf = isleaf || false
  this.users = users
}

AnalizeDS.prototype.zeroResults = function () {
  this.results.userPaths = []
  this.results.wholeTreeInfo = []
  this.results.allPaths = {}
  this.results.singlePath = []
}

AnalizeDS.prototype.zeroTempData = function () {
  this.tempData.currentLevel = false
  this.tempData.currentLevel = 0
  this.tempData.pastLevel = 0
  this.tempData.currentPath = []
  this.tempData.mergedPath = []
  this.tempData.currentUserAmount = 0
}

AnalizeDS.prototype.getPaths = function (container, entityName) {
  this.zeroResults()
  this.zeroTempData()
  this.values.targetGroupName = entityName
  scanDSF(container, 0, this, searchGroup)
  let finalList = this.results.allPaths
  return this.results.allPaths

}

AnalizeDS.prototype.resignFromAllGroups = function (container, username) {
  this.zeroResults()
  this.zeroTempData()
  this.values.targetUserName = username
  scanDSB(container, 0, this, resignFromAll)
  return this.results.userPaths
}

AnalizeDS.prototype.getTree = function (container) {
  this.zeroResults()
  this.zeroTempData()
  scanDSB(container, 0, this, builedTree)
  return this.results.wholeTreeInfo
}

AnalizeDS.prototype.flatTree = function (flatFrom) {
  this.zeroResults()
  this.zeroTempData()
  let flatTarget = Object.assign({}, flatFrom)
  scanDSB(flatTarget, 0, this, flat)
  flatFrom.detachGroup()
  flatFrom.addUsers(this.tempData.userContainer)
}

AnalizeDS.prototype.allUserGroups = function (container, username) {
  this.zeroResults()
  this.zeroTempData()
  this.values.targetUserName = username
  scanDSF(container, 0, this, getUserGroups)
  this.values.targetUserName = ''
  return this.results.allPaths
}

function scanDSB (parentGroup, level, analyzer, callback) {
  level += 1
  for (let props = 0; props < Object.keys(parentGroup).length; props++) {
    let currentProperty = parentGroup[Object.keys(parentGroup)[props]]
    if (gotChildren(currentProperty) && !haveUsers(currentProperty)) {
      scanDSB(currentProperty, level, analyzer, callback)
      callback(parentGroup, Object.keys(parentGroup)[props], level, analyzer, false, analyzer.values.targetUserName)
      continue
    }
    callback(parentGroup, Object.keys(parentGroup)[props], level, analyzer, true, analyzer.values.targetUserName)
  }
  level = 0
  return true
}

function scanDSF (parentGroup, level, analyzer, callback) {
  level += 1
  for (var props = 0; props < Object.keys(parentGroup).length; props++) {
    let currentProperty = parentGroup[Object.keys(parentGroup)[props]]
    callback(parentGroup, Object.keys(parentGroup)[props], level, analyzer, false, analyzer.values.targetUserName)
    if (gotChildren(currentProperty) && !haveUsers(currentProperty)) {
      scanDSF(currentProperty, level, analyzer, callback)
      continue
    }
    callback(parentGroup, 'leaf\n', level, analyzer, true, analyzer.values.targetUserName)
  }
  level = 0
  return true
}

function resignFromAll (parentGroup, item, level, analyzer, isLeaf, username) {
  let tempNode = parentGroup[item]
  if (isLeaf && gotUsers(parentGroup, item, username)) {
    if (tempNode.hasOwnProperty(username)) {
      tempNode.deleteSubEntity(username)
    }
  }
}

function haveUsers (Entity) {
  let propsArr = Object.keys(Entity)
  return (typeof Entity[propsArr[0]].changePassword !== 'undefined')
}

function gotChildren (Entity) {
  if (Entity) {

    let propsArr = Object.keys(Entity)
    return (propsArr.length > 0)
  }
}

function gotUsers (parentGroup, item, username) {
  let tempNode = parentGroup[item]
  if (gotChildren(tempNode) && haveUsers(tempNode)) {
    if (arguments.length === 2) {
      return Object.keys(tempNode).length
    }
    else if (arguments.length === 3) {
      return (tempNode.hasOwnProperty(username))
    }
  }
  return 0
}

function builedTree (parentGroup, item, level, analyzer, isLeaf, username) {
  let usersList = []
  if (isLeaf) {
    analyzer.tempData.currentUserAmount += gotUsers(parentGroup, item)
    usersList = parentGroup[item].getUsers()
  }
  else {
    analyzer.tempData.currentUserAmount += gotUsers(parentGroup, item)
  }
  analyzer.results.wholeTreeInfo.push(new PathItem(item, level, analyzer.tempData.currentUserAmount, isLeaf, usersList))
}

function flat (parentGroup, item, level, analyzer, isLeaf, username) {
  if (isLeaf && gotChildren(parentGroup[item])) {
    analyzer.tempData.userContainer = Object.assign(analyzer.tempData.userContainer, parentGroup[item])
  }
}

function getUserGroups (parentGroup, item, level, analyzer, isLeaf, username) {

  if (analyzer.values.wasleaf) {
    analyzer.results.singlePath.splice(level - 2)
    analyzer.values.wasleaf = false
  }
  if (isLeaf) {
    analyzer.values.wasleaf = true
    let index = analyzer.results.singlePath.length
    if (index > 0) {
      if (gotUsers(analyzer.formerParent, analyzer.results.singlePath[index - 1].item, username)) {
        let pathNum = Object.keys(analyzer.results.allPaths).length + 1
        analyzer.results.allPaths[pathNum] = analyzer.results.singlePath.slice()
      }
    }
  }
  if (item !== 'PARENT') {
    analyzer.results.singlePath.push(new PathItem(item, level, gotUsers(parentGroup, item), isLeaf))

  }
  analyzer.formerParent = parentGroup
}

function searchGroup (parentGroup, item, level, analyzer, isLeaf, username) {
  if (analyzer.values.wasleaf) {
    analyzer.results.singlePath.splice(level - 2)
    analyzer.values.wasleaf = false
  }
  if (isLeaf) {
    analyzer.values.wasleaf = true
  }
  if (item !== 'PARENT') {
    analyzer.results.singlePath.push(new PathItem(item, level, gotUsers(parentGroup, item), isLeaf))
  }

  if (item === analyzer.values.targetGroupName) {

    let pathNum = Object.keys(analyzer.results.allPaths).length + 1
    analyzer.results.allPaths[pathNum] = analyzer.results.singlePath.slice()

  }

}

