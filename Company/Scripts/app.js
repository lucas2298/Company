var ViewModel = function () {
    var self = this;
    self.staffs = ko.observableArray();
    self.error = ko.observable();
    self.detail = ko.observable();
    self.isDelete = ko.observable();
    self.isDelete(0);

    var staffsUri = '/api/staffs/'

    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            self.error(errorThrown);
        });
    }
    function getAllStaffs() {
        ajaxHelper(staffsUri, 'GET').done(function (data) {
            self.staffs(data);
        });
    }
    self.getStaffByID = function (item) {
        var del = document.getElementById('delete-notice');
        if (del != null) { del.style.display = "none"; }
        ajaxHelper(staffsUri + item.StaffID, 'GET').done(function (data) {
            self.detail(data);
        });
        var detail = document.getElementById('detail-notice');
        if (detail != null) { detail.style.display = "block"; } 
    }
    self.deleteStaffByID = function (item) {
        var detail = document.getElementById('detail-notice');
        if (detail != null) { detail.style.display = "none"; } 
        ajaxHelper(staffsUri + item.StaffID, 'DELETE').done(function (data) {
            getAllStaffs();
            self.isDelete(1);
        });
        var del = document.getElementById('delete-notice');
        if (del != null) { del.style.display = "block"; }
    }
    getAllStaffs();
};
ko.applyBindings(new ViewModel());