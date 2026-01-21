'use strict';

var dbm;
var type;
var seed;
const fs = require("fs");
const path = require("path")

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  const alterQuery = fs.readFileSync(
    path.join(__dirname,"../sql/alter_tool_owners_up.sql"),
    'utf-8'
  )
  return db.runSql(alterQuery);
};

exports.down = function(db) {
  const alterQuery = fs.readFileSync(
    path.join(__dirname,"../sql/alter_tool_owners_down.sql"),
    'utf-8'
  )
  return db.runSql(alterQuery);
};

exports._meta = {
  "version": 1
};
