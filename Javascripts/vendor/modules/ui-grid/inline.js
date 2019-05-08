
app = angular.module('app',
    [

        'ui.grid',
        'ui.grid.pagination',
        'ui.grid.selection',
        'ui.grid.cellNav',
        'ui.grid.expandable',
        'ui.grid.edit',
        'ui.grid.rowEdit',
        'ui.grid.saveState',
        'ui.grid.resizeColumns',
        'ui.grid.pinning',
        'ui.grid.moveColumns',
        'ui.grid.exporter',
        'ui.grid.infiniteScroll',
        'ui.grid.importer',
        'ui.grid.grouping'
    ]);
(function () {

    angular.module('ui.grid').factory('InlineEdit', ['$interval', '$rootScope', 'uiGridRowEditService',
        function ($interval, $rootScope, uiGridRowEditService) {
            function inlineEdit(entity, index, grid) {
                this.grid = grid;
                this.index = index;
                this.entity = {};
                this.isEditModeOn = false;
                this.init(entity);
            }

            inlineEdit.prototype = {
                init: function (rawEntity) {
                    var self = this;

                    for (var prop in rawEntity) {
                        self.entity[prop] = {
                            value: rawEntity[prop],
                            isValueChanged: false,
                            isSave: false,
                            isCancel: false,
                            isEdit: false
                        }
                    }
                },

                enterEditMode: function (event) {
                    console.log("enterEditMode");
                    event && event.stopPropagation();
                    var self = this;
                    self.isEditModeOn = true;

                    // cancel all rows which are in edit mode
                    self.grid.rows.forEach(function (row) {
                        if (row.inlineEdit && row.inlineEdit.isEditModeOn && row.uid !== self.grid.rows[self.index].uid) {
                            row.inlineEdit.cancelEdit();
                        }
                    });

                    // Reset all the values
                    for (var prop in self.entity) {
                        self.entity[prop].isSave = false;
                        self.entity[prop].isCancel = false;
                        self.entity[prop].isEdit = true;
                    }
                },

                saveEdit: function (event) {
                    event && event.stopPropagation();
                    var self = this;

                    self.isEditModeOn = false;

                    for (var prop in self.entity) {
                        self.entity[prop].isSave = true;
                        self.entity[prop].isEdit = false;
                    }

                    uiGridRowEditService.saveRow(self.grid, self.grid.rows[self.index])();
                },

                cancelEdit: function (event) {
                    event && event.stopPropagation();
                    var self = this;

                    self.isEditModeOn = false;
                    for (var prop in self.entity) {
                        self.entity[prop].isCancel = true;
                        self.entity[prop].isEdit = false;
                    }
                }
            }

            return inlineEdit;
        }]);
});