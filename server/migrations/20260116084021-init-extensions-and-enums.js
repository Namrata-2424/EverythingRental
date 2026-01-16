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
  const extensionsSql = fs.readFileSync(
    path.join(__dirname,'../sql/extensions_up.sql'),
    'utf-8'
  );

  const typesSql = fs.readFileSync(
    path.join(__dirname,'../sql/types_up.sql'),
    'utf-8'
  );

  return db.runSql(extensionsSql + "\n" + typesSql);
};

exports.down = function(db) {
  const extensionsSql = fs.readFileSync(
    path.join(__dirname,'../sql/extensions_down.sql'),
    'utf-8'
  );

  const typesSql = fs.readFileSync(
    path.join(__dirname,'../sql/types_down.sql'),
    'utf-8'
  );  

  return db.runSql(extensionsSql + "\n" + typesSql);
};

exports._meta = {
  "version": 1
};
