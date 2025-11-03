using API.Data;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.DbInitializer
{
    public class DbInitializer : IDbInitializer
    {
        private readonly DataContext _context;
        private readonly UserManager<ApplicationUsers> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public DbInitializer(DataContext context, UserManager<ApplicationUsers> userManager, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
        }
        public void Initialize()
        {
            try
            {
                if(_context.Database.GetPendingMigrations().Count() > 0)
                {
                    _context.Database.Migrate();
                }
            }
            catch (Exception)
            {

            }
            if(_context.Roles.Any(x => x.Name == Utility.Helper.Admin))
            {
                return;
            }
            _roleManager.CreateAsync(new IdentityRole(Utility.Helper.Admin)).GetAwaiter().GetResult();
            _roleManager.CreateAsync(new IdentityRole(Utility.Helper.User)).GetAwaiter().GetResult();

            _userManager.CreateAsync(new ApplicationUsers
            {
                UserName = "admin@gmail.com",
                Email = "admin@gmail.com",
                EmailConfirmed = true,
                Name = "Admin"
            }, "Admin123!").GetAwaiter().GetResult();
            ApplicationUsers user = _context.Users.FirstOrDefault(x => x.Email == "admin@gmail.com");
            _userManager.AddToRoleAsync(user, Utility.Helper.Admin).GetAwaiter().GetResult();
        }
    }
}
