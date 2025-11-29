using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Interfaces;
using Dsw2025Tpi.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ApplicationException = Dsw2025Tpi.Application.Exceptions.ApplicationException;

namespace Dsw2025Tpi.Api.Controllers;

[ApiController]
[Route("api/products")]

public class ProductsController : ControllerBase
{
    private readonly IProductsManagementService _service;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductsManagementService service, ILogger<ProductsController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet()]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllProducts([FromQuery] ProductModel.SearchProduct? request = null)
    {
        _logger.LogInformation("Solicitud para obtener productos recibida. Filtros: {@Request}", request);

        IEnumerable<ProductModel.ResponseProductModel>? products;
        if (request != null && (request.PageNumber > 0 || request.PageSize > 0 || !string.IsNullOrWhiteSpace(request.Search)))
        {
            products = await _service.GetAllProducts(request);
        }
        else
        {
            products = await _service.GetAllProducts();
        }

        if (products == null || !products.Any())
        {
            _logger.LogWarning("No se encontraron productos para los filtros proporcionados.");
            return Ok(new List<ProductModel.ResponseProductModel>());
        }

        _logger.LogInformation("Se encontraron {Count} productos.", products.Count());
        return Ok(products);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,User")]
    public async Task<IActionResult> GetProductById(Guid id)
    {
        _logger.LogInformation("Solicitud para obtener el producto con ID: {ProductId}", id);
        var product = await _service.GetProductById(id);
        _logger.LogInformation("Producto {ProductId} encontrado.", id);
        return Ok(product);
    }

    [HttpPost()]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddProduct([FromBody] ProductModel.RequestProductModel request)
    {
        _logger.LogInformation("Solicitud para crear un nuevo producto recibida: {@Request}", request);
        var product = await _service.AddProduct(request);
        _logger.LogInformation("Producto {ProductId} creado exitosamente.", product.Id);
        return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] ProductModel.RequestProductModel request)
    {
        _logger.LogInformation("Solicitud para actualizar el producto {ProductId} recibida: {@Request}", id, request);
        var updatedProduct = await _service.UpdateProduct(id, request);
        _logger.LogInformation("Producto {ProductId} actualizado exitosamente.", updatedProduct.Id);
        return Ok(updatedProduct);
    }

    [HttpPatch("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PatchProduct(Guid id)
    {
        _logger.LogInformation("Solicitud para deshabilitar el producto con ID: {ProductId}", id);
        await _service.PatchProduct(id);
        _logger.LogInformation("Producto {ProductId} deshabilitado exitosamente.", id);
        return NoContent();
    }
}
