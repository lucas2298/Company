using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
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
        public IEnumerable<Staff> GetStaffById([FromUri]GetStaffByIdParameterModel searchId)
        {
            var source = (from st in db.Staffs
                          select st).AsQueryable();
            if (searchId.StaffId > 0)
            {
                source = source.Where(a => (a.StaffID.Equals(searchId.StaffId)));
            }
            var items = source.ToList();
            return items;
        }

        // GET: Search by staff name
        [HttpGet]
        [ActionName("GetAllStaffByName")]
        public IEnumerable<Staff> GetStaffs([FromUri]GetStaffByNameParameterModel searchParam)
        {
            var source = (from st in db.Staffs.OrderBy(a => a.StaffName)
                          select st).AsQueryable();
            // Search Parameter
            if (!string.IsNullOrEmpty(searchParam.StaffName))
            {
                source = source.Where(a => a.StaffName.Contains(searchParam.StaffName));
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
        public IHttpActionResult PutStaff([FromUri]EditStaffByIdParameterModel editStaff, Staff staff)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (editStaff.StaffId != staff.StaffID)
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
                if (!StaffExists(editStaff.StaffId))
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
        public IHttpActionResult DeleteStaff([FromUri]DeleteStaffByIdParameterModel deleteId)
        {
            Staff staff = db.Staffs.Find(deleteId.StaffId);
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