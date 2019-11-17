/* eslint-disable */
/**
 *
 *  Web Starter Kit
 *  Copyright (c) 2017 JustCoded.
 *
 */

(() => {

  const cfg = require('./gulp-config.js');
  const gulp = require('gulp');
  const del = require('del');
  const path = require('path');
  const browserSync = require('browser-sync').create();

  /**
   * Require gulp task from file
   * @param  {string} taskName     Task name
   * @param  {String} path         Path to task file
   * @param  {Object} options      Options for task
   * @param  {Array}  dependencies Task dependencies
   */
  function requireTask(taskName, path, options, dependencies) {
    const settings = options || {};
    const taskFunction = function (callback) {
      if (settings.checkProduction) {
        settings.isProduction = process.argv[process.argv.length - 1] === 'build';
      }

      const task = require(`${path + taskName  }.js`).call(this, settings);

      return task(callback);
    };

    settings.taskName = taskName;

    if (!Array.isArray(dependencies)) {
      gulp.task(taskName, taskFunction);
    } else if (dependencies.length === 1) {
      gulp.task(taskName, gulp.series(dependencies[0], taskFunction));
    } else {
      gulp.task(taskName, gulp.series(dependencies, taskFunction));
    }
  }

  /**
   * Remove image(s) from build folder if corresponding
   * images were deleted from source folder
   * @param  {Object} event    Event object
   * @param  {String} src      Name of the source folder
   * @param  {String} dest     Name of the destination folder
   */
  function deleteFile(file, src, dest) {
    const fileName = file.path.toString().split('/').pop();
    const fileEventWord = file.event == 'unlink' ? 'deleted' : file.event;

    const filePathFromSrc = path.relative(path.resolve(src), file.path);
    const destFilePath = path.resolve(dest, filePathFromSrc);

    try {
      del.sync(destFilePath);
      console.log(` \u{1b}[32m${fileEventWord}: ${fileName}\u{1b}[0m`);
    } catch (error) {
      console.log(' \u{1b}[31mFile has already deleted\u{1b}[0m');
    }
  }

  /**
   * template HTML
   */
  requireTask(`${cfg.task.fileInclude}`, `./${cfg.folder.tasks}/`, {
    templates: cfg.fileInclude.templates,
    dest: cfg.fileInclude.dest,
  });

  /**
   * Hint HTML
   */
  requireTask(`${cfg.task.htmlHint}`, `./${cfg.folder.tasks}/`);

  /**
   * Lint ES
   */
  requireTask(`${cfg.task.esLint}`, `./${cfg.folder.tasks}/`, {
    src: cfg.folder.src,
  });

  /**
   * Build custom js
   */
  requireTask(`${cfg.task.buildCustomJs}`, `./${cfg.folder.tasks}/`, {
    src: cfg.folder.src,
    dest: cfg.folder.build,
    mainJs: cfg.file.mainJs,
    checkProduction: true,
  });

  /**
   * Build js vendor (concatenate vendors array)
   */
  requireTask(`${cfg.task.buildJsVendors}`, `./${cfg.folder.tasks}/`, {
    src: cfg.folder.src,
    dest: cfg.folder.build,
    vendorJs: cfg.file.vendorJs,
    vendorJsMin: cfg.file.vendorJsMin,
  });

  /**
   * Build styles for application from SASS
   */
  requireTask(`${cfg.task.buildSass}`, `./${cfg.folder.tasks}/`, {
    src: cfg.folder.src,
    dest: cfg.folder.build,
    mainScss: cfg.file.mainScss,
    mainScssMin: cfg.file.mainScssMin,
    checkProduction: true,
  });

  /**
   * Compile scss files listed in the config
   */
  requireTask(`${cfg.task.buildSassFiles}`, `./${cfg.folder.tasks}/`, {
    sassFilesInfo: cfg.getPathesForSassCompiling(),
    dest: cfg.folder.build,
  });

  /**
   * Build styles for vendor from SASS
   */
  requireTask(`${cfg.task.buildStylesVendors}`, `./${cfg.folder.tasks}/`, {
    src: cfg.folder.src,
    dest: cfg.folder.build,
    vendorScss: cfg.file.vendorScss,
    vendorScssMin: cfg.file.vendorScssMin,
  });

  /**
   * Minify images
   */
  requireTask(`${cfg.task.imageMin}`, `./${cfg.folder.tasks}/`, {
    src: cfg.folder.src,
    dest: cfg.folder.build,
  });

  /**
   * Clean build folder
   */
  requireTask(`${cfg.task.cleanBuild}`, `./${cfg.folder.tasks}/`, {
    src: cfg.folder.build,
  });

  /**
   * Clean production folder
   */
  requireTask(`${cfg.task.cleanProd}`, `./${cfg.folder.tasks}/`, {
    src: cfg.folder.prod,
  });


  /**
   * Copy folders to the build folder
   */
  requireTask(`${cfg.task.copyFolders}`, `./${cfg.folder.tasks}/`, {
    dest: cfg.folder.build,
    foldersToCopy: cfg.getPathesToCopy(),
  });

  /**
   * Copy folders to the production folder
   */
  requireTask(`${cfg.task.copyFoldersProduction}`, `./${cfg.folder.tasks}/`, {
    dest: cfg.folder.prod,
    foldersToCopy: cfg.getPathesToCopyForProduction(),
  });

  /**
   * Start browserSync server
   */
  requireTask(`${cfg.task.browserSync}`, `./${cfg.folder.tasks}/`, {
    mainHtml: cfg.file.mainHtml,
    browserSync,
  });

  /**
   * Watch for file changes
   */
  requireTask(`${cfg.task.watch}`, `./${cfg.folder.tasks}/`, {
    sassFilesInfo: cfg.getPathesForSassCompiling(),
    src: cfg.folder.src,
    templates: cfg.folder.templates,
    dest: cfg.folder.build,
    imageExtensions: cfg.imageExtensions,
    browserSync,
    deleteFile,
    tasks: {
      buildSassFiles: cfg.task.buildSassFiles,
      buildCustomJs: cfg.task.buildCustomJs,
      buildSass: cfg.task.buildSass,
      esLint: cfg.task.esLint,
      fileInclude: cfg.task.fileInclude,
      htmlHint: cfg.task.htmlHint,
      imageMin: cfg.task.imageMin,
    },
  }, false);

  /**
   * Default Gulp task
   */
  gulp.task('default', gulp.series(
    cfg.task.cleanBuild,
    gulp.parallel(
      cfg.task.buildCustomJs,
      cfg.task.buildJsVendors,
      cfg.task.buildSass,
      cfg.task.buildSassFiles,
      cfg.task.buildStylesVendors,
      cfg.task.fileInclude,
      cfg.task.esLint,
      cfg.task.imageMin,
    ),
    cfg.task.htmlHint,
    cfg.task.copyFolders,
    gulp.parallel(
      cfg.task.browserSync,
      cfg.task.watch,
    ),
  ));

  /**
   * Creating production folder without unnecessary files
   */
  gulp.task('build', gulp.series(
    gulp.parallel(
      cfg.task.cleanProd,
      cfg.task.cleanBuild,
    ),
    gulp.parallel(
      cfg.task.buildCustomJs,
      cfg.task.buildJsVendors,
      cfg.task.buildSass,
      cfg.task.buildSassFiles,
      cfg.task.buildStylesVendors,
      cfg.task.fileInclude,
      cfg.task.esLint,
      cfg.task.imageMin,
    ),
    cfg.task.htmlHint,
    cfg.task.copyFolders,
    cfg.task.copyFoldersProduction,
  ), true);
})();
