var ViewModel = function () {
    var self = this;
    self.staffs = ko.observableArray();
    self.staffSearching = ko.observableArray();
    self.error = ko.observable();
    self.detail = ko.observable();
    self.showSearchList = ko.observable();
    self.showSearchList(0);
    // New staff
    self.newStaff = {
        StaffName: ko.observable(),
        StartWorkingAt: ko.observable()
    }

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
    // Get all staff
    function getAllStaffs() {
        ajaxHelper(staffsUri + "GetAllStaff", 'GET').done(function (data) {
            self.staffs(data);
        });
    }
    // Get staff by id
    self.getStaffByID = function (item) {
        ajaxHelper(staffsUri + "GetStaffById?StaffId=" + item.StaffID, 'GET').done(function (data) {
            self.detail(data[0]);
        });
    }
    // Get staff by name
    self.searchStaffBtn = function () {
        uri = "/api/staffs/GetAllStaffByName?StaffName=" + $("#searchStaffByName").val();
        ajaxHelper(uri, 'GET').done(function (items) {
            $("#showStaffs").remove();
            self.showSearchList(1);
            self.staffSearching(items);
        });
    }
    // Add new staff
    self.addStaff = function (formElement) {
        if (self.newStaff.StaffName() == undefined || self.newStaff.StartWorkingAt() == undefined) return;
        if (self.newStaff.StaffName() == "" || self.newStaff.StartWorkingAt() == "") return;
        var staff = {
            StaffName: self.newStaff.StaffName(),
            StartWorkingAt: self.newStaff.StartWorkingAt()
        }
        ajaxHelper(staffsUri + "AddNewStaff", 'POST', staff).done(function (item) {
            self.staffs.push(item);
            alert("Add staff successfull!");
            getAllStaffs();
        });
    }
    // Delete staff
    self.deleteStaffByID = function (item) {
        if (confirm("Delete this staff?")) {
            ajaxHelper(staffsUri + "DeleteStaffById?StaffId=" + item.StaffID, 'DELETE').done(function (data) {
                if (self.showSearchList()) {
                    var temp = [];
                    for (var i in self.staffSearching()) {
                        var staff = self.staffSearching()[i];
                        if (staff.StaffID != item.StaffID) {
                            temp.push(self.staffSearching()[i])
                        }
                    }
                    self.staffSearching(temp);
                }
                getAllStaffs();
            });
        }
    }
    // Edit staff
    self.editStaff = async function (item) {
        if ($("#staffDetailEditBtn").html() === 'Edit') {
            $("#staffDetailEditBtn").html('Save');
            $(".detailStaff").prop('contenteditable', true);
            $("#addBtnToDetail").append('<button style="float:right;" class="col-sm-2 btn btn-default" id="cancelStaffChange">Cancel</button>').trigger('create');
        }
        else {
            id = self.detail().StaffID;
            newStaffName = $("#StaffName").html();
            newStartWorkingAt = $("#StartWorkingAt").html();
            var staff = {
                StaffID: id,
                StaffName: newStaffName,
                StartWorkingAt: newStartWorkingAt
            }
            data = await ajaxHelper(staffsUri + "EditStaffById?StaffId=" + id, 'PUT', staff);
            var hihi;
            if (self.showSearchList()) {
                for (i in self.staffSearching()) {
                    if (self.staffSearching()[i].StaffID == id) {
                        break;
                    }
                }
            }
            getAllStaffs();
            
            $("#staffDetailEditBtn").html('Edit');
            $(".detailStaff").prop('contenteditable', false);
            $("#cancelStaffChange").remove();
        }
    }
    getAllStaffs();
};
ko.applyBindings(new ViewModel());

// Check Name and Date are empty or not
$("#addStaffSubmit").click(function () {
    if ($("#inputStaffName").val() == "" || $("#inputStartWorkingAt").val() == "") {
        $("#staffSubmitError").text("Name and date must not empty!");
    }
    else if ($("#inputStaffName").val() != "" && $("#inputStartWorkingAt").val() != "") {
        $("#staffSubmitError").text("");
    }
});

