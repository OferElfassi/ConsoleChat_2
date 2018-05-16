const Group = require('./group')

module.exports = (function () {

    function Groups() {
        this.parentGroup = new Group;
        this.currentPath = [];
        this.allPaths = [];
        this.addGroupByPath(this.parentGroup,"PARENT")
      /*
      isAgroup (Path)
      deleteGroupByPath (containerPath, groupname)
      deleteUserByPath  function (path, username)
      addUserByPath  function (path, userObj)
      addGroupByPath (path, groupname)

      parsePathArr  (pathArr)
       */

    }

  Groups.prototype.isAgroup = function (Path) {
    let target = parsePath(Path, this.parentGroup)
    return (target instanceof Group)
  };

  Groups.prototype.addGroupByPath = function (path, groupname) {
    let target = parsePath(path, this.parentGroup)
    return target === null ? false : target.addSubGroup(groupname);
  };

  Groups.prototype.deleteGroupByPath = function (containerPath, groupname) {
    let target = parsePath(containerPath, this.parentGroup)
    return target === null ? false : target.deleteSubEntity(groupname)
  };

  Groups.prototype.addUserByPath = function (path, userObj) {
    let target = parsePath(path, this.parentGroup)
    return target === null ? false : target.addSubUser(userObj)
  };

  Groups.prototype.deleteUserByPath = function (path, username) {
    let target = parsePath(path, this.parentGroup);
    if (target.hasOwnProperty(username)) {
      return target === null ? false : target.deleteSubEntity(username)
    }
    return false
  };

  Groups.prototype.parsePathArr = function (pathArr) {
    return parsePath(pathArr,this.parentGroup)
  };


  function parsePath(path, parentRef) {
    if (Array.isArray(path)) {
      let pathLength = path.length
      let refObj = parentRef
      for (let index = 0; index < pathLength; index++) {
        refObj = refObj[path[index]]
      }
      return refObj
    }
    return path;
  }

  return Groups

})();