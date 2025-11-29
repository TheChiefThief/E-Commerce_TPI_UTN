using Dsw2025Tpi.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dsw2025Tpi.Application.Dtos;

public record OrderModel
{
    public record RequestOrderModel(string? ShippingAddress, string? BillingAddress, string? Notes, Guid CustomerId, List<OrderItemModel.RequestOrderItemModel> OrderItems);
    public record ResponseOrderModel(Guid Id, DateTime Date, string? ShippingAddress, string? BillingAddress, string? Notes, Guid CustomerId, string CustomerName, OrderStatus Status, decimal TotatAmount, List<OrderItemModel.ResponseOrderItemModel> OrderItems, string UserName);

    public record SearchOrder(string? CustomerName = null, string? Status = null, int PageNumber = 1, int PageSize = 10);
}
