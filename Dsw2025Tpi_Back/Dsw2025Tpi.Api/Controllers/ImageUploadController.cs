using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Dsw2025Tpi.Api.Controllers;

[ApiController]
[Route("api/images")]
public class ImageUploadController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public ImageUploadController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpPost("upload")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        // Navigate out of Dsw2025Tpi.Api -> Dsw2025Tpi_Back -> TPI-Front -> Dsw2025Tpi_Front -> public -> products_img
        // Determine the path to the frontend public folder
        var currentDirectory = Directory.GetCurrentDirectory();
        string frontendPublicPath;

        // Check if we are running from Dsw2025Tpi.Api (development usually)
        if (currentDirectory.EndsWith("Dsw2025Tpi.Api"))
        {
             frontendPublicPath = Path.GetFullPath(Path.Combine(currentDirectory, "..", "..", "Dsw2025Tpi_Front", "public", "products_img"));
        }
        else 
        {
            // Assume we are in the solution root (Dsw2025Tpi_Back)
             frontendPublicPath = Path.GetFullPath(Path.Combine(currentDirectory, "..", "Dsw2025Tpi_Front", "public", "products_img"));
        }
        
        var uploadsFolder = frontendPublicPath;

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        // Generate unique filename
        var fileName = Path.GetFileName(file.FileName);
        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }

        // Return the relative URL
        var imageUrl = $"/products_img/{uniqueFileName}";
        return Ok(new { url = imageUrl });
    }
}
