using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Services;
using Dsw2025Tpi.Domain.Entities;
using Dsw2025Tpi.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Dsw2025Tpi.Api.Controllers;

[ApiController]
[Route("api/auth")]

public class AuthenticateController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly JwtTokenService _jwtTokenService;
    private readonly IRepository _customerRepository;

    public AuthenticateController(UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        JwtTokenService jwtTokenService,
        IRepository customerRepository)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenService = jwtTokenService;
        _customerRepository = customerRepository;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginModel request)
    {
        var user = await _userManager.FindByNameAsync(request.Username);
        if (user == null)
        {
            throw new UnauthorizedException("Incorrect username or password");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
        {
            throw new UnauthorizedException("Incorrect username or password");
        }
        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? throw new Application.Exceptions.ApplicationException("User has not assigned role");

        var token = _jwtTokenService.GenerateToken(request.Username, role);

        var customer = (await _customerRepository.GetFiltered<Customer>(c => c.Email == user.Email)).FirstOrDefault();

        // If there is no customer record for this Identity user, create one so
        // frontend workflows (checkout) can rely on a customerId being present.
        if (customer == null)
        {
            var newCustomer = new Customer(user.Email, user.UserName, null);
            customer = await _customerRepository.Add(newCustomer);
        }

        return Ok(new { token, role, name = user.UserName, customerId = customer?.Id });
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {

        var user = new IdentityUser { UserName = model.Username, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);
        var role = await _userManager.AddToRoleAsync(user, "User");

        var customer = new Customer(model.Email, model.Username, null);
        await _customerRepository.Add(customer);

        return Ok("User successfully registered.");
    }
}
