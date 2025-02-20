/**
 * @fileoverview Renderer for the Coding with Chrome editor.
 *
 * @license Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */
goog.provide('cwc.renderer.Renderer');

goog.require('cwc.file.Files');
goog.require('cwc.renderer.Helper');
goog.require('cwc.soy.Renderer');
goog.require('cwc.utils.Helper');
goog.require('goog.string');
goog.require('soydata.SanitizedHtml');



/**
 * @param {!cwc.utils.Helper} helper
 * @constructor
 * @struct
 * @final
 */
cwc.renderer.Renderer = function(helper) {
  /** @type {string} */
  this.name = 'Renderer';

  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {Function} */
  this.renderer = null;

  /** @type {cwc.renderer.Helper} */
  this.rendererHelper = new cwc.renderer.Helper();

  /** @type {cwc.file.Files} */
  this.frameworkFiles = new cwc.file.Files();

  /** @type {cwc.file.Files} */
  this.libraryFiles = new cwc.file.Files();
};


/**
 * Loads framework into memory.
 * @param {string} file Filename of the framework file.
 */
cwc.renderer.Renderer.prototype.loadFramework = function(file) {
  var fileLoaderInstance = this.helper.getInstance('fileLoader');
  if (file && fileLoaderInstance) {
    console.log('Load additional Framework', file);
    fileLoaderInstance.getResourceFile(file, this.addFramework, this);
  } else {
    console.error('Unable to load Framework:', file);
  }
};


/**
 * @param {string!} name
 * @param {string!} content
 * @param {string=} opt_type
 */
cwc.renderer.Renderer.prototype.addFramework = function(name, content,
    opt_type) {
  var frameworkContent = content;
  if (!frameworkContent) {
    console.error('Recieved empty content for framework', name);
    return;
  }

  if (!goog.string.startsWith(content, 'data:')) {
    frameworkContent = 'data:text/javascript;charset=utf-8,' +
        encodeURIComponent(content);
  }

  var frameworkFile = this.frameworkFiles.addFile(name, frameworkContent,
      opt_type);
  if (!frameworkFile) {
    console.error('Was not able to add File', frameworkFile);
  } else {
    console.info('Added framework', name, frameworkFile);
  }
};


/**
 * Sets the renderer for the content.
 * @param {Function} renderer
 * @export
 */
cwc.renderer.Renderer.prototype.setRenderer = function(renderer) {
  if (!goog.isFunction(renderer)) {
    console.error('Renderer is not an function !');
  }
  this.renderer = renderer;
};


/**
 * Renders the JavaScript, CSS and HTML content together with all settings.
 * @param {boolean=} opt_preview_mode
 * @return {string}
 * @export
 */
cwc.renderer.Renderer.prototype.getRenderedContent = function(
    opt_preview_mode) {
  var editorInstance = this.helper.getInstance('editor');
  if (!editorInstance) {
    console.error('Missing editor instanace!');
    return '';
  }

  var fileInstance = this.helper.getInstance('file');
  if (fileInstance) {
    this.libraryFiles = fileInstance.getFiles();
  }

  return this.renderer(
      editorInstance.getEditorContent(),
      editorInstance.getEditorFlags(),
      this.libraryFiles,
      this.frameworkFiles,
      this.rendererHelper
  );
};


/**
 * @return {string} Data URL with the rendered content.
 */
cwc.renderer.Renderer.prototype.getContentUrl = function() {
  var content = this.getRenderedContent();
  return this.getDataUrl_(content);
};


/**
 * Gets preview code.
 * @return {string}
 */
cwc.renderer.Renderer.prototype.getRenderedPreview = function() {
  return this.getRenderedContent(true);
};


/**
 * @return {string} Rendered content as data url.
 */
cwc.renderer.Renderer.prototype.getPreviewUrl = function() {
  var content = this.getRenderedPreview();
  if (content) {
    return this.getDataUrl_(content);
  } else {
    console.error('Was not able to get preview URL: ' + content);
  }
  return '';
};


/**
 * @return {string} Rendered content as object.
 * @export
 */
cwc.renderer.Renderer.prototype.getObjectTag = function() {
  return this.rendererHelper.getObjectTag(this.getContentUrl());
};


/**
 * Returns data encoded preview.
 * @param {string} content
 * @param {string=} opt_type
 * @return {string}
 * @private
 */
cwc.renderer.Renderer.prototype.getDataUrl_ = function(content,
    opt_type) {
  var dataType = opt_type || 'text/html';
  return 'data:' + dataType + ';charset=utf-8,' + encodeURIComponent(content);
};
