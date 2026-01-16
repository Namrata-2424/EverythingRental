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

exports.up = function(db) {
  const toolsSql = fs.readFileSync(
    path.join(__dirname,'../sql/tools_up.sql'),
    'utf-8'
  );

  return db.runSql(toolsSql);
};

exports.down = function(db) {
  const toolsSql = fs.readFileSync(
    path.join(__dirname,'../sql/tools_down.sql'),
    'utf-8'
  );
  return db.runSql(toolsSql);
};

exports._meta = {
  "version": 1
};
