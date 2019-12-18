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

        // GET: api/Staffs
        public IQueryable<StaffDto> GetStaffs()
        {
            var staffs = from st in db.Staffs
                         select new StaffDto()
                         {
                             StaffID = st.StaffID,
                             StaffName = st.StaffName,
                             StartWorkingAt = st.StartWorkingAt
                         };
            return staffs;
            //return db.Staffs;
        }

        // GET: api/Staffs/5
        [ResponseType(typeof(Staff))]
        public IHttpActionResult GetStaff(long id)
        {
            Staff staff = db.Staffs.Find(id);            
            if (staff == null)
            {
                return NotFound();
            }
            var staffDto = new StaffDto()
            {
                StaffName = staff.StaffName,
                StaffID = staff.StaffID,
                StartWorkingAt = staff.StartWorkingAt
            };
            return Ok(staff);
        }

        // PUT: api/Staffs/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutStaff(long id, Staff staff)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != staff.StaffID)
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
                if (!StaffExists(id))
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

        // POST: api/Staffs
        [ResponseType(typeof(Staff))]
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

        // DELETE: api/Staffs/5
        [ResponseType(typeof(Staff))]
        public IHttpActionResult DeleteStaff(long id)
        {
            Staff staff = db.Staffs.Find(id);
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