using Azure.Core;
using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Interfaces;
using Dsw2025Tpi.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Dsw2025Tpi.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrdersManagementService _service;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IOrdersManagementService service, ILogger<OrdersController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet()]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllOrders([FromQuery] OrderModel.SearchOrder request)
    {
        _logger.LogInformation("Solicitud para obtener todas las órdenes recibida. Filtros: {@Request}", request);
        var orders = await _service.GetAllOrders(request);
        if (orders == null || !orders.Any())
        {
            _logger.LogWarning("No se encontraron órdenes para los filtros proporcionados.");
            throw new NoContentException("Empty List");
        }
        _logger.LogInformation("Se encontraron {Count} órdenes.", orders.Count());
        return Ok(orders);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> AddOrder([FromBody] OrderModel.RequestOrderModel request)
    {
        _logger.LogInformation("Solicitud para crear una nueva orden recibida: {@Request}", request);
        var newOrder = await _service.AddOrder(request);
        _logger.LogInformation("Orden {OrderId} creada exitosamente.", newOrder.Id);
        return CreatedAtAction(nameof(GetOrderById), new { id = newOrder.Id }, newOrder);
    }

    
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetOrderById(Guid id)
    {
        _logger.LogInformation("Solicitud para obtener la orden con ID: {OrderId}", id);
        var order = await _service.GetOrderById(id);
        _logger.LogInformation("Orden {OrderId} encontrada.", id);
        return Ok(order);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] string newStatus)
    {
        _logger.LogInformation("Solicitud para actualizar el estado de la orden {OrderId} a '{NewStatus}'.", id, newStatus);
        var updatedOrder = await _service.UpdateOrderStatus(id, newStatus);
        if (updatedOrder == null) throw new EntityNotFoundException("Order not found");
        _logger.LogInformation("Orden {OrderId} actualizada exitosamente.", id);
        return Ok(updatedOrder);
    }
}
