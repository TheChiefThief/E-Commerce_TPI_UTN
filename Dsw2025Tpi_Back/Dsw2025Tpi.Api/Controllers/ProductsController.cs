using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Interfaces;
using Dsw2025Tpi.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ApplicationException = Dsw2025Tpi.Application.Exceptions.ApplicationException;

namespace Dsw2025Tpi.Api.Controllers;

[ApiController]
[Route("api/products")]

public class ProductsController : ControllerBase
{
    private readonly IProductsManagementService _service;

    public ProductsController(IProductsManagementService service)
    {
        _service = service; 
    }

    [HttpGet()]
    [AllowAnonymous]
    public async Task<IActionResult> GetAllProducts([FromQuery] ProductModel.SearchProduct? request = null)
    {
        IEnumerable<ProductModel.ResponseProductModel>? products;
        if (request != null && (request.PageNumber > 0 || request.PageSize > 0 || !string.IsNullOrWhiteSpace(request.Search)))
        {
            products = await _service.GetAllProducts(request);
        }
        else
        {
            products = await _service.GetAllProducts();
        }
        if (products == null || !products.Any()) throw new NoContentException("Empty List");
        return Ok(products);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,User")]
    public async Task<IActionResult> GetProductById(Guid id)
    {
        var product = await _service.GetProductById(id);
        return Ok(product); 
    }

    [HttpPost()]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddProduct([FromBody]ProductModel.RequestProductModel request)
    {
        var product = await _service.AddProduct(request);
        return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product); 
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] ProductModel.RequestProductModel request)
    {
        var updatedProduct = await _service.UpdateProduct(id, request);
        return Ok(updatedProduct);
    }

    [HttpPatch("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PatchProduct(Guid id)
    {
        await _service.PatchProduct(id);
        return NoContent();
    }
}
