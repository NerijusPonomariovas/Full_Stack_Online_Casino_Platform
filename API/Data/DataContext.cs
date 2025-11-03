using API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

    //bridge
namespace API.Data
{
    public class DataContext : IdentityDbContext<ApplicationUsers>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Appointment> Appointments { get; set; }
    }
}
