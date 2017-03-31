# generator-jhipster-angular-datatables
> JHipster module to change default grid(table) for all or selected entities with angular-datatables. 

## Usage

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application.

You can choose to change default grid(table) for all or selected entities with [angular-datatables](https://l-lin.github.io/angular-datatables).  

### Installation

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have [JHipster and its related tools already installed](http://jhipster.github.io/installation.html).

This module requires Jhipster version greater than 3.0 in order to work, and I fixed errors for compatibility and tested with the new Jhipster v4.*.

```bash
npm install -g generator-jhipster-angular-datatables
```

Then run the module on a JHipster generated application:

```bash
yo jhipster-angular-datatables
```

If you want don't want to answer each question you can use

```bash
yo jhipster-angular-datatables default
```

### Style

All css class used in generator template are based in AdminLTE Template [AdminLTE].

```bash
<section class="content-header">
<div class="box">
<div class="box-header">
<div class="box-body">
```

## Example

Old view ![Old view][old-image]

New view ![New view][new-image]

- Added functionality if count more than 5 fields will be commented. It add all fields but if fields count is more than 5 will be added as commented lines.
- Added template functionality, you can choose if you want to use templates or a single html.


## Todo

1 - Resolve problems in entities with paging.
2 - Done. Actions buttons service used as dependency. 


## License

Apache-2.0 © [Hermes Lorenzo](https://www.linkedin.com/in/hermeslm)

[npm-image]: https://badge.fury.io/js/generator-jhipster-entity-audit.svg
[npm-url]: https://www.npmjs.com/package/generator-jhipster-angular-datatables
[travis-image]: https://travis-ci.org/deepu105/generator-jhipster-entity-audit.svg?branch=master
[project-url]: https://github.com/hermeslm/generator-jhipster-angular-datatables
[project-build]: 1.3.0
[daviddm-image]: https://david-dm.org/hipster-labs/generator-jhipster-entity-audit.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/hipster-labs/generator-jhipster-entity-audit
[old-image]: https://github.com/hermeslm/generator-jhipster-angular-datatables/blob/master/doc/old.png?raw=true
[new-image]: https://github.com/hermeslm/generator-jhipster-angular-datatables/blob/master/doc/new.png?raw=true
[adminLTE]: https://almsaeedstudio.com/themes/AdminLTE/index.html
