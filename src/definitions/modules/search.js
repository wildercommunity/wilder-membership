/*!
 * # Semantic UI - Search
 * http://github.com/semantic-org/semantic-ui/
 *
 *
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 */

(function ($, window, document, undefined) {
  window = (typeof window !== 'undefined' && window.Math == Math)
    ? window
    : (typeof self !== 'undefined' && self.Math == Math)
      ? self
      : Function('return this')();
  $.fn.search = function (parameters) {
    const
      $allModules = $(this);


    const moduleSelector = $allModules.selector || '';


    let time = new Date().getTime();


    let performance = [];


    const query = arguments[0];


    const methodInvoked = (typeof query === 'string');


    const queryArguments = [].slice.call(arguments, 1);


    let returnedValue;
    $(this)
      .each(function () {
        const
          settings = ($.isPlainObject(parameters))
            ? $.extend(true, {}, $.fn.search.settings, parameters)
            : $.extend({}, $.fn.search.settings);


        const className = settings.className;


        const metadata = settings.metadata;


        const regExp = settings.regExp;


        const fields = settings.fields;


        const selector = settings.selector;


        const error = settings.error;


        const namespace = settings.namespace;


        const eventNamespace = `.${namespace}`;


        const moduleNamespace = `${namespace}-module`;


        const $module = $(this);


        let $prompt = $module.find(selector.prompt);


        let $searchButton = $module.find(selector.searchButton);


        let $results = $module.find(selector.results);


        let $result = $module.find(selector.result);


        let $category = $module.find(selector.category);


        const element = this;


        let instance = $module.data(moduleNamespace);


        let disabledBubbled = false;


        let resultsDismissed = false;


        let module;
        module = {

          initialize() {
            module.verbose('Initializing module');
            module.get.settings();
            module.determine.searchFields();
            module.bind.events();
            module.set.type();
            module.create.results();
            module.instantiate();
          },
          instantiate() {
            module.verbose('Storing instance of module', module);
            instance = module;
            $module
              .data(moduleNamespace, module);
          },
          destroy() {
            module.verbose('Destroying instance');
            $module
              .off(eventNamespace)
              .removeData(moduleNamespace);
          },

          refresh() {
            module.debug('Refreshing selector cache');
            $prompt = $module.find(selector.prompt);
            $searchButton = $module.find(selector.searchButton);
            $category = $module.find(selector.category);
            $results = $module.find(selector.results);
            $result = $module.find(selector.result);
          },

          refreshResults() {
            $results = $module.find(selector.results);
            $result = $module.find(selector.result);
          },

          bind: {
            events() {
              module.verbose('Binding events to search');
              if (settings.automatic) {
                $module
                  .on(module.get.inputEvent() + eventNamespace, selector.prompt, module.event.input);
                $prompt
                  .attr('autocomplete', 'off');
              }
              $module
              // prompt
                .on(`focus${eventNamespace}`, selector.prompt, module.event.focus)
                .on(`blur${eventNamespace}`, selector.prompt, module.event.blur)
                .on(`keydown${eventNamespace}`, selector.prompt, module.handleKeyboard)
              // search button
                .on(`click${eventNamespace}`, selector.searchButton, module.query)
              // results
                .on(`mousedown${eventNamespace}`, selector.results, module.event.result.mousedown)
                .on(`mouseup${eventNamespace}`, selector.results, module.event.result.mouseup)
                .on(`click${eventNamespace}`, selector.result, module.event.result.click);
            },
          },

          determine: {
            searchFields() {
            // this makes sure $.extend does not add specified search fields to default fields
            // this is the only setting which should not extend defaults
              if (parameters && parameters.searchFields !== undefined) {
                settings.searchFields = parameters.searchFields;
              }
            },
          },

          event: {
            input() {
              if (settings.searchDelay) {
                clearTimeout(module.timer);
                module.timer = setTimeout(() => {
                  if (module.is.focused()) {
                    module.query();
                  }
                }, settings.searchDelay);
              } else {
                module.query();
              }
            },
            focus() {
              module.set.focus();
              if (settings.searchOnFocus && module.has.minimumCharacters()) {
                module.query(() => {
                  if (module.can.show()) {
                    module.showResults();
                  }
                });
              }
            },
            blur(event) {
              const
                pageLostFocus = (document.activeElement === this);


              const callback = function () {
                module.cancel.query();
                module.remove.focus();
                module.timer = setTimeout(module.hideResults, settings.hideDelay);
              };
              if (pageLostFocus) {
                return;
              }
              resultsDismissed = false;
              if (module.resultsClicked) {
                module.debug('Determining if user action caused search to close');
                $module
                  .one(`click.close${eventNamespace}`, selector.results, (event) => {
                    if (module.is.inMessage(event) || disabledBubbled) {
                      $prompt.focus();
                      return;
                    }
                    disabledBubbled = false;
                    if (!module.is.animating() && !module.is.hidden()) {
                      callback();
                    }
                  });
              } else {
                module.debug('Input blurred without user action, closing results');
                callback();
              }
            },
            result: {
              mousedown() {
                module.resultsClicked = true;
              },
              mouseup() {
                module.resultsClicked = false;
              },
              click(event) {
                module.debug('Search result selected');
                const
                  $result = $(this);


                const $title = $result.find(selector.title).eq(0);


                const $link = $result.is('a[href]')
                  ? $result
                  : $result.find('a[href]').eq(0);


                const href = $link.attr('href') || false;


                const target = $link.attr('target') || false;


                const title = $title.html();

                // title is used for result lookup

                const value = ($title.length > 0)
                  ? $title.text()
                  : false;


                const results = module.get.results();


                const result = $result.data(metadata.result) || module.get.result(value, results);


                let returnedValue;
                if ($.isFunction(settings.onSelect)) {
                  if (settings.onSelect.call(element, result, results) === false) {
                    module.debug('Custom onSelect callback cancelled default select action');
                    disabledBubbled = true;
                    return;
                  }
                }
                module.hideResults();
                if (value) {
                  module.set.value(value);
                }
                if (href) {
                  module.verbose('Opening search link found in result', $link);
                  if (target == '_blank' || event.ctrlKey) {
                    window.open(href);
                  } else {
                    window.location.href = (href);
                  }
                }
              },
            },
          },
          handleKeyboard(event) {
            const
            // force selector refresh
              $result = $module.find(selector.result);


            const $category = $module.find(selector.category);


            const $activeResult = $result.filter(`.${className.active}`);


            const currentIndex = $result.index($activeResult);


            const resultSize = $result.length;


            const hasActiveResult = $activeResult.length > 0;


            const keyCode = event.which;


            const keys = {
              backspace: 8,
              enter: 13,
              escape: 27,
              upArrow: 38,
              downArrow: 40,
            };


            let newIndex
          ;
          // search shortcuts
            if (keyCode == keys.escape) {
              module.verbose('Escape key pressed, blurring search field');
              module.hideResults();
              resultsDismissed = true;
            }
            if (module.is.visible()) {
              if (keyCode == keys.enter) {
                module.verbose('Enter key pressed, selecting active result');
                if ($result.filter(`.${className.active}`).length > 0) {
                  module.event.result.click.call($result.filter(`.${className.active}`), event);
                  event.preventDefault();
                  return false;
                }
              } else if (keyCode == keys.upArrow && hasActiveResult) {
                module.verbose('Up key pressed, changing active result');
                newIndex = (currentIndex - 1 < 0)
                  ? currentIndex
                  : currentIndex - 1;
                $category
                  .removeClass(className.active);
                $result
                  .removeClass(className.active)
                  .eq(newIndex)
                  .addClass(className.active)
                  .closest($category)
                  .addClass(className.active);
                event.preventDefault();
              } else if (keyCode == keys.downArrow) {
                module.verbose('Down key pressed, changing active result');
                newIndex = (currentIndex + 1 >= resultSize)
                  ? currentIndex
                  : currentIndex + 1;
                $category
                  .removeClass(className.active);
                $result
                  .removeClass(className.active)
                  .eq(newIndex)
                  .addClass(className.active)
                  .closest($category)
                  .addClass(className.active);
                event.preventDefault();
              }
            } else {
            // query shortcuts
              if (keyCode == keys.enter) {
                module.verbose('Enter key pressed, executing query');
                module.query();
                module.set.buttonPressed();
                $prompt.one('keyup', module.remove.buttonFocus);
              }
            }
          },

          setup: {
            api(searchTerm, callback) {
              const
                apiSettings = {
                  debug: settings.debug,
                  on: false,
                  cache: settings.cache,
                  action: 'search',
                  urlData: {
                    query: searchTerm,
                  },
                  onSuccess(response) {
                    module.parse.response.call(element, response, searchTerm);
                    callback();
                  },
                  onFailure() {
                    module.displayMessage(error.serverError);
                    callback();
                  },
                  onAbort(response) {
                  },
                  onError: module.error,
                };


              let searchHTML;
              $.extend(true, apiSettings, settings.apiSettings);
              module.verbose('Setting up API request', apiSettings);
              $module.api(apiSettings);
            },
          },

          can: {
            useAPI() {
              return $.fn.api !== undefined;
            },
            show() {
              return module.is.focused() && !module.is.visible() && !module.is.empty();
            },
            transition() {
              return settings.transition && $.fn.transition !== undefined && $module.transition('is supported');
            },
          },

          is: {
            animating() {
              return $results.hasClass(className.animating);
            },
            hidden() {
              return $results.hasClass(className.hidden);
            },
            inMessage(event) {
              if (!event.target) {
                return;
              }
              const
                $target = $(event.target);


              const isInDOM = $.contains(document.documentElement, event.target);
              return (isInDOM && $target.closest(selector.message).length > 0);
            },
            empty() {
              return ($results.html() === '');
            },
            visible() {
              return ($results.filter(':visible').length > 0);
            },
            focused() {
              return ($prompt.filter(':focus').length > 0);
            },
          },

          get: {
            settings() {
              if ($.isPlainObject(parameters) && parameters.searchFullText) {
                settings.fullTextSearch = parameters.searchFullText;
                module.error(settings.error.oldSearchSyntax, element);
              }
            },
            inputEvent() {
              const
                prompt = $prompt[0];


              const inputEvent = (prompt !== undefined && prompt.oninput !== undefined)
                ? 'input'
                : (prompt !== undefined && prompt.onpropertychange !== undefined)
                  ? 'propertychange'
                  : 'keyup';
              return inputEvent;
            },
            value() {
              return $prompt.val();
            },
            results() {
              const
                results = $module.data(metadata.results);
              return results;
            },
            result(value, results) {
              const
                lookupFields = ['title', 'id'];


              let result = false;
              value = (value !== undefined)
                ? value
                : module.get.value();
              results = (results !== undefined)
                ? results
                : module.get.results();
              if (settings.type === 'category') {
                module.debug('Finding result that matches', value);
                $.each(results, (index, category) => {
                  if ($.isArray(category.results)) {
                    result = module.search.object(value, category.results, lookupFields)[0];
                    // don't continue searching if a result is found
                    if (result) {
                      return false;
                    }
                  }
                });
              } else {
                module.debug('Finding result in results object', value);
                result = module.search.object(value, results, lookupFields)[0];
              }
              return result || false;
            },
          },

          select: {
            firstResult() {
              module.verbose('Selecting first result');
              $result.first().addClass(className.active);
            },
          },

          set: {
            focus() {
              $module.addClass(className.focus);
            },
            loading() {
              $module.addClass(className.loading);
            },
            value(value) {
              module.verbose('Setting search input value', value);
              $prompt
                .val(value);
            },
            type(type) {
              type = type || settings.type;
              if (settings.type == 'category') {
                $module.addClass(settings.type);
              }
            },
            buttonPressed() {
              $searchButton.addClass(className.pressed);
            },
          },

          remove: {
            loading() {
              $module.removeClass(className.loading);
            },
            focus() {
              $module.removeClass(className.focus);
            },
            buttonPressed() {
              $searchButton.removeClass(className.pressed);
            },
          },

          query(callback) {
            callback = $.isFunction(callback)
              ? callback
              : function () {};
            const
              searchTerm = module.get.value();


            const cache = module.read.cache(searchTerm);
            callback = callback || function () {};
            if (module.has.minimumCharacters()) {
              if (cache) {
                module.debug('Reading result from cache', searchTerm);
                module.save.results(cache.results);
                module.addResults(cache.html);
                module.inject.id(cache.results);
                callback();
              } else {
                module.debug('Querying for', searchTerm);
                if ($.isPlainObject(settings.source) || $.isArray(settings.source)) {
                  module.search.local(searchTerm);
                  callback();
                } else if (module.can.useAPI()) {
                  module.search.remote(searchTerm, callback);
                } else {
                  module.error(error.source);
                  callback();
                }
              }
              settings.onSearchQuery.call(element, searchTerm);
            } else {
              module.hideResults();
            }
          },

          search: {
            local(searchTerm) {
              let
                results = module.search.object(searchTerm, settings.content);


              let searchHTML;
              module.set.loading();
              module.save.results(results);
              module.debug('Returned full local search results', results);
              if (settings.maxResults > 0) {
                module.debug('Using specified max results', results);
                results = results.slice(0, settings.maxResults);
              }
              if (settings.type == 'category') {
                results = module.create.categoryResults(results);
              }
              searchHTML = module.generateResults({
                results,
              });
              module.remove.loading();
              module.addResults(searchHTML);
              module.inject.id(results);
              module.write.cache(searchTerm, {
                html: searchHTML,
                results,
              });
            },
            remote(searchTerm, callback) {
              callback = $.isFunction(callback)
                ? callback
                : function () {};
              if ($module.api('is loading')) {
                $module.api('abort');
              }
              module.setup.api(searchTerm, callback);
              $module
                .api('query');
            },
            object(searchTerm, source, searchFields) {
              const
                results = [];


              const exactResults = [];


              const fuzzyResults = [];


              const searchExp = searchTerm.toString().replace(regExp.escape, '\\$&');


              const matchRegExp = new RegExp(regExp.beginsWith + searchExp, 'i');


              // avoid duplicates when pushing results

              const addResult = function (array, result) {
                const
                  notResult = ($.inArray(result, results) == -1);


                const notFuzzyResult = ($.inArray(result, fuzzyResults) == -1);


                const notExactResults = ($.inArray(result, exactResults) == -1);
                if (notResult && notFuzzyResult && notExactResults) {
                  array.push(result);
                }
              };
              source = source || settings.source;
              searchFields = (searchFields !== undefined)
                ? searchFields
                : settings.searchFields
              ;

              // search fields should be array to loop correctly
              if (!$.isArray(searchFields)) {
                searchFields = [searchFields];
              }

              // exit conditions if no source
              if (source === undefined || source === false) {
                module.error(error.source);
                return [];
              }
              // iterate through search fields looking for matches
              $.each(searchFields, (index, field) => {
                $.each(source, (label, content) => {
                  const
                    fieldExists = (typeof content[field] === 'string');
                  if (fieldExists) {
                    if (content[field].search(matchRegExp) !== -1) {
                    // content starts with value (first in results)
                      addResult(results, content);
                    } else if (settings.fullTextSearch === 'exact' && module.exactSearch(searchTerm, content[field])) {
                    // content fuzzy matches (last in results)
                      addResult(exactResults, content);
                    } else if (settings.fullTextSearch == true && module.fuzzySearch(searchTerm, content[field])) {
                    // content fuzzy matches (last in results)
                      addResult(fuzzyResults, content);
                    }
                  }
                });
              });
              $.merge(exactResults, fuzzyResults);
              $.merge(results, exactResults);
              return results;
            },
          },
          exactSearch(query, term) {
            query = query.toLowerCase();
            term = term.toLowerCase();
            if (term.indexOf(query) > -1) {
              return true;
            }
            return false;
          },
          fuzzySearch(query, term) {
            const
              termLength = term.length;


            const queryLength = query.length;
            if (typeof query !== 'string') {
              return false;
            }
            query = query.toLowerCase();
            term = term.toLowerCase();
            if (queryLength > termLength) {
              return false;
            }
            if (queryLength === termLength) {
              return (query === term);
            }
            search: for (let characterIndex = 0, nextCharacterIndex = 0; characterIndex < queryLength; characterIndex++) {
              const
                queryCharacter = query.charCodeAt(characterIndex);
              while (nextCharacterIndex < termLength) {
                if (term.charCodeAt(nextCharacterIndex++) === queryCharacter) {
                  continue search;
                }
              }
              return false;
            }
            return true;
          },

          parse: {
            response(response, searchTerm) {
              const
                searchHTML = module.generateResults(response);
              module.verbose('Parsing server response', response);
              if (response !== undefined) {
                if (searchTerm !== undefined && response[fields.results] !== undefined) {
                  module.addResults(searchHTML);
                  module.inject.id(response[fields.results]);
                  module.write.cache(searchTerm, {
                    html: searchHTML,
                    results: response[fields.results],
                  });
                  module.save.results(response[fields.results]);
                }
              }
            },
          },

          cancel: {
            query() {
              if (module.can.useAPI()) {
                $module.api('abort');
              }
            },
          },

          has: {
            minimumCharacters() {
              const
                searchTerm = module.get.value();


              const numCharacters = searchTerm.length;
              return (numCharacters >= settings.minCharacters);
            },
            results() {
              if ($results.length === 0) {
                return false;
              }
              const
                html = $results.html();
              return html != '';
            },
          },

          clear: {
            cache(value) {
              const
                cache = $module.data(metadata.cache);
              if (!value) {
                module.debug('Clearing cache', value);
                $module.removeData(metadata.cache);
              } else if (value && cache && cache[value]) {
                module.debug('Removing value from cache', value);
                delete cache[value];
                $module.data(metadata.cache, cache);
              }
            },
          },

          read: {
            cache(name) {
              const
                cache = $module.data(metadata.cache);
              if (settings.cache) {
                module.verbose('Checking cache for generated html for query', name);
                return (typeof cache === 'object') && (cache[name] !== undefined)
                  ? cache[name]
                  : false;
              }
              return false;
            },
          },

          create: {
            categoryResults(results) {
              const
                categoryResults = {};
              $.each(results, (index, result) => {
                if (!result.category) {
                  return;
                }
                if (categoryResults[result.category] === undefined) {
                  module.verbose('Creating new category of results', result.category);
                  categoryResults[result.category] = {
                    name: result.category,
                    results: [result],
                  };
                } else {
                  categoryResults[result.category].results.push(result);
                }
              });
              return categoryResults;
            },
            id(resultIndex, categoryIndex) {
              const
                resultID = (resultIndex + 1);
              // not zero indexed

              const categoryID = (categoryIndex + 1);


              let firstCharCode;


              let letterID;


              let id;
              if (categoryIndex !== undefined) {
              // start char code for "A"
                letterID = String.fromCharCode(97 + categoryIndex);
                id = letterID + resultID;
                module.verbose('Creating category result id', id);
              } else {
                id = resultID;
                module.verbose('Creating result id', id);
              }
              return id;
            },
            results() {
              if ($results.length === 0) {
                $results = $('<div />')
                  .addClass(className.results)
                  .appendTo($module);
              }
            },
          },

          inject: {
            result(result, resultIndex, categoryIndex) {
              module.verbose('Injecting result into results');
              const
                $selectedResult = (categoryIndex !== undefined)
                  ? $results
                    .children().eq(categoryIndex)
                    .children(selector.results)
                    .first()
                    .children(selector.result)
                    .eq(resultIndex)
                  : $results
                    .children(selector.result).eq(resultIndex);
              module.verbose('Injecting results metadata', $selectedResult);
              $selectedResult
                .data(metadata.result, result);
            },
            id(results) {
              module.debug('Injecting unique ids into results');
              let
              // since results may be object, we must use counters
                categoryIndex = 0;


              let resultIndex = 0;
              if (settings.type === 'category') {
              // iterate through each category result
                $.each(results, (index, category) => {
                  resultIndex = 0;
                  $.each(category.results, (index, value) => {
                    const
                      result = category.results[index];
                    if (result.id === undefined) {
                      result.id = module.create.id(resultIndex, categoryIndex);
                    }
                    module.inject.result(result, resultIndex, categoryIndex);
                    resultIndex++;
                  });
                  categoryIndex++;
                });
              } else {
              // top level
                $.each(results, (index, value) => {
                  const
                    result = results[index];
                  if (result.id === undefined) {
                    result.id = module.create.id(resultIndex);
                  }
                  module.inject.result(result, resultIndex);
                  resultIndex++;
                });
              }
              return results;
            },
          },

          save: {
            results(results) {
              module.verbose('Saving current search results to metadata', results);
              $module.data(metadata.results, results);
            },
          },

          write: {
            cache(name, value) {
              const
                cache = ($module.data(metadata.cache) !== undefined)
                  ? $module.data(metadata.cache)
                  : {};
              if (settings.cache) {
                module.verbose('Writing generated html to cache', name, value);
                cache[name] = value;
                $module
                  .data(metadata.cache, cache);
              }
            },
          },

          addResults(html) {
            if ($.isFunction(settings.onResultsAdd)) {
              if (settings.onResultsAdd.call($results, html) === false) {
                module.debug('onResultsAdd callback cancelled default action');
                return false;
              }
            }
            if (html) {
              $results
                .html(html);
              module.refreshResults();
              if (settings.selectFirstResult) {
                module.select.firstResult();
              }
              module.showResults();
            } else {
              module.hideResults(() => {
                $results.empty();
              });
            }
          },

          showResults(callback) {
            callback = $.isFunction(callback)
              ? callback
              : function () {};
            if (resultsDismissed) {
              return;
            }
            if (!module.is.visible() && module.has.results()) {
              if (module.can.transition()) {
                module.debug('Showing results with css animations');
                $results
                  .transition({
                    animation: `${settings.transition} in`,
                    debug: settings.debug,
                    verbose: settings.verbose,
                    duration: settings.duration,
                    onComplete() {
                      callback();
                    },
                    queue: true,
                  });
              } else {
                module.debug('Showing results with javascript');
                $results
                  .stop()
                  .fadeIn(settings.duration, settings.easing);
              }
              settings.onResultsOpen.call($results);
            }
          },
          hideResults(callback) {
            callback = $.isFunction(callback)
              ? callback
              : function () {};
            if (module.is.visible()) {
              if (module.can.transition()) {
                module.debug('Hiding results with css animations');
                $results
                  .transition({
                    animation: `${settings.transition} out`,
                    debug: settings.debug,
                    verbose: settings.verbose,
                    duration: settings.duration,
                    onComplete() {
                      callback();
                    },
                    queue: true,
                  });
              } else {
                module.debug('Hiding results with javascript');
                $results
                  .stop()
                  .fadeOut(settings.duration, settings.easing);
              }
              settings.onResultsClose.call($results);
            }
          },

          generateResults(response) {
            module.debug('Generating html from response', response);
            const
              template = settings.templates[settings.type];


            const isProperObject = ($.isPlainObject(response[fields.results]) && !$.isEmptyObject(response[fields.results]));


            const isProperArray = ($.isArray(response[fields.results]) && response[fields.results].length > 0);


            let html = '';
            if (isProperObject || isProperArray) {
              if (settings.maxResults > 0) {
                if (isProperObject) {
                  if (settings.type == 'standard') {
                    module.error(error.maxResults);
                  }
                } else {
                  response[fields.results] = response[fields.results].slice(0, settings.maxResults);
                }
              }
              if ($.isFunction(template)) {
                html = template(response, fields);
              } else {
                module.error(error.noTemplate, false);
              }
            } else if (settings.showNoResults) {
              html = module.displayMessage(error.noResults, 'empty');
            }
            settings.onResults.call(element, response);
            return html;
          },

          displayMessage(text, type) {
            type = type || 'standard';
            module.debug('Displaying message', text, type);
            module.addResults(settings.templates.message(text, type));
            return settings.templates.message(text, type);
          },

          setting(name, value) {
            if ($.isPlainObject(name)) {
              $.extend(true, settings, name);
            } else if (value !== undefined) {
              settings[name] = value;
            } else {
              return settings[name];
            }
          },
          internal(name, value) {
            if ($.isPlainObject(name)) {
              $.extend(true, module, name);
            } else if (value !== undefined) {
              module[name] = value;
            } else {
              return module[name];
            }
          },
          debug() {
            if (!settings.silent && settings.debug) {
              if (settings.performance) {
                module.performance.log(arguments);
              } else {
                module.debug = Function.prototype.bind.call(console.info, console, `${settings.name}:`);
                module.debug.apply(console, arguments);
              }
            }
          },
          verbose() {
            if (!settings.silent && settings.verbose && settings.debug) {
              if (settings.performance) {
                module.performance.log(arguments);
              } else {
                module.verbose = Function.prototype.bind.call(console.info, console, `${settings.name}:`);
                module.verbose.apply(console, arguments);
              }
            }
          },
          error() {
            if (!settings.silent) {
              module.error = Function.prototype.bind.call(console.error, console, `${settings.name}:`);
              module.error.apply(console, arguments);
            }
          },
          performance: {
            log(message) {
              let
                currentTime;


              let executionTime;


              let previousTime;
              if (settings.performance) {
                currentTime = new Date().getTime();
                previousTime = time || currentTime;
                executionTime = currentTime - previousTime;
                time = currentTime;
                performance.push({
                  Name: message[0],
                  Arguments: [].slice.call(message, 1) || '',
                  Element: element,
                  'Execution Time': executionTime,
                });
              }
              clearTimeout(module.performance.timer);
              module.performance.timer = setTimeout(module.performance.display, 500);
            },
            display() {
              let
                title = `${settings.name}:`;


              let totalTime = 0;
              time = false;
              clearTimeout(module.performance.timer);
              $.each(performance, (index, data) => {
                totalTime += data['Execution Time'];
              });
              title += ` ${totalTime}ms`;
              if (moduleSelector) {
                title += ` '${moduleSelector}'`;
              }
              if ($allModules.length > 1) {
                title += `${' ' + '('}${$allModules.length})`;
              }
              if ((console.group !== undefined || console.table !== undefined) && performance.length > 0) {
                console.groupCollapsed(title);
                if (console.table) {
                  console.table(performance);
                } else {
                  $.each(performance, (index, data) => {
                    console.log(`${data.Name}: ${data['Execution Time']}ms`);
                  });
                }
                console.groupEnd();
              }
              performance = [];
            },
          },
          invoke(query, passedArguments, context) {
            let
              object = instance;


            let maxDepth;


            let found;


            let response;
            passedArguments = passedArguments || queryArguments;
            context = element || context;
            if (typeof query === 'string' && object !== undefined) {
              query = query.split(/[\. ]/);
              maxDepth = query.length - 1;
              $.each(query, (depth, value) => {
                const camelCaseValue = (depth != maxDepth)
                  ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1)
                  : query;
                if ($.isPlainObject(object[camelCaseValue]) && (depth != maxDepth)) {
                  object = object[camelCaseValue];
                } else if (object[camelCaseValue] !== undefined) {
                  found = object[camelCaseValue];
                  return false;
                } else if ($.isPlainObject(object[value]) && (depth != maxDepth)) {
                  object = object[value];
                } else if (object[value] !== undefined) {
                  found = object[value];
                  return false;
                } else {
                  return false;
                }
              });
            }
            if ($.isFunction(found)) {
              response = found.apply(context, passedArguments);
            } else if (found !== undefined) {
              response = found;
            }
            if ($.isArray(returnedValue)) {
              returnedValue.push(response);
            } else if (returnedValue !== undefined) {
              returnedValue = [returnedValue, response];
            } else if (response !== undefined) {
              returnedValue = response;
            }
            return found;
          },
        };
        if (methodInvoked) {
          if (instance === undefined) {
            module.initialize();
          }
          module.invoke(query);
        } else {
          if (instance !== undefined) {
            instance.invoke('destroy');
          }
          module.initialize();
        }
      });
    return (returnedValue !== undefined)
      ? returnedValue
      : this;
  };

  $.fn.search.settings = {

    name: 'Search',
    namespace: 'search',

    silent: false,
    debug: false,
    verbose: false,
    performance: true,

    // template to use (specified in settings.templates)
    type: 'standard',

    // minimum characters required to search
    minCharacters: 1,

    // whether to select first result after searching automatically
    selectFirstResult: false,

    // API config
    apiSettings: false,

    // object to search
    source: false,

    // Whether search should query current term on focus
    searchOnFocus: true,

    // fields to search
    searchFields: [
      'title',
      'description',
    ],

    // field to display in standard results template
    displayField: '',

    // search anywhere in value (set to 'exact' to require exact matches
    fullTextSearch: 'exact',

    // whether to add events to prompt automatically
    automatic: true,

    // delay before hiding menu after blur
    hideDelay: 0,

    // delay before searching
    searchDelay: 200,

    // maximum results returned from search
    maxResults: 7,

    // whether to store lookups in local cache
    cache: true,

    // whether no results errors should be shown
    showNoResults: true,

    // transition settings
    transition: 'scale',
    duration: 200,
    easing: 'easeOutExpo',

    // callbacks
    onSelect: false,
    onResultsAdd: false,

    onSearchQuery(query) {},
    onResults(response) {},

    onResultsOpen() {},
    onResultsClose() {},

    className: {
      animating: 'animating',
      active: 'active',
      empty: 'empty',
      focus: 'focus',
      hidden: 'hidden',
      loading: 'loading',
      results: 'results',
      pressed: 'down',
    },

    error: {
      source: 'Cannot search. No source used, and Semantic API module was not included',
      noResults: 'Your search returned no results',
      logging: 'Error in debug logging, exiting.',
      noEndpoint: 'No search endpoint was specified',
      noTemplate: 'A valid template name was not specified.',
      oldSearchSyntax: 'searchFullText setting has been renamed fullTextSearch for consistency, please adjust your settings.',
      serverError: 'There was an issue querying the server.',
      maxResults: 'Results must be an array to use maxResults setting',
      method: 'The method you called is not defined.',
    },

    metadata: {
      cache: 'cache',
      results: 'results',
      result: 'result',
    },

    regExp: {
      escape: /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
      beginsWith: '(?:\s|^)',
    },

    // maps api response attributes to internal representation
    fields: {
      categories: 'results', // array of categories (category view)
      categoryName: 'name', // name of category (category view)
      categoryResults: 'results', // array of results (category view)
      description: 'description', // result description
      image: 'image', // result image
      price: 'price', // result price
      results: 'results', // array of results (standard)
      title: 'title', // result title
      url: 'url', // result url
      action: 'action', // "view more" object name
      actionText: 'text', // "view more" text
      actionURL: 'url', // "view more" url
    },

    selector: {
      prompt: '.prompt',
      searchButton: '.search.button',
      results: '.results',
      message: '.results > .message',
      category: '.category',
      result: '.result',
      title: '.title, .name',
    },

    templates: {
      escape(string) {
        const
          badChars = /[&<>"'`]/g;


        const shouldEscape = /[&<>"'`]/;


        const escape = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '`': '&#x60;',
        };


        const escapedChar = function (chr) {
          return escape[chr];
        };
        if (shouldEscape.test(string)) {
          return string.replace(badChars, escapedChar);
        }
        return string;
      },
      message(message, type) {
        let
          html = '';
        if (message !== undefined && type !== undefined) {
          html += `${''
          + '<div class="message '}${type}">`
          ;
          // message type
          if (type == 'empty') {
            html += `${''
            + '<div class="header">No Results</div class="header">'
            + '<div class="description">'}${message}</div class="description">`;
          } else {
            html += ` <div class="description">${message}</div>`;
          }
          html += '</div>';
        }
        return html;
      },
      category(response, fields) {
        let
          html = '';


        const escape = $.fn.search.settings.templates.escape;
        if (response[fields.categoryResults] !== undefined) {
        // each category
          $.each(response[fields.categoryResults], (index, category) => {
            if (category[fields.results] !== undefined && category.results.length > 0) {
              html += '<div class="category">';

              if (category[fields.categoryName] !== undefined) {
                html += `<div class="name">${category[fields.categoryName]}</div>`;
              }

              // each item inside category
              html += '<div class="results">';
              $.each(category.results, (index, result) => {
                if (result[fields.url]) {
                  html += `<a class="result" href="${result[fields.url]}">`;
                } else {
                  html += '<a class="result">';
                }
                if (result[fields.image] !== undefined) {
                  html += `${''
                  + '<div class="image">'
                  + ' <img src="'}${result[fields.image]}">`
                  + '</div>';
                }
                html += '<div class="content">';
                if (result[fields.price] !== undefined) {
                  html += `<div class="price">${result[fields.price]}</div>`;
                }
                if (result[fields.title] !== undefined) {
                  html += `<div class="title">${result[fields.title]}</div>`;
                }
                if (result[fields.description] !== undefined) {
                  html += `<div class="description">${result[fields.description]}</div>`;
                }
                html += ''
                + '</div>';
                html += '</a>';
              });
              html += '</div>';
              html += ''
              + '</div>';
            }
          });
          if (response[fields.action]) {
            html += `${''
          + '<a href="'}${response[fields.action][fields.actionURL]}" class="action">${
              response[fields.action][fields.actionText]
            }</a>`;
          }
          return html;
        }
        return false;
      },
      standard(response, fields) {
        let
          html = '';
        if (response[fields.results] !== undefined) {
        // each result
          $.each(response[fields.results], (index, result) => {
            if (result[fields.url]) {
              html += `<a class="result" href="${result[fields.url]}">`;
            } else {
              html += '<a class="result">';
            }
            if (result[fields.image] !== undefined) {
              html += `${''
              + '<div class="image">'
              + ' <img src="'}${result[fields.image]}">`
              + '</div>';
            }
            html += '<div class="content">';
            if (result[fields.price] !== undefined) {
              html += `<div class="price">${result[fields.price]}</div>`;
            }
            if (result[fields.title] !== undefined) {
              html += `<div class="title">${result[fields.title]}</div>`;
            }
            if (result[fields.description] !== undefined) {
              html += `<div class="description">${result[fields.description]}</div>`;
            }
            html += ''
            + '</div>';
            html += '</a>';
          });

          if (response[fields.action]) {
            html += `${''
          + '<a href="'}${response[fields.action][fields.actionURL]}" class="action">${
              response[fields.action][fields.actionText]
            }</a>`;
          }
          return html;
        }
        return false;
      },
    },
  };
}(jQuery, window, document));
