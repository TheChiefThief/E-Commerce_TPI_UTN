using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Interfaces;
using Dsw2025Tpi.Application.Validation;
using Dsw2025Tpi.Data.Repositories;
using Dsw2025Tpi.Domain.Entities;
using Dsw2025Tpi.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ApplicationException = Dsw2025Tpi.Application.Exceptions.ApplicationException;

namespace Dsw2025Tpi.Application.Services;
public class ProductsManagementService : IProductsManagementService
{
    private readonly IRepository _repository;
    private readonly ILogger<ProductsManagementService> _logger;

    public ProductsManagementService(IRepository repository, ILogger<ProductsManagementService> logger)
    {
        _repository = repository;
        _logger = logger;
    }
    public async Task<ProductModel.ResponseProductModel?> GetProductById(Guid id)
    {
        _logger.LogInformation("Obteniendo producto por id: {id}", id);
        var product = await _repository.GetById<Product>(id);
        if (product == null)
        {
            _logger.LogWarning("Producto con id: {id} no encontrado", id);
            throw new EntityNotFoundException("Producto no encontrado");
        }
        if (!product.IsActive)
        {
            _logger.LogWarning("El producto con id: {id} no está activo", id);
            throw new ApplicationException("El producto no está activo");
        }
        _logger.LogInformation("Producto con id: {id} obtenido exitosamente", id);
        return product != null ?
            new ProductModel.ResponseProductModel(product.Id, product.Sku, product.InternalCode, product.Name, product.Description, product.CurrentUnitPrice, product.StockQuantity, product.IsActive, product.ImageUrl) :
            null;
    }

    public async Task<IEnumerable<ProductModel.ResponseProductModel>?> GetAllProducts()
    {
        _logger.LogInformation("Obteniendo todos los productos activos");
        var products = (await _repository
            .GetFiltered<Product>(p => p.IsActive))?
            .Select(p => new ProductModel.ResponseProductModel(p.Id, p.Sku, p.InternalCode, p.Name, p.Description,
            p.CurrentUnitPrice, p.StockQuantity, p.IsActive, p.ImageUrl));
        _logger.LogInformation("Se obtuvieron {Count} productos activos", products.Count());
        return products;

    }

    public async Task<IEnumerable<ProductModel.ResponseProductModel>?> GetAllProducts(ProductModel.SearchProduct request)
    {
        _logger.LogInformation("Obteniendo productos con paginación y filtro de búsqueda: {request}", request);
        if (request.PageNumber <= 0)
        {
            _logger.LogWarning("El número de página debe ser mayor que cero. Valor recibido: {PageNumber}", request.PageNumber);
            throw new ArgumentException("El número de página debe ser mayor que cero.");
        }

        if (request.PageSize <= 0)
        {
            _logger.LogWarning("El tamaño de la página debe ser mayor que cero. Valor recibido: {PageSize}", request.PageSize);
            throw new ArgumentException("El tamaño de la página debe ser mayor que cero.");
        }

        var products = await _repository
            .GetFiltered<Product>(p =>
                (!request.IsActive.HasValue || p.IsActive == request.IsActive.Value) &&
                (string.IsNullOrWhiteSpace(request.Search) ||
                p.Name.Contains(request.Search) ||
                p.Description.Contains(request.Search) ||
                p.Sku.Contains(request.Search)));
        _logger.LogInformation("Obteniendo productos con paginación y filtro de búsqueda");
        var paginatedProducts = products
        .Select(p => new ProductModel.ResponseProductModel(p.Id, p.Sku, p.InternalCode, p.Name, p.Description,
        p.CurrentUnitPrice, p.StockQuantity, p.IsActive, p.ImageUrl))
        .Skip((request.PageNumber - 1) * request.PageSize)
        .Take(request.PageSize);
        string statusLog = request.IsActive.HasValue
            ? (request.IsActive.Value ? "activos" : "inactivos")
            : "totales";
        _logger.LogInformation("Se obtuvieron {Count} productos {Status}", paginatedProducts.Count(), statusLog);
        return paginatedProducts;
    }

    public async Task<ProductModel.ResponseProductModel> AddProduct(ProductModel.RequestProductModel request)
    {
        _logger.LogInformation("Añadiendo un nuevo producto: {request}", request);
        ProductValidator.Validate(request);
        var exist = await _repository.First<Product>(p => p.Sku == request.Sku);
        if (exist != null)
        {
            _logger.LogWarning("Ya existe un producto con Sku {Sku}", request.Sku);
            throw new DuplicatedEntityException($"Ya existe un producto con Sku {request.Sku}");
        }
        var product = new Product(request.Sku, request.InternalCode, request.Name, request.Description, request.CurrentUnitPrice, request.StockQuantity);
        _logger.LogInformation("Received ImageUrl in request: '{ImageUrl}'", request.ImageUrl);
        product.ImageUrl = request.ImageUrl;
        _logger.LogInformation("Creating product with ImageUrl: {ImageUrl}", request.ImageUrl);
        await _repository.Add(product);
        _logger.LogInformation("Producto con id: {id} añadido exitosamente", product.Id);
        return new ProductModel.ResponseProductModel(product.Id, product.Sku, product.InternalCode, product.Name, product.Description,
            product.CurrentUnitPrice, product.StockQuantity, product.IsActive, product.ImageUrl);
    }

    public async Task<ProductModel.ResponseProductModel> UpdateProduct(Guid id, ProductModel.RequestProductModel request)
    {
        _logger.LogInformation("Actualizando producto con id: {id} con la siguiente información: {request}", id, request);
        var exist = await _repository.GetById<Product>(id);
        if (exist == null)
        {
            _logger.LogWarning("Producto con id: {id} no encontrado", id);
            throw new EntityNotFoundException("Producto no encontrado");
        }

        ProductValidator.Validate(request);

        var sku = await _repository.First<Product>(p => p.Sku == request.Sku && p.IsActive && p.Id != id);
        if (sku != null)
        {
            _logger.LogWarning("Ya existe un producto con Sku {Sku}", request.Sku);
            throw new DuplicatedEntityException($"Ya existe un producto con Sku {request.Sku}");
        }

        exist.Sku = request.Sku;
        exist.InternalCode = request.InternalCode;
        exist.Name = request.Name;
        exist.Description = request.Description;
        exist.CurrentUnitPrice = request.CurrentUnitPrice;
        exist.StockQuantity = request.StockQuantity;

        exist.StockQuantity = request.StockQuantity;
        exist.ImageUrl = request.ImageUrl;

        await _repository.Update(exist);

        _logger.LogInformation("Producto con id: {id} actualizado exitosamente", id);

        return new ProductModel.ResponseProductModel
        (
            exist.Id,
            exist.Sku,
            exist.InternalCode,
            exist.Name,
            exist.Description,
            exist.CurrentUnitPrice,
            exist.StockQuantity,
            exist.IsActive,
            exist.ImageUrl
        );
    }

    public async Task PatchProduct(Guid id)
    {
        _logger.LogInformation("Deshabilitando producto con id: {id}", id);
        var exist = await _repository.GetById<Product>(id);
        if (exist == null)
        {
            _logger.LogWarning("Producto con id: {id} no encontrado", id);
            throw new EntityNotFoundException("Producto no encontrado");
        }
        if (exist.IsActive == false)
        {
            _logger.LogWarning("El producto con id: {id} ya estaba deshabilitado", id);
            throw new ApplicationException("El producto ya estaba deshabilitado");
        }
        exist.IsActive = false;
        await _repository.Update(exist);
        _logger.LogInformation("Producto con id: {id} deshabilitado exitosamente", id);
    }
}

