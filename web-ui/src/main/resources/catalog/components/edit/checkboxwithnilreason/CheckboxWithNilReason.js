(function() {
  goog.provide('gn_checkbox_with_nilreason');

  var module = angular.module('gn_checkbox_with_nilreason', []);

  /**
   *  Create a widget to handle 3 states checkbox
   */
  module.directive('gnCheckboxWithNilreason',
      ['$http', '$rootScope', '$filter',
        'gnSchemaManagerService', 'gnCurrentEdit',
       function($http, $rootScope, $filter,
                gnSchemaManagerService, gnCurrentEdit) {

         return {
           restrict: 'A',
           scope: {
             value: '@gnCheckboxWithNilreason',
             label: '@',
             elementName: '@',
             elementRef: '@',
             tagName: '@',
             id: '@',
             nilreason: '@',
             labels: '@'
           },
           templateUrl: '../../catalog/components/edit/checkboxwithnilreason/' +
           'partials/checkboxwithnilreason.html',
           link: function(scope, element, attrs) {
             scope.status = scope.nilreason || scope.value;
             scope.radioLabels = attrs.labels ? angular.fromJson(attrs.labels) :
             {'true': 'true', 'false': 'false', 'unknown': 'unknown'};

             // Unique key for radio name to not mix between
             // directive instances in the same form
             scope.key = Math.random();

             var booleanElement = 'gco:Boolean',
             booleanElementNs = booleanElement.split(':')[0],
             elementNs = scope.tagName.split(':')[0];
             function build() {
               var attribute = '', isNil = scope.status === 'unknown';

               if (isNil) {
                 attribute = ' gco:nilReason="' + scope.status + '"';
               }

               scope.xmlSnippet = '<' + scope.tagName +
               ' xmlns:' +
               elementNs + '="' +
               gnSchemaManagerService.findNamespaceUri(elementNs,
               gnCurrentEdit.schema) + '"' +
               ' xmlns:' +
               booleanElementNs + '="' +
               gnSchemaManagerService.findNamespaceUri(booleanElementNs,
               gnCurrentEdit.schema) + '"' +
               attribute + '><' + booleanElement + '>' +
               (isNil ? '' : scope.status) +
               '</' + booleanElement + '></' + scope.tagName + '>';
             }
             scope.$watch('status', build);
             // Populate the field generated by the XSL form builder
             scope.$watch('xmlSnippet', function() {
               if (scope.id) {
                 $(scope.id).val(scope.xmlSnippet);
                 $(scope.id).change();
               }
             });
             build();
           }
         };
       }]);
})();