using Azure.Core;
using Dsw2025Tpi.Application.Dtos;
using Dsw2025Tpi.Application.Exceptions;
using Dsw2025Tpi.Application.Interfaces;
using Dsw2025Tpi.Application.Validation;
using Dsw2025Tpi.Data.Repositories;
using Dsw2025Tpi.Domain.Entities;
using Dsw2025Tpi.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ApplicationException = Dsw2025Tpi.Application.Exceptions.ApplicationException;

namespace Dsw2025Tpi.Application.Services;
    public class OrdersManagementService : IOrdersManagementService
    {
        private readonly IRepository _repository;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ILogger<OrdersManagementService> _logger;


        public OrdersManagementService(IRepository repository, UserManager<IdentityUser> userManager, ILogger<OrdersManagementService> logger)
        {
            _repository = repository;
            _userManager = userManager;
            _logger = logger;
        }
        public async Task<OrderModel.ResponseOrderModel?> GetOrderById(Guid id)
        {
            _logger.LogInformation("Iniciando la obtención del pedido con ID: {OrderId}", id);
            var order = await _repository.GetById<Order>(id, nameof(Order.OrderItems), "OrderItems.Product", nameof(Order.Customer));

            if (order == null)
            {
                _logger.LogWarning("No se encontró ningún pedido con el ID: {OrderId}", id);
                throw new EntityNotFoundException($"Orden no encontrada");
            }

            var responseItems = order.OrderItems.Select(i => new OrderItemModel.ResponseOrderItemModel(
                    i.Id,
                    i.Quantity,
                    i.UnitPrice,
                    i.OrderId,
                    i.ProductId,
                    i.Subtotal
                )).ToList();
            
            _logger.LogInformation("Pedido con ID: {OrderId} obtenido exitosamente.", id);

            return new OrderModel.ResponseOrderModel(
                Id: order.Id,
                Date: order.Date,
                ShippingAddress: order.ShippingAddress,
                BillingAddress: order.BillingAddress,
                Notes: order.Notes,
                CustomerId: order.CustomerId,
                Status: order.Status,
                order.TotalAmount,
                responseItems,
                CustomerName: order.Customer?.Name ?? "Cliente no encontrado");
        }

        public async Task<IEnumerable<OrderModel.ResponseOrderModel>?> GetAllOrders(OrderModel.SearchOrder request)
        {
            _logger.LogInformation("Iniciando la obtención de todos los pedidos con los siguientes filtros: {Request}", request);

            OrderStatus? status = null;
            if (!string.IsNullOrWhiteSpace(request.Status))
            {
                if (!Enum.TryParse<OrderStatus>(request.Status, true, out var parsedStatus) ||
                !Enum.IsDefined(typeof(OrderStatus), parsedStatus) ||
                int.TryParse(request.Status, out _))
                {
                    _logger.LogWarning("El estado del pedido no es válido: {Status}", request.Status);
                    throw new ArgumentException($"Estado de pedido inválido: {request.Status}");
                }
                status = parsedStatus;
            }

            if (request.CustomerId.HasValue)
            {
                var customer = await _repository.GetById<Customer>(request.CustomerId.Value);
                if (customer == null)
                {
                    _logger.LogWarning("No se encontró el cliente con ID: {CustomerId}", request.CustomerId.Value);
                    throw new EntityNotFoundException($"Cliente con ID {request.CustomerId} no encontrado.");
                }
            }

            var orders = await _repository.GetFiltered<Order>(
                o => o.Status != OrderStatus.CANCELLED &&
                    (!request.CustomerId.HasValue || o.CustomerId == request.CustomerId.Value) &&
                    (!status.HasValue || o.Status == status.Value),
                include: new[] { "OrderItems.Product", "Customer" }
            );

            if (orders == null || !orders.Any())
            {
                _logger.LogInformation("No se encontraron pedidos con los filtros especificados.");
                return Enumerable.Empty<OrderModel.ResponseOrderModel>();
            }

            var sortedOrders = orders.OrderByDescending(o => o.Date);

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

            var paginatedOrders = sortedOrders.Select(
                order => new OrderModel.ResponseOrderModel(
                order.Id,
                order.Date,
                order.ShippingAddress,
                order.BillingAddress,
                order.Notes,
                order.CustomerId,
                order.Status,
                order.TotalAmount,
                order.OrderItems.Select(i => new OrderItemModel.ResponseOrderItemModel(
                    i.Id,
                    i.Quantity,
                    i.UnitPrice,
                    i.OrderId,
                    i.ProductId,
                    i.Subtotal
                )).ToList(),
                CustomerName: order.Customer?.Name ?? "Cliente no encontrado"
            ))
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize);
            
            _logger.LogInformation("Se obtuvieron {OrderCount} pedidos.", paginatedOrders.Count());

            return paginatedOrders;
        }

        public async Task<OrderModel.ResponseOrderModel> AddOrder(OrderModel.RequestOrderModel request)
        {
            _logger.LogInformation("Iniciando la creación de un nuevo pedido.");
            OrderValidator.Validate(request);

            if (request.OrderItems == null || !request.OrderItems.Any())
            {
                _logger.LogWarning("El pedido debe tener al menos un artículo.");
                throw new ArgumentException("El pedido debe tener al menos un item.");
            }

            var customer = await _repository.GetById<Customer>(request.CustomerId);
            if (customer == null)
            {
                _logger.LogWarning("No se encontró el cliente con ID: {CustomerId}", request.CustomerId);
                throw new EntityNotFoundException($"Cliente con ID {request.CustomerId} no encontrado.");
            }

            var order = new Order(
                request.ShippingAddress,
                request.BillingAddress,
                request.Notes,
                request.CustomerId
            );

            var orderItems = new List<OrderItem>();


            // OPTIMIZACIÓN: Obtener todos los productos en una sola consulta
            var productIds = request.OrderItems.Select(i => i.ProductId).Distinct().ToList();
            var products = await _repository.GetFiltered<Product>(p => productIds.Contains(p.Id));

            // Validar que se encontraron todos los productos
            if (products == null || products.Count() != productIds.Count)
            {
                _logger.LogWarning("Uno o más productos no fueron encontrados.");
                throw new EntityNotFoundException("Uno o más productos no fueron encontrados.");
            }

            var productsDict = products.ToDictionary(p => p.Id);

            foreach (var item in request.OrderItems)
            {
                if (!productsDict.TryGetValue(item.ProductId, out var product))
                {
                    _logger.LogWarning("Producto no encontrado: {ProductId}", item.ProductId);
                    throw new EntityNotFoundException($"Producto no encontrado: {item.ProductId}");
                }

                if (!product.IsActive)
                {
                    _logger.LogWarning("El producto '{ProductName}' está deshabilitado.", product.Name);
                    throw new ApplicationException($"El producto '{product.Name}' está deshabilitado");
                }

                if (product.StockQuantity < item.Quantity)
                {
                    _logger.LogWarning("Stock insuficiente para el producto: {ProductName}", product.Name);
                    throw new InvalidOperationException($"Stock insuficiente para el producto: {product.Name}");
                }

                // Actualizar stock en memoria (se guardará al final)
                product.StockQuantity -= item.Quantity;
                _logger.LogInformation("Stock del producto {ProductName} actualizado a {StockQuantity}", product.Name, product.StockQuantity);


                // Nota: Dependiendo de la implementación del repositorio, podría ser necesario llamar a Update aquí o al final.
                // Asumiendo que Update marca la entidad como modificada en el contexto:
                await _repository.Update(product);

                var orderItem = new OrderItem(
                    item.Quantity,
                    product.CurrentUnitPrice,
                    order.Id,
                    product.Id
                );
                orderItems.Add(orderItem);
            }

            order.OrderItems = orderItems;
            await _repository.Add(order);
            
            _logger.LogInformation("Pedido con ID: {OrderId} creado exitosamente.", order.Id);

            var responseItems = orderItems.Select(oi => new OrderItemModel.ResponseOrderItemModel(
                oi.Id,
                oi.Quantity,
                oi.UnitPrice,
                oi.OrderId,
                oi.ProductId,
                oi.Subtotal
            )).ToList();

            return new OrderModel.ResponseOrderModel(
                order.Id,
                order.Date,
                order.ShippingAddress,
                order.BillingAddress,
                order.Notes,
                order.CustomerId,
                order.Status,
                order.TotalAmount,
                responseItems,
                CustomerName: customer.Name ?? "Cliente sin nombre"
            );
        }

        public async Task<OrderModel.ResponseOrderModel> UpdateOrderStatus(Guid id, string newStatus)
        {
            _logger.LogInformation("Iniciando la actualización del estado del pedido con ID: {OrderId} a {NewStatus}", id, newStatus);
            var order = await _repository.GetById<Order>(id, nameof(Order.OrderItems), "OrderItems.Product", nameof(Order.Customer));

            if (order == null)
            {
                _logger.LogWarning("No se encontró la orden con ID: {OrderId}", id);
                throw new EntityNotFoundException($"Orden con ID: {id} no encontrada");
            }

            if (!Enum.TryParse<OrderStatus>(newStatus, true, out var status) || int.TryParse(newStatus, out _))
            {
                _logger.LogWarning("El estado ingresado no es válido: {NewStatus}", newStatus);
                throw new ArgumentException("El estado ingresado no es válido");
            }

            if (status == OrderStatus.CANCELLED)
            {
                _logger.LogInformation("El estado del pedido se está cambiando a CANCELADO. Devolviendo el stock de los productos.");
                foreach (var item in order.OrderItems)
                {
                    var product = await _repository.GetById<Product>(item.ProductId);
                    if (product != null)
                    {
                        product.StockQuantity += item.Quantity;
                        await _repository.Update(product);
                        _logger.LogInformation("Stock del producto {ProductName} devuelto. Nuevo stock: {StockQuantity}", product.Name, product.StockQuantity);
                    }
                }
            }

            order.Status = status;

            await _repository.Update(order);

            _logger.LogInformation("El estado del pedido con ID: {OrderId} se actualizó exitosamente a {NewStatus}", id, newStatus);

            var responseItems = order.OrderItems.Select(oi => new OrderItemModel.ResponseOrderItemModel(
            oi.Id,
            oi.Quantity,
            oi.UnitPrice,
            oi.OrderId,
            oi.ProductId,
            oi.Subtotal
            )).ToList();

            return new OrderModel.ResponseOrderModel
            (
                order.Id,
                order.Date,
                order.ShippingAddress,
                order.BillingAddress,
                order.Notes,
                order.CustomerId,
                order.Status,
                order.TotalAmount,
                responseItems,
                CustomerName: order.Customer?.Name ?? "Cliente no encontrado"
            );
        }
    }
