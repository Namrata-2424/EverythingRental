'use strict';

var dbm;
var type;
var seed;
const fs = require('fs');
const path = require('path');

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  const toolsborrowSql = fs.readFileSync(
      path.join(__dirname,'../sql/tools_borrow_mapping_up.sql'),
      'utf-8'
    );
  
  return db.runSql(toolsborrowSql);
};

exports.down = function (db) {
  const toolsborrowSql = fs.readFileSync(
      path.join(__dirname,'../sql/tools_borrow_mapping_down.sql'),
      'utf-8'
    );
  
  return db.runSql(toolsborrowSql);
};

exports._meta = {
  "version": 1
};
