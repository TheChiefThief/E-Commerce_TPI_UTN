using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Services;
using Dsw2025Tpi.Application.Validation;
using Dsw2025Tpi.Domain.Entities;
using Dsw2025Tpi.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Dsw2025Tpi.Api.Controllers;

[ApiController]
[Route("api/auth")]

public class AuthenticateController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly JwtTokenService _jwtTokenService;
    private readonly IRepository _customerRepository;
    private readonly ILogger<AuthenticateController> _logger;

    public AuthenticateController(UserManager<IdentityUser> userManager,
        SignInManager<IdentityUser> signInManager,
        JwtTokenService jwtTokenService,
        IRepository customerRepository,
        ILogger<AuthenticateController> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenService = jwtTokenService;
        _customerRepository = customerRepository;
        _logger = logger;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginModel request)
    {
        try
        {
            AuthenticateValidator.ValidateLogin(request);
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Validación fallida en login: {Message}", ex.Message);
            throw;
        }

        _logger.LogInformation("Intento de login para el usuario: {Username}", request.Username);

        var user = await _userManager.FindByNameAsync(request.Username);
        if (user == null)
        {
            _logger.LogWarning("Fallo de login para el usuario {Username}: Usuario no encontrado.", request.Username);
            throw new UnauthorizedException("Nombre de usuario o contraseña incorrectos");
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
        {
            _logger.LogWarning("Fallo de login para el usuario {Username}: Contraseña incorrecta.", request.Username);
            throw new UnauthorizedException("Nombre de usuario o contraseña incorrectos");
        }
        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault() ?? throw new Application.Exceptions.ApplicationException("El usuario no tiene un rol asignado");

        _logger.LogInformation("Login exitoso para el usuario {Username} con rol {Role}", request.Username, role);

        var token = _jwtTokenService.GenerateToken(request.Username, role);

        var customer = (await _customerRepository.GetFiltered<Customer>(c => c.Email == user.Email)).FirstOrDefault();

        if (customer == null)
        {
            _logger.LogInformation("El usuario {Username} no tenía un perfil de cliente asociado. Creando uno nuevo.", user.UserName);
            var newCustomer = new Customer(user.Email, user.UserName, null);
            customer = await _customerRepository.Add(newCustomer);
        }

        return Ok(new { token, role, name = user.UserName, customerId = customer?.Id });
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        try
        {
            AuthenticateValidator.ValidateRegister(model);
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Validación fallida en registro: {Message}", ex.Message);
            throw;
        }

        _logger.LogInformation("Iniciando intento de registro para el email: {Email}", model.Email);

        var user = new IdentityUser { UserName = model.Username, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            _logger.LogWarning("Fallo el registro para el email {Email}. Errores: {Errors}", model.Email, string.Join(", ", result.Errors.Select(e => e.Description)));
            return BadRequest(result.Errors);
        }

        _logger.LogInformation("Usuario {Email} creado en Identity. Asignando rol 'User'.", model.Email);
        var role = await _userManager.AddToRoleAsync(user, "User");

        var customer = new Customer(model.Email, model.Username, null);
        await _customerRepository.Add(customer);

        _logger.LogInformation("Registro completado exitosamente para {Email}", model.Email);
        return Ok("Usuario registrado exitosamente.");
    }
}
