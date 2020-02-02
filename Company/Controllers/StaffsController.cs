using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Company.Models;

namespace Company.Controllers
{
    public class StaffsController : ApiController
    {
        private CompanyEntities db = new CompanyEntities();

        public static string RemoveUnicode(string text)
        {
            if (string.IsNullOrEmpty(text)) return text;
            string[] arr1 = new string[] { "á", "à", "ả", "ã", "ạ", "â", "ấ", "ầ", "ẩ", "ẫ", "ậ", "ă", "ắ", "ằ", "ẳ", "ẵ", "ặ",
    "đ",
    "é","è","ẻ","ẽ","ẹ","ê","ế","ề","ể","ễ","ệ",
    "í","ì","ỉ","ĩ","ị",
    "ó","ò","ỏ","õ","ọ","ô","ố","ồ","ổ","ỗ","ộ","ơ","ớ","ờ","ở","ỡ","ợ",
    "ú","ù","ủ","ũ","ụ","ư","ứ","ừ","ử","ữ","ự",
    "ý","ỳ","ỷ","ỹ","ỵ",};
            string[] arr2 = new string[] { "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a", "a",
    "d",
    "e","e","e","e","e","e","e","e","e","e","e",
    "i","i","i","i","i",
    "o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o","o",
    "u","u","u","u","u","u","u","u","u","u","u",
    "y","y","y","y","y",};
            for (int i = 0; i < arr1.Length; i++)
            {
                text = text.Replace(arr1[i], arr2[i]);
                text = text.Replace(arr1[i].ToUpper(), arr2[i].ToUpper());
            }
            return text;
        }

        // GET: Get all staff
        [HttpGet]
        [ActionName("GetAllStaff")]
        public IQueryable<Staff> GetAllStaff()
        {
            return db.Staffs;
        }
        // GET: get a staff by it id
        [HttpGet]
        [ActionName("GetStaffById")]
        public IEnumerable<Staff> GetStaffById([FromUri]long StaffId)
        {
            var source = (from st in db.Staffs
                          select st).AsQueryable();
            if (StaffId > 0)
            {
                source = source.Where(a => (a.StaffID.Equals(StaffId)));
            }
            var items = source.ToList();
            return items;
        }

        // GET: Search by staff name
        [HttpGet]
        [ActionName("GetAllStaffByName")]
        public IEnumerable<Staff> GetStaffs([FromUri]string StaffSearchName)
        {
            var source = (from st in db.Staffs.OrderBy(a => a.StaffName)
                          select st).AsQueryable();
            string temp = RemoveUnicode(StaffSearchName);
            //System.Diagnostics.Debug.WriteLine(temp);
            // Search Parameter
            if (!string.IsNullOrEmpty(StaffSearchName))
            {
                source = source.Where(a => a.NewStaffName.Contains(temp));
            }
            var items = source.ToList();
            return items;
        }

        // POST: Add new staff
        [HttpPost]
        [ActionName("AddNewStaff")]
        public IHttpActionResult PostStaff(Staff staff)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Staffs.Add(staff);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = staff.StaffID }, staff);
        }

        // PUT: api/Staffs/5
        [HttpPut]
        [ActionName("EditStaffById")]
        public IHttpActionResult PutStaff([FromUri]long StaffId, Staff staff)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (StaffId != staff.StaffID)
            {
                return BadRequest();
            }

            db.Entry(staff).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StaffExists(StaffId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // DELETE: api/Staffs/5
        [HttpDelete]
        [ActionName("DeleteStaffById")]
        public IHttpActionResult DeleteStaff([FromUri]long StaffId)
        {
            Staff staff = db.Staffs.Find(StaffId);
            if (staff == null)
            {
                return NotFound();
            }

            db.Staffs.Remove(staff);
            db.SaveChanges();

            return Ok(staff);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StaffExists(long id)
        {
            return db.Staffs.Count(e => e.StaffID == id) > 0;
        }
    }
}