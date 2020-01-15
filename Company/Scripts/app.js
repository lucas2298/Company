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
    self.searchStaffBtn = async function () {
        var name = $("#searchStaffByName").val();
        uri1 = "/api/staffs/GetAllStaffByName?StaffName=" + name;        
        var newName = xoa_dau(name);
        uri2 = "/api/staffs/GetAllStaffByName?StaffName=" + newName;
        console.log(newName)
        items1 = await ajaxHelper(uri1, 'GET');
        items2 = await ajaxHelper(uri2, 'GET');
        if (name != newName)
            for (var i in items2) {
                items1.push(items2[i])
            }
        $("#showStaffs").remove();
        self.showSearchList(1);
        self.staffSearching(items1);
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
            if (self.showSearchList()) {
                self.searchStaffBtn();
            }
            
            $("#staffDetailEditBtn").html('Edit');
            $(".detailStaff").prop('contenteditable', false);
            $("#cancelStaffChange").remove();
        }
    }
    getAllStaffs();
};

// Xoa dau tieng viet
function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

// Check Name and Date are empty or not
$("#addStaffSubmit").click(function () {
    if ($("#inputStaffName").val() == "" || $("#inputStartWorkingAt").val() == "") {
        $("#staffSubmitError").text("Name and date must not empty!");
    }
    else if ($("#inputStaffName").val() != "" && $("#inputStartWorkingAt").val() != "") {
        $("#staffSubmitError").text("");
    }
});

ko.applyBindings(new ViewModel());