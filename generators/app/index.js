'use strict';
var path = require('path'),
  util = require('util'),
  yeoman = require('yeoman-generator'),
  chalk = require('chalk'),
  _ = require('lodash'),
  pluralize = require('pluralize'),
  packagejs = require(__dirname + '/../../package.json'),
  fs = require('fs'),
  semver = require('semver'),
  glob = require("glob");

// Stores JHipster variables
var jhipsterVar = {moduleName: 'angular-datatables'};

// Stores JHipster functions
var jhipsterFunc = {};

var STRIP_HTML = 'stripHtml',
  STRIP_JS = 'stripJs',
  COPY = 'copy',
  TPL = 'template';

const SERVER_MAIN_SRC_DIR = 'src/main/java/';
const JHIPSTER_USER_TABLE_NAME = 'jhi_user';
const INTERPOLATE_REGEX = '/<%:([\s\S]+?)%>/g'; // so that tags in templates do not get mistreated as _ templates

module.exports = yeoman.Base.extend({

  initializing: {
    compose: function (args) {
      this.composeWith('jhipster:modules', {
        options: {
          jhipsterVar: jhipsterVar,
          jhipsterFunc: jhipsterFunc
        }
      });

      if (args == 'default') {
        this.updateType = 'all';
      }
    },

    displayLogo: function () {
      this.log(chalk.white('Welcome to the ' + chalk.bold('JHipster-Angular-DataTables') + ' Generator! ' + chalk.yellow('v' + packagejs.version + '\n')));
      this.log(chalk.white('This will change JHipster Entity list component with Angular-DataTables') + '\n');
    },

    checkJHVersion: function () {
      var supportedJHVersion = packagejs.dependencies['generator-jhipster'];
      if (jhipsterVar.jhipsterVersion && !semver.satisfies(jhipsterVar.jhipsterVersion, supportedJHVersion)) {
        this.env.error(chalk.red.bold('ERROR!') + ' I support only JHipster versions greater than ${supportedJHVersion}... If you want to use Entity Audit with an older JHipster version, download a previous version that supports the required JHipster version.');
      }
    },

    getEntitityNames: function () {
      var existingEntities = [],
        existingEntityChoices = [],
        existingEntityNames = [];
      try {
        existingEntityNames = fs.readdirSync('.jhipster');
      } catch (e) {
        this.log(chalk.red.bold('ERROR!') + ' Could not read entities, you might not have generated any entities yet. I will continue to install audit files, entities will not be updated...\n');
      }

      existingEntityNames.forEach(function (entry) {
        if (entry.indexOf('.json') !== -1) {
          var entityName = entry.replace('.json', '');
          existingEntities.push(entityName);
          existingEntityChoices.push({name: entityName, value: entityName});
        }
      });
      this.existingEntities = existingEntities;
      this.existingEntityChoices = existingEntityChoices;
    }
  },

  prompting: function () {
    var done = this.async();
    var prompts = [
      {
        type: 'list',
        name: 'useTemplate',
        message: '(1/2) Do you want to use template based or the default views?',
        choices: [
          {name: 'Yes, use templates based', value: true},
          {name: 'No, use default views', value: false}
        ],
        default: true
      }, {
        type: 'list',
        name: 'updateType',
        message: '(2/2) Do you want to change all existing entities, all your custom code will be overwritten?',
        choices: [
          {name: 'Yes, update all', value: 'all'},
          {name: 'No, let me choose the entities to update', value: 'selected'}
        ],
        default: 'all'
      },
      {
        when: function (response) {
          return response.updateType != 'all';
        },
        type: 'checkbox',
        name: 'entitiesToUpdate',
        message: 'Please choose the entities to be updated',
        choices: this.existingEntityChoices,
        default: 'none'
      }
    ];

    if (this.updateType == 'all') {
      this.updateType = 'all';
      done();
    } else {
      this.prompt(prompts, function (props) {

        this.props = props;
        // To access props later use this.props.someOption;
        this.useTemplate = props.useTemplate;
        this.updateType = props.updateType;
        this.entitiesToUpdate = props.entitiesToUpdate;
        done();
      }.bind(this));
    }
  },

  writing: {
    updateYeomanConfig: function () {
      // this.config.set('auditFramework', this.auditFramework);
      // this.config.set('changeDeleteBehavior', this.changeDeleteBehavior);
    },

    setupGlobalVar: function () {
      this.baseName = jhipsterVar.baseName;
      this.packageName = jhipsterVar.packageName;
      this.angularAppName = jhipsterVar.angularAppName;
      this.frontendBuilder = jhipsterVar.frontendBuilder;
      this.buildTool = jhipsterVar.buildTool;
      this.databaseType = jhipsterVar.databaseType;
      this.devDatabaseType = jhipsterVar.devDatabaseType;
      this.prodDatabaseType = jhipsterVar.prodDatabaseType;
      this.enableTranslation = jhipsterVar.enableTranslation;
      this.changelogDate = jhipsterFunc.dateFormatForLiquibase();
      this.searchEngine = jhipsterVar.searchEngine;
      this.webappDir = jhipsterVar.webappDir;
      // this.javaTemplateDir = 'src/main/java/package';
      this.webTemplateDir = 'src/main/webapp';
      this.resourcesTemplateDir = 'src/main/resources';
      this.javaDir = jhipsterVar.javaDir;
      this.resourceDir = jhipsterVar.resourceDir;
      this.interpolateRegex = /<%=([\s\S]+?)%>/g; // so that thymeleaf tags in templates do not get mistreated as _ templates
      this.jhipsterConfigDirectory = '.jhipster';
      this.copyFiles = function (files) {
        files.forEach(function (file) {
          jhipsterFunc.copyTemplate(file.from, file.to, file.type ? file.type : TPL, this, file.interpolate ? {'interpolate': file.interpolate} : undefined);
        }, this);
      };
    },

    writeBaseFiles: function () {

      //Add bower dependencies
      jhipsterFunc.addBowerDependency('angular-datatables', '0.5.5');

      //Add Angular-Datatables module dependencies
      jhipsterFunc.addAngularJsModule('datatables');
      jhipsterFunc.addAngularJsModule('datatables.factory');
      jhipsterFunc.addAngularJsModule('datatables.bootstrap');
      jhipsterFunc.addAngularJsModule('datatables.colreorder');
      jhipsterFunc.addAngularJsModule('datatables.columnfilter');
      jhipsterFunc.addAngularJsModule('udt');

      //Copy components services
      var filesToCopy = [
        // {
        //   from: this.webappDir + 'app/admin/entity-audit/_entity-audits.html',
        //   to: this.webappDir + 'app/admin/entity-audit/entity-audits.html'},
        {
          from: this.webTemplateDir + '/app/components/udt/_gui.service.js',
          to: this.webappDir + 'app/components/udt/gui.service.js'
        }
      ];
      // this.copy(this.webTemplateDir + '/app/components/UDT/GUI.service.js', this.webappDir + 'app/components/UDT/GUI.service.js');
      this.copyFiles(filesToCopy);
    },

    updateEntityFiles: function () {
      // Update existing entities to enable audit
      if (this.updateType == 'all') {
        this.entitiesToUpdate = this.existingEntities;
      }
      if (this.entitiesToUpdate && this.entitiesToUpdate.length > 0 && this.entitiesToUpdate != 'none') {
        this.log('\n' + chalk.bold.green('I\'m Updating selected entities ') + chalk.bold.yellow(this.entitiesToUpdate));
        var jsonObj = null;
        // this.auditedEntities = [];

        this.entitiesToUpdate.forEach(function (entityName) {
          // this.auditedEntities.push("\"" + entityName + "\"")
          // We read configuration from file
          var fileName = this.jhipsterConfigDirectory + '/' + entityName + ".json";
          this.fileData = this.fs.readJSON(fileName);
          this.entityNameCapitalized = _.upperFirst(entityName);
          //Config Entity data
          this.dto = this.fileData.dto;
          if (this.dto != undefined) {
            this.log(chalk.red.bold('WARN!') + ' dto is missing in .jhipster/' + this.entityNameCapitalized + '.json, using no as fallback\n');
            this.dto = 'no';
          }

          this.entityAngularJSSuffix = '';

          if (this.fileData.angularJSSuffix !== undefined) {
            this.entityAngularJSSuffix = this.fileData.angularJSSuffix;
          }

          var entityNameSpinalCased = _.kebabCase(_.lowerFirst(entityName));
          var entityNamePluralizedAndSpinalCased = _.kebabCase(_.lowerFirst(pluralize(entityName)));
          this.entityPluralFileName = entityNamePluralizedAndSpinalCased + this.entityAngularJSSuffix;
          this.entityStateName = entityNameSpinalCased + this.entityAngularJSSuffix;
          this.entityFolderName = entityNameSpinalCased;
          this.entityFileName = entityNameSpinalCased + this.entityAngularJSSuffix;
          this.entityClass = this.entityNameCapitalized;
          this.entityAngularJSName = this.entityClass + _.upperFirst(_.camelCase(this.entityAngularJSSuffix));
          this.entityInstance = _.lowerFirst(entityName);
          this.entityClassPlural = pluralize(entityName);
          this.entityClassPluralHumanized = _.startCase(this.entityClassPlural);
          this.entityClassHumanized = _.startCase(this.entityNameCapitalized);
          this.pagination = this.fileData.pagination;
          this.entityInstancePlural = pluralize(this.entityInstance);
          this.entityTranslationKey = this.entityInstance;
          this.fieldsContainBlob = false;
          this.relationships = this.fileData.relationships;
          this.fields = this.fileData.fields;
          if (this.databaseType === 'cassandra' || this.databaseType === 'mongodb') {
            this.pkType = 'String';
          } else {
            this.pkType = 'Long';
          }
          //load relationship
          this.fieldsContainOwnerManyToMany = false;
          this.fieldsContainNoOwnerOneToOne = false;
          this.fieldsContainOwnerOneToOne = false;
          this.fieldsContainOneToMany = false;
          this.fieldsContainManyToOne = false;
          this.differentTypes = [this.entityClass];


          if (!this.relationships) {
            this.relationships = [];
          }


          if (this.useTemplate) {
            jhipsterFunc.copyHtml(this.webTemplateDir + '/app/entities/tpl/_entity-box-header-template.ejs',
              this.webappDir + 'app/entities/tpl/list-box-header-tpl.html',
              this, {}, true);
            jhipsterFunc.copyHtml(this.webTemplateDir + '/app/entities/tpl/_entity-header-template.ejs',
              this.webappDir + 'app/entities/tpl/list-header-tpl.html',
              this, {}, true);
          }

          // Load in-memory data for fields
          this.fields && this.fields.forEach(function (field) {
            // Migration from JodaTime to Java Time
            if (field.fieldType === 'DateTime' || field.fieldType === 'Date') {
              field.fieldType = 'ZonedDateTime';
            }
            var fieldType = field.fieldType;

            var nonEnumType = _.includes(['String', 'Integer', 'Long', 'Float', 'Double', 'BigDecimal',
              'LocalDate', 'ZonedDateTime', 'Boolean', 'byte[]', 'ByteBuffer'], fieldType);
            if ((this.databaseType === 'sql' || this.databaseType === 'mongodb') && !nonEnumType) {
              field.fieldIsEnum = true;
            } else {
              field.fieldIsEnum = false;
            }

            if (_.isUndefined(field.fieldNameCapitalized)) {
              field.fieldNameCapitalized = _.upperFirst(field.fieldName);
            }

            if (_.isUndefined(field.fieldNameUnderscored)) {
              field.fieldNameUnderscored = _.snakeCase(field.fieldName);
            }

            if (_.isUndefined(field.fieldNameHumanized)) {
              field.fieldNameHumanized = _.startCase(field.fieldName);
            }

            if (_.isUndefined(field.fieldInJavaBeanMethod)) {
              // Handle the specific case when the second letter is capitalized
              // See http://stackoverflow.com/questions/2948083/naming-convention-for-getters-setters-in-java
              if (field.fieldName.length > 1) {
                var firstLetter = field.fieldName.charAt(0);
                var secondLetter = field.fieldName.charAt(1);
                if (firstLetter === firstLetter.toLowerCase() && secondLetter === secondLetter.toUpperCase()) {
                  field.fieldInJavaBeanMethod = firstLetter.toLowerCase() + field.fieldName.slice(1);
                } else {
                  field.fieldInJavaBeanMethod = _.upperFirst(field.fieldName);
                }
              } else {
                field.fieldInJavaBeanMethod = _.upperFirst(field.fieldName);
              }
            }

            if (_.isUndefined(field.fieldValidateRulesPatternJava)) {
              field.fieldValidateRulesPatternJava = field.fieldValidateRulesPattern ?
                field.fieldValidateRulesPattern.replace(/\\/g, '\\\\') : field.fieldValidateRulesPattern;
            }

            if (_.isArray(field.fieldValidateRules) && field.fieldValidateRules.length >= 1) {
              field.fieldValidate = true;
            } else {
              field.fieldValidate = false;
            }

            if (fieldType === 'ZonedDateTime') {
              this.fieldsContainZonedDateTime = true;
            } else if (fieldType === 'LocalDate') {
              this.fieldsContainLocalDate = true;
            } else if (fieldType === 'BigDecimal') {
              this.fieldsContainBigDecimal = true;
            } else if (fieldType === 'byte[]' || fieldType === 'ByteBuffer') {
              this.fieldsContainBlob = true;
            }

            if (field.fieldValidate) {
              this.validation = true;
            }
          }, this);

          this.relationships && this.relationships.forEach(function (relationship) {

            if (_.isUndefined(relationship.relationshipNameCapitalized)) {
              relationship.relationshipNameCapitalized = _.upperFirst(relationship.relationshipName);
            }

            if (_.isUndefined(relationship.relationshipNameCapitalizedPlural)) {
              if (relationship.relationshipName.length > 1) {
                relationship.relationshipNameCapitalizedPlural = pluralize(_.upperFirst(relationship.relationshipName));
              } else {
                relationship.relationshipNameCapitalizedPlural = _.upperFirst(pluralize(relationship.relationshipName));
              }
            }

            if (_.isUndefined(relationship.relationshipNameHumanized)) {
              relationship.relationshipNameHumanized = _.startCase(relationship.relationshipName);
            }

            if (_.isUndefined(relationship.relationshipNamePlural)) {
              relationship.relationshipNamePlural = pluralize(relationship.relationshipName);
            }

            if (_.isUndefined(relationship.relationshipFieldName)) {
              relationship.relationshipFieldName = _.lowerFirst(relationship.relationshipName);
            }

            if (_.isUndefined(relationship.relationshipFieldNamePlural)) {
              relationship.relationshipFieldNamePlural = pluralize(_.lowerFirst(relationship.relationshipName));
            }

            if (_.isUndefined(relationship.otherEntityRelationshipNamePlural) && (relationship.relationshipType === 'one-to-many' || (relationship.relationshipType === 'many-to-many' && relationship.ownerSide === false) || (relationship.relationshipType === 'one-to-one' && relationship.otherEntityName.toLowerCase() !== 'user'))) {
              relationship.otherEntityRelationshipNamePlural = pluralize(relationship.otherEntityRelationshipName);
            }

            if (_.isUndefined(relationship.otherEntityRelationshipNameCapitalized)) {
              relationship.otherEntityRelationshipNameCapitalized = _.upperFirst(relationship.otherEntityRelationshipName);
            }

            if (_.isUndefined(relationship.otherEntityRelationshipNameCapitalizedPlural)) {
              relationship.otherEntityRelationshipNameCapitalizedPlural = pluralize(_.upperFirst(relationship.otherEntityRelationshipName));
            }

            if (_.isUndefined(relationship.otherEntityNamePlural)) {
              relationship.otherEntityNamePlural = pluralize(relationship.otherEntityName);
            }

            if (_.isUndefined(relationship.otherEntityNameCapitalized)) {
              relationship.otherEntityNameCapitalized = _.upperFirst(relationship.otherEntityName);
            }

            if (_.isUndefined(relationship.otherEntityNameCapitalizedPlural)) {
              relationship.otherEntityNameCapitalizedPlural = pluralize(_.upperFirst(relationship.otherEntityName));
            }

            if (_.isUndefined(relationship.otherEntityFieldCapitalized)) {
              relationship.otherEntityFieldCapitalized = _.upperFirst(relationship.otherEntityField);
            }

            if (_.isUndefined(relationship.otherEntityStateName)) {
              relationship.otherEntityStateName = _.trim(_.kebabCase(relationship.otherEntityName), '-') + this.entityAngularJSSuffix;
            }
            // Load in-memory data for root
            if (relationship.relationshipType === 'many-to-many' && relationship.ownerSide) {
              this.fieldsContainOwnerManyToMany = true;
            } else if (relationship.relationshipType === 'one-to-one' && !relationship.ownerSide) {
              this.fieldsContainNoOwnerOneToOne = true;
            } else if (relationship.relationshipType === 'one-to-one' && relationship.ownerSide) {
              this.fieldsContainOwnerOneToOne = true;
            } else if (relationship.relationshipType === 'one-to-many') {
              this.fieldsContainOneToMany = true;
            } else if (relationship.relationshipType === 'many-to-one') {
              this.fieldsContainManyToOne = true;
            }

            if (relationship.relationshipValidateRules && relationship.relationshipValidateRules.indexOf('required') !== -1) {
              relationship.relationshipValidate = relationship.relationshipRequired = this.validation = true;
            }

            var entityType = relationship.otherEntityNameCapitalized;
            if (this.differentTypes.indexOf(entityType) === -1) {
              this.differentTypes.push(entityType);
            }
          }, this);

          this.service = this.fileData.service;
          //Update the entity list view
          if (this.useTemplate) {
            jhipsterFunc.copyHtml(this.webTemplateDir + '/app/entities/_entity-management-template.ejs',
              this.webappDir + 'app/entities/' + this.entityFolderName + '/' + this.entityPluralFileName + '.html',
              this, {}, true);
          }else{
            jhipsterFunc.copyHtml(this.webTemplateDir + '/app/entities/_entity-management.ejs',
              this.webappDir + 'app/entities/' + this.entityFolderName + '/' + this.entityPluralFileName + '.html',
              this, {}, true);
          }
          //Update the entity controller file
          this.template(this.webTemplateDir + '/app/entities/_entity-management.controller.ejs',
            this.webappDir + 'app/entities/' + this.entityFolderName + '/' + this.entityFileName + '.controller' + '.js',
            this, {});
        }, this);
      }
    },

    registering: function () {
      try {
        jhipsterFunc.registerModule("generator-jhipster-angular-datatables", "entity", "post"/*, "entity", "Change entity grid with angular-tables"*/);
      } catch (err) {
        this.log(chalk.red.bold('WARN!') + ' Could not register as a jhipster post entity creation hook...\n');
      }
    },
  },

  install: function () {
    var injectDependenciesAndConstants = function () {
      this.spawnCommand('gulp', ['install']);
    };

    this.installDependencies({
      bower: true,
      npm: false,
      callback: injectDependenciesAndConstants.bind(this)
    });
  }
  ,

  end: function () {
    this.log('\n' + chalk.bold.green('Angular Datatables are enabled for entities, you will have an option to enable audit while creating new entities as well'));
    this.log('\n' + chalk.bold.green('I\'m running gulp install now'));
  }


})
;
