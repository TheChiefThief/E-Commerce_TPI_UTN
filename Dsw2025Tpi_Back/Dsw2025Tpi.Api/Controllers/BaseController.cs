using Dsw2025Tpi.Application.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Net;
using System.Text.Json;

namespace Dsw2025Tpi.Api.Controllers
{
    public class BaseController : Controller
    {
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            if (context.Exception != null)
            {
                context.Result = Ok();
                context.ExceptionHandled = true;
                base.OnActionExecuted(context);
            }
        }

        /*
        {
            code = *codigo interno - que no es HTTP,
            message = "mensaje error"
        }
        */

        public IActionResult HandlelExeception(Exception e)
        {
            var statusCode = e switch
            {
                EntityNotFoundException => HttpStatusCode.NotFound,
                NoContentException => HttpStatusCode.NoContent,
                DuplicatedEntityException => HttpStatusCode.BadRequest,
                BadRequestException => HttpStatusCode.BadRequest,
                Dsw2025Tpi.Application.Exceptions.ApplicationException => HttpStatusCode.BadRequest,
                ArgumentException => HttpStatusCode.BadRequest,
                InvalidOperationException => HttpStatusCode.BadRequest,
                UnauthorizedException => HttpStatusCode.Unauthorized,
                _ => HttpStatusCode.InternalServerError
            };

            var errorResponse = new
            {
                status = (int)statusCode,
                title = statusCode.ToString(),
                detail = e.Message
            };

            return StatusCode((int)statusCode, errorResponse);
        }
    }
}