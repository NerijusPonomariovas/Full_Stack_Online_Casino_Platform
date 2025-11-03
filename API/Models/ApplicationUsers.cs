using Microsoft.AspNetCore.Identity;

namespace API.Models
{
    public class ApplicationUsers : IdentityUser
    {
        public string Name { get; set; } = string.Empty; 
    }
}
