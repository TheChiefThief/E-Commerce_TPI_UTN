using Dsw2025Tpi.Application.Exceptions;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using ApplicationException = Dsw2025Tpi.Application.Exceptions.ApplicationException;

namespace Dsw2025Tpi.Api;

public class CustomExceptionHandlingMiddleware : IMiddleware
{
    private readonly ILogger<CustomExceptionHandlingMiddleware> _logger;

    public CustomExceptionHandlingMiddleware(ILogger<CustomExceptionHandlingMiddleware> logger)
    {
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Ocurrió una excepción no controlada: {ErrorMessage}", e.Message);

            context.Response.ContentType = "application/json";

            var statusCode = e switch
            {
                // Not Found (404)
                EntityNotFoundException => HttpStatusCode.NotFound,
                ResourceNotFoundException => HttpStatusCode.NotFound,

                // Conflict (409)
                ConflictException => HttpStatusCode.Conflict,
                EmailAlreadyExistsException => HttpStatusCode.Conflict,
                DataIntegrityException => HttpStatusCode.Conflict,
                ConcurrencyException => HttpStatusCode.Conflict,
                DuplicateOrderException => HttpStatusCode.Conflict,

                // Unprocessable Entity (422)
                UnprocessableEntityException => HttpStatusCode.UnprocessableEntity,
                InsufficientStockException => HttpStatusCode.UnprocessableEntity,

                // Bad Request (400)
                ArgumentException => HttpStatusCode.BadRequest,
                BadRequestException => HttpStatusCode.BadRequest,
                ValidationException => HttpStatusCode.BadRequest,

                // Too Many Requests (429)
                TooManyRequestsException => (HttpStatusCode)429,

                // Internal Server Error (500)
                DatabaseException => HttpStatusCode.InternalServerError,
                ExternalServiceException => HttpStatusCode.InternalServerError,
                ConfigurationException => HttpStatusCode.InternalServerError,
                SerializationException => HttpStatusCode.InternalServerError,

                // Service Unavailable (503)
                ServiceUnavailableException => HttpStatusCode.ServiceUnavailable,

                // Request Timeout (408)
                Dsw2025Tpi.Application.Exceptions.TimeoutException => HttpStatusCode.RequestTimeout,

                // Not Implemented (501)
                Dsw2025Tpi.Application.Exceptions.NotImplementedException => HttpStatusCode.NotImplemented,

                // Default
                _ => HttpStatusCode.InternalServerError
            };

            context.Response.StatusCode = (int)statusCode;

            var internalCode = e switch
            {
                Dsw2025Tpi.Application.Exceptions.NotAuthenticatedException => "AUTH-07",
                Dsw2025Tpi.Application.Exceptions.InvalidRoleException => "AUTH-12",
                // AUTH - Authentication/Authorization errors
                InvalidTokenException => "AUTH-1001",
                ExpiredTokenException => "AUTH-1002",
                InvalidCredentialsException => "AUTH-1003",
                UnauthorizedException => "AUTH-1004",
                ForbiddenException => "AUTH-2001",
                InsufficientPermissionsException => "AUTH-2002",
                EmailAlreadyExistsException => "AUTH-2003",

                // VAL - Validation errors

                ValidationException => "VAL-1001",
                InvalidEmailFormatException => "VAL-1002",
                WeakPasswordException => "VAL-1003",
                BadRequestException => "VAL-1004",
                ArgumentException => "VAL-1005",
                InvalidOperationException => "VAL-1006",
                InvalidQuantityException => "VAL-1007",

                // PROD - Product errors
                ProductNotFoundException => "PROD-4001",
                ProductDiscontinuedException => "PROD-4002",
                ProductNotAvailableException => "PROD-4003",
                InvalidProductPriceException => "PROD-1001",
                InsufficientStockException => "PROD-2001",

                // ORDER - Order errors
                InvalidOrderStatusException => "ORDER-1001",
                OrderAlreadyCancelledException => "ORDER-1002",
                DuplicateOrderException => "ORDER-4001",

                // CUST - Customer errors
                CustomerNotFoundException => "CUST-4001",

                // FILE - File errors
                InvalidFileFormatException => "FILE-1001",
                FileTooLargeException => "FILE-1002",

                // RES - Resource errors
                EntityNotFoundException => "RES-4001",
                ResourceNotFoundException => "RES-4002",
                NoContentException => "RES-4003",
                ConflictException => "RES-4004",
                DuplicatedEntityException => "RES-4005",


                // SYS - System errors
                ExternalServiceException => "SYS-5001",
                ConfigurationException => "SYS-5002",
                SerializationException => "SYS-5003",
                ServiceUnavailableException => "SYS-5004",
                Dsw2025Tpi.Application.Exceptions.TimeoutException => "SYS-5005",
                TooManyRequestsException => "SYS-4001",
                Dsw2025Tpi.Application.Exceptions.NotImplementedException => "SYS-5006",
                ApplicationException => "SYS-1001",

                // Unknown
                _ => "SYS-9999"
            };

            var errorResponse = new
            {
                status = (int)statusCode,
                title = statusCode.ToString(),
                detail = e.Message,
                internalcode = internalCode
            };

            var json = JsonSerializer.Serialize(errorResponse);
            await context.Response.WriteAsync(json);
        }
    }
}
