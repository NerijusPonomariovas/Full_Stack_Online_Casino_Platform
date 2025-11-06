using API.Data;
using API.Interfaces;
using API.Models;
using API.Models.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //jwt single sign in token
    public class AccountController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<ApplicationUsers> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ITokenService _tokenService;
        private readonly SignInManager<ApplicationUsers> _signInManager;

        public AccountController(DataContext context, UserManager<ApplicationUsers> userManager, ITokenService tokenService, RoleManager<IdentityRole> roleManager, SignInManager<ApplicationUsers> signInManager)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody]LoginViewModels model)
        {
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await _userManager.FindByEmailAsync(model.Email) ?? await _userManager.FindByNameAsync(model.Email);
            if(user == null)
            {
                return Unauthorized(new { message = "Invalid email, username or password"});
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if(!result.Succeeded)
            {
                return Unauthorized(new { message = "Invalid email, username or password" });
            }
            HttpContext.Session.SetString("username", user.UserName);

            var token = _tokenService.createToken(user);

            return Ok(new
            {
                message = "Login Succesful",
                username = user.UserName,
                token
            });
        }
        [HttpPost("Register")]
        public async Task<ActionResult> Register([FromBody]RegisterViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if(await _userManager.Users.AnyAsync(u => u.UserName == model.Email))
            {
                return BadRequest(new { message = "User already exists" });
            }
            var user = new ApplicationUsers
            {
                UserName = model.Email,
                Email = model.Email,
                Name = model.Name
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return Unauthorized(new { message = "Invalid email, username or password" });
            }
            return Ok(new
            {
                message = "Registration succesful",
                userName = user.UserName
            });
        }
    }
}
